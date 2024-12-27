import { useEffect, useState } from "react";
import { userLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { MainPredictionFormValidations } from "../../assets/validations.mjs";
import { scroller } from "react-scroll";
import Chart from "react-google-charts";

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
  const [selectedMarket, setSelectedMarket] = useState({});
  const [vegetableOptions, setVegetableOptions] = useState([]);
  const [selectedVegetable, setSelectedVegetable] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [selectedFestival, setSelectedFestival] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [predPeriod, setPredPeriod] = useState();
  const [formErrors, setFormErrors] = useState({});

  const getAllMarkets = async () => {
    try {
      const response = await axios.get("/api/market/getAllMarkets");
      const options = response.data.data.map((market) => ({
        market: market.market,
        location: market.location,
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
        vegetable: vegetable.vegetableName,
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
  };

  const handleSelectChange = (e, name) => {
    switch (name) {
      case "vegetable":
        setSelectedVegetable(e.target.value);
        setFormValues({ ...formValues, vegetable: e.target.value });
        break;
      case "location":
        setSelectedMarket(e.target.value);
        setFormValues({ ...formValues, location: e.target.value });
        break;
      case "predType":
        setSelectedPeriod(e.target.value);
        setFormValues({ ...formValues, predType: e.target.value });
        break;
      case "festival":
        setSelectedFestival(e.target.value);
        setFormValues({ ...formValues, festival: Number(e.target.value) });
        break;
      default:
        console.log("Not a valid select box change");

        break;
    }
  };

  const clearForm = () => {
    setSelectedVegetable({});
    setSelectedMarket({});
    setSelectedPeriod({});
    setSelectedFestival({});
    setFormValues(initialValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = MainPredictionFormValidations(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors");
    } else {
      try {
        setBtnDisabled(true);
        const result = await axios.post(
          "/api/prediction/getPredictions",
          formValues
        );
        setPredPeriod(result.data.data.type);
        scroller.scrollTo("resultsDiv", {
          duration: 1000,
          delay: 0,
          smooth: "linear",
          offset: 0,
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
  }, []);

  return (
    <>
      <Navbar publicPage={false} navLinks={userLinks} />
      <div className="flex flex-col">
        <div className="flex flex-col lg:flex-row">
          <div className="layout-2-in-row">
            <h2 className="form-heading">How to use this prediction tool</h2>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="layout-2-in-row">
              <div className="form-group">
                <label className="form-label">Vegetable</label>
                <div className="relative">
                  <select
                    className="form-input w-full overflow-x-hidden"
                    name="vegetable"
                    value={selectedVegetable}
                    onChange={(e) => handleSelectChange(e, "vegetable")}
                  >
                    <option value="" defaultValue>
                      Select the vegetable
                    </option>
                    {vegetableOptions.length > 0 ? (
                      vegetableOptions.map((vegetable, index) => {
                        return (
                          <option value={vegetable.value} key={index}>
                            {vegetable.vegetable}
                          </option>
                        );
                      })
                    ) : (
                      <option disabled>No vegetables available</option>
                    )}
                  </select>
                </div>
                <span className="form-error">{formErrors.vegetable}</span>
              </div>
              <div className="form-group">
                <label className="form-label">Market Area</label>
                <div className="relative">
                  <select
                    className="form-input w-full overflow-x-hidden"
                    name="location"
                    value={selectedMarket}
                    onChange={(e) => handleSelectChange(e, "location")}
                  >
                    <option value="" defaultValue>
                      Select the market
                    </option>
                    {marketOptions.length > 0 ? (
                      marketOptions.map((market, index) => {
                        return (
                          <option value={market.location} key={index}>
                            {market.market}
                          </option>
                        );
                      })
                    ) : (
                      <option disabled>No markets available</option>
                    )}
                  </select>
                </div>
                <span className="form-error">{formErrors.location}</span>
              </div>
              <div className="form-group">
                <label className="form-label">Average Rainfall in mm</label>
                <input
                  type="text"
                  placeholder="Enter next week's average rainfall"
                  className="form-input"
                  name="rainfall"
                  value={formValues.rainfall}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors.rainfall}</span>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Current Fuel Price (Lanka Auto Diesel) in Rs
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
              <div className="form-group">
                <label className="form-label">Prediction Period</label>
                <div className="relative">
                  <select
                    className="form-input w-full overflow-x-hidden"
                    name="predType"
                    value={selectedPeriod}
                    onChange={(e) => handleSelectChange(e, "predType")}
                  >
                    <option value="" defaultValue>
                      Select the prediction period
                    </option>
                    <option value="week">Next Week</option>
                    <option value="4week">Next 4 Weeks</option>
                  </select>
                </div>
                <span className="form-error">{formErrors.predType}</span>
              </div>
              <div className="form-group">
                <label className="form-label">Festival Seasonality</label>
                <div className="relative">
                  <select
                    className="form-input w-full overflow-x-hidden"
                    name="festival"
                    value={selectedFestival}
                    onChange={(e) => handleSelectChange(e, "festival")}
                  >
                    <option value="" defaultValue>
                      A festival happening within prediction period?
                    </option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
                <span className="form-error">{formErrors.festival}</span>
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
            </div>
          </form>
        </div>
        <div id="resultsDiv" className="layout-2-in-row py-4 ">
          {predPeriod === "week" && (
            <div className="flex flex-col w-full sm:w-[70%] lg:w-[40%] bg-slate-100 p-5">
              <h2 className="form-heading">Weekly Predictable Price</h2>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <p>From - 2024-12-23</p>
                <p>To - 2024-12-30</p>
              </div>
              <p>Vegetable - Carrot</p>
              <p>Market Area - Colombo</p>
              <p>Predictable Price - 650.00 Rs</p>
            </div>
          )}
          {predPeriod === "4week" && (
            <Chart
              className="h-screen"
              chartType="LineChart"
              data={[
                ["Age", "Weight"],
                [4, 16],
                [8, 25],
                [12, 40],
                [16, 55],
                [20, 70],
              ]}
              options={{
                title: "Average Weight by Age",
              }}
              width={"100%"}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PredictMain;
