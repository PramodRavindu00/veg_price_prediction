import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks.mjs";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast, Toaster } from "sonner";
import { loginFormValidations } from "../../assets/validations.mjs";
import axios from "axios";
import { useAuth } from "../../assets/useAuth.mjs";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      if (auth.userType === "Admin") {
        navigate("/admin/dashboard");
      } else if (auth.userType === "User") {
        navigate("/user/predict");
      }
    }
  }, [auth, navigate]);

  const [formValues, setFormValues] = useState(initialValues);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = loginFormValidations(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors");
    } else {
      try {
        setBtnDisabled(true);
        const res = await axios.post("/api/auth/userLogin", formValues);
        toast.success(res.data.message);
        if (res.data.success) {
          const loggedUser = res.data.loggedUser;

          //auth context state updating with logged user data
          setAuth({ ...loggedUser, isLoggedIn: true });
        }
      } catch (error) {
        console.log(error);

        if (error.status === 401) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Internal Server Error, Please try again later");
        }
      } finally {
        setFormValues(initialValues);
        setBtnDisabled(false);
      }
    }
  };

  return (
    <>
      <Navbar navLinks={publicLinks} />
      <div
        className="relative w-full h-auto bg-cover bg-center min-h-screen lg:min-h-screen bg-bg-content
    flex items-center justify-center p-5"
      >
        <div className="flex flex-col bg-white p-6 w-full sm:w-3/4 lg:w-1/3 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
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
              <span className="form-error">{formErrors.email}</span>
            </div>
            <div className="mb-4">
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

            <div className="mb-4 flex form-label justify-end text-gray-600 form-label">
              <Link to="/home" className="underline hover:text-black">
                Reset Password
              </Link>
            </div>
            <div className="mb-2 flex justify-center text-gray-600 form-label">
              <span>
                Don&apos;t have an Account yet?&nbsp;
                <Link to="/register" className="underline hover:text-black">
                  Register
                </Link>
              </span>{" "}
            </div>
            <div className="my-8 lg:my-4 flex justify-center">
              <button
                type="submit"
                className="btn-primary"
                disabled={btnDisabled}
              >
                {btnDisabled ? "Please Wait..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default Login;
