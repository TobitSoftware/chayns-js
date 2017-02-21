export const TAPP_API_URL = '//chayns1.tobit.com/TappApi/';

export function tappApi(endpoint, raw = false) {
	return fetch(TAPP_API_URL + endpoint)
		.then((res) => res.json())
		.then((json) => {
			if (json.Value && !raw) {
				return json.Value;
			} else if (json.Data && !raw) {
				return json.Data;
			}

			return json;
		});
}
