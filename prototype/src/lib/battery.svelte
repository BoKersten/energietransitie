<script>
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';

	export let percentage;

	let chartInstance; // Reference to the chart instance
	let chartCanvas; // Reference to the canvas element

	// Chart configuration options
	const createChartOptions = () => ({
		type: 'doughnut',
		data: {
			datasets: [
				{
					data: [percentage, 100 - percentage],
					backgroundColor: ['green', 'rgba(255, 255, 255, 0)'],
					borderColor: 'transparent'
				}
			]
		},
		options: {
			maintainAspectRatio: false,
			cutout: '80%',
			radius: '100%',
			plugins: {
				tooltip: {
					enabled: false // Disable tooltips completely
				}
			}
		},
		plugins: [
			{
				id: 'cutoutBackground',
				beforeDraw(chart) {
					const { ctx, chartArea } = chart;
					const centerX = (chartArea.left + chartArea.right) / 2;
					const centerY = (chartArea.top + chartArea.bottom) / 2;
					const cutoutRadius = chart.getDatasetMeta(0).data[0].innerRadius;

					// Draw the cutout background
					ctx.save();
					ctx.beginPath();
					ctx.arc(centerX, centerY, cutoutRadius, 0, 2 * Math.PI);
					ctx.fillStyle = '#f0f0f0'; // Background color of the cutout
					ctx.fill();
					ctx.restore();
				}
			},
			{
				id: 'centerText',
				beforeDraw(chart) {
					const { width, height } = chart;
					const { ctx } = chart;
					ctx.save();

					ctx.font = `15px sans-serif`;
					ctx.textBaseline = 'middle';
					ctx.textAlign = 'center';

					const text = `Batterij percentage:\n \n${percentage}%`;
					const lines = text.split('\n');
					const lineHeight = 20;
					const centerX = width / 2;
					const centerY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

					lines.forEach((line, index) => {
						ctx.fillText(line, centerX, centerY + index * lineHeight);
					});

					ctx.restore();
				}
			}
		]
	});

	// Initialize the chart when the component mounts
	onMount(() => {
		chartInstance = new Chart(chartCanvas, createChartOptions());
	});

	// Update the chart data reactively
	$: if (chartInstance) {
		chartInstance.data.datasets[0].data = [percentage, 100 - percentage];
		chartInstance.update();
	}

	// Cleanup when the component is destroyed
	onDestroy(() => {
		if (chartInstance) {
			chartInstance.destroy();
			chartInstance = null;
		}
	});
</script>

<div class="battery-component">
	<canvas bind:this={chartCanvas}></canvas>
</div>

<style>
	.battery-component {
		grid-area: 1 / 5 / 3 / 6;
		width: 300px;
		margin-right: 10px;
		background-color: white;
		padding: 40px;
		border-radius: 15px;
	}
</style>
