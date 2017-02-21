import { chaynsCall } from '../chaynsCall';

export function navigateBack() {
	return chaynsCall({
		'call': {
			'action': 20,
			'value': {}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		}
	});
}
