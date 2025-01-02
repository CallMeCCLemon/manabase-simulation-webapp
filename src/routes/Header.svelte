<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/logo.webp';
	import { onMount } from 'svelte';
	import { decodeJwtResponse, onGoogleScriptLoad } from '$lib/utils/google-auth';

	// function onSignIn(googleUser) {
	// 	console.log(googleUser);
	// 	let profile = googleUser.getBasicProfile();
	// 	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	// 	console.log('Name: ' + profile.getName());
	// 	console.log('Image URL: ' + profile.getImageUrl());
	// 	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	// }

	// globalThis.onSignIn = onSignIn;



	//
	// function signOut() {
	// 	var auth2 = gapi.auth2.getAuthInstance();
	// 	auth2.signOut().then(function() {
	// 		console.log('User signed out.');
	// 	});
	// }
	//
	// function handleCredentialResponse(response) {
	// 	console.log('handleCredentialResponse function is firing');
	// 	console.log(response);
	// }
	//
	// function onSuccess(googleUser) {
	// 	console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
	// }
	//
	// function onFailure(error) {
	// 	console.log(error);
	// }
	//
	// function renderButton() {
	// 	return gapi.signin2.render('my-signin2', {
	// 		'scope': 'profile email',
	// 		'width': 240,
	// 		'height': 50,
	// 		'longtitle': true,
	// 		'theme': 'dark',
	// 		'onsuccess': onSuccess,
	// 		'onfailure': onFailure
	// 	});
	// }

	onMount(() => {
		onGoogleScriptLoad(decodeJwtResponse);
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
			<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<!--{renderButton()}-->
<!--		<div id="g_id_onload"-->
<!--				 data-client_id="320657207668-nuaaj0bcl2jfh55q27l33tfsnnnf6ed9.apps.googleusercontent.com"-->
<!--				 data-context="signin"-->
<!--				 data-ux_mode="redirect"-->
<!--				 data-login_uri="http://localhost:5173/simulate"-->
<!--				 data-auto_prompt="false"-->
<!--				 data-callback="onSignIn"-->
<!--		>-->
<!--		</div>-->

<!--		<div class="g_id_signin"-->
<!--				 data-type="standard"-->
<!--				 data-shape="pill"-->
<!--				 data-theme="filled_blue"-->
<!--				 data-text="signin_with"-->
<!--				 data-size="large"-->
<!--				 data-logo_alignment="left">-->
<!--		</div>-->
		<div id="googleSignIn"></div>



		<!--		<div class="g-signin2" data-onsuccess="onSignIn"></div>-->

		<!--		<a href="#" onclick="signOut();">Sign out</a>-->
	</div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
    }

    .corner {
        width: 5em;
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
</style>
