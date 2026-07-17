import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = ["#2563eb", "#9333ea", "#16a34a", "#f59e0b", "#dc2626", "#0891b2", "#7c3aed", "#be185d"];

function DoughnutChartCard({ title, labels, values, emptyText = "No data available yet" }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const hasData = labels.length > 0;

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
        borderWidth: 2,
        borderColor: colors.cardBg,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: colors.textSecondary,
          font: { size: 11 },
          boxWidth: 10,
          padding: 12,
        },
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
          <Doughnut data={data} options={options} />
        </div>
      ) : (
        <p style={{ color: colors.textMuted, fontSize: "0.85rem" }} className="mb-0">
          {emptyText}
        </p>
      )}
    </div>
  );
}

export default DoughnutChartCard;