import {environment} from '../environment';
import {addWidthChangeListener} from './widthChangeListener';
import {isString} from '../../utils';
import {getWindowMetrics} from './getWindowMetrics';

const callbacks = {};

const setWidthVariable = (data) => {
    document.documentElement.style.setProperty('--width', data.width + 'px');
};

export function activateDynamicFontSize() {
    const callFrames = (width) => {
        document.querySelectorAll('iframe').forEach((iframe) => {
            if (callbacks[iframe.name]) {
                callbacks[iframe.name].forEach((callbackName) => {
                    let message = `chayns.${(!environment.isWidget ? 'customTab' : 'widget')}.jsoncall:`;
                    message += JSON.stringify({'callback': callbackName, 'retVal': {width}});
                    iframe.contentWindow.postMessage(message, '*');
                });
            }
        });
    };

    window.addEventListener('resize', (data) => {
        const width = data.target.innerWidth;
        callFrames(width);
        setWidthVariable({width});
    });

    const width = window.innerWidth;
    callFrames(width);
    setWidthVariable({width});
}

function dynamicFontSize() {
    if (environment.isInFrame) {
        addWidthChangeListener(setWidthVariable);
        getWindowMetrics().then((result) => {
            setWidthVariable({'width': result.windowWidth});
        });
    } else {
        window.addEventListener('message', (event) => {
            try {
                const data = event.data;

                if (!data || !isString(data)) {
                    return;
                }

                let callPrefix = data.split(':', 1);
                let prefixLength = callPrefix[0].length + 1; // also cut the first :
                let params = JSON.parse(data.substr(prefixLength, data.length - prefixLength));
                if (params.action === 237) {
                    const frameName = callPrefix[0].split('@')[1];
                    if (!callbacks[frameName]) {
                        callbacks[frameName] = [];
                    }
                    callbacks[frameName].push(params.value.callback);
                }
            } catch (ex) {
                log.warn(ex);
            }

        });
        activateDynamicFontSize();
    }
}

export {dynamicFontSize};
