import { chaynsCall } from '../chaynsCall';

export function refreshAccessToken() {
	return chaynsCall({
		'call': {
			'action': 55,
			'value': {}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		}
	});
}
