<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/logo.webp';
	import { onMount } from 'svelte';
	import { decodeJwtResponse, onGoogleScriptLoad } from '$lib/utils/google-auth';
	import { user } from '$lib/stores/user';

	let isLoggedIn = $derived.by(() => {
		console.log('Show sign in?');
		console.log($user === null);
		return $user !== null;
	});

	user.subscribe((updatedUser) => {
		console.log('User store updated');
		if (updatedUser) {
			console.log('User is logged in');
			console.log(updatedUser);
		} else {
			console.log('User is not logged in');
			console.log(updatedUser);
		}
	});

	onMount(() => {
		if (!isLoggedIn) {
			onGoogleScriptLoad(decodeJwtResponse);
		} else {
			console.log('User is logged in');
		}
	});
</script>

<header>
	<div class="corner">
		<a href="https://mana-sim.latentlab.cc/">
			<img src={logo} alt="Mana-Sim" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			{#if isLoggedIn}
				<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
					<a href="/about">About</a>
				</li>
			{/if}
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		{#if !isLoggedIn}
			<div id="googleSignIn"></div>
		{:else}
			<div>
				<img class="profile-image" src={$user.picture} alt="Profile" />
			</div>
		{/if}
	</div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
    }

    .corner {
        width: 15em;
        height: 3em;
    }

    .corner a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .corner img {
        width: 2em;
        height: 2em;
        object-fit: contain;
    }

    nav {
        display: flex;
        justify-content: center;
        --background: rgba(255, 255, 255, 0.7);
    }

    svg {
        width: 2em;
        height: 3em;
        display: block;
    }

    path {
        fill: var(--background);
    }

    ul {
        position: relative;
        padding: 0;
        margin: 0;
        height: 3em;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        background: var(--background);
        background-size: contain;
    }

    li {
        position: relative;
        height: 100%;
    }

    li[aria-current='page']::before {
        --size: 6px;
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: calc(50% - var(--size));
        border: var(--size) solid transparent;
        border-top: var(--size) solid var(--color-theme-1);
    }

    nav a {
        display: flex;
        height: 100%;
        align-items: center;
        padding: 0 0.5rem;
        color: var(--color-text);
        font-weight: 700;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-decoration: none;
        transition: color 0.2s linear;
    }

    a:hover {
        color: var(--color-theme-1);
    }

    .profile-image {
        width: 3em;
        height: 3em;
        border-radius: 50%;
				text-align: right;
    }
</style>
