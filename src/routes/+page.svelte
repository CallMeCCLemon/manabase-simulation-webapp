<script lang="ts">
	import * as gql from 'gql-query-builder';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import RequestForm from './RequestForm.svelte';
	import ResultPane from './ResultPane.svelte';

	const gqlEndpoint = import.meta.env.VITE_GQL_ENDPOINT;
	const defaultResult = {
		message: '',
		successRate: 0,
		ready: false,
		inProgress: false,
		checkpoints: [{
			successes: 0,
			iterations: 0
		}]
	};

	let ready = $state(false);
	let isValid = $state();

	let result = $state(defaultResult);

	async function simulate(
		manaCost: Record<string, number>,
		initialHandSize: number,
		cardsDrawnPerTurn: number,
		deckList: string,
		targetTurn: number,
		gqlEndpoint: string,
		onThePlay: boolean) {
		result = defaultResult;

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

		const query = gql.query({
			operation: 'simulate',
			variables: {
				deckList: deckList,
				gameConfiguration: {
					name: 'gameConfiguration',
					type: 'Api_Input_GameConfiguration',
					value: {
						initialHandSize: initialHandSize,
						cardsDrawnPerTurn: cardsDrawnPerTurn,
						onThePlay: onThePlay
					}
				},
				objective: {
					name: 'objective',
					type: 'Api_Input_Objective',
					value: {
						targetTurn: targetTurn,
						manaCosts: {
							colorRequirements: formattedManaCost,
							genericCost: manaCost.Generic
						}
					}
				}
			},
			fields: [
				'message',
				'successRate',
				{
					checkpoints: [
						'iterations',
						'successes'
					]
				}
			]
		});

		console.log(`Query: ${JSON.stringify(query)}`);
		result.inProgress = true;
		fetch(`${gqlEndpoint}/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
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
				checkpoints: data.data.simulate.checkpoints
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
				checkpoints: []
			};
		});
	}

	async function validate(deckList: string, gqlEndpoint: string) {
		result = defaultResult;

		let query = gql.query({
			operation: 'validate',
			variables: {
				deckList: deckList
			},
			fields: [
				'isValid',
				{
					invalidCards: [
						'name',
						'reason'
					]
				}
			]
		});

		console.log(`Query: ${JSON.stringify(query)}`);

		fetch(`${gqlEndpoint}/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(query)
		}).then((response) => {
			console.log(`validate response: ${response.status}, ${response.statusText}`);
			return response.json();
		}).then((data) => {
			console.log(`Object: ${JSON.stringify(data)}`);
			console.log(`validate response: ${data.data.validate.isValid}, ${JSON.stringify(data.data.validate.invalidCards)}`);
			isValid = data.data.validate.isValid;
			ready = true;
			console.log(`Validated: ${ready}`);
		}).catch((err) => {
			console.log(err);
		});
	}

</script>

<svelte:head>
	<title>MTG Mana Sim</title>
	<meta name="description" content="MTG Mana Simulator" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcomeFallback} alt="Welcome" />
			</picture>
		</span>

		MTG Mana Simulator
	</h1>

	<RequestForm simulate={simulate} gqlEndpoint={gqlEndpoint} validate={validate} />
	<ResultPane {...result} />
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    h1 {
        width: 100%;
    }

    .welcome {
        display: block;
        position: relative;
        width: 100%;
        height: 0;
        padding: 0 0 calc(100% * 495 / 2048) 0;
    }

    .welcome img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        display: block;
    }
</style>
