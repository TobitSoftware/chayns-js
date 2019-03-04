import {buttonText, buttonType, dialogAction} from './chaynsDialog';
import {isArray} from '../../../utils/is';
import {isDialogPermitted} from '../../../utils/isPermitted';
import {open} from './open';

export function mediaSelect(dialog) {
    const callbackName = 'mediaSelectCallback';

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
        dialog.callType = dialogAction.MEDIA_SELECT;
        return open(dialog);
    }
}