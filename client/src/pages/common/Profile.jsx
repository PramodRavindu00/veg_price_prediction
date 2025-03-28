import { toast, Toaster } from "sonner";
import { adminLinks, userLinks } from "../../assets/navLinks.mjs";
import { useAuth } from "../../assets/useAuth.mjs";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import SelectBox from "../../components/SelectBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { passwordChangeValidations } from "../../assets/validations.mjs";
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
  const initialValues = {
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    email: userData?.email,
    address: userData?.address,
    contact: userData?.contact,
    marketArea: userData?.marketArea,
  };
  const [formErrors, setFormErrors] = useState(null);
  const [passwordFormErrors, setPasswordFormErrors] = useState(null);

  const [formValues, setFormValues] = useState(initialValues);
  const [passwordFormValues, setPasswordFormValues] = useState(
    initialPasswordValues
  );

  const [btnProfileDisabled, setBtnProfileDisabled] = useState(false);
  const [btnPasswordDisabled, setBtnPasswordDisabled] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormValues({ ...passwordFormValues, [name]: value });
    setPasswordFormErrors({ ...passwordFormErrors, [name]: "" });
  };

  const handleSelectChange = (option, name) => {
    //  setSelectedMarket(option);
    setFormValues((prev) => ({ ...prev, location: option?.value }));

    setFormErrors((prev) => ({ ...prev, [name]: "" }));
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

  return (
    <>
      <Navbar
        publicPage={false}
        navLinks={auth.userType === "Admin" ? adminLinks : userLinks}
      />
      <div className="flex flex-col md:flex-row p-5 gap-5">
        <div className="flex flex-col bg-white p-5 rounded-lg shadow-lg gap-5 border-2 border-gray-200 w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <form className="flex flex-col gap-5">
            <div className="w-full">
              <label className="form-label">Market Area</label>
              <SelectBox
                name="location"
                // options={marketOptions}
                // value={selectedMarket}
                placeholder="Select Market Area"
                onChange={(selectedOption) => {
                  handleSelectChange(selectedOption, "location");
                }}
              />
              <span className="form-error">{formErrors?.location}</span>
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
