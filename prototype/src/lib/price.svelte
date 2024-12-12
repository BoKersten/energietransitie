<script>
	import { chartRender } from './Actions/chartRender';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { currentReturn, currentNet } from './store';
	let today = new Date();
	const takePrice = [];
	const returnPrice = [];
	let tariffs = [];
	const dispatch = createEventDispatcher();
	let chartData = null; // Start with null, will be populated later

	async function loadTariffs() {
		try {
			const currentTimestamp = new Date().toISOString();
			console.log(currentTimestamp);
			const startTimestamp = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate()
			).toISOString();

			console.log(startTimestamp);
			const response = await fetch(
				`http://localhost:3000/api/tariffs?startTimestamp=${startTimestamp}&endTimestamp=${currentTimestamp}`
			);

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			tariffs = await response.json();
			dispatch('updateTariffs', tariffs);

			// Reset and populate takePrice and returnPrice arrays
			takePrice.length = 0;
			returnPrice.length = 0;

			for (let i = 0; i <= today.getHours(); i++) {
				takePrice.push(tariffs[i]?.TariffUsage);
				returnPrice.push(tariffs[i]?.TariffReturn);
				if (i == today.getHours()) {
					currentReturn.set(tariffs[i]?.TariffReturn);

					currentNet.set(tariffs[i]?.TariffUsage);
				}
			}

			console.log(takePrice);
			console.log(returnPrice);
			console.log(tariffs);

			// Prepare chart data only after the data is fetched
			const labels = [];
			for (let i = 0; i <= today.getHours(); i++) {
				labels.push(`${i}:00`);
			}

			chartData = {
				labels: labels,
				datasets: [
					{
						label: 'Terugleververgoeding per Kwh in $',
						data: returnPrice,
						fill: false,
						borderColor: '#0091D5',
						tension: 0.1
					},
					{
						label: 'Afneemkosten net per Kwh',
						data: takePrice,
						fill: false,
						borderColor: '#EA6A47',
						tension: 0.1
					}
				]
			};
		} catch (error) {
			console.error('Error loading tariffs:', error);
		}
	}
	$: config = {
		type: 'line',
		data: chartData
	};

	onMount(loadTariffs);
</script>

{#if chartData}
	<div class="price-component">
		<canvas use:chartRender={config}></canvas>
	</div>
{:else}
	<p>Loading chart...</p>
{/if}

<style>
	.price-component {
		grid-area: 1 / 1 / 3 / 5;
		background: white;
		margin-left: 10px;
	}
	canvas {
		width: 100%;
	}
</style>
