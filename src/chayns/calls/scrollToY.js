import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function scrollToY(y, duration) {
	return chaynsCall({
		'call': {
			'action': 81,
			'value': {
				'position': y,
                duration
			}
		},
		'app': {
			'fn': appScrollToY.bind(this, y)
		},
		'propTypes': {
			'position': propTypes.number.isRequired,
            'duration': propTypes.number
		}
	});
}

function appScrollToY(y) {
	window.scrollTo(0, y);
	return Promise.resolve();
}
