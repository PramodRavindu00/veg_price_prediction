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
  const [vegPreferences, setVegPreferences] = useState(null);
  const [userChartData, setUserChartData] = useState(null);
  const [veggieChartData, setVeggieChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formValue, setFormValue] = useState({ fuelPrice: "" });
  const [formError, setFormError] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [currentFuelPrice, setCurrentFuelPrice] = useState(null);

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

  const vegetablePreferences = async () => {
    try {
      const res = await axios.get("/api/user/getVeggieCount");
      const data = res.data.data;
      setVegPreferences(data);
    } catch (error) {
      console.log(error.message);
      toast.error("Error receiving market distributions");
    }
  };

  const getFuelPrice = async () => {
    try {
      const { data } = await axios.get("/api/maintenance/getFuelPrice");
      setCurrentFuelPrice(data);
    } catch (error) {
      console.log(error.message);
      toast.error("Error receiving current Fuel Price");
    }
  };

  useEffect(() => {
    getFuelPrice();
    getCounts();
  }, []);

  useEffect(() => {
    if (counts) {
      userDistribution();
      vegetablePreferences();
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

      setUserChartData(data);
    }

    if (vegPreferences) {
      const data = {
        labels: vegPreferences.map((item) => item.vegetable),
        datasets: [
          {
            data: vegPreferences.map((item) => item.count),
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

      setVeggieChartData(data);
    }
  }, [marketDistribution, vegPreferences]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1")
      .replace(/^(\d+\.\d{2})\d*/g, "$1");
    setFormValue({ ...formValue, [name]: numericValue.slice(0, 10) });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValue.fuelPrice) {
      setFormError("Fuel Price is required!");
      console.log("form have validation errors");
    } else {
      setBtnDisabled(true);
      try {
        await axios.post("/api/maintenance/updateFuelPrice", formValue);
        toast.success("Fuel Price updated successfully");
        getFuelPrice();
      } catch (error) {
        console.error(error.message);
        toast.error("An error occurred in updating Fuel Price");
      } finally {
        setBtnDisabled(false);
        setFormValue({ fuelPrice: "" });
      }
    }
  };

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
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5  justify-center">
            {/* Market distribution */}
            <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg p-5">
              <h2 className="text-center text-xl font-bold text-gray-800">
                Distribution of{" "}
                <CountUp start={0} end={counts?.userCount} separator="," />{" "}
                Users
              </h2>
              {userChartData ? (
                <div className="w-full flex flex-col gap-3 items-center justify-center">
                  <div className="mx-auto">
                    <Pie
                      className="w-52 h-52 hover:cursor-pointer"
                      data={userChartData}
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
                              userChartData.datasets[0].backgroundColor[index],
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
            <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg p-5">
              <h2 className="text-center text-xl font-bold text-gray-800">
                Vegetable Preference Among{" "}
                <CountUp start={0} end={counts?.userCount} separator="," />{" "}
                Users
              </h2>
              {veggieChartData ? (
                <div className="w-full flex flex-col gap-3 items-center justify-center">
                  <div className="mx-auto">
                    <Pie
                      className="w-52 h-52 hover:cursor-pointer"
                      data={veggieChartData}
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
                    {vegPreferences?.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor:
                              veggieChartData.datasets[0].backgroundColor[
                                index
                              ],
                          }}
                        ></span>
                        <span className="font-medium">{item.vegetable}</span>
                        <span className="text-gray-500">
                          ({((item.count * 100) / counts?.userCount).toFixed(2)}
                          %)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center col-span-2">
                  Loading Vegetable Preferences...
                </div>
              )}
            </div>
          </div>

          {/* fuel price maintenance section */}
          <div className="w-full flex flex-col gap-3 bg-white p-5 rounded-lg shadow-lg">
            <div className="flex flex-col gap-1 items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Update Fuel Price
              </h2>
              <p className="text-justify text-sm sm:text-base text-red-500 font-semibold">
                Update the fuel price regularly in the system to ensure accurate
                predictions. This should be done whenever the country's fuel
                price changes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-2">
              {!currentFuelPrice ? (
                <div className="text-center">
                  <p>Loading Fuel Price.....</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <p className="text-lg sm:text-xl text-center">
                    Current Fuel Price (Lanka Auto Diesel)
                  </p>
                  <span className="animate-blink text-xl sm:text-2xl font-bold">
                    LKR {Number(currentFuelPrice?.price).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="bg-black/5 p-5 rounded-lg shadow-lg border border-gray-200">
                <form
                  className="flex flex-col justify-center w-full sm:w-2/3 mx-auto"
                  onSubmit={handleSubmit}
                >
                  <label className="form-label">
                    Fuel Price (Lanka Auto Diesel)
                  </label>

                  <input
                    type="text"
                    placeholder="Enter Current Fuel Price"
                    className="form-input"
                    name="fuelPrice"
                    onChange={handleChange}
                    value={formValue.fuelPrice}
                  />
                  <span className="form-error">{formError}</span>
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-2/3 mt-4"
                    disabled={btnDisabled}
                  >
                    {btnDisabled ? "Please Wait..." : "Update"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster richColors position="top-right" />
    </>
  );
};

export default Dashboard;
