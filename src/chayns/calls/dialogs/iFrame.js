import {buttonText, buttonType, dialogAction} from './chaynsDialog';
import {isArray} from '../../../utils/is';
import {isDialogPermitted} from '../../../utils/isPermitted';
import {open} from './open';
import {addDialogDataListener, sendData} from './communication';
import {chaynsCall} from '../../chaynsCall';
import {getCallbackName} from '../../callback';
import {environment} from '../../environment';
import Config from '../../Config';

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

    dialog.tappIframeName = window.name;
    dialog.callType = dialogAction.IFRAME;
    dialog.url = `${dialog.url}${dialog.url.indexOf('?') >= 0 ? '&' : '?'}siteId=${environment.site.id}`;
    if (isDialogPermitted()) {
        addDialogDataListener(_chaynsCallResponder, true);
        return open(dialog);
    }
}

export function _chaynsCallResponder(obj) {
    if (obj.call.value.callback) {
        const call = JSON.parse(JSON.stringify(obj)); // deep copy
        if (!obj.call.value.callback.startsWith(`window.${Config.get('callbackPrefix')}`)) {
            obj.call.value.callback = getCallbackName(obj.call.value.callback);
        }
        chaynsCall(obj).then((result) => {
            sendData({result, call}, true);
        });
    } else {
        chaynsCall(obj);
    }
}
