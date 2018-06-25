import { chaynsCall } from '../../chaynsCall';
import { getCallbackName } from '../../callback';
import { propTypes } from '../../propTypes';
import { isNumber, isDate } from '../../../utils/is';
import {environment} from '../../environment';

export function date(config) {
	const callbackName = 'date';
	let {preSelect, minDate, maxDate, title, message, minuteInterval} = config,
		type = config.dateType || dateType.DATE;

    if(minuteInterval && minuteInterval > 1 && environment.isIOS && environment.isApp) {
        preSelect = roundInterval(preSelect, minuteInterval);
    } else{
        preSelect = validateValue(preSelect);
    }
	minDate = validateValue(minDate);
	maxDate = validateValue(maxDate);

	return chaynsCall({
		'call': {
			'action': 30,
			'value': {
				'callback': getCallbackName(callbackName),
				type,
				'selectedDate': preSelect,
				minDate,
				maxDate,
				title,
				message,
                minuteInterval
			}
		},
		'app': {
			'support': {'android': 4732, 'ios': 4301}
		},
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired,
			'type': propTypes.number.isRequired,
			'selectedDate': propTypes.date.isRequired,
			'minDate': propTypes.date.isRequired,
			'maxDate': propTypes.date.isRequired,
			'text': propTypes.string,
			'message': propTypes.string
		}
	}).then((data) => Promise.resolve(data.selectedDate));
}

export const dateType = {
	'DATE': 1,
	'TIME': 2,
	'DATE_TIME': 3
};

function validateValue(value) {
	if (!isNumber(value)) {
		if (isDate(value)) {
			return parseInt(value.getTime() / 1000, 10);
		}
		return -1;
	}
	return value;
}

function roundInterval(preDate = new Date(), interval) {
    if (!isDate(preDate)) {
        if (isNumber(preDate)) {
            preDate = new Date(preDate);
        } else {
            return -1;
        }
    }
    let minutes = preDate.getMinutes();
    preDate.setMinutes(minutes - (minutes % interval));
    preDate.setSeconds(0);
    return parseInt(preDate.getTime() / 1000, 10);
}

