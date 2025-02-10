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
      <div className="p-5 flex flex-col w-full lg:w-2/3 mx-auto bg-white rounded-lg shadow-lg border-2 border-green-800">
        <h2 className="text-center md:text-xl font-bold text-gray-800 mb-4">
          Predicted Price for Next 4 Weeks per 1KG
        </h2>
        <div className="flex flex-row justify-evenly font-bold">
          <p className="capitalize">Vegetable - {data?.vegetable}</p>
          <p className="capitalize">Market Area - {data?.location}</p>
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
