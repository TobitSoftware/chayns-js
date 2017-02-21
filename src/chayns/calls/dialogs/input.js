import { chaynsCall } from '../../chaynsCall';
import { getCallbackName } from '../../callback';
import { propTypes } from '../../propTypes';
import { buttonText, buttonType } from './chaynsDialog';
import { isArray } from '../../../utils/is';

export function input(dialog) {
	const callbackName = 'inputCallback';

	if (!dialog.buttons || !isArray(dialog.buttons)) {
		dialog.buttons = [{
			'text': buttonText.YES,
			'buttonType': buttonType.POSITIVE
		}, {
			'text': buttonText.NO,
			'buttonType': buttonType.NEGATIVE
		}];
	}

	return chaynsCall({
		'call': {
			'action': 103,
			'value': {
				'callback': getCallbackName(callbackName),
				dialog
			}
		},
		'app': {
			'support': {'android': 5140, 'ios': 5148}
		},
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired,
			'dialog': propTypes.object.isRequired
		}
	});
}

export const inputType = {
	DEFAULT: 0,
	PASSWORD: 1
};
