import { useEffect, useState } from "react";
import { userLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";
import SelectBox from "../../components/SelectBox";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useAuth } from "../../assets/useAuth.mjs";
import Loader from "../../components/Loader";
import { isFestivalSeason, weeklyConsumption } from "../../assets/Data.mjs";
import {
  predictFormValidations,
  preferenceFormValidations,
} from "../../assets/validations.mjs";
import Modal from "../../components/Modal";
import { scroller } from "react-scroll";
import FormInstructions from "../../components/FormInstructions";
import { shoppingList } from "../../assets/formInstructions.mjs";

const initialValues = {
  date: new Date().toISOString().slice(0, 10),
  predType: "week",
  festival: "",
};

const ShoppingList = () => {
  const { userData, setUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [predictFormValues, setPredictFormValues] = useState(initialValues);
  const [preferenceFormValues, setPreferenceFormValues] = useState(null);
  const [submitBtnTxt, setSubmitBtnTxt] = useState("Add");
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [predictFormErrors, setPredictFormErrors] = useState({});
  const [preferenceFormErrors, setPreferenceFormErrors] = useState({});
  const [vegetableOptions, setVegetableOptions] = useState([]);
  const [selectedVegetables, setSelectedVegetables] = useState([]);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState(null);

  const openViewModal = () => setViewModalOpen(true);
  const closeViewModal = () => {
    setViewModalOpen(false);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setSelectedVegetables([]);
    setPreferenceFormErrors({});
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

      setPredictFormValues((prev) => ({ ...prev, rainfall: avgRainfall }));
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

  const getAllVegetables = async () => {
    try {
      const response = await axios.get("/api/vegetables/allVegetables");
      const options = response.data.data.map((vegetable) => ({
        label: vegetable.vegetableName,
        value: vegetable._id,
      }));
      setVegetableOptions(options);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getFuelPrice = async () => {
    try {
      const { data } = await axios.get("/api/maintenance/getFuelPrice");
      setPredictFormValues((prev) => ({
        ...prev,
        fuelPrice: data.price,
      }));
    } catch (error) {
      console.log(error.message);
      toast.error("Failed receiving fuel price.Enter it manually");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const validNumericValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1")
      .replace(/^(\d+\.\d{2})\d*/g, "$1");
    setPredictFormValues({ ...predictFormValues, [name]: validNumericValue });
    setPredictFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (option, name) => {
    if (name === "vegetables") {
      if (option.length > 5) {
        toast.warning("You can select maximum of 5 vegetables");
        return;
      }
      setSelectedVegetables(option);

      const preferredVeggies = option.map((veg) => {
        const isExisting = preferenceFormValues.preferredVeggies.find(
          (existVeg) => existVeg.vegetable === veg.value
        );
        return {
          vegetable: veg.value,
          amount: isExisting ? isExisting.amount : null,
        };
      });

      setPreferenceFormValues((prev) => ({
        ...prev,
        preferredVeggies: preferredVeggies,
      }));
    } else if (name === "festival") {
      setSelectedFestival(option);
      setPredictFormValues((prev) => ({
        ...prev,
        festival: Number(option?.value),
      }));
    } else {
      console.log("Not a valid select box change");
    }
    setPredictFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAmountChange = (option, index) => {
    const preferredVeggies = [...preferenceFormValues.preferredVeggies];
    preferredVeggies[index].amount = option.value;

    setPreferenceFormValues((prev) => ({
      ...prev,
      preferredVeggies: preferredVeggies,
    }));
  };

  const handlePreferenceSubmit = async (e) => {
    e.preventDefault();
    const errors = preferenceFormValidations(preferenceFormValues);
    setPreferenceFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("form has validation errors");
    } else {
      setBtnDisabled(true);
      try {
        const res = await axios.patch(
          `/api/user/updatePreferences/${userData._id}`,
          preferenceFormValues
        );
        const updatedUser = res.data.data;
        setUserData(updatedUser);
        toast.success("User preferences updated successfully");
        setSelectedVegetables([]);
        setBtnDisabled(false);
        setTimeout(() => {
          closeModal();
        }, 2000);
      } catch (error) {
        console.log(error.message);
        toast.error("An error occurred");
      }
    }
  };

  const clearForm = () => {
    setPredictFormValues((prev) => ({
      ...prev,
      festival: "",
    }));
    getWeatherData(userData.nearestMarket.market.location);
    setSelectedFestival(null);
  };

  const handlePredictSubmit = async (e) => {
    e.preventDefault();
    const errors = predictFormValidations(predictFormValues);
    setPredictFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("form has validation errors");
    } else {
      try {
        // console.log(predictFormValues);
        setBtnDisabled(true);
        const response = await axios.post(
          "/api/prediction/preferredPredictions",
          predictFormValues
        );

        setResult(response.data.data);
        setBtnDisabled(false);
        clearForm();
      } catch (error) {
        console.log("Internal Server Error", error);
      }
    }
  };

  useEffect(() => {
    getAllVegetables();
    getFuelPrice();
  }, []);

  useEffect(() => {
    if (userData) {
      setLoading(false);
      getWeatherData(userData?.nearestMarket.market.location);
      setPredictFormValues((prev) => ({
        ...prev,
        vegetable:
          userData?.preferredVeggies.map((veggie) => ({
            vegetable: veggie.vegetable.value,
            amount: veggie.amount,
          })) || [],
        location: userData?.nearestMarket.market.location || "",
      }));

      setPreferenceFormValues({ userId: userData._id, preferredVeggies: [] });
      if (userData.preferredVeggies.length > 0) {
        setSubmitBtnTxt("Update");
      }
    }
  }, [userData]);

  useEffect(() => {
    if (result) {
      scroller.scrollTo("resultsDiv", {
        duration: 1000,
        delay: 0,
        smooth: "linear",
        offset: -105,
      });
    }
  }, [result]);

  return (
    <>
      <Navbar publicPage={false} navLinks={userLinks} />
      {loading && !predictFormValues && !preferenceFormValues ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col p-5 gap-5">
            <div className="flex flex-row w-1/2  md:w-1/6 self-end">
              <button
                className="flex-1 bg-blue-500 text-white border-none rounded-l-md hover:bg-blue-600 px-4 py-2"
                onClick={openViewModal}
              >
                View
              </button>
              <button
                className="flex-1 bg-lime-500 text-white border-none rounded-r-md hover:bg-lime-600 px-4 py-2"
                onClick={openModal}
              >
                {submitBtnTxt}
              </button>
            </div>
            <div className="flex flex-col bg-white p-5 w-full rounded-lg shadow-lg gap-5 border-2 border-gray-200">
              <FormInstructions content={shoppingList} />
              <form
                className="flex flex-col gap-5"
                onSubmit={handlePredictSubmit}
              >
                <hr className="hidden sm:block border-t-2 border-gray-300" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {" "}
                  <div className="w-full">
                    <label className="form-label">Market Area</label>
                    <input
                      type="text"
                      disabled
                      name="location"
                      value={userData?.nearestMarket.market.market}
                      className="form-input"
                    />
                    <span className="form-error">
                      {predictFormErrors.location}
                    </span>
                  </div>
                  <div className="w-full">
                    <label className="form-label">
                      {" "}
                      Average Rainfall in mm/hr
                    </label>
                    <input
                      type="text"
                      placeholder="Enter next week's precipitation"
                      className="form-input"
                      name="rainfall"
                      value={predictFormValues.rainfall}
                      onChange={handleChange}
                    />
                    {fetchingWeather && (
                      <span className="text-green-800 text-sm w-full mt-1 block">
                        Please wait until fetching weather data
                      </span>
                    )}
                    <span className="form-error">
                      {predictFormErrors.rainfall}
                    </span>
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
                      value={predictFormValues?.fuelPrice}
                      onChange={handleChange}
                    />
                    <span className="form-error">
                      {predictFormErrors.fuelPrice}
                    </span>
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
                    <span className="form-error">
                      {predictFormErrors.festival}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-1/4"
                  disabled={btnDisabled}
                >
                  {btnDisabled ? "Please Wait..." : "Predict Prices"}
                </button>
              </form>
            </div>

            {result && (
              <div
                id="resultsDiv"
                className="py-5 items-center flex flex-col w-full"
              >
                <div className="p-5 flex flex-col w-full lg:w-2/3 mx-auto bg-white rounded-lg shadow-lg border-2 border-gray-200">
                  <h2 className="text-center md:text-xl font-bold text-gray-800 mb-4">
                    Predicted Prices of Preferred Veggies in Next Week
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
                  <table className="w-full border-collapse bg-gray-100 rounded-t-md overflow-hidden shadow-lg">
                    <thead className="rounded-t-md">
                      <tr className="bg-gray-200 text-gray-700 text-center text-sm sm:text-base">
                        <th className="p-3 font-semibold">Vegetable</th>
                        <th className="p-3 font-semibold">Amount</th>
                        <th className="hidden sm:table-cell p-3 font-semibold">
                          Price / KG
                        </th>
                        <th className="p-3 font-semibold">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.weeklyCost?.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-300 text-center text-gray-800 text-sm sm:text-base"
                        >
                          <td className="p-3 font-medium capitalize">
                            {item.vegetable}
                          </td>
                          <td className="p-3 font-medium">
                            {item.amount !== 1000
                              ? `${item.amount} g`
                              : `${item.amount / 1000} KG`}
                          </td>
                          <td className="hidden sm:table-cell p-3 text-gray-600 font-medium">
                            {`Rs ${item.priceKG.toFixed(2)}`}
                          </td>
                          <td className="p-3 text-gray-600 font-medium">{`Rs ${item.cost.toFixed(
                            2
                          )}`}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-200 font-semibold text-gray-800 text-sm sm:text-base">
                        <td></td>
                        <td className="hidden sm:table-cell"></td>
                        <td className="p-3 text-right capitalize">
                          Sub Total:
                        </td>
                        <td className="p-3 text-gray-900 text-center">{`Rs ${result?.weeklyCost
                          ?.reduce((sum, item) => sum + item.cost, 0)
                          .toFixed(2)}`}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <Modal
        isOpen={modalOpen}
        closeModal={closeModal}
        title={"Preference Edit Modal"}
      >
        <form
          onSubmit={handlePreferenceSubmit}
          className="flex flex-col overflow-y-hidden"
        >
          <h1 className="form-heading">{`${submitBtnTxt} Preferences`}</h1>
          <div className="form-group">
            <label className="form-label">
              Select Your preferred vegetables
            </label>
            <SelectBox
              name="vegetables"
              options={vegetableOptions}
              value={selectedVegetables}
              placeholder="Select upto 5 options"
              isMulti={true}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "vegetables")
              }
            />
            <span className="form-error">{preferenceFormErrors.vegetable}</span>
          </div>

          {selectedVegetables.map((vegetable, index) => (
            <div className="form-group flex flex-row space-x-4" key={index}>
              <div className="flex-1">
                {" "}
                <input
                  type="text"
                  value={vegetable.label}
                  className="form-input"
                  disabled
                  name={`veg${index + 1}`}
                />
              </div>
              <div className="flex-1">
                <SelectBox
                  name={`amount${index + 1}`}
                  options={weeklyConsumption}
                  value={
                    weeklyConsumption.find(
                      (option) =>
                        option.value ===
                        preferenceFormValues.preferredVeggies[index]?.amount
                    ) || null
                  }
                  placeholder="Amount"
                  onChange={(selectedOption) =>
                    handleAmountChange(selectedOption, index)
                  }
                />
                <span className="form-error">
                  {preferenceFormErrors[`amountError${index + 1}`]}
                </span>
              </div>
            </div>
          ))}
          <div className="my-2 lg:mt-4 flex justify-center form-group">
            <button
              type="submit"
              className="btn-primary w-full sm:w-1/2"
              disabled={btnDisabled}
            >
              {btnDisabled ? "Please Wait..." : submitBtnTxt}
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={viewModalOpen}
        closeModal={closeViewModal}
        title={"Preference View Modal"}
      >
        <div className="flex flex-col w-full">
          <div>
            {userData?.preferredVeggies.length <= 0 ? (
              <h1 className="px-5 py-4 text-center bg-orange-300 font-semibold rounded-lg">
                No personalized vegetable list added yet
              </h1>
            ) : (
              <div className=" flex flex-col w-full">
                <h2 className="text-center text-xl font-bold text-gray-800 mb-5">
                  Preferred Vegetables{" "}
                </h2>
                <div className="flex flex-row bg-gray-100 p-3 rounded-t-md mb-2 items-center">
                  <span className="flex flex-1 font-semibold text-gray-700 text-center">
                    Vegetable
                  </span>
                  <span className="flex flex-1 font-semibold text-gray-700 text-center">
                    Qty/week
                  </span>
                </div>
                {userData?.preferredVeggies.map((veg, index) => (
                  <div
                    className="flex flex-row mb-2 px-2 py-1 space-x-2 border-b-2"
                    key={index}
                  >
                    <span className="flex flex-1 text-gray-800 font-medium">
                      {veg.vegetable.vegetableName}
                    </span>
                    <span className="flex flex-1 text-center text-gray-600 font-medium ">
                      {" "}
                      {veg.amount !== 1000
                        ? `${veg.amount} g`
                        : `${veg.amount / 1000} KG`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default ShoppingList;
