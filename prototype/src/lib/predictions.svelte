<script>
	import { PUBLIC_API_KEY } from '$env/static/public';
	import { chartRender } from './Actions/chartRender';
	import { onMount } from 'svelte';
	import { fetchWeatherData } from './weather';
	import { predictedGen, predictedUse } from './store';

	let today = new Date();
	let predictionTake = [];
	let predictionMake = [4.5, 6.2, 6.6, 3.7];
	// API call
	let BIGML_USERNAME = 'bokersten';

	let BIGML_API_KEY = PUBLIC_API_KEY;
	let BIGML_AUTH = `username=${BIGML_USERNAME}&api_key=${BIGML_API_KEY}`;
	let data = null;

	let weatherData = [];
	let showGraph = false;
	const labels = [
		formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000)), // Tomorrow
		formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)), // Day after tomorrow
		formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)), // Next day
		formatDate(new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000))
	];
	const fetchPrediction = async () => {
		for (let i = 0; i < 4; i++) {
			const headers = {
				'Content-Type': 'application/json'
			};

			const body = JSON.stringify({
				model: 'linearregression/uwGh8s371wHQTuU6wag8RdIUA3I',
				input_data: weatherData[i]
			});
			console.log(weatherData[i]);

			try {
				const response = await fetch(`https://bigml.io/andromeda/prediction?${BIGML_AUTH}`, {
					method: 'POST',
					headers: headers,
					body: body
				});
				console.log(BIGML_AUTH);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const result = await response.json();
				if (i == 0) {
					predictedUse.set(result.prediction['000001']);
					predictedGen.set(predictionMake[i]);
				}
				console.log('result:', result);

				predictionTake.push((result.prediction['000001'] / 1000).toFixed(2));
				data = {
					labels: labels,
					datasets: [
						{
							label: 'Verwacht verbruik in Kwh',
							data: predictionTake,
							backgroundColor: ['#1C4E80'],
							borderColor: ['#1C4E80'],
							borderWidth: 1
						},
						{
							label: 'Verwachte opwek in Kwh',
							data: predictionMake,
							backgroundColor: '#0091D5',
							borderCOlor: '#0091D5'
						}
					]
				};
			} catch (error) {
				console.error('Error fetching prediction:', error);
			}
		}
	};
	onMount(async () => {
		weatherData = await fetchWeatherData();
		setTimeout(() => {
			fetchPrediction();
			if (fetchPrediction) showGraph = true;
		}, 100);
	});

	// chartJS code
	function formatDate(date) {
		const day = date.getDate(); // Get day of the month
		const month = date.getMonth() + 1; // Months are 0-based, so add 1
		return `${day}-${month}`;
	}

	$: config = {
		type: 'bar',
		data: data,
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	};
</script>

{#if showGraph == true}
	<div class="predict-component">
		<canvas use:chartRender={config}></canvas>
	</div>
{:else}
	<p>Loading chart...</p>
{/if}

<style>
	.predict-component {
		background: white;
		border-radius: 15px;
		grid-area: 3 / 3 / 5 / 6;
		margin-right: 10px;
	}
</style>
