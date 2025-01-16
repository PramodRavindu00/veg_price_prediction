import { useEffect, useState } from "react";
import { userLinks } from "../../assets/navLinks.mjs";
import { useAuth } from "../../assets/useAuth.mjs";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import axios from "axios";
import { MultiplePredictionFormValidations } from "../../assets/validations.mjs";
import SelectBox from "../../components/SelectBox";
import { isFestivalSeason } from "../../assets/Data.mjs";

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

  useEffect(() => {
    if (userData && userData.nearestMarket) {
      setFormValues((prev) => ({
        ...prev,
        location: userData.nearestMarket.market.location,
      }));
    }

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

    if (userData && userData.nearestMarket) {
      setLoading(false);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validNumericValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1")
      .replace(/^(\d+\.\d{2})\d*/g, "$1");
    setFormValues({ ...formValues, [name]: validNumericValue });
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
  };

  const clearForm = () => {
    const userMarket = marketOptions.find(
      (market) => market.id === userData?.nearestMarket?.market?._id
    );
    setFormValues({
      ...initialValues,
      location: userMarket?.location || "",
    });
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
        console.log(formValues);

        setBtnDisabled(true);
        const res = await axios.post("/api/prediction/multiVegPredictions");
        console.log(res.data.data);
        clearForm();
        setBtnDisabled(false);
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  return (
    <>
      <Navbar publicPage={false} navLinks={userLinks} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col p-5">
            <div className="flex flex-col lg:flex-row items-center gap-5">
              <div className="flex flex-col bg-white p-6 w-full rounded-lg shadow-lg gap-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-row-2">
                    {" "}
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
                      <span className="form-error">{formErrors.vegetable}</span>
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="w-full">
                      <label className="form-label">Market Area</label>

                      <SelectBox
                        name="location"
                        options={marketOptions}
                        value={selectedMarket}
                        placeholder="Select Market Area"
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, "location")
                        }
                      />
                      <span className="form-error">{formErrors.location}</span>
                    </div>{" "}
                    <div className="w-full">
                      <label className="form-label">
                        Average Rainfall in mm
                      </label>
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
                  </div>
                  <div className="form-row-2">
                    {" "}
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
                      <label className="form-label">Festival Seasonality</label>
                      <SelectBox
                        name="festival"
                        options={isFestivalSeason}
                        value={selectedFestival}
                        placeholder="Any festival in next week?"
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
                      {btnDisabled ? "Please Wait..." : "Predict Prices"}
                    </button>
                  </div>
                </form>
              </div>
              <div className="layout-2-in-row">Results table</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PredictMultiVeg;
