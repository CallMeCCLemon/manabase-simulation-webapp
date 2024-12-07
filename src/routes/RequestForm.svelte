<script lang="ts">
	import ManaCost from './ManaCost.svelte';

	let initialHandSize = $state(7);
	let cardsDrawnPerTurn = $state(1);
	let deckList = $state('{lands:[{name:"Test-Mountain",colors:[RED],entersTapped:false,quantity:24}],nonLands:[{name:"Test-Nonland-1",castingCost:{colorRequirements:[RED,RED,RED],genericCost:1},quantity:1}]}');
	let targetTurn = $state(3);

	const initialManaCost = {
		White: 0,
		Blue: 0,
		Black: 0,
		Red: 3,
		Green: 0,
		Colorless: 0,
		Generic: 0
	};

	let manaCost = $state(initialManaCost);

	function setFieldByString<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
		return { ...obj, [key]: value };
	}

	function updateManaCost(color: keyof typeof initialManaCost, updatedValue: number) {
		manaCost = setFieldByString(manaCost, color, updatedValue); // Create a new object
		console.log(`Updated Mana Values - White: ${manaCost.White}, Blue: ${manaCost.Blue}, Black: ${manaCost.Black}, Red: ${manaCost.Red}, Green: ${manaCost.Green}, Colorless: ${manaCost.Colorless}, Generic: ${manaCost.Generic}`);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const onThePlay = formData.get('on-the-play') === 'on';
		let formattedManaCost = Object.entries(manaCost).map(
			([color, cost]) => {
				let output = ""
				for (let i = 0; i < cost; i++) {
					if (color === "Generic") {
						continue;
					}
					output += `${color.toUpperCase()}, `
				}
				return output
			}
		).reduce((acc, curr) => acc + curr);
		formattedManaCost = formattedManaCost.slice(0, -2);

		console.log(`initialHandSize: ${initialHandSize}`);
		console.log(`cardsDrawnPerTurn: ${cardsDrawnPerTurn}`);
		console.log(`onThePlay: ${onThePlay}`);
		console.log(`manaValues:`, manaCost);
		console.log(`deckList: ${deckList}`);
		console.log(`targetTurn: ${targetTurn}`);
		console.log(`manaCost:`, manaCost);
		console.log(`formattedManaCost:`, formattedManaCost);

		const query = `
			query {
				simulate(
					deckList: ${deckList},
					gameConfiguration: {
						initialHandSize: ${initialHandSize},
						cardsDrawnPerTurn: ${cardsDrawnPerTurn},
						onThePlay: ${onThePlay}
					},
					objective: {
						targetTurn: ${targetTurn},
						manaCosts: {
							colorRequirements: [${formattedManaCost}],
							genericCost: ${manaCost.Generic}
						}
					}
				) {
					message
					successRate
				}
			}
		`;
		console.log(`Query: ${query}`);

		fetch('https://api-mana-sim.latentlab.cc/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({ query })
		}).then((response) => {
			return response.json();
		}).then((data) => {
			console.log(data);
		});
	}
</script>

<div>
	<form onsubmit={handleSubmit}>
		<div class="space-y-12">
			<div class="border-b border-gray-900/10 pb-12">

				<div class="p-6 border border-gray-300 rounded-lg mt-10 bg-gray-50">
					<h2 class="text-md font-medium text-gray-900">
						Game Configuration:
					</h2>
					<div class="mt-10 grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-6">
						<div class="sm:col-span-3">
							<label for="initial-hand-size" class="block text-sm/6 font-medium text-gray-900">
								Initial hand size
							</label>
							<div class="mt-2">
								<input
									id="initial-hand-size"
									name="initial-hand-size"
									type="number"
									class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									bind:value={initialHandSize}
								/>
							</div>
						</div>

						<div class="sm:col-span-3">
							<label for="cards-drawn-per-turn" class="block text-sm/6 font-medium text-gray-900">
								Cards Drawn Per Turn
							</label>
							<div class="mt-2">
								<input
									id="cards-drawn-per-turn"
									name="cards-drawn-per-turn"
									type="number"
									class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									bind:value={cardsDrawnPerTurn}
								/>
							</div>
						</div>

						<div class="sm:col-span-3">
							<div class="flex items-center mt-2">
								<input
									id="on-the-play"
									name="on-the-play"
									type="checkbox"
									class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
								/>
								<label for="on-the-play" class="ml-2 text-sm font-medium text-gray-900">
									On The Play
								</label>
							</div>
						</div>
					</div>
				</div>

				<div class="p-6 border border-gray-300 rounded-lg mt-10 bg-gray-50">
					<h2 class="text-md font-medium text-gray-900">
						Objective
					</h2>

					<div class="sm:col-span-6">
						<div class="sm:col-span-3">
							<ManaCost updateManaCost={updateManaCost} manaCost={manaCost} />
						</div>

						<div class="sm:col-span-3">
							<label for="target-turn" class="block text-sm/6 font-medium text-gray-900">
								Target Turn
							</label>
							<div class="mt-2">
								<input
									id="target-turn"
									name="target-turn"
									bind:value={targetTurn}
									type="number"
									class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
							</div>
						</div>
					</div>
				</div>

				<div class="p-6 border border-gray-300 rounded-lg mt-10 bg-gray-50">
					<label for="deck-list" class="block text-sm/6 font-medium text-gray-900">
						Deck List
					</label>
					<div class="mt-2">
							<textarea
								bind:value={deckList}
								id="deck-list"
								name="deck-list"
								class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								rows="10"
								style="resize: vertical; overflow-y: scroll;"></textarea>
					</div>

				</div>

				<div class="mt-6 flex items-center justify-end gap-x-6">
					<button type="button" class="text-sm/6 font-semibold text-gray-900">
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Simulate
					</button>
				</div>
			</div>

			<div class="mt-2">
				<p class="text-sm text-gray-500">
					Output:
				</p>
			</div>

		</div>
	</form>
</div>