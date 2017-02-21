import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

function setPullToRefresh(enabled) {
	return chaynsCall({
		'call': {
			'action': 0,
			'value': {
				enabled
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		'web': false,
		'propTypes': {
			'enabled': propTypes.boolean.isRequired
		}
	});
}

export function allowRefreshScroll() {
	return setPullToRefresh(true);
}

export function disallowRefreshScroll() {
	return setPullToRefresh(false);
}
