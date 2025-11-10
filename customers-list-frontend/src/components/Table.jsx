import { FixedSizeList as List } from "react-window";
import "./Table.css";
import userIcon from "../assets/user.svg";

function Row({ index, style, data }) {
  const c = data[index];
  return (
    <div className="table-row" style={style}>
      {/* Checkbox */}
      <div className="cell checkbox">
        <input type="checkbox" />
      </div>

      {/* Avatar */}
      <div className="cell avatar">
        <img src={c.avatar} alt={c.name} />
      </div>

      {/* Customer name + phone */}
      <div className="cell name-phone">
        <div className="name">{c.name}</div>
        <div className="phone">{c.phone}</div>
      </div>

      {/* Age */}
      <div className="cell age">{c.age}</div>

      {/* Email */}
      <div className="cell email">{c.email}</div>

      {/* Last Message */}
      <div className="cell lastMessage">
        {new Date(c.lastMessageAt).toLocaleDateString()}
      </div>

      {/* Added By */}
      <div className="cell addedBy">
        <img src={userIcon} alt="user" className="user-icon" />
        {c.addedBy}
      </div>
    </div>
  );
}

export default function Table({ customers }) {
  return (
    <div className="table-container">
      {}
      <div className="table-header sticky">
        <div className="cell checkbox"></div>
        <div className="cell avatar"></div>
        <div className="cell name-phone">Customer</div>
        <div className="cell age">Age</div>
        <div className="cell email">Email</div>
        <div className="cell lastMessage">Last message sent at</div>
        <div className="cell addedBy">Added by</div>
      </div>

      {}
      <List
        height={window.innerHeight - 300}
        itemCount={customers.length}
        itemSize={64}
        width="100%"
        itemData={customers}
      >
        {Row}
      </List>
    </div>
  );
}
