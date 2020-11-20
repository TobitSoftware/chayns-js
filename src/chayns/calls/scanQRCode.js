import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';
import {isObject} from '../../utils';

function qrCode(cancel, cameraType, timeout, {
    dialogTitle, dialogSubtitle, enableFlashToggle, enableCameraSwitch, ccAnimation, geoLocation, showInput, codeType
} = {}) {
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
                dialogSubtitle,
                'dialogSubitle': dialogSubtitle, // Remove until android app typo is fixed
                enableFlashToggle,
                enableCameraSwitch,
                ccAnimation,
                geoLocation,
                showInput,
                codeType
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        'web': true,
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

export function scanQRCode(cameraType, timeout, config = {}, dialogSubtitle = undefined) {
    if (isObject(config)) {
        return qrCode(false, cameraType, timeout, config);
    }
    return qrCode(false, cameraType, timeout, { 'dialogTitle': config, dialogSubtitle});
}

export function cancelScanQrCode() {
    return qrCode(true);
}

export const cameryType = {
    'AUTO': 0,
    'BACK': 1,
    'FRONT': 2
};
