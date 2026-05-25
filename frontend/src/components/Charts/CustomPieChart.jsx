import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#875cf5", "#fe5c73", "#ff9f43", "#00b386", "#4e9af1", "#f368e0", "#2bcbba", "#ffd32a"];

const CustomPieChart = ({ data, label, totalLabel }) => {
  const renderCustomLabel = ({ cx, cy }) => (
    <>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#6b7280" fontSize={12}>
        {label}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="#1a1a2e" fontSize={18} fontWeight={700}>
        {totalLabel}
      </text>
    </>
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: "10px 14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}>
          <p style={{ fontSize: 12, color: "#6b7280" }}>{payload[0].name}</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>
            Rs.{payload[0].value?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={110}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="custom-legend">
        {data.map((entry, index) => (
          <div key={index} className="legend-item">
            <div
              className="legend-dot"
              style={{ background: COLORS[index % COLORS.length] }}
            />
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomPieChart;
