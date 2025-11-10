import React, { useEffect, useMemo, useState } from "react";
import { generateCustomers } from "./utils/dataGenerator";
import Table from "./components/Table";
import SearchBar from "./components/SearchBar";
import useDebounce from "./hooks/useDebounce";
import logo from "./assets/DoubleTickLogo.png";
import "./App.css";

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    const data = generateCustomers(1000000);
    setCustomers(data);
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    );
  }, [customers, debouncedSearch]);

  return (
    <div className="main-container">
      <header className="header">
        <img src={logo} alt="DoubleTick" className="header-logo" />
        <div className="header-title">
          All Customers{" "}
          <span className="header-badge">{filtered.length.toLocaleString()}</span>

        </div>
      </header>

      <SearchBar value={search} onChange={setSearch} />

      <div className="table-section">
        {filtered.length > 0 ? (
          <Table customers={filtered} />
        ) : (
          <p className="loading-text">Loading data...</p>
        )}
      </div>
    </div>
  );
}
