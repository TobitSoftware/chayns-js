import {buttonText, buttonType, dialogAction} from './chaynsDialog';
import {isArray} from '../../../utils/is';
import {isDialogPermitted} from '../../../utils/isPermitted';
import {open} from './open';
import {environment} from '../../environment';
import {login} from '../login';

export function mediaSelect(dialog = {}) {
    const callbackName = 'mediaSelectCallback';

    if (!dialog.buttons || !isArray(dialog.buttons)) {
        dialog.buttons = [{
            'text': buttonText.OK,
            'buttonType': buttonType.POSITIVE
        }, {
            'text': buttonText.CANCEL,
            'buttonType': buttonType.NEGATIVE
        }];
    }

    if (isDialogPermitted()) {
        dialog.callType = dialogAction.MEDIA_SELECT;
        if (!environment.user.isAuthenticated) {
            return login();
        }
        dialog.chaynsToken = environment.user.tobitAccessToken;
        return open(dialog);

    }
}
