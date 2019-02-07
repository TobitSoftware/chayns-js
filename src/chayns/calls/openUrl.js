import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';

export function openUrl(value) {
    const callbackName = 'openUrl';
    value.callback = getCallbackName(callbackName);

    return chaynsCall({
        'call': {
            'action': 31,
            value
        },
        'app': {
            'support': {'android': 4728, 'ios': 4301}
        },
        callbackName,
        'propTypes': {
            'url': propTypes.string.isRequired,
            'title': propTypes.string,
            'callback': propTypes.string.isRequired,
            'darkenBackground': propTypes.boolean,
            'fullSize': propTypes.boolean,
            'width': propTypes.number,
            'type': propTypes.number,
            'animation': propTypes.number,
            'exclusiveView': propTypes.boolean
        }
    }).then((data) => Promise.resolve(data.closeParam));
}

export const urlType = {
    'WEB': 0,
    'AR': 1
};

export const animationType = {
    'DEFAULT': 0,
    'BOTTOM': 1
};
