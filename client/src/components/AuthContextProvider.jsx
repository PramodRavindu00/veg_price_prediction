import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth"); //check theres already an item saved
    return storedAuth ? JSON.parse(storedAuth) : null; //if saved return it if not null
  });

  useEffect(() => {
    const checkValidCookieAvailable = async () => {
      try {
        //this endpoint verifying a JWT token which was saved inside a valid cookie from back end
        const res = await axios.post(
          "/api/auth/validateToken",
          {},
          { withCredentials: true }
        );
        if (res.data.success) {
          const token = res.data;
          setAuth({
            id: token.data.id,
            userType: token.data.role,
            isLoggedIn: true,
          });
        }
      } catch (error) {
        console.log(
          `Don't have a valid cookie or token.Need to login`,
          error.message
        );
      }
    };

    checkValidCookieAvailable();
  }, []);

  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth)); //set new item if the auth state updated
    } else {
      localStorage.removeItem("auth"); //remove the item
    }
  }, [auth]);

  //providing the context API to share across the system
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
