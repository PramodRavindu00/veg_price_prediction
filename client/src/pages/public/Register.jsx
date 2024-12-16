import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  contactNo: "",
  nearestMarket: "",
  password: "",
  confirmPassword: "",
  notification: "",
  userType: "user",
};
const Register = () => {
  const [marketOptions, setMarketOptions] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState({});
  const [notification, setNotification] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);

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
    setFormValues({ ...formValues, nearestMarket: e.target.value });
  };

  const handleCheckBoxChange = (e) => {
    setNotification(e.target.checked);
    setFormValues({ ...formValues, notification: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
  };

  return (
    <div>
      <Navbar navLinks={publicLinks} />
      <div className="flex items-center justify-center h-screen">
        <div className="flex-col bg-white bg-opacity-70 p-8 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2">
          <h2 className="form-heading">CREATE ACCOUNT</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row-2">
              <div className="mb-4 w-full lg:w-1/2">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your First Name"
                  className="form-input"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                />
                <span className="form-error"></span>
              </div>
              <div className="mb-4 w-full lg:w-1/2">
                <label className="form-label">Your Last Name</label>
                <input
                  type="text"
                  placeholder="Enter your Last Name"
                  className="form-input"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                />
                <span className="form-error"></span>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Email</label>
              <input
                type="text"
                placeholder="Enter your Email"
                className="form-input"
                name="email"
                value={formValues.email}
                onChange={handleChange}
              />
              <span className="form-error"></span>
            </div>
            <div className="mb-4">
              <label className="form-label">Address</label>
              <input
                type="text"
                placeholder="Enter your Address"
                className="form-input"
                name="address"
                value={formValues.address}
                onChange={handleChange}
              />
              <span className="form-error"></span>
            </div>
            <div className="form-row-2">
              <div className="mb-4 w-full lg:w-1/2">
                <label className="form-label">Contact No</label>
                <input
                  type="text"
                  placeholder="Enter your Contact No"
                  className="form-input"
                  name="contactNo"
                  value={formValues.contactNo}
                  onChange={handleChange}
                />
                <span className="form-error"></span>
              </div>

              <div className="mb-4 w-full lg:w-1/2">
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
                <span className="form-error"></span>
              </div>
            </div>
            <div className="form-row-2">
              <div className="mb-4 w-full lg:w-1/2">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="form-input"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                />
                <span className="form-error"></span>
              </div>
              <div className="mb-4 w-full lg:w-1/2">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  className="form-input"
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                />
                <span className="form-error"></span>
              </div>
            </div>
            <div className="mb-1 flex">
              <input
                type="checkbox"
                name="notification"
                checked={notification}
                onChange={handleCheckBoxChange}
                className="mr-2"
              />
              <label htmlFor="notification" className="form-label">
                I agree to the receive Weekly Price Predictions via Emails
              </label>
            </div>
            <div className="mb-1 flex justify-center form-label">
              <span>
                Already Have an Account? &nbsp;
                <Link to="/login" className="text-black underline">
                  Login
                </Link>
              </span>
            </div>
            <div className="mb-2 flex justify-center">
              <button type="submit" className="btn-primary">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
