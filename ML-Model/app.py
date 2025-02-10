from flask import Flask,request,jsonify
from flask_cors import CORS
import pickle
import xgboost as xgb 
import pandas as pd
import numpy as np
from datetime import datetime,timedelta

app = Flask(__name__)
CORS(app)

@app.route('/')
def test():
    return "<h1>Flask App is running</h1>"

with open('final_model.pkl', 'rb') as file:
    model = pickle.load(file)

with open('encoded_columns.pkl', 'rb') as file:
    encoded_columns = pickle.load(file)

with open('scaler.pkl', 'rb') as file:
    scaler = pickle.load(file)

@app.route('/predict',methods=['POST'])
def predict():
    try:
        input = request.json
        
        date = input['current_date']
        vegetables = input['vegetables']
        location = input['location']
        fuel_price = float(input['fuel_price'])
        rainfall = float(input['rainfall'])
        festival = input['festival']
        pred_type = input['pred_type']

         # Parse the input date
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        next_week_date_obj = date_obj + timedelta(weeks=1)
        month = next_week_date_obj.month
        next_week = next_week_date_obj.isocalendar()[1]

        single_week_start = next_week_date_obj - timedelta(days=date_obj.weekday())
        single_week_end = single_week_start + timedelta(days=6)

        results = {
                'location':location,
                'week_start':single_week_start.strftime("%Y-%m-%d"),
                'week_end':single_week_end.strftime("%Y-%m-%d"),
                'type':"week",
                'predictions':[]
                }
        
        # retrieving the cos and and sin values to provide as inputs 
        sin_week = np.sin(2 * np.pi * next_week / 52)
        cos_week = np.cos(2 * np.pi * next_week / 52)
        
    #checking the vegetable param is coming as a list,if so it assign as a list  
        if isinstance(vegetables, str):
            vegetables = [vegetables]

        for vegetable in vegetables:
            # creating the input data as a dataframe
            input_data = pd.DataFrame({
                'month': [month],
                'week_of_year': [next_week], 
                'fuel_price': [fuel_price],
                'rainfall': [rainfall],
                'sin_week': [sin_week],
                'cos_week': [cos_week],
                'festival_season' : [festival]
            })
            
            #getting encoded columns from the arguments 
            all_vegetables = [col for col in encoded_columns if col.startswith('vegetable_')]
            all_locations = [col for col in encoded_columns if col.startswith('location_')]

            #filling the relevant value as 1 and others 0 if the column name matches
            for veg in all_vegetables:
                input_data[veg] = 1 if f'vegetable_{vegetable}' == veg else 0
            
            for loc in all_locations:
                input_data[loc] = 1 if f'location_{location}' == loc else 0
            
            #if any missing column which is not filled it also be marked as 0
            missing_columns = set(encoded_columns) - set(input_data.columns)
            for col in missing_columns:
                input_data[col] = 0

            if pred_type == 'week':
                #scaling all the inputs as done while training the model
                input_scaled = scaler.transform(input_data) 
                predicted_price = model.predict(input_scaled)[0]
                rounded_price = round(predicted_price/5)*5
                results['predictions'].append(
                    {'vegetable': vegetable,
                    'price':float(rounded_price)
                })
                
            elif pred_type == '4week':
                results = {'vegetable': vegetable,'location': location,
                           'type':"4week",'predictions': []}
                        
                for i in range(1,5):   
                    new_date_obj = date_obj + timedelta(weeks=i)
                
                    new_month = new_date_obj.month
                    new_year = new_date_obj.year
                    
                    # Calculate sinusoidal transformations
                    new_week_of_year = new_date_obj.isocalendar()[1]
                    new_sin_week = np.sin(2 * np.pi * new_week_of_year / 52)
                    new_cos_week = np.cos(2 * np.pi * new_week_of_year / 52)
                
                    # Calculate the start and end dates of the week
                
                    week_start = new_date_obj - timedelta(days=new_date_obj.weekday())
                    week_end = week_start + timedelta(days=6)
            
                    # Update the input data
                    input_data['month'] = new_month
                    input_data['week_of_year'] = new_week_of_year
                    input_data['sin_week'] = new_sin_week
                    input_data['cos_week'] = new_cos_week
                
                    # Scale the updated data
                    input_scaled = scaler.transform(input_data)
                    
                    # Predict prices
                    predicted_price = model.predict(input_scaled)[0]
                    rounded_price = round(predicted_price/5)*5
                    
                    #Append results
                    results['predictions'].append({
                    'week_start': week_start.strftime("%Y-%m-%d"),
                    'week_end': week_end.strftime("%Y-%m-%d"),
                    'price':float(rounded_price),
                    })
                    
        return jsonify({
        "success": True,
        "result":results
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}),500


if __name__ == "__main__":
    app.run(debug=True, port=5001)