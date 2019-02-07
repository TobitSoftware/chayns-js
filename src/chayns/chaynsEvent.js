import {isFunction, isString} from '../utils/is';
import {getLogger} from '../utils/logger';
import {isPermitted} from '../utils/isPermitted';
import {environment} from '../chayns/environment';

const log = getLogger('chayns.core.event');

export function addChaynsEventListener(obj) {
    if ((environment.isChaynsWeb && obj.web === false) || (environment.isApp && !isPermitted(obj.app))) {
        return Promise.reject('event not supported in this version');
    }

    const {callback, name, useCapture} = obj.event;
    if (!isFunction(callback) || !isString(name)) {
        return Promise.reject(new Error('invalid parameters'));
    }

    window.addEventListener(`chayns${name}`, callback, !!useCapture);

    log.debug(`chaynsEvent${name} listener added`);
    return Promise.resolve();
}
