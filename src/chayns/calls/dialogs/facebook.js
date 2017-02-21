import { chaynsCall } from '../../chaynsCall';
import { getCallbackName } from '../../callback';
import { propTypes } from '../../propTypes';
import { buttonText, buttonType } from './chaynsDialog';
import { isArray } from '../../../utils/is';

export function facebook(config) {
	const callbackName = 'facebookDialog';

	if (!config.buttons || !isArray(config.buttons)) {
		config.buttons = [{
			'text': buttonText.OK,
			'buttonType': buttonType.POSITIVE
		}, {
			'text': buttonText.CANCEL,
			'buttonType': buttonType.CANCEL
		}];
	}

	if (config.preSelected && !isArray(config.preSelected)) {
		config.preSelected = [config.preSelected];
	}

	return chaynsCall({
		'call': {
			'action': 51,
			'value': {
				'callback': getCallbackName(callbackName),
				'dialog': {
					'title': config.title || '',
					'message': config.message || '',
					'buttons': config.buttons,
					'displayMe': true,
					'multiselect': !!config.multiselect,
					'quickfind': !!config.quickfind
				},
				'preSelection': config.preSelected || []
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired,
			'dialog': propTypes.object.isRequired,
			'preSelection': propTypes.array.isRequired
		}
	});
}
