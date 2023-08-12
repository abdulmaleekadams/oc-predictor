'use client'
import { ChangeEvent, FormEvent, useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Set isLoading to true when form is submitted

    // Perform validation on form inputs

    // Make API request to backend for prediction
    const URL = 'https://oc-predictor.onrender.com' ;
    try {
      const response = await fetch(`${URL}/api/index`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);

      setPredictionResult(data.result);
    } catch (error) {
      console.error('Prediction error:', error);
      // Handle error condition
    } finally {
      setIsLoading(false); // Set isLoading to false after the API request is complete
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const features = [
    'Age',
    'CEA',
    'IBIL',
    'NEU',
    'Menopause',
    'CA125',
    'ALB',
    'HE4',
    'GLO',
    'LYM%',
  ];

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      <h1>Prediction of Ovarian Cancer</h1>

      <form onSubmit={handleSubmit}>
        <div className='heading flex'>
          <p>Features</p>
          <p>Input</p>
        </div>
        {features.map((feature, index) => (
          <label key={index} className='flex'>
            <p>{feature}</p>
            <input
              type='number'
              step={0.01}
              min={0}
              name={feature.toLowerCase()}
              onChange={handleChange}
            />
          </label>
        ))}

        {/* Add more input fields for other features */}
        <button type='submit' className='button' disabled={isLoading}> {/* Disable the button when isLoading is true */}
          {isLoading ? 'Predicting...' : 'Predict'} {/* Change button text based on isLoading */}
        </button>
      </form>
      {predictionResult && (
        <div>
          <h2>Prediction Result:</h2>
          <p>{predictionResult ? predictionResult : 'loading'}</p>
        </div>
      )}
    </main>
  );
}
