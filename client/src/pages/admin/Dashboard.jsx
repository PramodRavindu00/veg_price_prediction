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

  const getCounts = async () => {
    try {
      const res = await axios.get("/api/maintenance/getCounts");
      setCounts(res.data.data);
    } catch (error) {
      console.log(error.message);
      toast.error("Error receiving counts");
    }
  };

  const userDistribution = async () => {
    try {
      const res = await axios.get("/api/user/getUserDistribution");
      setMarketDistribution(res.data.data);
    } catch (error) {
      console.log(error.message);
      toast.error("Error receiving market distributions");
    }
  };

  useEffect(() => {
    getCounts();
    userDistribution();

    if (marketDistribution) {
      const data = {
        labels: marketDistribution.map((item) => item.market),
        datasets: [
          {
            data: marketDistribution.map((item) => item.count),
            backgroundColor: [
              "#FF5733",
              "#33FF57",
              "#3357FF",
              "#FF33A1",
              "#FFD700",
              "#4B0082",
              "#FF4500",
              "#ADFF2F",
              "#D2691E",
              "#DC143C",
            ],
            hoverOffset: 4,
          },
        ],
      };

      setPieChartData({ data });
    }
  }, [marketDistribution]);

  return (
    <>
      <Navbar publicPage={false} navLinks={adminLinks} />
      <div className="flex flex-col p-5 gap-5">
        {/* counts section */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex flex-col  shadow-lg h-40  bg-lime-100 rounded-lg justify-center text-gray-800">
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
          <div className="flex flex-col  shadow-lg h-40  bg-red-300 rounded-lg justify-center text-gray-800">
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
          <div className="flex flex-col  shadow-lg h-40  bg-blue-100 rounded-lg justify-center text-gray-800">
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
          <div className="flex flex-col  shadow-lg h-40  bg-green-100 rounded-lg justify-center text-gray-800">
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
        <h1 className="text-center">Distributions</h1>
        {/* charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-center">
          {/* market distribution chart */}
          <div className="min-h-[50vh] grid grid-cols-1 lg:grid-cols-2 px-5 items-center">
            {pieChartData ? (
              <>
                <div className="flex flex-col  text-center">
                  <span className="text-lg font-semibold mb-4">
                    User Distribution of Market Areas
                  </span>
                  <ul className="flex flex-col gap-2">
                    {marketDistribution?.map((item, index) => (
                      <li
                        key={item.location}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor:
                              pieChartData.data.datasets[0].backgroundColor[
                                index
                              ],
                          }}
                        ></span>
                        <span className="font-medium">{item.market}</span>
                        <span className="text-gray-500">
                          ({item.count} users)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex ">
                  <Pie
                    className="h-52 lg:h-72"
                    data={pieChartData.data}
                    options={{
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                      },
                      maintainAspectRatio: true,
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="text-center col-span-2">
                Loading user distribution...
              </div>
            )}
          </div>
          <div className="w-full bg-orange-400">
            {pieChartData ? (
              <Pie
                className="mx-auto"
                data={pieChartData.data}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                  },
                  maintainAspectRatio: false,
                }}
              />
            ) : (
              <div>Loading market location data...</div>
            )}
          </div>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default Dashboard;
