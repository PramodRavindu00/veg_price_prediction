import { useEffect, useState } from "react";
import { userLinks } from "../../assets/navLinks.mjs";
import { useAuth } from "../../assets/useAuth.mjs";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import axios from "axios";
import { MultiplePredictionFormValidations } from "../../assets/validations.mjs";
import SelectBox from "../../components/SelectBox";
import { isFestivalSeason } from "../../assets/Data.mjs";
import { toast, Toaster } from "sonner";
import { scroller } from "react-scroll";

const initialValues = {
  date: new Date().toISOString().slice(0, 10),
  vegetable: [],
  location: "",
  rainfall: "",
  fuelPrice: "",
  predType: "week",
  festival: "",
};

const PredictMultiVeg = () => {
  const { userData } = useAuth();
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [vegetableOptions, setVegetableOptions] = useState([]);
  const [selectedVegetables, setSelectedVegetables] = useState([]);
  const [marketOptions, setMarketOptions] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [result, setResult] = useState(null);

  const getWeatherData = async (location) => {
    setFetchingWeather(true);
    setBtnDisabled(true);
    if (!location) {
      toast.error(
        "Weather data could not be fetched. try again or enter it manually."
      );
      return;
    }
    try {
      const response = await axios.get(
        `/api/maintenance/getWeatherData/${location}`
      );

      const avgRainfall = response.data.data.avgRainfall;

      setFormValues((prev) => ({ ...prev, rainfall: avgRainfall }));
    } catch (error) {
      console.log(error.message);
      toast.error(
        "Weather data could not be fetched. try again or enter it manually."
      );
    } finally {
      setFetchingWeather(false);
      setBtnDisabled(false);
    }
  };

  const getFuelPrice = async () => {
    try {
      const { data } = await axios.get("/api/maintenance/getFuelPrice");
      setFormValues((prev) => ({
        ...prev,
        fuelPrice: data.price,
      }));
    } catch (error) {
      console.log(error.message);
      toast.error("Failed receiving fuel price.Enter it manually");
    }
  };

  const getAllVegetables = async () => {
    try {
      const response = await axios.get("/api/vegetables/allVegetables");
      const options = response.data.data.map((vegetable) => ({
        label: vegetable.vegetableName,
        value: vegetable.value,
      }));

      setVegetableOptions(options);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validNumericValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1")
      .replace(/^(\d+\.\d{2})\d*/g, "$1");
    setFormValues({ ...formValues, [name]: validNumericValue });
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (option, name) => {
    if (name === "vegetables") {
      const selectedValues = option.map((option) => option.value);
      setFormValues((prev) => ({
        ...prev,
        vegetable: selectedValues,
      }));
      setSelectedVegetables(option);
    } else if (name === "location") {
      setSelectedMarket(option);
      setFormValues((prev) => ({ ...prev, location: option?.value }));
    } else if (name === "festival") {
      setSelectedFestival(option);
      setFormValues((prev) => ({ ...prev, festival: Number(option?.value) }));
    } else {
      console.log("Not a valid select box change");
    }
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const clearForm = () => {
    const userMarket = marketOptions.find(
      (market) => market.id === userData?.nearestMarket?.market?._id
    );

    setFormValues((prev) => ({
      ...initialValues,
      location: userMarket?.location || "",
      fuelPrice: prev.fuelPrice,
    }));
    getWeatherData(userData.nearestMarket.market.location);
    setSelectedVegetables([]);
    setSelectedMarket(userMarket || null);
    setSelectedFestival(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = MultiplePredictionFormValidations(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors");
    } else {
      try {
        // console.log(formValues);

        setBtnDisabled(true);
        const response = await axios.post(
          "/api/prediction/getPredictions",
          formValues
        );
        setResult(response.data.data);
         scroller.scrollTo("resultsDiv", {
           duration: 1000,
           delay: 0,
           smooth: "linear",
           offset: -80,
         });
        setBtnDisabled(false);
        clearForm();
      } catch (error) {
        console.log("Internal Server Error", error);
      }
    }
  };

  useEffect(() => {
    if (userData && userData.nearestMarket) {
      setFormValues((prev) => ({
        ...prev,
        location: userData.nearestMarket.market.location,
      }));
      setLoading(false);
      getWeatherData(userData.nearestMarket.market.location);
    }

    const getAllMarkets = async () => {
      try {
        const response = await axios.get("/api/market/getAllMarkets");
        const options = response.data.data.map((market) => ({
          id: market._id,
          label: market.market,
          value: market.location,
        }));

        setMarketOptions(options);
        const userMarket = options.find(
          (market) => market.id === userData.nearestMarket.market._id
        );
        setSelectedMarket(userMarket || "");
      } catch (error) {
        console.log(error.message);
      }
    };

    getAllVegetables();
    getAllMarkets();
    getFuelPrice();
  }, [userData]);

  return (
    <>
      <Navbar publicPage={false} navLinks={userLinks} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col p-5 gap-5">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col bg-white p-5 w-full rounded-lg shadow-lg gap-5 border-2 border-gray-200"
            >
              <div className="w-full">
                <label className="form-label">Vegetables</label>
                <SelectBox
                  name="vegetables"
                  options={vegetableOptions}
                  value={selectedVegetables}
                  placeholder="Select vegetables"
                  isMulti={true}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "vegetables")
                  }
                />
                <span className="form-error">{formErrors.vegetables}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="w-full">
                  <label className="form-label">Market Area</label>

                  <SelectBox
                    name="location"
                    options={marketOptions}
                    value={selectedMarket}
                    placeholder="Select Market Area"
                    onChange={(selectedOption) => {
                      handleSelectChange(selectedOption, "location");
                      getWeatherData(selectedOption.value);
                    }}
                  />
                  <span className="form-error">{formErrors.location}</span>
                </div>{" "}
                <div className="w-full">
                  <label className="form-label">
                    Average Rainfall in mm/hr
                  </label>
                  <input
                    type="text"
                    placeholder="Enter next week's precipitation"
                    className="form-input"
                    name="rainfall"
                    value={formValues.rainfall}
                    onChange={handleChange}
                  />
                  {fetchingWeather && (
                    <span className="text-green-800 text-sm w-full mt-1 block">
                      Please wait until fetching weather data
                    </span>
                  )}
                  <span className="form-error">{formErrors.rainfall}</span>
                </div>
                <div className="w-full">
                  <label className="form-label">
                    Fuel Price (Lanka Auto Diesel) in Rs
                  </label>
                  <input
                    type="text"
                    placeholder="Enter fuel price"
                    className="form-input"
                    name="fuelPrice"
                    value={formValues.fuelPrice}
                    onChange={handleChange}
                  />
                  <span className="form-error">{formErrors.fuelPrice}</span>
                </div>
                <div className="w-full">
                  <label className="form-label">Festivity</label>
                  <SelectBox
                    name="festival"
                    options={isFestivalSeason}
                    value={selectedFestival}
                    placeholder="Any festival happening?"
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, "festival")
                    }
                  />
                  <span className="form-error">{formErrors.festival}</span>
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={btnDisabled}
              >
                {btnDisabled ? "Please Wait..." : "Predict Prices"}
              </button>
            </form>
            {result && (
              <div
                className="p-5 flex flex-col w-full lg:w-1/2 mx-auto bg-white rounded-lg shadow-lg border-2 border-gray-200"
                id="resultsDiv"
              >
                <h2 className="text-center md:text-xl font-bold text-gray-800 mb-4">
                  Predicted Prices for Next Week per 1Kg
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-700 mb-4">
                  <p className="capitalize">
                    <strong>From:</strong> {result?.week_start}
                  </p>
                  <p className="capitalize">
                    <strong>To:</strong> {result?.week_end}
                  </p>
                  <p className="capitalize">
                    <strong>Market Area:</strong> {result?.location}
                  </p>
                </div>

                <div className="flex flex-row bg-gray-100 p-3 rounded-t-md mb-2 items-center">
                  <span className="flex flex-1 font-semibold text-gray-700 text-center">
                    Vegetable
                  </span>
                  <span className="flex flex-1 font-semibold text-gray-700 text-center">
                    Price
                  </span>
                </div>
                {result?.predictions.map((prediction, index) => (
                  <div
                    className="flex flex-row mb-2 px-2 py-1 space-x-2 border-b-2"
                    key={index}
                  >
                    <span className="flex flex-1 text-gray-800 font-medium capitalize">
                      {prediction.vegetable}
                    </span>
                    <span className="flex flex-1 text-center text-gray-600 font-medium ">
                      {" "}
                      {`Rs ${prediction.price.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <Toaster richColors position="top-right" />
    </>
  );
};

export default PredictMultiVeg;
