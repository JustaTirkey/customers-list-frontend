import React, { useMemo, useState, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import "./Table.css";

/*
 props:
  - rawData: original array of customers (1M)
  - pageSizeRows: 30 (rows per page)
  - visiblePages: initial pages (we will control inside)
  - search, sortField, sortOrder already applied? We'll apply in parent or here.
*/

function Row({ index, style, data }) {
  const item = data[index];
  if (!item) return <div style={style} />;

  return (
    <div className="table-row" style={style}>
      <div className="cell id">{item.id}</div>
      <div className="cell name">{item.name}</div>
      <div className="cell email">{item.email}</div>
      <div className="cell phone">{item.phone}</div>
      <div className="cell score">{item.score}</div>
      <div className="cell addedBy">{item.addedBy}</div>
      <div className="cell time">{new Date(item.lastMessageAt).toLocaleDateString()}</div>
    </div>
  );
}

export default function Table({
  data,             // already filtered & sorted array (full result after search)
  onRequestMore,    // callback to parent to request more pages
  totalCount,       // total available after filter
  rowHeight = 44,
  pageSize = 30,
}) {
  // itemCount is how many rows we currently want to show; parent controls growth by changing 'data' length
  const itemCount = data.length;

  // handle the onScroll event from react-window
  const handleScroll = useCallback(
    ({ scrollOffset, scrollDirection, scrollUpdateWasRequested }) => {
      // approximate index currently scrolled to:
      const currentIndex = Math.floor(scrollOffset / rowHeight);
      // when we get within 3*pageSize rows of the end, request more
      if (currentIndex + 3 * pageSize >= itemCount && itemCount < totalCount) {
        onRequestMore();
      }
    },
    [itemCount, onRequestMore, pageSize, rowHeight, totalCount]
  );

  // table header (sorting handled by parent via clicking)
  
  return (
    <div className="table-container">
      <div className="table-header">
        <div className="cell id header-clickable" onClick={() => onHeaderClick && onHeaderClick("id")}>ID</div>
        <div className="cell name header-clickable" onClick={() => onHeaderClick && onHeaderClick("name")}>Name</div>
        <div className="cell email header-clickable" onClick={() => onHeaderClick && onHeaderClick("email")}>Email</div>
        <div className="cell phone header-clickable" onClick={() => onHeaderClick && onHeaderClick("phone")}>Phone</div>
        <div className="cell score header-clickable" onClick={() => onHeaderClick && onHeaderClick("score")}>Score</div>
        <div className="cell addedBy header-clickable" onClick={() => onHeaderClick && onHeaderClick("addedBy")}>Added By</div>
        <div className="cell time header-clickable" onClick={() => onHeaderClick && onHeaderClick("lastMessageAt")}>Last Message</div>
      </div>

      {/* <div className="table-header">
        <div className="cell id header-clickable">ID</div>
        <div className="cell name header-clickable">Name</div>
        <div className="cell email header-clickable">Email</div>
        <div className="cell phone header-clickable">Phone</div>
        <div className="cell score header-clickable">Score</div>
        <div className="cell addedBy header-clickable">Added By</div>
        <div className="cell time header-clickable">Last Message</div>
      </div> */}

      <List
        height={window.innerHeight - 160}
        itemCount={itemCount}
        itemSize={rowHeight}
        width="100%"
        onScroll={handleScroll}
        itemData={data}
      >
        {Row}
      </List>
    </div>
  );
}
