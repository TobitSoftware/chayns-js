import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';
import { isArray, isObject } from '../../utils/is';

export function openImage(data, startIndex = 0) {
	if (!isArray(data)) {
		data = [data];
	}

	let urls = [];
	let items;
	if (isObject(data[0])) {
		for (let i = 0, l = data.length; i < l; i++) {
			urls.push(data[i].url);
		}
		items = data;
	} else {
		urls = data;
	}

	return chaynsCall({
		'call': {
			'action': 4,
			'value': {
				urls,
				items,
				startIndex,
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		'propTypes': {
			'startIndex': propTypes.number.isRequired,
			'urls': propTypes.array,
			'items': propTypes.array
		}
	});
}