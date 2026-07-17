import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function BarChartCard({ title, labels, values, color = "#2563eb", emptyText = "No data available yet", horizontal = false }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const hasData = labels.length > 0;

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: color,
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    indexAxis: horizontal ? "y" : "x",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: colors.textSecondary },
        grid: { color: horizontal ? colors.border : "transparent" },
      },
      y: {
        ticks: { color: colors.textSecondary },
        grid: { color: horizontal ? "transparent" : colors.border },
      },
    },
  };

  return (
    <div
      className="p-4 h-100"
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: "14px",
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
      }}
    >
      <h6 style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1rem" }} className="mb-3">
        {title}
      </h6>
      {hasData ? (
        <div style={{ height: "260px" }}>
          <Bar data={data} options={options} />
        </div>
      ) : (
        <p style={{ color: colors.textMuted, fontSize: "0.85rem" }} className="mb-0">
          {emptyText}
        </p>
      )}
    </div>
  );
}

export default BarChartCard;