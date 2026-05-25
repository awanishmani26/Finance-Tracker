import { LuTrendingUp, LuTrendingDown, LuTrash2 } from "react-icons/lu";
import { formatDate, formatCurrency } from "../utils/helper";

const TransactionItem = ({ item, type, onDelete, showDelete = false }) => {
  const isExpense = type === "expense";

  return (
    <div className="transaction-item">
      <div className="transaction-icon">
        {item.icon ? (
          <span style={{ fontSize: 20 }}>{item.icon}</span>
        ) : isExpense ? (
          <LuTrendingDown style={{ color: "var(--expense-red)" }} />
        ) : (
          <LuTrendingUp style={{ color: "var(--income-green)" }} />
        )}
      </div>
      <div className="transaction-info">
        <div className="transaction-name">
          {isExpense ? item.category : item.source}
        </div>
        <div className="transaction-date">{formatDate(item.date)}</div>
      </div>
      <div className="transaction-amount">
        <span className={`amount-badge ${isExpense ? "badge-expense" : "badge-income"}`}>
          {isExpense ? "- " : "+ "}
          {formatCurrency(item.amount)}
          {isExpense ? " " : " "}
          <span style={{ fontSize: 10 }}>
            {isExpense ? "↘" : "↗"}
          </span>
        </span>
        {showDelete && onDelete && (
          <button
            className="delete-btn"
            onClick={() => onDelete(item._id)}
            style={{ opacity: 1 }}
          >
            <LuTrash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
