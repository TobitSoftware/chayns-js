import {buttonText, buttonType, dialogAction} from './chaynsDialog';
import {isArray} from '../../../utils/is';
import {isDialogPermitted} from '../../../utils/isPermitted';
import {open} from './open';

export function signature(dialog = {}) {
    const callbackName = 'signatureCallback';

    if (!dialog.buttons || !isArray(dialog.buttons)) {
        dialog.buttons = [];
        dialog.buttons.push({
            'text': buttonText.OK,
            'buttonType': buttonType.POSITIVE
        });
        dialog.buttons.push({
            'text': buttonText.CANCEL,
            'buttonType': buttonType.NEGATIVE
        });
    }

    if(isDialogPermitted()) {
        dialog.callType = dialogAction.SIGNATURE;

        return open(dialog);
    }
}
