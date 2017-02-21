import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function getWindowMetrics() {
	const callbackName = 'getWindowMetrics';

	return chaynsCall({
		'call': {
			'action': 78,
			'value': {
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'fn': () => Promise.resolve({
				'height': document.body.clientHeight,
				'scrollTop': window.pageYOffset,
				'windowHeight': window.screen.availHeight
			})
		},
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired
		}
	}).then((data) => Promise.resolve({
		'height': data.AvailHeight,
		'scrollTop': data.WindowScrollTop,
		'windowHeight': data.WindowInnerHeight,
		'pageYOffset': data.pageYOffset
	}));
}
