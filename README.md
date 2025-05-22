# vegetable Price prediction system using Machine Learning for Sri Lankan Local Markets

A web based full stack application that can predict future vegetables prices based on different locations and vegetables in sri lanka using machine learning technologies which helps to make informed decision making for farmers, merchants and consumers in their vegetable purchasing and selling activities.

#Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Technologies Used](#technologies-used)
  
---

##  Features

- User login (Admin/ General User) secured with JWT authentication.
- User Regsitration
- Query Submission for guest users
- Predict vegetable prices of a single vegettable for the next week or next 4 weeks
- predict multiple vegetable prices at once for the next week
- Add favourite 5 vegetables with their weekly amount of consuming, edit favourite vegetbles and their amounts
- Predict favourite vegetable prices 
- add / update current fuel price in Sri Lanka (Admin)
- recieving weather related data for predictions using an external weather API based on the user selected location
- Reply to guest user Queries
- Profile / User Account management
- dashbaord views and analytics (Admin)

## Installation
clone the repo or download the project as ZIP
- git clone https://github.com/PramodRavindu00/veg_price_prediction.git (bash)

# Navigate to the project folder
cd veg_price_prediction

## Environment Variables

Create a `.env` file in the root directory of the **backend** folder. Below are the environment variables you need to set:
- PORT - backend PORT
- MONGO_URI - MongoDB connection URI
- EMAIL - app email
- PASSWORD- app email password
- JWT_SECRET - generate a SECRET key eg: from chatgpt
- WEATHER_API_KEY - include your API key obtained from `worldweatheronline.com`

# Install backend dependencies
cd backend
- npm install

# Install frontend dependencies
cd ../frontend
- npm install 

# Install machine learning model libraries dependencies
cd ../ML-Model
- install flask, flask-cors, pandas, numpy, keras, sk learn

# run the whole application at once
- navigate to the root folder and type in cmd - npm start

# Start backend server
- npm run start-server

# Start frontend server
cd ../frontend
- npm run start-client

 # Start ML-Model server
cd ../ML-Model
- npm run start-python

# Technologies Used
- Frontend: React + Vite, Tailwind CSS
- Backend: Express JS
- Database: MongoDB
- Others: JWT, dotenv, axios, external API
