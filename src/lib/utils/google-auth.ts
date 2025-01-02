import { user, jwt } from '$lib/stores/user';

export const decodeJwtResponse = (token: string) => {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));

	return JSON.parse(jsonPayload);
};

export const onGoogleScriptLoad = () => {
	try {
		const handleCredentialResponse = (response) => {
			const responsePayload = decodeJwtResponse(response.credential);
			console.log('Full Name: ' + responsePayload.name);
			console.log(responsePayload);
			user.set(responsePayload);
			jwt.set(response.credential);
			console.log('Wrote to user store');
		};
		google.accounts.id.initialize({
			client_id: import.meta.env.VITE_GOOGLE_SIGNIN_API_KEY,
			callback: handleCredentialResponse,
		});
		google.accounts.id.renderButton(
			document.getElementById('googleSignIn'),
			{ theme: 'filled_blue', size: 'large', text: "signin_with", shape: "circular", logo_alignment: "left" } // customization attributes
		);
		google.accounts.id.prompt(); // also display the One Tap dialog
	} catch (err) {
		console.error('Error initializing Google Sign-In');
		console.error(err);
	}
};