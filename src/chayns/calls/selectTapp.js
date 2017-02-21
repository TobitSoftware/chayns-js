import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';
import { isArray } from '../../utils/is';
import { extend } from '../../utils/extend';

export function selectTapp(tapp, param) {
	const value = extend({}, tapp);

	if (param) {
		value.params = isArray(param) ? param : [param];
	}

	return chaynsCall({
		'call': {
			'action': 2,
			value
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		'propTypes': {
			'id': propTypes.number,
			'position': propTypes.number,
			'internalName': propTypes.string,
			'showName': propTypes.string,
			'params': propTypes.array
		}
	});
}
