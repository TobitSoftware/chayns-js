import {buttonText, buttonType, dialogAction} from './chaynsDialog';
import {isArray} from '../../../utils/is';
import {isDialogPermitted} from '../../../utils/isPermitted';
import {open} from './open';
import {environment} from '../../environment';
import {login} from '../login';

export const fileType = {
    'IMAGE': 'image',
    'VIDEO': 'video',
    'AUDIO': 'audio',
    'DOCUMENT': [
        'application/x-latex',
        'application/x-tex',
        'text/',
        'application/json',
        'application/pdf',
        'application/msword',
        'application/msexcel',
        'application/mspowerpoint',
        'application/vnd.ms-word',
        'application/vnd.ms-excel',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument',
        'application/vnd.oasis.opendocument'
    ]
};

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
        if (!environment.user.isAuthenticated) {
            return login();
        }
        dialog.chaynsToken = environment.user.tobitAccessToken;
        return open(dialog);
    }
}
