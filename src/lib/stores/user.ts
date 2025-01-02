import { writable } from 'svelte/store';

// User is the type returned from Google's OAuth2 API for a user.
interface User {
	id: string;
	name: string;
	email: string;
	given_name: string;
	family_name: string;
	picture: string;
	credential: string;
	iss: string;
	exp: number;
	sub: string;
	aud: string;
}

export const jwt = writable(null as string | null);

export const user = writable(null as User | null);
