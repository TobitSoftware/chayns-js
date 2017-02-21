import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

let watchdogInterval;

function registerWatchdog(enabled, ongoing, interval) {
	return chaynsCall({
		'call': {
			'action': 106,
			'value': {
				enabled,
				ongoing,
				interval
			}
		},
		'app': {
			'support': {'android': 5205}
		},
		'web': false,
		'propTypes': {
			'enabled': propTypes.boolean.isRequired,
			'ongoing': propTypes.boolean,
			'interval': propTypes.number
		}
	});
}

export function addWatchdog(ongoing, interval, startInterval) {
	const result = registerWatchdog(true, ongoing, interval);

	if (startInterval && !watchdogInterval) {
		watchdogInterval = setInterval(() =>
			registerWatchdog(true), parseInt(interval * 0.9, 10)
		);
	}

	return result;
}

export function removeWatchdog() {
	if (watchdogInterval) {
		clearInterval(watchdogInterval);
		watchdogInterval = null;
	}

	return registerWatchdog(false);
}
