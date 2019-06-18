import {buttonText, buttonType, dialogAction} from './chaynsDialog';
import {isArray} from '../../../utils/is';
import {isDialogPermitted} from '../../../utils/isPermitted';
import {open} from './open';

export function iFrame(dialog = {}) {
    const callbackName = 'iFrameCallback';

    if (!dialog.buttons || !isArray(dialog.buttons)) {
        dialog.buttons = [{
            'text': buttonText.YES,
            'buttonType': buttonType.POSITIVE
        }, {
            'text': buttonText.NO,
            'buttonType': buttonType.NEGATIVE
        }];
    }

    if(isDialogPermitted()) {
        dialog.callType = dialogAction.IFRAME;
        return open(dialog);
    }
}
