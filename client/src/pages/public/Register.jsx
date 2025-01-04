import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks.mjs";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { registerFormValidations } from "../../assets/validations.mjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast, Toaster } from "sonner";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  contactNo: "",
  nearestMarket: null,
  password: "",
  confirmPassword: "",
  notification: true,
  userType: "User",
};

const Register = () => {
  const [marketOptions, setMarketOptions] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState({});
  const [notification, setNotification] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = (e) => {
    e.preventDefault();
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const getAllMarkets = async () => {
    try {
      const response = await axios.get("/api/market/getAllMarkets");
      const options = response.data.data.map((market) => ({
        market: market.market,
        location: market._id,
      }));

      setMarketOptions(options);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAllMarkets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNo") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormValues({ ...formValues, [name]: numericValue.slice(0, 10) });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSelectChange = (e) => {
    setSelectedMarket(e.target.value);
    setFormValues({ ...formValues, nearestMarket: { market: e.target.value } });
  };

  const handleCheckBoxChange = (e) => {
    setNotification(e.target.checked);
    setFormValues({ ...formValues, notification: e.target.checked });
  };

  const clearForm = () => {
    setFormValues(initialValues);
    setBtnDisabled(false);
    setSelectedMarket({});
    setNotification(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = registerFormValidations(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors");
    } else {
      const { confirmPassword, ...valuesToSubmit } = formValues;
      try {
        setBtnDisabled(true);
        const res = await axios.post("/api/auth/userRegister", valuesToSubmit);
        toast.success(res.data.message);
        clearForm();
      } catch (error) {
        setBtnDisabled(false);
        console.log(error.message);
        if (error.response) {
          const errorRes = error.response.data;
          if (errorRes.type === "email") {
            setFormErrors({
              ...errors,
              email: errorRes.message,
            });
            setFormValues({ ...formValues, email: "" });
          }

          if (errorRes.type === "contact") {
            setFormErrors({
              ...errors,
              contactNo: errorRes.message,
            });
            setFormValues({ ...formValues, contactNo: "" });
          }
        } else {
          toast.error("Internal Server Error, Please try again later");
        }
      }
    }
  };

  return (
    <>
      <Navbar navLinks={publicLinks} />
      <div
        className="relative w-full h-auto bg-cover bg-center min-h-screen lg:min-h-[85vh] 
 bg-gradient-to-r from-green-600 via-yellow-200 to-green-400
    flex items-center justify-center p-5"
      >
        <div className="flex flex-col bg-white p-6 w-full sm:w-3/4 lg:w-1/2 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="form-row-2">
              <div className="w-full">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your First Name"
                  className="form-input"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors.firstName}</span>
              </div>
              <div className="w-full">
                <label className="form-label">Your Last Name</label>
                <input
                  type="text"
                  placeholder="Enter your Last Name"
                  className="form-input"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors.lastName}</span>
              </div>
            </div>
            <div className="form-row-2">
              <div className="w-full">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  placeholder="Enter your Email"
                  className="form-input"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors.email}</span>
              </div>
              <div className="w-full">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  placeholder="Enter your Address"
                  className="form-input"
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors.address}</span>
              </div>
            </div>

            <div className="form-row-2">
              <div className="w-full">
                <label className="form-label">Contact No</label>
                <input
                  type="text"
                  placeholder="Enter your Contact No"
                  className="form-input"
                  name="contactNo"
                  value={formValues.contactNo}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors.contactNo}</span>
              </div>

              <div className="w-full">
                <label className="form-label">Nearest Market</label>
                <div className="relative">
                  <select
                    className="form-input w-full overflow-x-hidden"
                    name="nearestMarket"
                    value={selectedMarket}
                    onChange={handleSelectChange}
                  >
                    <option value="" defaultValue>
                      Select the nearest market
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
                <span className="form-error">{formErrors.nearestMarket}</span>
              </div>
            </div>
            <div className="form-row-2">
              <div className="w-full">
                <label className="form-label">Password</label>
                <div className="relative flex items-center">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your Password"
                    className="form-input"
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                  />
                  <button
                    className="absolute right-2"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={passwordVisible ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
                <span className="form-error">{formErrors.password}</span>
              </div>
              <div className="w-full">
                <label className="form-label">Confirm Password</label>
                <div className="flex relative items-center">
                  {" "}
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className="form-input"
                    name="confirmPassword"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    className="absolute right-2"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={confirmPasswordVisible ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
                <span className="form-error">{formErrors.confirmPassword}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="notification"
                checked={notification}
                onChange={handleCheckBoxChange}
                className="form-checkbox text-blue-500"
              />
              <label
                htmlFor="notification"
                className="text-gray-600 form-label"
              >
                I agree to receive emails.
              </label>
            </div>
            <div className="my-1 flex justify-center form-label text-gray-600 mb-2">
              <span>
                Already Have an Account? &nbsp;
                <Link to="/login" className="underline hover:text-black">
                  Login
                </Link>
              </span>
            </div>
            <div className="mb-1 flex flex-col items-center justify-center">
              <button
                type="submit"
                className="btn-primary"
                disabled={btnDisabled}
              >
                {btnDisabled ? "Please Wait..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toaster richColors position="top-right" />
    </>
  );
};

export default Register;
