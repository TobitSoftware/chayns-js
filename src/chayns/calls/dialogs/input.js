import {chaynsCall} from '../../chaynsCall';
import {getCallbackName} from '../../callback';
import {propTypes} from '../../propTypes';
import {buttonText, buttonType, dialogAction} from './chaynsDialog';
import {isArray} from '../../../utils/is';
import {isDialogPermitted} from '../../../utils/isPermitted';
import {open} from './open';

export function input(dialog) {
    const callbackName = 'inputCallback';

    if (!dialog.buttons || !isArray(dialog.buttons)) {
        dialog.buttons = [{
            'text': buttonText.YES,
            'buttonType': buttonType.POSITIVE
        }, {
            'text': buttonText.NO,
            'buttonType': buttonType.NEGATIVE
        }];
    }

    if (dialog.formatter) {
        dialog.formatter = dialog.formatter.toString();
    }

    if (isDialogPermitted()) {
        dialog.callType = dialogAction.INPUT;
        return open(dialog);
    }

    return chaynsCall({
        'call': {
            'action': 103,
            'value': {
                'callback': getCallbackName(callbackName),
                dialog
            }
        },
        'app': {
            'support': {'android': 5140, 'ios': 5148}
        },
        callbackName,
        'propTypes': {
            'callback': propTypes.string.isRequired,
            'dialog': propTypes.object.isRequired
        }
    });
}

export const inputType = {
    'DEFAULT': 0,
    'PASSWORD': 1,
    'TEXTAREA': 2,
    'INPUT': 3,
    'NUMBER': 4
};
