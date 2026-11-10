import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

// Legacy recharts pie. The budget dashboard now uses BudgetCharts.jsx; kept working for any other consumer.
const COLORS = ["#2563eb", "#16a34a", "#d97706", "#7c3aed", "#dc2626"];
const FALLBACK = [
  { category: "Events", amount: 8000 },
  { category: "Equipment", amount: 5000 },
  { category: "Marketing", amount: 3500 },
  { category: "Misc", amount: 2000 },
];

const ExpenseBreakdownChart = ({ data }) => {
  const chartData = Array.isArray(data) && data.length > 0 ? data : FALLBACK;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ category }) => category} outerRadius={80} dataKey="amount" nameKey="category">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseBreakdownChart;
