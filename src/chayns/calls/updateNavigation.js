import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';
import { isObject } from '../../utils/is';
import { extend } from '../../utils/extend';

export function updateNavigation(tappId, config) {
	const value = {
		'tappID': tappId
	};

	if (isObject(config)) {
		extend(value, config);
	}

	return chaynsCall({
		'call': {
			'action': 84,
			value
		},
		'app': false,
		'propTypes': {
			'stateOnly': propTypes.boolean,
			'tappID': propTypes.number.isRequired,
			'updateTapp': propTypes.boolean
		}
	});
}
