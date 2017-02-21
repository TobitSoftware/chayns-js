import { chaynsDialog, buttonText, buttonType } from './chaynsDialog';

export function alert(title = '', message = '') {
	return chaynsDialog({
		'dialog': {
			title,
			message,
			'buttons': [{
				'text': buttonText.OK,
				'buttonType': buttonType.POSITIVE
			}]
		}
	});
}
