import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

/**
 * This call will change temporary some design settings on your chanys site.
 * You can change the titleImage, the visibility, the siteIcon, an overlay for your titleImage, the background color.
 * <div>Call:101</div>
 * @example chayns.setTemporaryDesignSettings('titleImageVisability', false)
 * @example chayns.setTemporaryDesignSettings('titleImageUrl', '//images.tobit.com/locations/153008/38dd6dc9-b6b3-4d96-baaf-0bd66a96cc46.png')
 * @example chayns.setTemporaryDesignSettings('locationIcon', 'https://chayns.tobit.com/storage/60038-22141/Images/icon-72.png')
 * @example chayns.setTemporaryDesignSettings('imageOverlay', 'https://images.tobit.com/locations/1/Tapps/247353_Parallax.png?_=1527161393')
 * @example chayns.setTemporaryDesignSettings('backgroundColor', '#ff0000')
 * @param {string} component The element which should be updated.
 * @param param The value which should be used to update component.
 * @return {Promise} Do not listen to this promise, it returns you no information.
 */

export function setTemporaryDesignSettings(component, param) {
    const callbackName = 'setChaynsSettings';

    return chaynsCall({
        'call': {
            'action': 101,
            'value': {
                component,
                param
            }
        },
        'app': false,
        callbackName,
        'propTypes': {
            'component': propTypes.string.isRequired,
            'param': propTypes.oneOfType([
                propTypes.string,
                propTypes.object,
                propTypes.boolean
            ]).isRequired
        }
    });
}

/**
 * See setDesignSettings for the complete documentation.
 * @param {string} component The element which should be updated.
 * @param param The value which should be used to update component.
 * @return {Promise} Do not listen to this promise, it returns you no information.
 */
export function updateChaynsWeb(component, param) {
    return setTemporaryDesignSettings(component, param);
}

