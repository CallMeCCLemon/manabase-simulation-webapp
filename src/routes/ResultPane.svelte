<script lang="ts">
	import Chart, { type ChartItem } from 'chart.js/auto';
	import { onMount } from 'svelte';

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

	let chartConfig;
	let chartData;

	let dataToGraph = [12, 19, 3, 5, 2, 3, 10, 20, 3, 9, 200, 9, 1, 2];
	let chartObject;

	function chart(node, data) {
		function setupChart(_data) {
			chartObject = new Chart(node, {
				type: "line",
				data: {
					labels: checkpoints.map((checkpoint: { iterations: number; }) => checkpoint.iterations),
					datasets: [
						{
							label: "Iterations",
							data: checkpoints.map((checkpoint: {
								iterations: number;
								successes: number;
							}) => (checkpoint.successes / checkpoint.iterations * 100).toFixed(2)),
							borderWidth: 1,
						},
					],
				},
				options: {
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});
		}
		setupChart(data)
		return {
			update(data) {
				chartObject.destroy();
				setupChart(data);
			},
			destroy() {
				chartObject.destroy();
			}
		}
	}
	//
	// $effect(() => {
	// 	const ctx = document.getElementById('chart') as ChartItem;
	// 	chartData = {
	// 		labels: checkpoints.map((checkpoint: { iterations: number; }) => checkpoint.iterations),
	// 		datasets: [{
	// 			label: 'Successes',
	// 			data: checkpoints.map((checkpoint: {
	// 				iterations: number;
	// 				successes: number;
	// 			}) => (checkpoint.successes / checkpoint.iterations * 100).toFixed(2)),
	// 			backgroundColor: 'rgba(75, 192, 192, 0.2)',
	// 			borderColor: 'rgba(75, 192, 192, 1)',
	// 			borderWidth: 1
	// 		}]
	// 	};
	// 	chartConfig = {
	// 		scales: {
	// 			y: {
	// 				beginAtZero: false
	// 			}
	// 		}
	// 	};
	//
	//
	// 	console.log(`ctx: ${JSON.stringify(ctx)}`);
	// 	chart.update();
	// });
	//
	// onMount(() => {
	// 	console.log(`chartData: ${JSON.stringify(chartData)}`);
	// 	console.log(`chartConfig: ${JSON.stringify(chartConfig)}`);
	// });
</script>

<div class="mt-2">
	{#if ready}
		<div class="p-6 border border-gray-300 rounded-lg mt-10 bg-gray-50">
			<h2>
				Results
			</h2>
			<div style="width: 600px;">
				<canvas class='chart' use:chart={dataToGraph}></canvas>
			</div>
			<p class="text-sm text-gray-500">
				Summary: {message}
				<br />
				Final Success Rate: {successRate}%
				<br />
			</p>
		</div>
	{/if}
</div>