import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';
import { isObject } from '../../utils/is';
import { getLogger } from '../../utils/logger';

const log = getLogger('chayns.core.call');

export function openUrl(url, title, darkenBackground, fullSize) {
	const callbackName = 'openUrl';
	let value;

	if (!isObject(url)) {
		value = {
			url,
			title,
			'darkenBackground': !!darkenBackground,
			'fullSize': !!fullSize
		};

		log.warn('Function call is deprecated. Please check the documentation.');
	} else {
		// url should be an object. old call is deprecated!
		value = url;
	}

	value.callback = getCallbackName(callbackName);

	return chaynsCall({
		'call': {
			'action': 31,
			value
		},
		'app': {
			'support': {'android': 4728, 'ios': 4301}
		},
		callbackName,
		'propTypes': {
			'url': propTypes.string.isRequired,
			'title': propTypes.string,
			'callback': propTypes.string.isRequired,
			'darkenBackground': propTypes.boolean,
			'fullSize': propTypes.boolean,
			'width': propTypes.number,
			'type': propTypes.number,
			'animation': propTypes.number,
			'exclusiveView': propTypes.boolean
		}
	}).then((data) => Promise.resolve(data.closeParam));
}

export const urlType = {
	WEB: 0,
	AR: 1
};

export const animationType = {
	DEFAULT: 0,
	BOTTOM: 1
};
