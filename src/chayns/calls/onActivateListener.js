import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';

const listeners = [];

const callbackFunction = (data) => {
    for (let i = 0, l = listeners.length; i < l; i++) {
        listeners[i](data);
    }
};

// Set the name of the hidden property and the change event for visibility
let hidden = '';
let visibilityChange = '';
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
}

function handleVisibilityChange(data) {
    const retVal = {'date': new Date().toISOString()};
    if (document[hidden]) {
        retVal.tappEvent = 1;
        retVal.data = {'tappEvent': 1};
    } else {
        retVal.tappEvent = 0;
        retVal.data = {'tappEvent': 0};
    }
    callbackFunction(retVal);
}

function _setOnActivateCallback(enabled) {
    const callbackName = 'setOnActivateCallback';

    return chaynsCall({
        'call': {
            'action': 60,
            'value': {
                'callback': enabled ? getCallbackName(callbackName) : undefined
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        'myChaynsApp': {
            'support': {'android': 6049, 'ios': 6034}
        },
        'web': {
            'fn': () => {
                if (enabled) {
                    document.addEventListener(visibilityChange, handleVisibilityChange, false);
                } else {
                    document.removeEventListener(visibilityChange, handleVisibilityChange, false);
                }
            }
        },
        callbackName,
        callbackFunction,
        'timeout': 0,
        'propTypes': {
            'callback': propTypes.string
        }
    });
}

export function addOnActivateListener(cb) {
    if (listeners.length === 0) {
        _setOnActivateCallback(true);
    }

    listeners.push(cb);
    return true;
}

export function removeOnActivateListener(cb) {
    let index = listeners.indexOf(cb);
    if (index !== -1) {
        listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
        _setOnActivateCallback(false);
    }

    return index !== -1;
}

export const tappEvent = {
    'ON_SHOW': 0,
    'ON_HIDE': 1,
    'ON_REFRESH': 2
};
