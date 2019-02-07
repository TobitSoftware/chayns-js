import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';

/**
 *This call will show or hide an overlay.
 * @since App not supported, Web supported
 * @param {boolean} enabled  true -will show the overlay, false -will hide the overlay.
 * @param {string} color  Use an hexCode to define the color of the overlay.
 * @param {number} transition  Duration that the overlay should be animated to show ore hide the overlay.
 * @param {number} mode  0 -The overlay will be shown over whole side. 1 -The Tapp(TM) will be excluded from overlay.
 * @return {Promise}
 */
function setOverlay(enabled, color, transition, mode) {
    const callbackName = 'showOverlay';

    return chaynsCall({
        'call': {
            'action': 116,
            'value': {
                'callback': getCallbackName(callbackName),
                enabled,
                color,
                transition,
                mode
            }
        },
        'app': false,
        callbackName,
        'propTypes': {
            'enabled': propTypes.boolean.isRequired,
            'callback': propTypes.string.isRequired,
            'color': propTypes.string,
            'transition': propTypes.string
        }
    });
}

/**
 * Call to show the overlay.
 * @param {string} color
 * @param {number} transition
 * @param {number} mode
 * @return {*}
 */
export function showOverlay(color, transition, mode) {
    return setOverlay(true, color, transition, mode);
}

/**
 * Call to hide the overlay
 * @param {number} transition
 * @return {*}
 */
export function hideOverlay(transition) {
    return setOverlay(false, undefined, transition, 0);
}
