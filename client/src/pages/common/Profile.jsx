import { toast, Toaster } from "sonner";
import { adminLinks, userLinks } from "../../assets/navLinks.mjs";
import { useAuth } from "../../assets/useAuth.mjs";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import SelectBox from "../../components/SelectBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  passwordChangeValidations,
  proFileEditValidations,
} from "../../assets/validations.mjs";
import axios from "axios";
import { useNavigate } from "react-router";
import Confirm from "../../components/Confirm";
import { autoLogout } from "../../assets/utilFunctions.mjs";

const initialPasswordValues = {
  password: "",
  newPassword: "",
  confirmPassword: "",
};

const Profile = () => {
  const navigate = useNavigate();
  const { auth, userData, setAuth, setUserData } = useAuth();
  const [formErrors, setFormErrors] = useState(null);
  const [passwordFormErrors, setPasswordFormErrors] = useState(null);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contactNo: "",
    nearestMarket: null, // This will be set when data loads
  });

  useEffect(() => {
    if (userData) {
      setFormValues({
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        email: userData?.email || "",
        address: userData?.address || "",
        contactNo: userData?.contactNo || "",
        nearestMarket: userData?.nearestMarket?.market?._id ,
      });

      const getAllMarkets = async () => {
        try {
          const response = await axios.get("/api/market/getAllMarkets");
          const options = response.data.data.map((market) => ({
            label: market.market,
            value: market._id,
          }));

          setMarketOptions(options);
          // Set the nearest market option based on userData
          const userMarket = options.find(
            (market) => market.value === userData?.nearestMarket?.market?._id
          );
          setSelectedMarket(userMarket || "");
        } catch (error) {
          console.log(error.message);
        }
      };
      getAllMarkets();
    }
  }, [userData]);

  const [passwordFormValues, setPasswordFormValues] = useState(
    initialPasswordValues
  );
  const [btnProfileDisabled, setBtnProfileDisabled] = useState(false);
  const [btnPasswordDisabled, setBtnPasswordDisabled] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [marketOptions, setMarketOptions] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);

  const togglePassword = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const toggleNewPassword = (e) => {
    e.preventDefault();
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toggleConfirmPassword = (e) => {
    e.preventDefault();
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNo") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormValues({ ...formValues, [name]: numericValue.slice(0, 10) });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }

    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormValues({ ...passwordFormValues, [name]: value });
    setPasswordFormErrors({ ...passwordFormErrors, [name]: "" });
  };

  const handleSelectChange = (option) => {
    setSelectedMarket(option);
    setFormValues({ ...formValues, nearestMarket: { market: option?.value } });
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    const errors = passwordChangeValidations(passwordFormValues);
    setPasswordFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors");
    } else {
      setBtnPasswordDisabled(true);
      try {
        await axios.patch(`/api/user/changePassword/${userData?._id}`, {
          password: passwordFormValues.password,
          newPassword: passwordFormValues.newPassword,
        });

        toast.success("Password Changed Successfully");

        setTimeout(() => {
          toast.info("You will be redirected to the login page shortly");
        }, 2000);
        setTimeout(() => {
          autoLogout(setAuth, navigate, setUserData);
        }, 4000);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      } finally {
        setPasswordFormValues(initialPasswordValues);
        setBtnPasswordDisabled(false);
      }
    }
  };

  const handleAccountDelete = async (e) => {
    e.preventDefault();
    Confirm({
      title: "Confirm User Account Delete",
      message:
        "Are you sure you want to delete your account? This cannot be undone",
      onConfirm: async () => {
        try {
          await axios.delete(`/api/user/deleteAccount/${userData?._id}`);
          toast.success("User Account has been deleted successfully");
          setTimeout(() => {
            toast.info("You will be redirected to the login page shortly");
          }, 2000);
          setTimeout(() => {
            autoLogout(setAuth, navigate, setUserData);
          }, 4000);
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  const handleProfileEdit = async (e) => {
    e.preventDefault();
    const errors = proFileEditValidations(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors");
    } else {
      setBtnProfileDisabled(true);
      try {
        const res = await axios.patch(
          `/api/user/profileEdit/${userData?._id}`,
          formValues
        );
        toast.success("Profile Details Updated Successfully");
        setUserData(res?.data?.data);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setBtnProfileDisabled(false);
      }
    }
  };

  return (
    <>
      <Navbar
        publicPage={false}
        navLinks={auth.userType === "Admin" ? adminLinks : userLinks}
      />
      <div className="flex flex-col md:flex-row p-5 gap-5">
        <div className="flex flex-col bg-white p-5 rounded-lg shadow-lg gap-5 border-2 border-gray-200 w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <form className="flex flex-col gap-5" onSubmit={handleProfileEdit}>
            <div className="form-row-2">
              <div className="w-full">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your First Name"
                  className="form-input"
                  name="firstName"
                  value={formValues?.firstName}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors?.firstName}</span>
              </div>
              <div className="w-full">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter your Last Name"
                  className="form-input"
                  name="lastName"
                  value={formValues?.lastName}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors?.lastName}</span>
              </div>
            </div>

            <div className="w-full">
              <label className="form-label">Email</label>
              <input
                type="text"
                placeholder="Enter your Email"
                className="form-input"
                name="email"
                value={formValues?.email}
                disabled={userData?.userType === "Admin" ? true : false}
                onChange={handleChange}
              />
              <span className="form-error">{formErrors?.email}</span>
            </div>
            <div className="w-full">
              <label className="form-label">Address</label>
              <input
                type="text"
                placeholder="Enter your Address"
                className="form-input"
                name="address"
                value={formValues?.address}
                onChange={handleChange}
              />
              <span className="form-error">{formErrors?.address}</span>
            </div>

            <div className="form-row-2">
              <div className="w-full">
                <label className="form-label">Contact No</label>
                <input
                  type="text"
                  placeholder="Enter your Contact No"
                  className="form-input"
                  name="contactNo"
                  value={formValues?.contactNo}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors?.contactNo}</span>
              </div>

              <div className="w-full">
                <label className="form-label">Closest Market Area</label>
                {userData?.userType === "Admin" ? (
                  <input
                    type="text"
                    name="nearestMarket"
                    className="form-input"
                    value={userData?.nearestMarket.market.market}
                    disabled={true}
                  />
                ) : (
                  <SelectBox
                    name="nearestMarket"
                    options={marketOptions}
                    value={selectedMarket}
                    placeholder="Select Market Area"
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption)
                    }
                  />
                )}

                <span className="form-error">{formErrors?.nearestMarket}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-info w-full sm:w-1/3"
              disabled={btnProfileDisabled}
            >
              {btnProfileDisabled ? "Please Wait..." : "Save Details"}
            </button>
          </form>
        </div>
        <div className="flex flex-col bg-white p-5 rounded-lg shadow-lg gap-5 border-2 border-gray-200 w-full md:w-1/3">
          <h2 className="text-2xl font-bold text-gray-800">
            Security & Control
          </h2>
          <form
            className="flex flex-col gap-5"
            onSubmit={handlePasswordChangeSubmit}
          >
            <div className="w-full">
              <label className="form-label">Current Password</label>
              <div className="flex relative items-center">
                {" "}
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter current password"
                  className="form-input"
                  name="password"
                  value={passwordFormValues?.password}
                  onChange={handlePasswordChange}
                />
                <button className="absolute right-2" onClick={togglePassword}>
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              <span className="form-error">{passwordFormErrors?.password}</span>
            </div>
            <div className="w-full">
              <label className="form-label">Enter New Password</label>
              <div className="flex relative items-center">
                {" "}
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  placeholder="Enter New password"
                  className="form-input"
                  name="newPassword"
                  value={passwordFormValues?.newPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  className="absolute right-2"
                  onClick={toggleNewPassword}
                >
                  <FontAwesomeIcon
                    icon={newPasswordVisible ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              <span className="form-error">
                {passwordFormErrors?.newPassword}
              </span>
            </div>
            <div className="w-full">
              <label className="form-label">Confirm New Password</label>
              <div className="flex relative items-center">
                {" "}
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Re-enter New password"
                  className="form-input"
                  name="confirmPassword"
                  value={passwordFormValues?.confirmPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  className="absolute right-2"
                  onClick={toggleConfirmPassword}
                >
                  <FontAwesomeIcon
                    icon={confirmPasswordVisible ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              <span className="form-error">
                {passwordFormErrors?.confirmPassword}
              </span>
            </div>
            <button
              type="submit"
              className="btn-primary w-full sm:w-2/3"
              disabled={btnPasswordDisabled}
            >
              {btnPasswordDisabled ? "Please Wait..." : "Change Password"}
            </button>
          </form>
          {userData?.userType !== "Admin" && (
            <form
              className="flex flex-col gap-5"
              onSubmit={handleAccountDelete}
            >
              <button type="submit" className="btn-danger w-full sm:w-2/3">
                {"Delete Account"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default Profile;
