import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function scrollToY(y) {
	return chaynsCall({
		'call': {
			'action': 81,
			'value': {
				'position': y
			}
		},
		'app': {
			'fn': appScrollToY.bind(this, y)
		},
		'propTypes': {
			'position': propTypes.number.isRequired
		}
	});
}

function appScrollToY(y) {
	window.scrollTo(0, y);
	return Promise.resolve();
}
