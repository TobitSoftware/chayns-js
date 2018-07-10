import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';
import { isDate } from '../../utils/is';

export function saveAppointment(config) {
	const callbackName = 'saveAppointment';
	let {name, location, description, start, end} = config;

	if (isDate(start)) {
		start = parseInt(start.getTime() / 1000, 10);
	}
	if (isDate(end)) {
		end = parseInt(end.getTime() / 1000, 10);
	}

	return chaynsCall({
		'call': {
			'action': 29,
			'value': {
				name,
				'location': location || '',
				'description': description || '',
				'startTime': start,
				'endTime': end,
				'callback': getCallbackName(callbackName)
			}
		},
        'myChaynsApp': {
            'support': {'android': 5683, 'ios': 5764}
        },
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		'web': false,
		'propTypes': {
			'name': propTypes.string.isRequired,
			'location': propTypes.string.isRequired,
			'description': propTypes.string.isRequired,
			'startTime': propTypes.date.isRequired,
			'endTime': propTypes.date.isRequired
		}
	});
}