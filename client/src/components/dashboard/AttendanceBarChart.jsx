import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Bar chart showing attendance percentage per subject.
// Bars are colored green (>=75%) or amber (<75%) to flag subjects at risk.
function AttendanceBarChart({ perSubject }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const data = {
    labels: perSubject.map((s) => s.subjectCode),
    datasets: [
      {
        label: "Attendance %",
        data: perSubject.map((s) => s.percentage),
        backgroundColor: perSubject.map((s) => (s.percentage >= 75 ? "#16a34a" : "#f59e0b")),
        borderRadius: 6,
        maxBarThickness: 42,
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
          title: (items) => {
            const subject = perSubject[items[0].dataIndex];
            return subject.subjectName;
          },
          label: (item) => `${item.formattedValue}% attendance`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          color: colors.textMuted,
          callback: (value) => `${value}%`,
        },
        grid: { color: colors.border },
      },
      x: {
        ticks: { color: colors.textSecondary },
        grid: { display: false },
      },
    },
  };

  return (
    <div style={{ height: "260px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default AttendanceBarChart;