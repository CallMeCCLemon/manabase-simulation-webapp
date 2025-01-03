<script lang="ts">
	import Chart, { type ChartItem } from 'chart.js/auto';

	let {
		ready,
		message,
		successRate,
		checkpoints,
		deckStats
	}: {
		ready: boolean,
		message: string,
		successRate: number,
		checkpoints: { iterations: number, successes: number }[],
		deckStats: any,
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

<style>
    ol {
        padding-left: 1rem;
        font-size: 0.8rem;
				border-radius: 0.5rem;
				border: 1px solid rgba(0, 0, 0, 0.1);
    }
</style>

<div class="mt-2">
	{#if ready}
		<div class="p-6 border border-gray-300 rounded-lg mt-10 bg-gray-50 text-left">
			<h2>
				Results
			</h2>
			<div style="width: 100%;">
				<canvas class='chart' use:chart={checkpoints}></canvas>
			</div>
			<p class="text-sm text-gray-500">
				Final Success Rate: {successRate}%

			</p>
			<ol>
				<li>Total Cards: {deckStats.totalCards}</li>
				<li>Lands: {deckStats.lands}</li>
				<li>Non-Lands: {deckStats.nonLands}</li>
			</ol>
			<ol>
				<li>White Mana: {deckStats.totalManaPips.whiteMana}</li>
				<li>Blue Mana: {deckStats.totalManaPips.blueMana}</li>
				<li>Black Mana: {deckStats.totalManaPips.blackMana}</li>
				<li>Red Mana: {deckStats.totalManaPips.redMana}</li>
				<li>Green Mana: {deckStats.totalManaPips.greenMana}</li>
				<li>Colorless Mana: {deckStats.totalManaPips.colorlessMana}</li>
				<li>Generic Cost: {deckStats.totalManaPips.genericCost}</li>
			</ol>
		</div>
	{/if}
</div>