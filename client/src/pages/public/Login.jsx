import Navbar from "../../components/Navbar";
import { publicLinks } from "../../assets/navLinks";
import { Link } from "react-router";
const Login = () => {
  return (
    <div>
      <Navbar navLinks={publicLinks} />
      <div className="flex items-center justify-center h-screen">
        <div className="flex-col bg-white bg-opacity-70 p-8 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3">
          <h2 className="form-heading">LOG IN</h2>
          <form>
            <div className="mb-4">
              <label className="form-label">Email</label>
              <input
                type="text"
                placeholder="Enter your Email"
                className="form-input"
              />
              <span className="form-error"></span>
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Enter your Password"
                className="form-input"
              />
              <span className="form-error"></span>
            </div>

            <div className="mb-4 flex form-label justify-end text-xs">
              <Link to="/home" className="text-black underline">
                Reset Password
              </Link>
            </div>
            <div className="mb-2 flex form-label justify-center text-xs">
              <span>
                Don&apos;t have an Account yet?&nbsp;
                <Link to="/register" className="text-black underline">
                  Register Here
                </Link>
              </span>{" "}
            </div>
            <div className="my-2 flex justify-center">
              <button type="submit" className="btn-primary">
                LOG IN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
