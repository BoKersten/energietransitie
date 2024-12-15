// Get today's date in YYYYMMDD format
function getTodayDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = ('0' + (today.getMonth() + 1)).slice(-2); // Months are 0-indexed
	const day = ('0' + today.getDate()).slice(-2);
	return year - 1 + month + day;
}

function getLaterDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = ('0' + (today.getMonth() + 1)).slice(-2); // Months are 0-indexed
	const day = parseInt(('0' + today.getDate()).slice(-2)) + 4;
	return year - 1 + month + day;
}

// Define the start and end date as today's date
const todayDate = getTodayDate();
const laterDate = getLaterDate();
const startDate = todayDate; // Start date is today
const endDate = laterDate; // End date is today
let weatherData = [];
// Define the station and desired data format
const station = '260'; // The station number for location 260
const format = 'json'; // The desired format is JSON
const variables = 'TG:Q:SQ:SP:NG:RH:FHVEC:FXX:DDVEC:PG'; // Temperature-related variables

// Set up the POST request data
const postData = new URLSearchParams({
	start: startDate,
	end: endDate,
	vars: variables,
	stns: station,
	fmt: format
});

// Fetch data and export the weather data
export const fetchWeatherData = async () => {
	try {
		const response = await fetch('https://www.daggegevens.knmi.nl/klimatologie/daggegevens', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: postData.toString()
		});

		const data = await response.json(); // Parse the JSON response
		console.log('data:', data);
		for (let i = 0; i < 4; i++) {
			let weatherJson = {
				TG: data[i]?.TG,
				Q: data[i]?.Q,
				SQ: data[i]?.SQ,
				SP: data[i]?.SP,
				NG: data[i]?.NG,
				RH: data[i]?.RH,
				FHVEC: data[i]?.FHVEC,
				FXX: data[i]?.FXX,
				DDVEC: data[i]?.DDVEC,
				PG: data[i]?.PG
			};
			weatherData.push(weatherJson);
		}
		console.log(weatherData);

		return weatherData;
	} catch (error) {
		console.error('Error fetching data:', error); // Handle errors
	}
};
