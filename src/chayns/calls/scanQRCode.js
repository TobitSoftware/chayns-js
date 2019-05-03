import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';

function qrCode(cancel, cameraType, timeout, dialogTitle, dialogSubtitle) {
    const callbackName = 'scanQRCode';

    return chaynsCall({
        'call': {
            'action': 34,
            'value': {
                'callback': getCallbackName(callbackName),
                cameraType,
                timeout,
                cancel,
                dialogTitle,
                dialogSubtitle
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        'web': false,
        'myChaynsApp': {
            'support': {'android': 5683, 'ios': 5764}
        },

        callbackName,
        'propTypes': {
            'callback': propTypes.string.isRequired,
            'cameraType': propTypes.number,
            'timeout': propTypes.number,
            'dialogTitle': propTypes.string,
            'dialogSubtitle': propTypes.string
        }
    }).then((data) => Promise.resolve(data.qrCode));
}

export function scanQRCode(cameraType, timeout, dialogTitle, dialogSubtitle) {
    return qrCode(false, cameraType, timeout, dialogTitle, dialogSubtitle);
}

export function cancelScanQrCode() {
    return qrCode(true);
}

export const cameryType = {
    'AUTO': 0,
    'BACK': 1,
    'FRONT': 2
};
