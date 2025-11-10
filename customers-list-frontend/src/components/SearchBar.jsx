import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ padding: "10px 16px", display: "flex", gap: 12, alignItems: "center" }}>
      <input
        aria-label="search"
        placeholder="Search name, email or phone..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px 12px",
          fontSize: 14,
          width: 360,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />
      <div style={{ marginLeft: "auto" }}>
        {/* Static filters dropdown placeholder */}
        <select style={{ padding: "6px 10px" }}>
          <option>All</option>
          <option>Filter A</option>
          <option>Filter B</option>
          <option>Filter C</option>
        </select>
      </div>
    </div>
  );
}
