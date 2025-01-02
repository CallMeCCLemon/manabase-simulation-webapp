<script lang="ts">
	import Chart, { type ChartItem } from 'chart.js/auto';

	let {
		ready,
		message,
		successRate,
		checkpoints
	}: {
		ready: boolean,
		message: string,
		successRate: number,
		checkpoints: { iterations: number, successes: number }[],
	} = $props();

	let chartObject;

	function chart(node, data) {
		function setupChart(data) {
			chartObject = new Chart(node, {
				type: 'line',
				data: {
					labels: checkpoints.map((checkpoint: { iterations: number; }) => checkpoint.iterations),
					datasets: [
						{
							label: 'Success Rate',
							data: checkpoints.map((checkpoint: {
								iterations: number;
								successes: number;
							}) => (checkpoint.successes / checkpoint.iterations * 100).toFixed(2)),
							borderWidth: 1
						}
					]
				},
				options: {
					plugins: {
						tooltip: {
							callbacks: {
								label: function(context) {
									let label = context.dataset.label || '';

									if (label) {
										label += ': ';
									}
									if (context.parsed.y !== null) {
										label += `${context.parsed.y}%`;
									}
									return label;
								}
							}
						}
					},
					scales: {
						x: {
							title: {
								display: true,
								text: '# of Iterations'
							}
						},
						y: {
							min: 0,
							max: 100,
							title: {
								display: true,
								text: 'Success Rate %'
							},
							ticks: {
								// Include a dollar sign in the ticks
								callback: function(value, index, ticks) {
									return `${value}%`;
								}
							}
						}

					}
				}
			});
		}

		setupChart();
		return {
			update(data) {
				chartObject.destroy();
				setupChart(data);
			},
			destroy() {
				chartObject.destroy();
			}
		};
	}
</script>

<div class="mt-2">
	{#if ready}
		<div class="p-6 border border-gray-300 rounded-lg mt-10 bg-gray-50">
			<h2>
				Results
			</h2>
			<div style="width: 600px;">
				<canvas class='chart' use:chart={checkpoints}></canvas>
			</div>
			<p class="text-sm text-gray-500">
				Final Success Rate: {successRate}%
				<br />
			</p>
		</div>
	{/if}
</div>