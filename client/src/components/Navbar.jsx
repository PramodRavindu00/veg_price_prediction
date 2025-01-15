import PropTypes from "prop-types";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faRightFromBracket,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Confirm from "./Confirm";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useAuth } from "../assets/useAuth.mjs";

const Navbar = ({ publicPage = true, navLinks }) => {
  const { setAuth, setUserData } = useAuth();

  const [toggleBtn, setToggleBtn] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = (action) => {
    if (action === "open") {
      setMobileNav(true);
      setToggleBtn(false);
    } else {
      setMobileNav(false);
      setTimeout(() => {
        setToggleBtn(true);
      }, 800);
    }
  };

  const logout = () => {
    Confirm({
      title: "Confirm Log out",
      message: "Are you sure you want to log out?",
      onConfirm: async () => {
        try {
          const res = await axios.post(
            "/api/auth/logOut",
            {},
            { withCredentials: true }
          );
          if (res.data.success) {
            setAuth({
              isLoggedIn: false,
              userId: null,
              userType: null,
            });
            setUserData(null);
            console.log(res.data.message);
            
            navigate("/login");
          }
        } catch (error) {
          toast.error(error);
        }
      },
    });
  };

  return (
    <nav className="flex w-full fixed sm:sticky top-0 right-0 p-3 sm:p-6 items-center bg-transparent sm:bg-[#1d362e] z-10 text-white">
      <div className="w-full hidden sm:flex items-center justify-between gap-2">
        <span className="hidden text-3xl  lg:block">
          GreenPriceNet
        </span>
        <ul className="flex  flex-row justify-center gap-5 md:gap-10 text-lg">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.route}
                className="hover:font-semibold transition ease-out duration-1000"
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-10">
          {publicPage ? (
            <>
              <Link
                to="/login"
                className="hover:font-semibold transition ease-out duration-1000"
              >
                <FontAwesomeIcon icon={faDoorOpen} className="mx-2" />
                Log In
              </Link>

              <Link
                to="/register"
                className="hover:font-semibold transition ease-out duration-1000"
              >
                <FontAwesomeIcon icon={faUserPlus} className="mx-2" />
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile">
                {" "}
                <FontAwesomeIcon icon={faUser} className="mx-2 text-3xl" />
              </Link>
              <button onClick={logout}>
                {" "}
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="mx-2 text-3xl"
                />
              </button>
            </>
          )}
        </div>
      </div>

      {/* mobile nav bar */}
      <div className="h-full flex flex-col sm:hidden">
        {toggleBtn && (
          <button className="text-2xl text-white bg-black/50 p-2 rounded">
            <AiOutlineMenu onClick={() => toggleMenu("open")} />
          </button>
        )}

        <div
          className={`bg-[#1d362e] flex flex-col p-5 fixed top-0 left-0 w-full h-full  z-50 transform ${
            mobileNav ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-1000 ease-in-out overflow-y-auto `}
        >
          <button className="ml-auto text-xl mb-5">
            {" "}
            <AiOutlineClose onClick={() => toggleMenu("close")} />
          </button>

          <ul className="flex flex-col w-full  justify-center items-center space-y-3">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.route} onClick={() => toggleMenu("close")}>
                  {link.text}
                </Link>
              </li>
            ))}
            {publicPage ? (
              <>
                <li>
                  {" "}
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  {" "}
                  <Link to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  {" "}
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  {" "}
                  <Link onClick={logout}>Logout</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </nav>
  );
};

Navbar.propTypes = {
  publicPage: PropTypes.bool,
  navLinks: PropTypes.arrayOf(PropTypes.object),
};

export default Navbar;
