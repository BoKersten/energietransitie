import Chart from 'chart.js/auto';

export const chartRender = (node, options) => {
	console.log('Chart Render is called:');
	const _chart = new Chart(node, options);

	return {
		update(updatedOptions) {
			// Update only the data part of the chart
			_chart.data = updatedOptions.data;

			// Update the chart
			_chart.update();
		},

		destroy() {
			console.log('Destroy function is called:');
			_chart.destroy();
		}
	};
};
