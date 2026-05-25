import { formatCurrency } from "../utils/helper";

const SummaryCard = ({ icon, title, amount, type }) => {
  const iconClass =
    type === "balance"
      ? "icon-balance"
      : type === "income"
      ? "icon-income"
      : "icon-expense";

  return (
    <div className="summary-card">
      <div className={`summary-card-icon ${iconClass}`}>{icon}</div>
      <div className="summary-card-info">
        <h4>{title}</h4>
        <p>{formatCurrency(amount || 0)}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
