<script lang="ts">
	import RequestForm from './RequestForm.svelte';
	import ResultPane from './ResultPane.svelte';
	import { jwt } from '$lib/stores/user';
	import type { SimulateQueryInputs } from '$lib/api/model';
	import { createSimulateQuery } from '$lib/api/generation';

	const gqlEndpoint = import.meta.env.VITE_GQL_ENDPOINT;
	const defaultResult = {
		message: '',
		successRate: 0,
		ready: false,
		inProgress: false,
		checkpoints: [{
			successes: 0,
			iterations: 0
		}],
		deckStats: {
			totalCards: 0,
			lands: 0,
			nonLands: 0,
			totalManaPips: {
				whiteMana: 0,
				blueMana: 0,
				blackMana: 0,
				redMana: 0,
				greenMana: 0,
				colorlessMana: 0,
				genericCost: 0
			}
		}
	};

	let ready = $state(false);

	let result = $state(defaultResult);

	async function simulate(
		manaCost: Record<string, number>,
		initialHandSize: number,
		cardsDrawnPerTurn: number,
		deckList: string,
		targetTurn: number,
		gqlEndpoint: string,
		onThePlay: boolean) {
		let formattedManaCost: string[] = [];
		Object.entries(manaCost).forEach(
			([color, cost]) => {
				for (let i = 0; i < cost; i++) {
					if (color === 'Generic') {
						continue;
					}
					formattedManaCost.push(color.toUpperCase());
				}
			}
		);

		const query = createSimulateQuery({
			deckList: deckList,
			initialHandSize: initialHandSize,
			cardsDrawnPerTurn: cardsDrawnPerTurn,
			onThePlay: onThePlay,
			targetTurn: targetTurn,
			formattedManaCost: formattedManaCost,
			genericManaCost: manaCost.Generic
		} as SimulateQueryInputs);

		console.log(`Query: ${JSON.stringify(query)}`);
		result.inProgress = true;
		fetch(`${gqlEndpoint}/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Authorization': `${$jwt}`
			},
			body: JSON.stringify(query)
		}).then((response) => {
			return response.json();
		}).then((data) => {
			console.log(data);
			result = {
				message: data.data.simulate.message,
				successRate: data.data.simulate.successRate,
				ready: true,
				inProgress: false,
				checkpoints: data.data.simulate.checkpoints,
				deckStats: data.data.simulate.deckStats
			};
			ready = true;
			console.log(`ready: ${ready}`);
		}).catch((err) => {
			console.log(err);
			result = {
				message: 'Error',
				successRate: 0,
				ready: true,
				inProgress: false,
				checkpoints: [],
				deckStats: {
					totalCards: 0,
					lands: 0,
					nonLands: 0,
					totalManaPips: {
						whiteMana: 0,
						blueMana: 0,
						blackMana: 0,
						redMana: 0,
						greenMana: 0,
						colorlessMana: 0,
						genericCost: 0
					}
				}
			};
		});
	}

</script>

<div class="container">
	<RequestForm simulate={simulate} gqlEndpoint={gqlEndpoint} />
	<ResultPane {...result} />
</div>