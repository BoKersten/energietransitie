<script>
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';

	export let efficiency;
	let chartInstance;
	let chartCanvas;

	// Chart configuration with dynamic data
	const createChartData = () => ({
		labels: ['Efficiëntie zonnepanelen', ''], // Add a second label for the invisible segment
		datasets: [
			{
				label: 'Efficiëntie in procenten',
				data: [efficiency, 100 - efficiency],
				backgroundColor: ['#ffa008', 'rgba(0, 0, 0, 0)'], // Transparent second segment
				hoverOffset: 0, // Disable hover offset
				borderColor: ['transparent', 'transparent'], // No border for both segments
				borderWidth: 0 // Ensure no borders
			}
		]
	});

	// Initialize the chart when the component mounts
	onMount(() => {
		// Initialize the chart instance with initial data
		chartInstance = new Chart(chartCanvas, {
			type: 'pie',
			data: createChartData(),
			options: {
				plugins: {
					tooltip: {
						callbacks: {
							label: (tooltipItem) => {
								if (tooltipItem.dataIndex === 1) {
									return null;
								}
								return `${tooltipItem.raw}%`; // Tooltip only for the visible segment
							}
						},
						filter: (tooltipItem) => tooltipItem.dataIndex === 0 // Only show tooltips for the first segment
					}
				},
				elements: {
					arc: {
						borderWidth: 0 // Ensure no borders on arcs
					}
				}
			}
		});
	});

	// Update the chart's data reactively when efficiency changes
	$: {
		if (chartInstance) {
			// Only update the data part of the chart, without recreating it
			chartInstance.data.datasets[0].data = [efficiency, 100 - efficiency];
			chartInstance.update();
		}
	}

	// Cleanup the chart instance when the component is destroyed
	onDestroy(() => {
		if (chartInstance) {
			chartInstance.destroy();
			chartInstance = null;
		}
	});
</script>

<div class="solar-component">
	<canvas bind:this={chartCanvas}></canvas>
</div>

<style>
	.solar-component {
		padding: 20px;
		grid-area: 3 / 1 / 5 / 3;
		background-color: white;
		border-radius: 15px;
		margin-left: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
