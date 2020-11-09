import {buttonText, buttonType, chaynsDialog} from './chaynsDialog';
import {isArray} from '../../../utils/is';

export function confirm(title = '', message = '', config = {}) {
    // backward compatibility
    if (isArray(config)) {
        config = {
            'buttons': config
        };
    }
    if (!config.buttons || !isArray(config.buttons)) {
        config.buttons = [{
            'text': buttonText.YES,
            'buttonType': buttonType.POSITIVE
        }, {
            'text': buttonText.NO,
            'buttonType': buttonType.NEGATIVE
        }];
    }

    return chaynsDialog({
        'dialog': {
            title,
            message,
            'buttons': config.buttons,
            'select': config.select
        }
    });
}
