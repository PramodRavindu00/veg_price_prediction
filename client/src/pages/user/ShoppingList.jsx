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

const ShoppingList = () => {
  const { userData, setUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [predictFormValues, setPredictFormValues] = useState(null);
  const [preferenceFormValues, setPreferenceFormValues] = useState(null);
  const [submitBtnTxt, setSubmitBtnTxt] = useState("Add Preferences");

  useEffect(() => {
    if (userData) {
      setLoading(false);

      setPredictFormValues({
        date: new Date().toISOString().slice(0, 10),
        vegetable: userData.preferredVeggies,
        location: userData.nearestMarket.market.location,
        rainfall: "",
        fuelPrice: "",
        predType: "week",
        festival: "",
      });

      setPreferenceFormValues({ userId: userData._id, preferredVeggies: [] });
      if (userData.preferredVeggies.length > 0) {
        setSubmitBtnTxt("Change Preferences");
      }
    }
  }, [userData]);

  const [predictFormErrors, setPredictFormErrors] = useState({});
  const [preferenceFormErrors, setPreferenceFormErrors] = useState({});

  const [vegetableOptions, setVegetableOptions] = useState([]);
  const [selectedVegetables, setSelectedVegetables] = useState([]);

  const [selectedFestival, setSelectedFestival] = useState(null);

  const [btnDisabled, setBtnDisabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setSelectedVegetables([]);
    setPreferenceFormErrors({});
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validNumericValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1")
      .replace(/^(\d+\.\d{2})\d*/g, "$1");
    setPredictFormValues({ ...predictFormValues, [name]: validNumericValue });
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

  const handlePredictSubmit = (e) => {
    e.preventDefault();
    const errors = predictFormValidations(predictFormValues);
    setPredictFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("form has validation errors");
    } else {
      console.log(predictFormValues);
    }
  };

  useEffect(() => {
    getAllVegetables();
  }, []);

  return (
    <>
      <Navbar publicPage={false} navLinks={userLinks} />
      {loading && !predictFormValues && !preferenceFormValues ? (
        <Loader />
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col lg:flex-row">
            <div className="layout-2-in-row">
              <div className="mb-6">
                {" "}
                <button className="btn-secondary" onClick={openModal}>
                  {submitBtnTxt}
                </button>
              </div>
              <div>
                {userData.preferredVeggies.length <= 0 ? (
                  <h1 className="px-6 py-4 text-center bg-orange-300 font-semibold rounded-md">
                    No personalized vegetable list added yet
                  </h1>
                ) : (
                  <div className="p-6 flex flex-col w-full lg:w-2/3 mx-auto bg-white rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-center text-xl font-bold text-gray-800 mb-6">
                      Preferred Vegetables{" "}
                    </h2>
                    <div className="flex flex-row bg-gray-100 p-3 rounded-t-md mb-2 items-center">
                      <span className="flex flex-1 font-semibold text-gray-700 text-center">
                        Vegetable
                      </span>
                      <span className="flex flex-1 font-semibold text-gray-700 text-center">
                        Weekly Consumption
                      </span>
                    </div>
                    {userData.preferredVeggies.map((veg, index) => (
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
            <div className="layout-2-in-row">
              <h2 className="form-heading">
                Fill this form to predict your preferred vegetables prices &
                plan your cost
              </h2>
              <form
                className="flex flex-col items-center"
                onSubmit={handlePredictSubmit}
              >
                <div className="form-group">
                  <label className="form-label">Market Area</label>
                  <input
                    type="text"
                    disabled
                    name="location"
                    value={userData.nearestMarket.market.market}
                    className="form-input"
                  />
                  <span className="form-error">
                    {predictFormErrors.location}
                  </span>
                </div>
                <div className="form-group">
                  <label className="form-label">Average Rainfall in mm</label>
                  <input
                    type="text"
                    placeholder="Enter next week's average rainfall"
                    className="form-input"
                    name="rainfall"
                    value={predictFormValues.rainfall}
                    onChange={handleChange}
                  />
                  <span className="form-error">
                    {predictFormErrors.rainfall}
                  </span>
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
                    value={predictFormValues.fuelPrice}
                    onChange={handleChange}
                  />
                  <span className="form-error">
                    {predictFormErrors.fuelPrice}
                  </span>
                </div>
                <div className="form-group">
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
                  <span className="form-error">
                    {predictFormErrors.festival}
                  </span>
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
          </div>
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        closeModal={closeModal}
        title={"Preference Edit Modal"}
      >
        <form
          onSubmit={handlePreferenceSubmit}
          className="flex flex-col justify-center items-center"
        >
          <h1 className="form-heading">{submitBtnTxt}</h1>
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
              className="btn-primary"
              disabled={btnDisabled}
            >
              {btnDisabled ? "Please Wait..." : submitBtnTxt}
            </button>
          </div>
        </form>
      </Modal>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default ShoppingList;
