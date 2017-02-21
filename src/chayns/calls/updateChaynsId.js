import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function updateChaynsId(id) {
	return chaynsCall({
		'call': {
			'action': 92,
			'value': {
				id
			}
		},
		'app': {
			'support': {'android': 4962, 'ios': 4517}
		},
		'propTypes': {
			'id': propTypes.number
		}
	});
}
