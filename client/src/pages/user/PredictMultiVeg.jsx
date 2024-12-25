import { useEffect, useState } from "react";
import { userLinks } from "../../assets/navLinks.mjs";
import { useAuth } from "../../assets/useAuth.mjs";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import axios from "axios";

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
  const [marketOptions, setMarketOptions] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState({});
  const [selectedFestival, setSelectedFestival] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData && userData.nearestMarket) {
      setFormValues((prev) => ({
        ...prev,
        location: userData.nearestMarket,
      }));
      setLoading(false);
    } else {
      setLoading(false);
    }
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

    const getAllMarkets = async () => {
      try {
        const response = await axios.get("/api/market/getAllMarkets");
        const options = response.data.data.map((market) => ({
          market: market.market,
          location: market.location,
        }));

        setMarketOptions(options);
        const userMarket = options.find(
          (market) => market.location === userData.nearestMarket
        );

        setSelectedMarket(userMarket?.location || "");
      } catch (error) {
        console.log(error.message);
      }
    };

    getAllVegetables();
    getAllMarkets();
  }, [userData]);

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
      case "location":
        setSelectedMarket(e.target.value);
        setFormValues({ ...formValues, location: e.target.value });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
  };

  return (
    <>
      <Navbar publicPage={false} navLinks={userLinks} />
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col lg:flex-row ">
            <div className="layout-2-in-row">
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">
                      Vegetables{" "}
                      <span className="text-xs">(Select at least 1)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {vegetableOptions.map((vegetable, index) => (
                        <div className="flex items-center" key={index}>
                          <input
                            type="checkbox"
                            name={vegetable.value}
                            className="mr-2"
                          />
                          <label
                            htmlFor={vegetable.value}
                            className="form-label mt-1"
                          >
                            {vegetable.vegetable}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
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
                  <div className="mb-4">
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
                  <div className="mb-4">
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
                  <div className="mb-4">
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
                  <div className="my-2 lg:mt-4 flex justify-center">
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
            <div className="layout-2-in-row"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default PredictMultiVeg;
