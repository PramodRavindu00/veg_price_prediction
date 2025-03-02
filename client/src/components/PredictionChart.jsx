import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import PropTypes from "prop-types";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);
const PredictionChart = ({ data }) => {
  const labels = data?.predictions?.map((prediction) => prediction.week_start);
  const prices = data?.predictions?.map((prediction) =>
    parseFloat(prediction.price).toFixed(2)
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Price",
        data: prices,
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };
  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return value.toFixed(2); // Ensures two decimal places on the Y-axis
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          fontColor: "black",
        },
      },
      tooltip: {
        backgroundColor: "rgb(0, 0, 0)", // Background color of the tooltip
      },
    },
  };

  return (
    <>
      <div className="p-5 flex flex-col w-full lg:w-2/3 mx-auto bg-white rounded-lg shadow-lg border-2 border-gray-2">
        <h2 className="text-center md:text-xl font-bold text-gray-800 mb-4">
          Predicted Prices for Next 4 Weeks per 1Kg
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 mb-4">
          <p className="capitalize">
            <strong>From:</strong> {data?.predictions[0]?.week_start}
          </p>
          <p className="capitalize">
            <strong>To:</strong> {data?.predictions[3]?.week_end}
          </p>
          <p className="capitalize">
            <strong>Vegetable:</strong> {data?.vegetable}
          </p>
          <p className="capitalize">
            <strong>Market Area:</strong> {data?.location}
          </p>
        </div>

        <Line data={chartData} options={options} />
      </div>
    </>
  );
};
PredictionChart.propTypes = {
  data: PropTypes.object,
};
export default PredictionChart;
