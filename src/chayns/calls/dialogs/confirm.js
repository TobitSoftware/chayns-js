import { chaynsDialog, buttonText, buttonType } from './chaynsDialog';
import { isArray } from '../../../utils/is';

export function confirm(title = '', message = '', buttons) {
	if (!buttons || !isArray(buttons)) {
		buttons = [{
			'text': buttonText.YES,
			'buttonType': buttonType.POSITIVE
		}, {
			'text': buttonText.NO,
			'buttonType': buttonType.NEGATIVE
		}];
	}

	return chaynsDialog({
		'dialog': {
			title,
			message,
			buttons
		}
	});
}