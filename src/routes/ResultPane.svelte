<script lang="ts">
	import Chart, { type ChartItem } from 'chart.js/auto';
	import type { DeckStats } from '$lib/api/model';

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
		deckStats: DeckStats,
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
			<div>
				<h2>Deck Stats</h2>
				<ol>
					<li>Total Cards: {deckStats.totalCards}</li>
					<li>Lands: {deckStats.lands}</li>
					<li>Non-Lands: {deckStats.nonLands}</li>
				</ol>
				<h2>Mana Pips for Spells</h2>
				<ol>
					<li>White Mana Pips: {deckStats.totalManaPips.whiteMana}</li>
					<li>Blue Mana Pips: {deckStats.totalManaPips.blueMana}</li>
					<li>Black Mana Pips: {deckStats.totalManaPips.blackMana}</li>
					<li>Red Mana Pips: {deckStats.totalManaPips.redMana}</li>
					<li>Green Mana Pips: {deckStats.totalManaPips.greenMana}</li>
					<li>Colorless Mana Pips: {deckStats.totalManaPips.colorlessMana}</li>
					<li>Generic Mana Cost: {deckStats.totalManaPips.genericCost}</li>
				</ol>
				<h2>Land Mana Production</h2>
				<ol>
					<li>White Mana Sources: {deckStats.landStats.landManaProduction.whiteMana}</li>
					<li>Blue Mana Sources: {deckStats.landStats.landManaProduction.blueMana}</li>
					<li>Black Mana Sources: {deckStats.landStats.landManaProduction.blackMana}</li>
					<li>Red Mana Sources: {deckStats.landStats.landManaProduction.redMana}</li>
					<li>Green Mana Sources: {deckStats.landStats.landManaProduction.greenMana}</li>
					<li>Colorless Mana Sources: {deckStats.landStats.landManaProduction.colorlessMana}</li>
				</ol>
			</div>
		</div>
	{/if}
</div>