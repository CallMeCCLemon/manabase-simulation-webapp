<script lang="ts">
	let initialHandSize = $state(7);
	let cardsDrawnPerTurn = $state(1);
	let manaCost = $state('WW1');
	let deckList = $state('{}');
	let targetTurn = $state(3);

	let convertStringToManaCost = (manaCost: string) => {
		return manaCost;
	};

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const onThePlay = formData.get('on-the-play') === 'on';
		console.log(`initialHandSize: ${initialHandSize}`);
		console.log(`cardsDrawnPerTurn: ${cardsDrawnPerTurn}`);
		console.log(`onThePlay: ${onThePlay}`);
		console.log(`manaCost: ${manaCost}`);
		console.log(`deckList: ${deckList}`);
		console.log(`targetTurn: ${targetTurn}`);

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
      manaCosts:
        {
          colorRequirements: [WHITE, WHITE],
          genericCost: 1
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
				<h2 class="text-2xl font-bold">New Mana Simulator Request</h2>


				<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
					<h2 class="text-md font-medium text-gray-900">
						Game Configuration:
					</h2>
				</div>
				<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
								value={initialHandSize}
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
								value={cardsDrawnPerTurn}
							/>
						</div>
					</div>

					<div class="sm:col-span-3">
						<label for="on-the-play" class="block text-sm font-medium text-gray-900">
							On The Play
						</label>
						<div class="mt-2">
							<input
								id="on-the-play"
								name="on-the-play"
								type="checkbox"
								class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
							/>
						</div>
					</div>
				</div>
				<div>
					<h2 class="text-md font-medium text-gray-900">
						Objective
					</h2>
				</div>
				<div class="sm:col-span-6">
					<div class="sm:col-span-3">
						<label for="mana-cost" class="block text-sm/6 font-medium text-gray-900">
							Mana Cost (ex: WW1 => White + White + 1 Generic)
						</label>
						<div class="mt-2">
							<input
								id="mana-cost"
								name="mana-cost"
								value={manaCost}
								type="text"
								class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							/>
						</div>
					</div>

					<div class="sm:col-span-3">
						<label for="target-turn" class="block text-sm/6 font-medium text-gray-900">
							Target Turn
						</label>
						<div class="mt-2">
							<input
								id="target-turn"
								name="target-turn"
								value={targetTurn}
								type="number"
								class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
						</div>
					</div>
				</div>
				<div class="sm:col-span-6">
					<label for="deck-list" class="block text-sm/6 font-medium text-gray-900">
						Deck List
					</label>
					<div class="mt-2">
							<textarea
								value={deckList}
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
						Save
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