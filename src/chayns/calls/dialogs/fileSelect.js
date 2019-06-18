import {buttonText, buttonType, dialogAction} from './chaynsDialog';
import {isArray} from '../../../utils/is';
import {isDialogPermitted} from '../../../utils/isPermitted';
import {open} from './open';

export function fileSelect(dialog = {}) {
    const callbackName = 'fileSelectCallback';

    if (!dialog.buttons || !isArray(dialog.buttons)) {
        dialog.buttons = [];
        if (dialog.multiselect || dialog.directory) {
            dialog.buttons.push({
                'text': buttonText.OK,
                'buttonType': buttonType.POSITIVE
            });
        }
        dialog.buttons.push({
            'text': buttonText.CANCEL,
            'buttonType': buttonType.NEGATIVE
        });
    }

    if(isDialogPermitted()) {
        dialog.callType = dialogAction.FILE_SELECT;
        return open(dialog);
    }
}
