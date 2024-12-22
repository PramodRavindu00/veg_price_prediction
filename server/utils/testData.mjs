export const singleVegSingleWeek = {
  vegetable: "carrot",
  location: "colombo",
  weekStart: "2024-12-23",
  weekEnd: "2024-12-30",
  price: 650,
  type: "week",
};

export const singleVegMultiWeek = {
  vegetable: "carrot",
  location: "colombo",
  type: "4week",
  predictions: [
    { weekStart: "2024-12-23", weekEnd: "2024-12-29", price: 650 },
    { weekStart: "2024-12-30", weekEnd: "2025-01-06", price: 750 },
    { weekStart: "2025-01-07", weekEnd: "2024-12-13", price: 850 },
    { weekStart: "2025-01-14", weekEnd: "2024-12-20", price: 550 },
  ],
};

export const multiVegSingleWeek = {
  vegetable: "carrot",
  location: "colombo",
  weekStart: "2024-12-23",
  weekEnd: "2024-12-29",
  predictions: [
    { vegetable: "carrot", price: 650 },
    { vegetable: "brinjal", price: 750 },
    { vegetable: "pumpkin", price: 850 },
    { vegetable: "cucumber", price: 550 },
  ],
};
