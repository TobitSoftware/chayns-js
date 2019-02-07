import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';
import {isArray} from '../../utils/is';

export function vibrate(pattern) {
    if (!isArray(pattern)) {
        pattern = [pattern];
    }

    return chaynsCall({
        'call': {
            'action': 19,
            'value': {
                pattern
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        'web': {
            'fn': navigatorVibrate.bind(this, pattern)
        },
        'propTypes': {
            'pattern': propTypes.array.isRequired
        }
    });
}

function navigatorVibrate(pattern) {
    try {
        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
        navigator.vibrate(pattern);
        return Promise.resolve();
    } catch (e) {
        return Promise.reject();
    }
}
