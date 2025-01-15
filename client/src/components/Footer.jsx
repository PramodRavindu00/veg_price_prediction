import { Link, useLocation } from "react-router";
import { publicLinks } from "../assets/navLinks.mjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const location = useLocation();
  const  publicFooterLinks = [
    ...publicLinks,
    { text: "Login", route: "/login" },
    { text: "Register", route: "/register" },
  ];

  const publicFooterRoutes = publicFooterLinks.map((link) => link.route);
  const isPublicRoute = publicFooterRoutes.includes(location.pathname);

  return (
    <footer className="text-center text-white flex flex-col w-full mt-auto bg-[#1d362e] py-5">
      {isPublicRoute && (
        <>
          <div className="flex flex-col sm:flex-row justify-evenly p-3 gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg ">Quick Links</h3>
              <ul className="flex  flex-col">
                {publicFooterLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.route}
                      className="hover:font-semibold hover:text-black transition ease-out duration-1000"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden sm:block h-auto border-l-2 border-gray-400"></div>
            <hr className="block sm:hidden w-20 border-t-2 border-gray-400 mx-auto" />
            <div className="flex flex-col gap-1">
              <h3 className="text-lg">Follow Us</h3>
              <ul className="flex  flex-col text-sm gap-1 items-center sm:items-start ">
                <li>
                  <FontAwesomeIcon icon={faFacebook} className="mr-2" />
                  <a
                    href="https://www.facebook.com/"
                    className="hover:font-semibold hover:text-black transition ease-out duration-1000"
                    target="_blank"
                  >
                    FaceBook
                  </a>
                </li>
                <li>
                  <FontAwesomeIcon icon={faInstagram} className="mr-2" />
                  <a
                    href="https://www.instagram.com/"
                    className="hover:font-semibold hover:text-black transition ease-out duration-1000"
                    target="_blank"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <FontAwesomeIcon icon={faXTwitter} className="mr-2" />
                  <a
                    href="https://twitter.com/"
                    className="hover:font-semibold hover:text-black transition ease-out duration-1000"
                    target="_blank"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <hr className="w-[95vw] border-t-2 border-gray-400 my-3 mx-auto" />
        </>
      )}

      <p>© 2024 GreenPriceNet. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
