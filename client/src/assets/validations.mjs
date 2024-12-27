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

export const MainPredictionFormValidations = (values) => {
  const errors = {};
  if (!values.vegetable) {
    errors.vegetable = "Vegetable is required!";
  }
  if (!values.location) {
    errors.location = "Market area is required!";
  }
  if (!values.rainfall) {
    errors.rainfall = "Average rainfall value is required!";
  }
  if (!values.fuelPrice) {
    errors.fuelPrice = "Fuel price is required!";
  }
  if (!values.predType) {
    errors.predType = "Prediction period is required!";
  }
  if (values.festival === "") {
    errors.festival = "Festival seasonality is required!";
  }
  return errors;
};

export const MultiplePredictionFormValidations = (values) => {
  const errors = {};
  if (values.vegetable.length <= 0) {
    errors.vegetable = "Select at least one vegetable!";
  }
  if (!values.location) {
    errors.location = "Market area is required!";
  }
  if (!values.rainfall) {
    errors.rainfall = "Average rainfall value is required!";
  }
  if (!values.fuelPrice) {
    errors.fuelPrice = "Fuel price is required!";
  }

  if (values.festival === "") {
    errors.festival = "Festival seasonality is required!";
  }
  return errors;
};

export const preferenceFormValidations = (values) => {
  const errors = {};
  if (values.preferredVeggies.length <= 0) {
    errors.vegetable = "Select between 1 to 5 vegetables!";
  }

  values.preferredVeggies.forEach((veg, index) => {
    if (!veg.amount) {
      errors[`amountError${index + 1}`] = "Consuming amount is required!";
    }
  });

  return errors;
};

export const predictFormValidations = (values) => {
  const errors = {};
  if (!values.location) {
    errors.location = "Market area is required!";
  }
  if (!values.rainfall) {
    errors.rainfall = "Average rainfall value is required!";
  }
  if (!values.fuelPrice) {
    errors.fuelPrice = "Fuel price is required!";
  }

  if (values.festival === "") {
    errors.festival = "Festival seasonality is required!";
  }
  return errors;
};
