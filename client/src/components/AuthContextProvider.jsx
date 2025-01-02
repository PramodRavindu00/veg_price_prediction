import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedAuth = sessionStorage.getItem("auth"); //check theres already an item saved
    return storedAuth ? JSON.parse(storedAuth) : null; //if saved return it if not null
  });
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkValidCookieAvailable = async () => {
      try {
        //this endpoint verifying a JWT token which was saved inside a valid cookie from back end
        const res = await axios.get("/api/auth/validateToken", {
          withCredentials: true,
        });
        if (res.status === 204) {
          console.log("No token returned,need to login");
        } else if (res.data.success) {
          const token = res.data;
          setAuth({
            id: token.data.id,
            userType: token.data.role,
            isLoggedIn: true,
          });
          sessionStorage.setItem("auth", JSON.stringify(auth));
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    checkValidCookieAvailable();
  }, [auth]);

  useEffect(() => {
    if (auth) {
      sessionStorage.setItem("auth", JSON.stringify(auth)); //set new item if the auth state updated
    } else {
      sessionStorage.removeItem("auth"); //remove the item
    }
  }, [auth]);

  //providing logged user details to every page
  useEffect(() => {
    if (auth && auth.id && !userData) {
      const fetchUserDetails = async () => {
        try {
          const res = await axios.get(`/api/user/getUserDetails/${auth.id}`);
          setUserData(res.data.data);
        } catch (error) {
          console.log(error.data.message);
        }
      };
      fetchUserDetails();
    }
  }, [auth, userData]);

  //providing the context API to share across the system
  return (
    <AuthContext.Provider value={{ auth, setAuth, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
