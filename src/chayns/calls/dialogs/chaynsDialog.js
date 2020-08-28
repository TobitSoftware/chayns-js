import {chaynsCall} from '../../chaynsCall';
import {getCallbackName} from '../../callback';
import {propTypes} from '../../propTypes';
import {environment} from '../../environment';
import {isDialogPermitted} from '../../../utils/isPermitted';
import {open} from './open';
import Config from '../../Config';

export const buttonText = {
    'YES': {
        'de': 'Ja',
        'en': 'Yes',
        'nl': 'Ja'
    }[environment.language] || 'Yes',
    'NO': {
        'de': 'Nein',
        'en': 'No',
        'nl': 'Nee'
    }[environment.language] || 'No',
    'OK': 'OK',
    'CANCEL': {
        'de': 'Abbrechen',
        'en': 'Cancel',
        'nl': 'Annuleren'
    }[environment.language] || 'Cancel'
};

export const buttonType = {
    'CANCEL': -1,
    'NEGATIVE': 0,
    'POSITIVE': 1
};

export const dialogAction = {
    'ALERT_CONFIRM': 178,
    'INPUT': 173,
    'SELECT': 174,
    'DATE': 175,
    'ADVANCED_DATE': 176,
    'DROP_UP_ALERT': 177,
    'MEDIA_SELECT': 179,
    'FILE_SELECT': 180,
    'IFRAME': 191
};

export function chaynsDialog(config) {
    const callbackName = 'chaynsDialog';

    config.callback = getCallbackName(callbackName);

    if (isDialogPermitted()) {
        if (config.dialog) {
            config.dialog.callType = dialogAction.ALERT_CONFIRM;
            return open(config.dialog).then((data) => Promise.resolve(data.buttonType));
        }
        const externalDialogUrl = Config.get('externalDialogUrl');
        if (externalDialogUrl) {
            config.externalDialogUrl = externalDialogUrl + '?OS=' + environment.os + '&color=' + environment.site.color + '&font=' + environment.site.font + '&colormode=' + environment.site.colorMode + '&lang=' + environment.site.language + '&siteId=' + environment.site.id + '&AppVersion=' + environment.appVersion;
        }
        Promise.reject('Dialog object is invalid and not supported');
    } else {
        return chaynsCall({
            'call': {
                'action': 16,
                'value': config
            },
            'app': {
                'support': {'android': 4794, 'ios': 4301}
            },
            callbackName,
            'propTypes': {
                'callback': propTypes.string.isRequired,
                'dialog': propTypes.object.isRequired
            }
        }).then((data) => Promise.resolve(data.buttonType));
    }
}
