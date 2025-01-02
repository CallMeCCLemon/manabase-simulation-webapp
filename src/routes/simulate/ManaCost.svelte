<script>
	const colors = ['White', 'Blue', 'Black', 'Red', 'Green', 'Colorless', 'Generic'];

	let { updateManaCost, manaCost } = $props();
</script>

<div>
	<div class="grid grid-cols-7 gap-x-4 gap-y-4">
		{#each colors as color}
			<div class="flex flex-col items-center">
				<label for={`${color}-mana`} class="mb-1">{color}</label>
				<input
					type="number"
					id={`${color}-mana`}
					bind:value={manaCost[color]}
					oninput={(e) => updateManaCost(color, manaCost[color], e)}
					class="w-16 h-16 text-center border border-gray-300 rounded"
				/>
			</div>
		{/each}
	</div>
</div>