<script lang="ts">
	// import { onMount } from 'svelte';
	// import { type ClientOptions, createClient } from '@urql/core';

	// const options = {
	// 	url: 'http://100.69.236.43:32001',
	// } as ClientOptions;
	//
	// const graphqlClient = createClient(options);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		console.log(JSON.stringify(event));

		// const formData = new FormData(event.currentTarget as HTMLFormElement);
		// const message = formData.get('message') as string;
		//
		const query = `
		{
    echo(message: "Hello World!") {
        message
    }
}
		`;

		fetch("https://api-mana-sim.latentlab.cc/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ query }),
		}).then((response) => {
			return response.json();
		}).then((data) => {
			console.log(data);
		});

		// try {
		// 	// const response = await graphqlClient.mutation(query, { message }).toPromise();
		// 	console.log(response.data.echo.message);
		// 	alert(response.data.echo.message);
		// } catch (error) {
		// 	console.error('Error submitting form:', error);
		// }
	}

</script>

<div>
	This is the start of the mana request form.
	<form>
		<div class="space-y-12">
			<div class="border-b border-gray-900/10 pb-12">
				<h2 class="text-2xl font-bold">Mana Simulator Echo Test Request</h2>

				<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<div class="sm:col-span-3">
						<label for="message" class="block text-sm/6 font-medium text-gray-900">
							Message
						</label>
						<div class="mt-2">
							<input
								id="message"
								name="message"
								type="text"
								autoComplete="given-name"
								class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							/>
						</div>
					</div>

<!--					<div class="sm:col-span-3">-->
<!--						<label for="last-name" class="block text-sm/6 font-medium text-gray-900">-->
<!--							Last name-->
<!--						</label>-->
<!--						<div class="mt-2">-->
<!--							<input-->
<!--								id="last-name"-->
<!--								name="last-name"-->
<!--								type="text"-->
<!--								autoComplete="family-name"-->
<!--								class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"-->
<!--							/>-->
<!--						</div>-->
					</div>

				<div class="mt-6 flex items-center justify-end gap-x-6">
					<button type="button" class="text-sm/6 font-semibold text-gray-900">
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						onclick={handleSubmit}
					>
						Save
					</button>
				</div>
			</div>

		</div>
	</form>
</div>