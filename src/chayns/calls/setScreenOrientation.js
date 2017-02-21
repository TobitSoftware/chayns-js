import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';
import { isPermitted } from '../../utils/isPermitted';

export function setScreenOrientation(o) {
	// if new orientations are not supported fallback to older ones
	if (!isPermitted({'android': 5280, 'ios': 5260})) {
		if (o === orientation.PORTRAIT_REVERSE) {
			o = orientation.PORTRAIT_SENSOR;
		} else if (o === orientation.LANDSCAPE_REVERSE) {
			o = orientation.LANDSCAPE_SENSOR;
		}
	}

	if (!isPermitted({'android': 5261, 'ios': 5260})) {
		if (o === orientation.PORTRAIT_SENSOR) {
			o = orientation.PORTRAIT;
		} else if (o === orientation.LANDSCAPE_SENSOR) {
			o = orientation.LANDSCAPE;
		}
	}

	return chaynsCall({
		'call': {
			'action': 96,
			'value': {
				'orientation': o
			}
		},
		'app': {
			'support': {'android': 4973, 'ios': 4538}
		},
		'web': false,
		'propTypes': {
			'orientation': propTypes.number.isRequired
		}
	});
}

export const orientation = {
	'DEFAULT': 0,
	'PORTRAIT': 1,
	'LANDSCAPE': 2,
	'PORTRAIT_SENSOR': 3,
	'LANDSCAPE_SENSOR': 4,
	'PORTRAIT_REVERSE': 5,
	'LANDSCAPE_REVERSE': 6
};
