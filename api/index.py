from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split

# importing machine learning models for prediction
from xgboost import XGBClassifier

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000',
     'https://oc-predictor.vercel.app/'])


cancer_data = pd.read_csv('ovarian.csv')
cancer_data = cancer_data.apply(
    lambda x: x.str.rstrip() if x.dtype == "object" else x)
cancer_data.replace({'AFP': {'>1210.00': '1210.00', '>1210': '1210.00'},
                    'CA125': {'>5000.00': '5000.00'},
                     'CA19-9': {'>1000.00': '1000.00', '>1000': '1000.00', '<0.600': '0.5'}}, inplace=True)

# Convert object columns to float columns
for col in cancer_data.drop('TYPE', axis=1).select_dtypes(include=['object']).columns:
    cancer_data[col] = cancer_data[col].astype('float')

# Convert target column to integer
cancer_data['TYPE'] = cancer_data['TYPE'].astype('int')

# cols_to_drop = ['CA72-4', 'NEU']
cols_to_drop = ['CA72-4', 'SUBJECT_ID']
cancer_data = cancer_data.drop(cols_to_drop, axis=1)

# get columns with missing data
cols_with_missing = [
    col for col in cancer_data.columns if cancer_data[col].isnull().any()]

# impute missing data with median value
for col in cols_with_missing:
    median_val = cancer_data[col].median()
    cancer_data[col].fillna(median_val, inplace=True)

# split data into features (X) and target (y)
cancer_X_train = cancer_data.drop('TYPE', axis=1)
cancer_y_train = cancer_data['TYPE']


selected_features = ['Age',
                     'CEA',
                     'IBIL',
                     'NEU',
                     'Menopause',
                     'CA125',
                     'ALB',
                     'HE4',
                     'GLO',
                     'LYM%']

# Split data into training and validation sets
X_train, X_test, y_train, y_test = train_test_split(
    cancer_X_train, cancer_y_train, test_size=0.3, random_state=42)
X_train = X_train[selected_features]
X_test = X_test[selected_features]


# initializing the boosting module with default parameters
xgb_model = XGBClassifier()

# training the model on the train dataset
xgb_model.fit(X_train, y_train)


@app.route("/api/index", methods=['POST'])
def hello_world():
    data = request.json

    age = float(data['age'])
    cea = float(data['cea'])
    ibil = float(data['ibil'])
    neu = float(data['neu'])
    menopause = float(data['menopause'])
    ca125 = float(data['ca125'])
    alb = float(data['alb'])
    he4 = float(data['he4'])
    glo = float(data['glo'])
    lym = float(data['lym%'])

    # Create a new DataFrame with user input
    user_data = pd.DataFrame([[age, cea, ibil, neu, menopause, ca125, alb, he4, glo, lym]], columns=[
                             'Age', 'CEA', 'IBIL', 'NEU', 'Menopause', 'CA125', 'ALB', 'HE4', 'GLO', 'LYM%'])
    predictions = xgb_model.predict(user_data)

    # Interpret the predictions
    if predictions == 1:
        return jsonify({'result': "The model predicts the absence of cancer."})
    else:
        return jsonify({'result': "The model predicts the presence of cancer."})


if __name__ == '__main__':
    app.run()
