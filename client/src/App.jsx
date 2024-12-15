import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";

import Home from "./pages/public/Home";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div className="w-full overflow-x-hidden min-h-[100vh] flex flex-col">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          {/* 
          <Route
            path="/admin/*"
            element={<PrivateRoute role="Admin" component={Admin} />} //privateRoute used to prevent user editing the URL
          />
          <Route
            path="/staff/*"
            element={<PrivateRoute role="Staff" component={Staff} />}
          />
          <Route
            path="/customer/*"
            element={<PrivateRoute role="Customer" component={Customer} />}
          />
          <Route path="*" element={<Navigate to={redirect()} />} /> */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
};

export default App;
