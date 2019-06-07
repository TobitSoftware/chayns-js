import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';
import {environment} from '../environment';

const listeners = [];

export function getWindowMetrics() {
    const callbackName = 'getWindowMetrics';

    return chaynsCall({
        'call': {
            'action': 78,
            'value': {
                'callback': getCallbackName(callbackName)
            }
        },
        // 'app': {
        //     'support': {'android': 5423, 'ios': 5420}
        // },
        'app': {
            'fn': () => Promise.resolve({
                'AvailHeight': document.body.clientHeight,
                'pageYOffset': window.pageYOffset,
                'WindowInnerHeight': window.screen.availHeight,
                'WindowScrollTop': document.body.scrollTop
            })
        },
        callbackName,
        'propTypes': {
            'callback': propTypes.string.isRequired
        }
    }).then((data) => Promise.resolve({
        'height': data.AvailHeight,
        'scrollTop': data.WindowScrollTop,
        'windowHeight': data.WindowInnerHeight,
        'pageYOffset': data.pageYOffset,
        'frameX': data.frameX,
        'frameY': data.frameY
    }));
}

let cooldown = false;
let changed = false;

function cooldownFunction() {
    cooldown = false;
    if (changed) {
        changed = false;
        _getWindowMetricsCallback();
    }
}

async function _getWindowMetricsCallback() {

    if (!cooldown) {
        cooldown = true;
        setTimeout(cooldownFunction, 1);

        let usableHeight = 0;

        if (environment.isChaynsWeb && !environment.isWidget) {
            const {windowHeight} = await chayns.getWindowMetrics();

            usableHeight = windowHeight;

            if (!environment.isChaynsnetRuntime) {
                if (environment.isMobile) {
                    usableHeight -= 45;
                } else {
                    usableHeight -= 85;
                }
            } else {
                usableHeight -= 8;
            }
        } else {
            const {innerHeight} = window;

            usableHeight = innerHeight;

            if (environment.isAndroid) {
                const bodyPaddingTop = document.body.style.paddingTop;
                const paddingTop = parseInt(bodyPaddingTop, 10);

                if (paddingTop && !Number.isNaN(paddingTop)) {
                    usableHeight -= paddingTop;
                }
            } else if (environment.isIOS && environment.appVersion < 6028) {
                const isIPhoneX = screen.width === 375 && screen.height === 812 && window.devicePixelRatio === 3;
                const isIPhoneXR = screen.width === 414 && screen.height === 896 && window.devicePixelRatio === 2;
                const isIPhoneXS = screen.width === 414 && screen.height === 896 && window.devicePixelRatio === 3;
                const hasNotch = isIPhoneX || isIPhoneXR || isIPhoneXS;
                if (hasNotch) {
                    usableHeight -= 83;
                } else {
                    usableHeight -= 49;
                }
            }
        }

        // Temporary fix for chayns.de site
        if (environment.site.locationId === 378 && environment.isChaynsnetRuntime) {
            usableHeight -= 55;
        }

        const {tappPaddingTop, tappPaddingBottom} = getTappInformation();

        if (!environment.isMobile) {
            const verticalTappPadding = tappPaddingTop + tappPaddingBottom;

            usableHeight -= verticalTappPadding;
        }

        listeners.forEach((listener) => {
            listener(usableHeight);
        });
    } else {
        changed = true;
    }
}

const getTappInformation = () => {
    const tappElement = document.querySelector('.tapp');

    let tappPaddingBottom = 0;
    let tappPaddingRight = 0;
    let tappPaddingLeft = 0;
    let tappPaddingTop = 0;
    let tappHeight = 0;
    let tappWidth = 0;

    if (tappElement) {
        const computedStyle = window.getComputedStyle(tappElement, null);

        const paddingBottomString = computedStyle.getPropertyValue('padding-bottom');
        const paddingRightString = computedStyle.getPropertyValue('padding-right');
        const paddingLeftString = computedStyle.getPropertyValue('padding-left');
        const paddingTopString = computedStyle.getPropertyValue('padding-top');
        const heightString = computedStyle.getPropertyValue('height');
        const widthString = computedStyle.getPropertyValue('width');

        tappPaddingBottom = parseInt(paddingBottomString, 10);
        tappPaddingRight = parseInt(paddingRightString, 10);
        tappPaddingLeft = parseInt(paddingLeftString, 10);
        tappPaddingTop = parseInt(paddingTopString, 10);
        tappHeight = parseInt(heightString, 10);
        tappWidth = parseInt(widthString, 10);
    }

    return {
        tappPaddingBottom,
        tappPaddingRight,
        tappPaddingLeft,
        tappPaddingTop,
        tappHeight,
        tappWidth
    };
};


export function addWindowMetricsListener(cb, startCall = false) {
    if (listeners.length === 0) {
        window.addEventListener('resize', _getWindowMetricsCallback);
    }

    listeners.push(cb);

    if (startCall) {
        _getWindowMetricsCallback();
    }
}

export function removeWindowMetricsListener(cb) {
    let index = listeners.indexOf(cb);
    if (index !== -1) {
        listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
        window.addEventListener('resize', _getWindowMetricsCallback);
    }

    return index !== -1;
}
