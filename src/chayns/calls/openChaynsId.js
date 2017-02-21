import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function openChaynsId(params) {
	return chaynsCall({
		'call': {
			'action': 58,
			'value': {
				params
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		'propTypes': {
			'params': propTypes.array
		}
	});
}
