import React from "react";
import searchIcon from "../assets/search.svg";
import filterIcon from "../assets/filter.svg";
import "./SearchBar.css";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <div className="search-input">
        <img src={searchIcon} alt="search" className="icon" />
        <input
          type="text"
          placeholder="Search Customers"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <div className="filter-btn">
        <img src={filterIcon} alt="filter" className="icon" />
        <span>Add Filters</span>

        <div className="filter-dropdown">
          <div>Filter 1</div>
          <div>Filter 2</div>
          <div>Filter 3</div>
        </div>
      </div>
    </div>
  );
}
