document.addEventListener('DOMContentLoaded', function () {
    // API key
    const apiKey = '46307c0733115117bdbc3aa38ad0028a';

    // City for forecast
    const city = 'Chennai';

    // URL for forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Function to fetch forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            // Filter forecast to include only rainfall predictions for the next 7 days
            const rainfallPredictions = [];
            data.list.forEach(item => {
                const date = new Date(item.dt_txt).toLocaleDateString(); // Extract date from forecast data
                const rainfall = item.rain ? item.rain['3h'] : 0; // Check if rainfall data is available
                rainfallPredictions.push({ date, rainfall });
            });

            // Get the next 7 days
            const next7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i + 1);
                return date.toLocaleDateString();
            });

            // Prepare data for the chart
            const labels = next7Days;
            const rainfallData = next7Days.map(day => {
                const prediction = rainfallPredictions.find(prediction => prediction.date === day);
                return prediction ? prediction.rainfall : 0;
            });

            // Create the chart
            const ctx = document.getElementById('rainfallChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Rainfall Prediction (mm)',
                        data: rainfallData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching forecast:', error));
});
// function sendEmail() {
//     const emailContent = document.getElementById('email-content').value;

//     // Create an object with the email content
//     const emailData = { content: emailContent };

//     // Make an HTTP POST request to your server endpoint
//     fetch('http://localhost:3000/send-email', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(emailData)
//     })
//     .then(response => {
//         if (response.ok) {
//             alert('Email sent successfully!');
//         } else {
//             throw new Error('Failed to send email');
//         }
//     })
//     .catch(error => {
//         console.error('Error sending email:', error);
//         alert('Failed to send email');
//     });
// }
async function sendEmail() {
    const emailContent = document.getElementById('email-content').value;

    // Create an object with the email content
    const emailData = { content: emailContent };

    try {
        // Make an asynchronous HTTP POST request to your server endpoint
        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (response.ok) {
            alert('Email sent successfully!');
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email');
    }
}


document.getElementById('calculate-flood-prediction').addEventListener('click', calculateFloodPrediction);

// function calculateFloodPrediction() {
//     // Fetch data from the API
//     fetch('http://127.0.0.1:5000/api/predict', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             threshold: '0.5',
//             data: '35325.36'
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Extract the prediction probability from the API response
//         const predictionProbability = data.prediction.y_month_raw[0].months_flood;
 
//         // Display the prediction probability on the webpage
//         const predictionResultElement = document.getElementById('prediction-result');
//         predictionResultElement.textContent = `Prediction Probability: ${predictionProbability}`;
//     })
//     .catch(error => {
//         console.error('Error fetching data from API:', error);
//         alert('Failed to fetch data from API');
//     });
// }
async function calculateRainfallForNext7Days() {
    try {
        const apiKey = '46307c0733115117bdbc3aa38ad0028a';
        const city = 'Chennai';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        // Fetch forecast data from OpenWeatherMap API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch forecast data from OpenWeatherMap API');
        }
        const forecastData = await response.json();

        // Extract rainfall data for the next 7 days
        const next7Days = forecastData.list.slice(0, 7).map(item => ({
            date: new Date(item.dt * 1000), // Convert timestamp to Date object
            rainfall: item.rain ? item.rain['3h'] : 0 // Check if rainfall data is available
        }));

        // Calculate total rainfall for the next 7 days
        const totalRainfall = next7Days.reduce((total, day) => total + day.rainfall, 0);

        return totalRainfall;
    } catch (error) {
        console.error('Error calculating rainfall for next 7 days:', error);
        throw error; // Rethrow the error to handle it outside this function
    }
}

async function calculateFloodPrediction() {
    try {
        // Calculate total rainfall for the next 7 days
        const totalRainfall = await calculateRainfallForNext7Days();

        // Fetch data from the API
        const response = await fetch('http://127.0.0.1:5000/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                threshold: '0.5',
                data: totalRainfall.toString() // Send total rainfall as a string
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from API');
        }

        const data = await response.json();
        // Extract the prediction probability from the API response
        const predictionPercentage = (data.prediction.y_month_raw[0].months_flood * 100).toFixed(2);

        // Display the prediction probability on the webpage
        const predictionResultElement = document.getElementById('prediction-result');
        predictionResultElement.textContent = `Prediction Percentage: ${predictionProbability}`;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        alert('Failed to fetch data from API');
    }
}





