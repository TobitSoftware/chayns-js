
import {open} from './open';
import {dialogAction} from './chaynsDialog';
import {isDialogPermitted} from '../../../utils/isPermitted';

export function dropUpAlert(dialog) {
    if(!isDialogPermitted()) {
        Promise.reject('This dialog is only available if you set apiDialogs in chayns.register');
    }
    dialog.callType = dialogAction.DROP_UP_ALERT;
    return open(dialog);
}
