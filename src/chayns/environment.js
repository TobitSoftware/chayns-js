
const userAgent = (window.navigator && navigator.userAgent) || '',
	chaynsInfo = window.ChaynsInfo,
	INTERNAL_PARAMETERS = [
		'appversion',
		'os',
		'tappid',
		'colorscheme'
	],
	parameters = {},
	publicParameters = {},
	query = location.search.substr(1).split('&');

if (query[0] !== '') {
	for (let i = 0, l = query.length; i < l; i++) {
		const item = query[i].split('=');
		const key = item[0],
			value = decodeURIComponent(item[1]);

		if (INTERNAL_PARAMETERS.indexOf(key.toLowerCase()) === -1) {
			publicParameters[key] = value;
		}

		parameters[key.toLowerCase()] = value.toLowerCase();
	}
}

const isApp = ['android', 'ios', 'wp'].indexOf(parameters.os) > -1,
	isMobile = (/(iphone|ipod|((?:android)?.*?mobile)|blackberry|nokia)/i).test(userAgent),
	isTablet = (/(ipad|android(?!.*mobile)|nexus 7)/i).test(userAgent),
	isChaynsWebLight = parameters.os === 'webshadowlight',
	isChaynsWebMobile = chaynsInfo ? chaynsInfo.IsMobile : parameters.os === 'webshadowmobile',
	isChaynsWebDesktop = chaynsInfo ? !chaynsInfo.IsMobile : parameters.os === 'webshadow',
	isWidget = publicParameters.isWidget === 'true';

export const environment = {
	'parameters': publicParameters,
	'_parameters': parameters,
	'browser': getBrowserInfo(),
	'language': parameters.lang || (navigator.languages && navigator.languages.length > 0 ? navigator.languages[0] : (navigator.language || navigator.userLanguage)).substring(0, 2),
	'site': {
		'colorScheme': parameters.colorscheme || (chaynsInfo ? chaynsInfo.ColorScheme.ID : 0)
	},
	'user': {},
	'app': {},
	'device': {},
	'isIOS': (/iPhone|iPad|iPod/i).test(userAgent),
	'isAndroid': (/Android/i).test(userAgent),
	'isWP': (/windows phone/i).test(userAgent),
	'isMobile': isMobile,
	'isTablet': isTablet,
	'isApp': isApp,
	'isBrowser': !isApp,
	'isDesktop': !isMobile && !isTablet,
	'os': parameters.os || 'noOS',
	'isChaynsWebLight': isChaynsWebLight,
	'isChaynsWebMobile': isChaynsWebMobile,
	'isChaynsWebDesktop': isChaynsWebDesktop,
	'isChaynsWeb': isChaynsWebMobile || isChaynsWebDesktop || isChaynsWebLight,
	'isChaynsParent': !!chaynsInfo && window === window.top,
	'isWidget': isWidget,
	'isInFrame': (window !== window.top),
	'isInFacebookFrame': false,
	'appVersion': parseInt(parameters.appversion, 10),
	'debugMode': !!parameters.debug,
	'apiVersion': 3100
};

export function setEnv(key, value) {
	environment[key] = value;
}

function getBrowserInfo() {
	let temp = null,
		matches = userAgent.match(/(opera|chrome|safari|firefox|msie|trident|edge(?=\/))\/?\s*(\d+)/i) || [];

	if (/trident/i.test(matches[1])) {
		temp = (/\brv[ :]+(\d+)/g).exec(userAgent) || [];
		return {
			'name': 'ie',
			'version': temp[1] || '-1'
		};
	}

	if (matches[1] === 'Chrome') {
		temp = userAgent.match(/\bOPR\/(\d+)/);
		if (temp) {
			return {
				'name': 'opera',
				'version': temp[1] || '-1'
			};
		}

		temp = userAgent.match(/(edge(?=\/))\/?\s*(\d+)/i);
		if (temp) {
			return {
				'name': 'edge',
				'version': temp[2] || '-1'
			};
		}
	}

	matches = matches[2] ? [matches[1], matches[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((temp = userAgent.match(/version\/(\d+)/i))) {
		matches.splice(1, 1, temp[1]);
	}

	matches[0] = matches[0].toLowerCase();
	if (matches[0].indexOf('msie') > -1) {
		matches[0] = 'ie';
	}

	return {
		'name': matches[0],
		'version': matches[1] || '-1'
	};
}
