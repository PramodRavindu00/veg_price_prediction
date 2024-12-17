import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";
import Footer from "./components/Footer";
import Profile from "./pages/common/Profile";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import Contact from "./pages/public/Contact";
import PredictMain from "./pages/user/PredictMain";
import Queries from "./pages/admin/Queries";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContextProvider } from "./components/AuthContextProvider";
import PrivateRoute from "./components/PrivateRoute";
import Unauthorized from "./pages/error/Unauthorized";
import NotFound from "./pages/error/NotFound";
//import FadeWrapper from "./components/FadeWrapper";

const App = () => {
  //const [loader, setLoader] = useState(false);
  //const navigate = useNavigate();

  // useEffect(() => {
  //   const checkValidToken = async () => {
  //     try {
  //       const res = await axios.post(
  //         "/api/auth/validateToken",
  //         {},
  //         { withCredentials: true }
  //       );
  //       if (res.data) {
  //         const token = res.data;

  //         // Redirect based on userType only if not already on the target route
  //         if (token.userType === "Admin" && window.location.pathname !== "/admin/queries") {
  //           navigate("/admin/queries");
  //         } else if (token.userType === "User" && window.location.pathname !== "/user/predict") {
  //           navigate("/user/predict");
  //         }
  //       } else {
  //         // If no valid token, navigate to home
  //         if (window.location.pathname !== "/") navigate("/");
  //       }
  //     } catch (error) {
  //       console.error("Token validation failed:", error.message);
  //       if (window.location.pathname !== "/") navigate("/");
  //     } finally {
  //       setLoader(false); // Hide loader after validation completes
  //     }
  //   };

  //   checkValidToken();
  // }, [navigate]);

  // if (loader) {
  //   return <Loader loading={loader} />;
  // }

  return (
    <div className="flex flex-col min-h-screen">
      <AuthContextProvider>
        <Router>
          <div className="flex-grow">
            <Routes>
              {/* Public routes which are not required a login */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />

              {/* User private Routes which requires login as a user*/}
              <Route
                path="/user/predict"
                element={
                  <PrivateRoute userRole="User" component={PredictMain} />
                }
              />

              {/* Admin private Routes which requires login as admin*/}
              <Route
                path="/admin/queries"
                element={<PrivateRoute userRole="Admin" component={Queries} />}
              />

              {/* common private Routes which requires login only*/}
              <Route
                path="/profile"
                element={
                  <PrivateRoute userTypeRequired={false} component={Profile} />
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthContextProvider>
      <Footer />
    </div>
  );
};

export default App;
