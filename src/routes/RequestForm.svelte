<script lang="ts">
	import ManaCost from './ManaCost.svelte';

	const {
		simulate,
		validate,
		gqlEndpoint,
	} = $props();

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

	console.log(`GQL Endpoint: ${gqlEndpoint}`);

	let initialHandSize = $state(7);
	let cardsDrawnPerTurn = $state(1);
	let deckList = $state(`Deck
5 Mountain
4 Manifold Mouse
4 Heartfire Hero
2 Screaming Nemesis
4 Emberheart Challenger
4 Monstrous Rage
2 Rockface Village
2 Obliterating Bolt
4 Thornspire Verge
2 Snakeskin Veil
3 Monastery Swiftspear
4 Burst Lightning
3 Soulstone Sanctuary
3 Questing Druid // Seek the Beast
4 Copperline Gorge
4 Hired Claw
2 Scorching Dragonfire
4 Karplusan Forest

Sideboard
3 Pawpatch Formation
2 Torch the Tower
2 Scorching Shot
2 Tectonic Hazard
1 Questing Druid
2 Lithomantic Barrage
3 Urabrask's Forge
	`);
	let targetTurn = $state(3);
	let result = $state(defaultResult);

	const initialManaCost = {
		White: 0,
		Blue: 0,
		Black: 0,
		Red: 2,
		Green: 0,
		Colorless: 0,
		Generic: 1
	};

	let manaCost = $state(initialManaCost);

	function setFieldByString<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
		return { ...obj, [key]: value };
	}

	function updateManaCost(color: keyof typeof initialManaCost, updatedValue: number) {
		manaCost = setFieldByString(manaCost, color, updatedValue); // Create a new object
	}

	async function handleValidate(formData: FormData) {
		// event.preventDefault();
		const formValues = Object.fromEntries(formData.entries());
		console.log('Form Data:', formValues['deck-list']);

		// const formData = new FormData(event.currentTarget as HTMLFormElement);
		validate(formValues['deck-list'], gqlEndpoint);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const onThePlay = formData.get('on-the-play') === 'on';
		simulate(manaCost, initialHandSize, cardsDrawnPerTurn, deckList, targetTurn, gqlEndpoint, onThePlay);
	}
</script>

<style>
    .spinner {
        border: 4px solid rgba(0, 0, 0, 0.1); /* Light gray */
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border-left-color: #09f; /* Blue */
        animation: spin 1s ease infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>

<div>
	<form onsubmit={handleSubmit}>
		<div class="space-y-12">
			<div class="border-b border-gray-900/10 pb-12">
				<div class="p-6 border border-gray-300 rounded-lg mt-10 bg-gray-50">
					<h2 class="text-md font-medium text-gray-900">
						Game Configuration
					</h2>
					<div class="grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-6">
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
					<h2 class="text-md font-medium text-gray-900">
						Deck List
					</h2>
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
					{#if !result.inProgress}
						<button
							type="button"
							class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							onclick={() => {
								let form = document.querySelector('form');
								if (form === null) {
									return;
								}
								handleValidate(new FormData(form))
							}}
						>
							Validate
						</button>
						<button
							type="submit"
							class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Simulate
						</button>
					{:else}
						<div class="spinner"></div>
					{/if}
				</div>
			</div>
		</div>
	</form>
</div>