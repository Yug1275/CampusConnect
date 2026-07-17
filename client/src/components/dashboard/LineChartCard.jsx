import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

function LineChartCard({ title, labels, values, valueSuffix = "%", emptyText = "No data available yet" }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const hasData = labels.length > 0;

  const data = {
    labels: labels.map((l) =>
      new Date(l).toLocaleDateString(undefined, { day: "2-digit", month: "short" })
    ),
    datasets: [
      {
        label: title,
        data: values,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: "#2563eb",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (item) => `${item.formattedValue}${valueSuffix}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { color: colors.textMuted, callback: (v) => `${v}${valueSuffix}` },
        grid: { color: colors.border },
      },
      x: {
        ticks: { color: colors.textSecondary },
        grid: { display: false },
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
          <Line data={data} options={options} />
        </div>
      ) : (
        <p style={{ color: colors.textMuted, fontSize: "0.85rem" }} className="mb-0">
          {emptyText}
        </p>
      )}
    </div>
  );
}

export default LineChartCard;