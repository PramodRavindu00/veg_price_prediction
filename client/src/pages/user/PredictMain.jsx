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
import FormInstructions from "../../components/FormInstructions";
import { predictMain } from "../../assets/formInstructions.mjs";

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
       // console.log(response.data.data);
        
        setPredPeriod(response.data.data.type);
        setResult(response.data.data);
      
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


  useEffect(() => {
    if (result) {
      scroller.scrollTo("resultsDiv", {
        duration: 1000,
        delay: 0,
        smooth: "linear",
        offset: -100,
      });
    }
  }, [result]);

  return (
    <>
      <Navbar publicPage={false} navLinks={userLinks} />
      <div className="flex flex-col p-5 gap-5">
        <div className="flex flex-col bg-white p-5 w-full rounded-lg shadow-lg gap-5 border-2 border-gray-200">
          <FormInstructions content={predictMain} />
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <hr className="hidden sm:block border-t-2 border-gray-300" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {" "}
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
              <div className="w-full">
                <label className="form-label">Average Rainfall in mm/hr</label>
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
            <button
              type="submit"
              className="btn-primary"
              disabled={btnDisabled}
            >
              {btnDisabled ? "Please Wait..." : "Predict Price"}
            </button>
          </form>
        </div>

        {result && (
          <div
            id="resultsDiv"
            className="py-5 items-center flex flex-col w-full"
          >
            {result && predPeriod === "week" && (
              <div className="flex flex-col w-full sm:w-1/2 bg-white shadow-lg rounded-lg p-5 border-2 border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
                  Predicted Price for Next Week per 1Kg
                </h2>
                <hr className="mb-4 border-gray-300" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 mb-4">
                  <p className="capitalize">
                    <strong>From:</strong> {result?.week_start}
                  </p>
                  <p className="capitalize">
                    <strong>To:</strong> {result?.week_end}
                  </p>
                  <p className="capitalize">
                    <strong>Vegetable:</strong>{" "}
                    {result?.predictions[0].vegetable}
                  </p>
                  <p className="capitalize">
                    <strong>Market Area:</strong> {result?.location}
                  </p>
                  <p className="text-xl font-semibold text-green-600 capitalize">
                    Predicted Price: Rs{" "}
                    {result.predictions[0]?.price.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
            {result && predPeriod === "4week" && (
              <PredictionChart data={result} />
            )}
          </div>
        )}
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default PredictMain;
