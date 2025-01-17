import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { adminLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";
import {
  faCarrot,
  faLocationDot,
  faMessage,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import CountUp from "react-countup";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  plugins,
} from "chart.js";
import Loader from "../../components/Loader";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  const [counts, setCounts] = useState(null);
  const [marketDistribution, setMarketDistribution] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCounts = async () => {
    try {
      const res = await axios.get("/api/maintenance/getCounts");
      setCounts(res.data.data);
    } catch (error) {
      console.log(error.message);
      toast.error("Error receiving counts");
    } finally {
      setLoading(false);
    }
  };

  const userDistribution = async () => {
    try {
      const res = await axios.get("/api/user/getUserDistribution");
      const data = res.data.data;
      setMarketDistribution(data);
    } catch (error) {
      console.log(error.message);
      toast.error("Error receiving market distributions");
    }
  };

  useEffect(() => {
    getCounts();
  }, []);

  useEffect(() => {
    if (counts) {
      userDistribution();
    }
  }, [counts]);

  useEffect(() => {
    if (marketDistribution) {
      const data = {
        labels: marketDistribution.map((item) => item.market),
        datasets: [
          {
            data: marketDistribution.map((item) => item.count),
            backgroundColor: [
              "#4c34b5",
              "#51f35f",
              "#b4d092",
              "#11f901",
              "#c25310",
              "#6c45bd",
              "#9f473e",
              "#ac710a",
              "#9a1c2f",
              "#aab3bc",
              "#ab825c",
              "#a7574b",
              "#06b716",
              "#35dffb",
              "#d99b0c",
            ],
          },
        ],
      };

      setPieChartData(data);
    }
  }, [marketDistribution]);

  return (
    <>
      <Navbar publicPage={false} navLinks={adminLinks} />
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col p-5 gap-5">
          {/* counts section */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="flex flex-col  shadow-lg h-40  bg-lime-100 rounded-lg justify-center text-gray-800 hover:cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="text-5xl" />
                <CountUp
                  start={0}
                  end={counts?.userCount}
                  separator=","
                  className="text-3xl"
                />
                <span className="text-sm">Registered Users</span>
              </div>
            </div>
            <div className="flex flex-col  shadow-lg h-40  bg-red-300 rounded-lg justify-center text-gray-800 hover:cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-5xl" />
                <CountUp
                  start={0}
                  end={counts?.marketCount}
                  separator=","
                  className="text-3xl"
                />
                <span className="text-sm">Market Areas</span>
              </div>
            </div>
            <div className="flex flex-col  shadow-lg h-40  bg-blue-100 rounded-lg justify-center text-gray-800 hover:cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <FontAwesomeIcon icon={faCarrot} className="text-5xl" />
                <CountUp
                  start={0}
                  end={counts?.vegCount}
                  separator=","
                  className="text-3xl"
                />
                <span className="text-sm">Vegetables</span>
              </div>
            </div>
            <div className="flex flex-col  shadow-lg h-40  bg-green-100 rounded-lg justify-center text-gray-800 hover:cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <FontAwesomeIcon icon={faMessage} className="text-5xl" />
                <CountUp
                  start={0}
                  end={counts?.queryCount}
                  separator=","
                  className="text-3xl"
                />
                <span className="text-sm">Queries Received</span>
              </div>
            </div>
          </div>
          {/* charts section */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-center">
            {/* Market distribution */}
            <div className="flex flex-col items-center justify-center gap-2 bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-center text-xl font-bold text-gray-800">
                Distribution of{" "}
                <CountUp start={0} end={counts?.userCount} separator="," />{" "}
                Users
              </h2>
              {pieChartData ? (
                <div className="w-full flex flex-col gap-3 items-center justify-center">
                  <div className="mx-auto">
                    <Pie
                      className="w-52 h-52 hover:cursor-pointer"
                      data={pieChartData}
                      options={{
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: true },
                        },
                        maintainAspectRatio: true,
                      }}
                    />
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {marketDistribution?.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor:
                              pieChartData.datasets[0].backgroundColor[index],
                          }}
                        ></span>
                        <span className="font-medium">{item.market}</span>
                        <span className="text-gray-500">
                          ({(item.count * 100) / counts?.userCount}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center col-span-2">
                  Loading User Distribution...
                </div>
              )}
            </div>

            {/* vegetable distribution */}
            <div className="bg-black h-20"></div>
          </div>
        </div>
      )}

      <Toaster richColors position="top-right" />
    </>
  );
};

export default Dashboard;
