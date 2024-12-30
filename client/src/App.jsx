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
import Dashboard from "./pages/admin/Dashboard";
import PredictMultiVeg from "./pages/user/PredictMultiVeg";
import ShoppingList from "./pages/user/ShoppingList";
import Users from "./pages/admin/Users";
//import FadeWrapper from "./components/FadeWrapper";
import Support from "./pages/user/Support";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
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
              <Route
                path="/user/predictMultiple"
                element={
                  <PrivateRoute userRole="User" component={PredictMultiVeg} />
                }
              />
              <Route
                path="/user/shoppingList"
                element={
                  <PrivateRoute userRole="User" component={ShoppingList} />
                }
              />
              <Route
                path="/user/support"
                element={<PrivateRoute userRole="User" component={Support} />}
              />

              {/* Admin private Routes which requires login as admin*/}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute userRole="Admin" component={Dashboard} />
                }
              />
              <Route
                path="/admin/queries"
                element={<PrivateRoute userRole="Admin" component={Queries} />}
              />
              <Route
                path="/admin/users"
                element={<PrivateRoute userRole="Admin" component={Users} />}
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
