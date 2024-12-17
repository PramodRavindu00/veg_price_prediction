const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const registerFormValidations = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = "First name is required!";
  }
  if (!values.lastName) {
    errors.lastName = "Last name is required!";
  }
  if (!values.email) {
    errors.email = "Email is required!";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Invalid Email format!";
  }
  if (!values.contactNo) {
    errors.contactNo = "Contact No is required!";
  }
  if (!values.address) {
    errors.address = "Address is required!";
  }

  if (!values.nearestMarket) {
    errors.nearestMarket = "Nearest Market is required!";
  }
  if (!values.password) {
    errors.password = "Password is required!";
  } else if (values.password.length < 4) {
    errors.password = "Password must be more than 4 characters";
  } else if (values.password.length > 10) {
    errors.password = "Password cannot exceed more than 10 characters";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm password is required!";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

export const loginFormValidations = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "Email is required!";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Invalid Email format!";
  }

  if (!values.password) {
    errors.password = "Password is required!";
  }

  return errors;
};
