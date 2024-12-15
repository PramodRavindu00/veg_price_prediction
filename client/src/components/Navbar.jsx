import PropTypes from "prop-types";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ publicPage = true, navLinks }) => {
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
    navigate("/login");
    alert("Successfully logout");
  };

  return (
    <nav className="fixed flex w-full z-50 text-white top-0 right-0 min-h-[10vh] px-3 sm:px-8 items-center bg-black/50">
      {/* desktop navbar */}
      <div className="w-full hidden sm:flex items-center gap-2">
        <span className="text-2xl">GreenPriceNet</span>
        <ul className="flex w-full gap-5 md:gap-10 justify-center">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.destination}
                smooth={true}
                duration={800}
                className="cursor-pointer "
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-5 md:gap-10 justify-center">
          {publicPage ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>

      {/* mobile nav bar */}
      <div className="w-full h-full flex flex-col sm:hidden">
        {toggleBtn && (
          <button className="text-xl">
            <AiOutlineMenu onClick={() => toggleMenu("open")} />
          </button>
        )}

        <div
          className={`gradient flex flex-col p-5 fixed top-0 left-0 w-full h-full  z-50 transform ${
            mobileNav ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-1000 ease-in-out overflow-y-auto`}
        >
          <button className="ml-auto text-xl mb-5">
            {" "}
            <AiOutlineClose onClick={() => toggleMenu("close")} />
          </button>

          <ul className="flex flex-col w-full  justify-center items-center space-y-3 text-black">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.destination}
                  smooth={true}
                  duration={900}
                  onClick={() => toggleMenu("close")}
                >
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
    </nav>
  );
};

Navbar.propTypes = {
  publicPage: PropTypes.bool,
  navLinks: PropTypes.arrayOf(PropTypes.string),
};

export default Navbar;
