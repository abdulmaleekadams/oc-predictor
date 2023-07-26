'use client'
import { ChangeEvent, FormEvent, useState } from 'react'



export default function Home() {


  const [formData, setFormData] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Perform validation on form inputs

    // Make API request to backend for prediction
    try {
      const response = await fetch("https://oc-predictor.vercel.app/api/python", {
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
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const features = ['Age',
    'CEA',
    'IBIL',
    'NEU',
    'Menopause',
    'CA125',
    'ALB',
    'HE4',
    'GLO',
    'LYM%']
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >

      <h1>Prediction of Ovarian Cancer</h1>

      <form onSubmit={handleSubmit}>
        <div className='heading flex'>
          <p>Features</p>
          <p>Input</p>
        </div>
        {features.map((feature, index) => (
          <label key={index} className='flex'>
            <p>{feature}</p>
            <input type="number" step={0.01} min={0} name={feature.toLowerCase()} onChange={handleChange} />
          </label>
        ))}

        {/* Add more input fields for other features */}
        <button type="submit" className='button'>Predict</button>
      </form>
      {predictionResult && (
        <div>
          <h2>Prediction Result:</h2>
          <p>{predictionResult ? predictionResult : "loading"}</p>
        </div>
      )}

    </main>
  )
}
