import { Navigate } from "react-router";
import { useAuth } from "../assets/useAuth.mjs";
import PropTypes from "prop-types";

const PrivateRoute = ({
  component: Component, //rendering component inside the route
  userRole, //user role to redirect role base access
  userTypeRequired = true,
  ...rest //other react router params
}) => {
  const { auth } = useAuth();
  const { isLoggedIn, userType } = auth; //checking from auth context data

  //if not login redirect to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  //here user is logged,but user role is required and must be matched with auth context usertype.otherwise
  //redirected to unauthorized even user is logged.In there another redirection will happen based on user type
  if (userTypeRequired && userRole && userRole !== userType) {
    return <Navigate to="/unauthorized" />;
  }

  //not logged in and wrong userType page issue not belongs.So render the desired component with rest of params
  return <Component {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  userRole: PropTypes.string,
  userTypeRequired: PropTypes.bool,
};

export default PrivateRoute;
