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
                'AvailHeight': document.body.clientHeight,
                'pageYOffset': window.pageYOffset,
                'WindowInnerHeight': window.screen.availHeight,
                'WindowScrollTop': document.body.scrollTop
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
