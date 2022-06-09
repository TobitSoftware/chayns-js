const userAgent = (window.navigator && navigator.userAgent) || '',
    INTERNAL_PARAMETERS = [
        'appversion',
        'os',
        'tappid'
    ],
    parameters = {},
    publicParameters = {},
    query = (window.chaynsParameters || location.search).substr(1);

const
    isIOS = (/iPhone|iPad|iPod/i).test(userAgent),
    isMyChaynsApp = navigator.userAgent.toLowerCase().indexOf('mychayns') >= 0 && (!isIOS || navigator.userAgent.toLowerCase().indexOf('web;') >= 0);
let myChaynsAppVersion = isMyChaynsApp ? navigator.userAgent.match(/(mychayns\/)(\d+\.?\d*)/i)[2].replace('.', '') : null;
myChaynsAppVersion = myChaynsAppVersion ? parseInt(myChaynsAppVersion, 10) : undefined;

try {
    new URLSearchParams(query).forEach((value, key) => {
        if (INTERNAL_PARAMETERS.indexOf(key.toLowerCase()) === -1) {
            publicParameters[key] = value;
        }
        parameters[key.toLowerCase()] = value.toLowerCase();
    });
} catch(e) {
    console.error('error on parsing search params', e);
}

const isMobileMediaQuery = matchMedia('screen and (max-width: 850px), (max-width: 1000px) and (max-height: 400px)');

const
    isDface = (/dface|h96pp|h96max|jabiru|chaynsterminal|wayter|odroidn2p/i).test(navigator.userAgent),
    isApp = (!isMyChaynsApp && ['android', 'ios', 'wp'].indexOf(parameters.os) > -1 && navigator.userAgent.toLowerCase().indexOf('chayns') >= 0) || isDface,
    isDavidClientApp = (/((mychayns)(.)*(77892-10814))/i).test(navigator.userAgent),
    isMobile = parameters.os === 'webshadowmobile' || ((window.self === window.top || (parameters.os === 'chaynsnet-runtime' && !parameters.davidclient)) ? isMobileMediaQuery.matches : (/(?!.*ipad)^.*(iphone|ipod|((?:android)?.*?mobile)|blackberry|nokia)/i).test(userAgent) || ((/android/i).test(userAgent) && isMobileMediaQuery.matches)), // Temporary workaround for intercom in david
    isTablet = (/(ipad|android(?!.*mobile)|nexus 7)/i).test(userAgent) && !(/android.*mobile/i).test(userAgent),
    isChaynsParent = window.self === window.top || !!(window.cwInfo && (window.name === 'mobileView' || parameters.forcechaynsparent === '1')),
    isChaynsnetRuntime = parameters.os === 'webshadowlight' || parameters.os === 'chaynsnet-runtime' || (window.chaynsInfo && window.chaynsInfo.isChaynsnetRuntime),
    isChaynsWebMobile = !isApp && isMobile,
    isChaynsWebDesktop = !isApp && (!isMobile || parameters.os === 'webshadow'),
    isLocationApp = isMyChaynsApp && !isDavidClientApp && !(/((mychayns)(.)*(60021-08989))/i).test(navigator.userAgent),
    isSTB = (/h96pp|h96max|odroidn2p/i).test(navigator.userAgent),
    isWidget = publicParameters.isWidget === 'true';

if (isChaynsParent || (parameters.os === 'chaynsnet-runtime' && !parameters.davidclient)) {
    isMobileMediaQuery.addEventListener('change', (ev) => {
        environment.isMobile = ev.matches;
        environment.isDesktop = !ev.matches;
        environment.isTablet = !ev.matches;
        document.documentElement.classList.add(ev.matches ? 'chayns--mobile' : 'chayns--tablet');
        document.documentElement.classList.remove(!ev.matches ? 'chayns--mobile' : 'chayns--tablet');
        document.documentElement.classList[ev.matches ? 'remove' : 'add']('chayns--desktop');
    });
}

export let environment = {
    'parameters': publicParameters,
    '_parameters': parameters,
    'browser': getBrowserInfo(),
    'language': parameters.lang || (navigator.languages && navigator.languages.length > 0 ? navigator.languages[0] : (navigator.language || navigator.userLanguage)).substring(0, 2),
    'site': {},
    'user': {},
    'app': {},
    'device': {},
    'isIOS': isIOS,
    'isAndroid': (/Android/i).test(userAgent),
    'isWP': (/windows phone/i).test(userAgent),
    'isMobile': isMobile,
    'isTablet': isTablet,
    'isApp': isApp,
    'isBrowser': !isApp,
    'isDesktop': !isMobile,
    'os': parameters.os || 'noOS',
    'isChaynsnetRuntime': isChaynsnetRuntime,
    'isChaynsWebMobile': isChaynsWebMobile,
    'isChaynsWebDesktop': isChaynsWebDesktop,
    'isChaynsWeb': isChaynsWebMobile || isChaynsWebDesktop || isChaynsnetRuntime,
    'isChaynsParent': isChaynsParent,
    'isChaynsDe': !isApp && !!(window.ChaynsInfo && window.ChaynsInfo.LocationID === 378),
    'isMyChaynsApp': isMyChaynsApp,
    'isLocationApp': isLocationApp,
    'isSTB': isSTB,
    'isWidget': isWidget,
    'isInFrame': window.self !== window.top && !(window.cwInfo && (window.name === 'mobileView' || window.name === 'davidSmartClient')),
    'isInFacebookFrame': false,
    'appVersion': window.cwInfo ? parseFloat(window.cwInfo.version) : parseFloat(parameters.appversion),
    'myChaynsAppVersion': myChaynsAppVersion,
    'debugMode': !!parameters.debug,
    'apiVersion': 4000
};

export function setEnv(env) {
    for (let prop in env) {
        if (env.hasOwnProperty(prop)) {
            environment[prop] = env[prop];
        }
    }
}

function getBrowserInfo() {
    let temp = null,
        matches = userAgent.match(/(opera|chrome|safari|firefox|msie|trident|edge(?=\/))\/?\s*(\d+)/i) || [];

    if ((/trident/i).test(matches[1])) {
        temp = (/\brv[ :]+(\d+)/g).exec(userAgent) || [];
        return {
            'name': 'ie',
            'version': temp[1] || '-1',
            'supportsWebP': false
        };
    }

    const canvas = typeof document === 'object' ? document.createElement('canvas') : {};
    canvas.width = 1;
    canvas.height = 1;
    const supportsWebP = canvas.toDataURL ? canvas.toDataURL('image/webp').indexOf('image/webp') === 5 : false;

    if (matches[1] === 'Chrome') {
        temp = userAgent.match(/\bOPR\/(\d+)/);
        if (temp) {
            return {
                'name': 'opera',
                'version': temp[1] || '-1',
                'supportsWebP': supportsWebP
            };
        }

        temp = userAgent.match(/(edge|edg(?=\/))\/?\s*(\d+)/i);
        if (temp) {
            return {
                'name': 'edge',
                'version': temp[2] || '-1',
                'supportsWebP': supportsWebP
            };
        }
    }

    matches = matches[2] ? [matches[1], matches[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((temp = userAgent.match(/version\/(\d+)/i)) && matches[0] !== 'Chrome') {
        matches.splice(1, 1, temp[1]);
    }

    matches[0] = matches[0].toLowerCase();
    if (matches[0].indexOf('msie') > -1) {
        matches[0] = 'ie';
    }


    return {
        'name': matches[0],
        'version': matches[1] || '-1',
        'supportsWebP': supportsWebP
    };
}
