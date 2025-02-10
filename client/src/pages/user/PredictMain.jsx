import { useEffect, useState } from "react";
import { userLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { MainPredictionFormValidations } from "../../assets/validations.mjs";
import { scroller } from "react-scroll";
import SelectBox from "../../components/SelectBox";
import { isFestivalSeason, predType } from "../../assets/Data.mjs";
import { toast, Toaster } from "sonner";
import PredictionChart from "../../components/PredictionChart";

const initialValues = {
  date: new Date().toISOString().slice(0, 10),
  vegetable: "",
  location: "",
  rainfall: "",
  fuelPrice: "",
  predType: "",
  festival: "",
};
const PredictMain = () => {
  const [formValues, setFormValues] = useState(initialValues);
  const [marketOptions, setMarketOptions] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [vegetableOptions, setVegetableOptions] = useState([]);
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [predPeriod, setPredPeriod] = useState();
  const [formErrors, setFormErrors] = useState({});
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [result, setResult] = useState(null);

  const getAllMarkets = async () => {
    try {
      const response = await axios.get("/api/market/getAllMarkets");
      const options = response.data.data.map((market) => ({
        label: market.market,
        value: market.location,
      }));

      setMarketOptions(options);
    } catch (error) {
      console.log(error.message);
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
    switch (name) {
      case "vegetable":
        setSelectedVegetable(option);
        setFormValues({ ...formValues, vegetable: option?.value });
        break;
      case "location":
        setSelectedMarket(option);
        setFormValues({ ...formValues, location: option?.value });
        break;
      case "predType":
        setSelectedPeriod(option);
        setFormValues({ ...formValues, predType: option?.value });
        break;
      case "festival":
        setSelectedFestival(option);
        setFormValues({ ...formValues, festival: Number(option?.value) });
        break;
      default:
        console.log("Not a valid select box change");
        break;
    }
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const clearForm = () => {
    setSelectedVegetable(null);
    setSelectedMarket(null);
    setSelectedPeriod(null);
    setSelectedFestival(null);
    setFormValues((prev) => ({
      ...initialValues,
      ["fuelPrice"]: prev.fuelPrice,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = MainPredictionFormValidations(formValues);
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
        setPredPeriod(response.data.data.type);
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
    getAllMarkets();
    getAllVegetables();
    getFuelPrice();
  }, []);

  return (
    <>
      <Navbar publicPage={false} navLinks={userLinks} />
      <div className="flex flex-col p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <div className="layout-2-in-row">
            <h2 className="form-heading">How to use this prediction tool</h2>
          </div>
          <div className="flex flex-col bg-white p-5 w-full rounded-lg shadow-lg gap-5 border-2 border-green-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-row-2">
                <div className="w-full">
                  <label className="form-label">Vegetable</label>
                  <SelectBox
                    name="vegetable"
                    options={vegetableOptions}
                    value={selectedVegetable}
                    placeholder="Select Vegetable"
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, "vegetable")
                    }
                  />
                  <span className="form-error">{formErrors.vegetable}</span>
                </div>
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
                </div>
              </div>
              <div className="form-row-2">
                <div className="w-full">
                  <label className="form-label">
                    Next Week Average Precipitation in mm/hr
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
              </div>
              <div className="form-row-2">
                <div className="w-full">
                  <label className="form-label">Prediction Period</label>
                  <SelectBox
                    name="predType"
                    options={predType}
                    value={selectedPeriod}
                    placeholder="Select Prediction Period"
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, "predType")
                    }
                  />
                  <span className="form-error">{formErrors.predType}</span>
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
              <div className="my-2 lg:mt-4 flex justify-center form-group">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={btnDisabled}
                >
                  {btnDisabled ? "Please Wait..." : "Predict Price"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          id="resultsDiv"
          className="py-5 items-center flex flex-col w-full mt-10"
        >
          {result && predPeriod === "week" && (
            <div className="p-5 flex flex-col w-full lg:w-1/2 mx-auto bg-white rounded-lg shadow-lg border-2 border-green-800">
              <h2 className="text-center md:text-xl font-bold text-gray-800 mb-4">
                Predicted Price for Next Week per 1KG
              </h2>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <p>From - {result?.week_start}</p>
                <p>To - {result?.week_end}</p>
              </div>
              <p className="capitalize">
                Vegetable - {result?.predictions[0].vegetable}
              </p>
              <p className="capitalize">Market Area - {result?.location}</p>
              <p>
                Predicted Price - Rs {result.predictions[0]?.price.toFixed(2)}
              </p>
            </div>
          )}
          {result && predPeriod === "4week" && (
            <PredictionChart data={result} />
          )}
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default PredictMain;
