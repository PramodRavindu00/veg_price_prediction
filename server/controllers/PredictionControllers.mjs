import axios from "axios";

export const predictions = async (req, res) => {
  const input = req.body;

  const predictionInput = {
    current_date: input.date,
    vegetables: input.vegetable,
    location: input.location,
    fuel_price: input.fuelPrice,
    rainfall: input.rainfall,
    pred_type: input.predType,
    festival: input.festival,
  };

  //console.log(predictionInput);

  try {
    const response = await axios.post(
      "http://localhost:5001/predict",
      predictionInput
    );
    res.status(200).json({
      status: "success",
      data: response.data.result,
    });
    console.log(response.data.result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const preferredPredictions = async (req, res) => {
  const input = req.body;

  const preferredVeggies = input.vegetable.map((veggie) => veggie.vegetable);

  const predictionInput = {
    current_date: input.date,
    vegetables: preferredVeggies,
    location: input.location,
    fuel_price: input.fuelPrice,
    rainfall: input.rainfall,
    pred_type: input.predType,
    festival: input.festival,
  };

  try {
    const response = await axios.post(
      "http://localhost:5001/predict",
      predictionInput
    );
   
    const weeklyCost = input.vegetable.map((veggie) => {
      const vegetableFound = response.data.result?.predictions.find(
        (item) => item.vegetable === veggie.vegetable
      );

      if (vegetableFound) {
        return {
          vegetable: veggie.vegetable,
          amount: veggie.amount,
          priceKG: vegetableFound.price,
          cost: (vegetableFound.price * veggie.amount) / 1000,
        };
      } else { 
        return {
          vegetable: veggie.vegetable,
          amount: veggie.amount,
          priceKG: null,
          cost: null,
        };
      }
    });

    res.status(200).json({
      status: "success",
      data: weeklyCost,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
