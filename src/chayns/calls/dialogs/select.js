import { chaynsCall } from '../../chaynsCall';
import { getCallbackName } from '../../callback';
import { propTypes } from '../../propTypes';
import { buttonText, buttonType } from './chaynsDialog';
import { isPresent, isArray } from '../../../utils/is';

export function select(config) {
	const callbackName = 'multiselectdialog',
		list = [];

	for (let i = 0, l = config.list.length; i < l; i++) {
		const item = config.list[i];
		if (item.name || (item.image && (isPresent(item.value)))) {
			list.push({
				'name': item.name,
				'value': isPresent(item.value) ? item.value : item.name,
				'isSelected': !!item.isSelected,
				'image': item.image,
				'icon': item.icon
			});
		}
	}

	if (config.list.length === 0) {
		return Promise.reject(new Error('Invalid Parameters'));
	}

	if (!config.buttons || !isArray(config.buttons)) {
		config.buttons = [{
			'text': buttonText.OK,
			'buttonType': buttonType.POSITIVE
		}, {
			'text': buttonText.CANCEL,
			'buttonType': buttonType.CANCEL
		}];
	}

	return chaynsCall({
		'call': {
			'action': 50,
			'value': {
				'callback': getCallbackName(callbackName),
				'dialog': {
					'title': config.title || '',
					'message': config.message || '',
					'buttons': config.buttons,
					'multiselect': !!config.multiselect,
					'quickfind': !!config.quickfind
				},
				list
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired,
			'dialog': propTypes.object.isRequired,
			'list': propTypes.array.isRequired
		}
	});
}
