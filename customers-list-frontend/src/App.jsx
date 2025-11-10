import React, { useEffect, useMemo, useState, useCallback } from "react";
import { generateCustomers } from "./utils/dataGenerator"; // your existing generator
import Table from "./components/Table";
import SearchBar from "./components/SearchBar";
import useDebounce from "./hooks/useDebounce";

/*
 Behavior:
  - We generate 1M in memory (assignment asks for local storage). 
  - filteredSorted holds the result of search+sort (full array reference).
  - visibleCount = pages * rowsPerPage; initially 1 page (30 rows). Parent increases pages when Table asks for more.
  - Table receives only visible slice (but react-window will virtualize).
*/

const ROWS_PER_PAGE = 30; // as per requirement

export default function App() {
  const [raw, setRaw] = useState([]);         // full 1M
  const [pages, setPages] = useState(1);      // how many pages visible
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const [sortField, setSortField] = useState(null); // e.g. 'name', 'email', 'score'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' | 'desc'

  useEffect(() => {
    // generate in a microtask so dev server can render quickly (optional)
    setTimeout(() => {
      const customers = generateCustomers(1000000);
      setRaw(customers);
    }, 0);
  }, []);

  // compute filtered+sorted (memoized)
  const filteredSorted = useMemo(() => {
    if (!raw || raw.length === 0) return [];

    const q = (debouncedSearch || "").trim().toLowerCase();

    // filter
    let arr = q
      ? raw.filter((c) => {
          return (
            String(c.name).toLowerCase().includes(q) ||
            String(c.email).toLowerCase().includes(q) ||
            String(c.phone).toLowerCase().includes(q)
          );
        })
      : raw;

    // sort
    if (sortField) {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      arr = [...arr].sort((a, b) => {
        const va = a[sortField];
        const vb = b[sortField];
        // numeric or string compare
        if (typeof va === "number" && typeof vb === "number") return (va - vb) * multiplier;
        return String(va).localeCompare(String(vb)) * multiplier;
      });
    }

    return arr;
  }, [raw, debouncedSearch, sortField, sortOrder]);

  // visible slice according to pages
  const visibleCount = Math.min(pages * ROWS_PER_PAGE, filteredSorted.length);
  const visible = filteredSorted.slice(0, visibleCount);

  // request more pages (called by Table via onRequestMore)
  const requestMore = useCallback(() => {
    setPages((p) => {
      const next = p + 1;
      // cap so we don't exceed total pages
      const maxPages = Math.ceil(filteredSorted.length / ROWS_PER_PAGE);
      return Math.min(next, maxPages);
    });
  }, [filteredSorted.length]);

  // header click handler: toggle sortField/order
  const handleHeaderClick = (field) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPages(1); // reset visible to first page on sort/search change
  };

  // attach clickable header by intercepting clicks on header elements
  // We'll pass handleHeaderClick down by adding event listeners to header elements (or alternatively replace header elements in Table to call parent)
  // For simplicity, we'll attach listeners via a small effect that queries DOM; but better: modify Table to accept onHeaderClick prop.
  // Here we implement a quick approach: pass handler prop to Table below.

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <h1 style={{ textAlign: "center", margin: 0 }}>Customers List Frontend</h1>
      </div>

      <SearchBar value={search} onChange={(v) => { setSearch(v); setPages(1); }} />

      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 13, color: "#666" }}>
          Showing {visible.length} of {filteredSorted.length} matching rows.
        </div>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {/* Table expects data array, onRequestMore callback, totalCount */}
        <Table
          data={visible}
          onRequestMore={requestMore}
          totalCount={filteredSorted.length}
          rowHeight={44}
          pageSize={ROWS_PER_PAGE}
          // Pass header click - modify Table to call window event or we will instead capture clicks via simplest approach:
          // We'll use global handler: when user clicks a header text we toggle.
          // But better: supply a prop onHeaderClick -> assume Table will call it. Keep consistent.
          onHeaderClick={handleHeaderClick}
        />
      </div>
    </div>
  );
}
