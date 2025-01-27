import { useState } from "react";
import { publicLinks } from "../../assets/navLinks.mjs";
import Navbar from "../../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router";

const initialValues = {
  id: "",
  email: "",
  otp: "",
  password: "",
  confirmPassword: "",
};
const PasswordReset = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const veriFyEmail = async (e) => {
    e.preventDefault();
    //   validation
    const errors = {};
    if (!formValues.email) {
      errors.email = "Email is required!";
    } else if (!/^[^s@]+@[^s@]+.[^s@]{2,}$/i.test(formValues.email)) {
      errors.email = "Invalid Email format!";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors");
    } else {
      try {
        setBtnDisabled(true);
        const res = await axios.post("/api/user/sendOTP", {
          email: formValues.email,
        });
        toast.success(res.data.message);
        setFormValues((prev) => ({ ...prev, id: res.data.data.id }));
        setStep(2);
      } catch (error) {
        console.log(error);
        if (error.status !== 500) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Internal Server Error, Please try again later");
        }
      } finally {
        setBtnDisabled(false);
        setFormValues((prev)=>({...prev,email:""}))
      }
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    //   validation
    const errors = {};
    if (!formValues.otp) {
      errors.otp = "OTP is required!";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors");
    } else {
      try {
        setBtnDisabled(true);
        const res = await axios.post("/api/user/verifyOTP", {
          otp: formValues.otp,
        });
        toast.success(res.data.message);
        setStep(3);
      } catch (error) {
        console.log(error);

        if (error.status !== 500) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Internal Server Error, Please try again later");
        }
      } finally {
        setBtnDisabled(false);
        setFormValues((prev) => ({ ...prev, otp: "" }));
      }
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formValues.password) {
      errors.password = "Password is required!";
    } else if (formValues.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (formValues.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    if (!formValues.confirmPassword) {
      errors.confirmPassword = "Confirm password is required!";
    } else if (formValues.confirmPassword !== formValues.password) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors");
    } else {
      setBtnDisabled(true);
      try {
        const res = await axios.patch(
          `/api/user/changePassword/${formValues.id}`,
          { password: formValues.password }
        );

        toast.success(res.data.message);

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (error) {
        if (error.status !== 500) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Internal Server Error, Please try again later");
        }
      } finally {
        setBtnDisabled(false);
        setFormValues(initialValues)
      }
    }
  };
  return (
    <>
      <Navbar navLinks={publicLinks} />
      <div className="relative w-full h-auto bg-cover bg-center bg-bg-content flex-grow flex items-center justify-center p-5">
        <div className="flex flex-col bg-white p-6 w-full sm:w-3/4 lg:w-1/3 rounded-lg shadow-lg gap-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Password Reset
          </h2>

          {step === 1 && (
            <form onSubmit={veriFyEmail} className="space-y-4">
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
              <div className="my-8 lg:my-4 flex justify-center">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={btnDisabled}
                >
                  {btnDisabled ? "Please Wait..." : "Verify Email"}
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={verifyOTP} className="space-y-4">
              <div className="w-full">
                <label className="form-label">OTP</label>
                <input
                  type="text"
                  placeholder="Enter the OTP"
                  className="form-input"
                  name="otp"
                  value={formValues.otp}
                  onChange={handleChange}
                />
                <span className="form-error">{formErrors.otp}</span>
              </div>
              <div className="my-8 lg:my-4 flex justify-center">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={btnDisabled}
                >
                  {btnDisabled ? "Please Wait..." : "Verify OTP"}
                </button>
              </div>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={changePassword} className="space-y-4">
              <div className="w-full">
                <label className="form-label">Password</label>
                <div className="relative flex items-center">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter new Password"
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
                    placeholder="Re-enter new password"
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
              <div className="my-8 lg:my-4 flex justify-center">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={btnDisabled}
                >
                  {btnDisabled ? "Please Wait..." : "Change Password"}
                </button>
              </div>
            </form>
          )}
          {step !== 1 && (
            <h2 className="form-label text-center mt-0">
              Do not Refresh / Change or Close the Page
            </h2>
          )}
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default PasswordReset;
