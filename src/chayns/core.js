import Config from './Config';
import { messageListener } from './callback';
import { getGlobalData } from './calls/getGlobalData';
import { setHeight } from './calls/setHeight';
import { environment, setEnv } from './environment';
import * as accordion from '../ui/accordion';
import * as autogrow from '../ui/autogrow';
import * as equalizer from '../ui/equalizer';
import * as finder from '../ui/finder';
import * as gallery from '../ui/gallery';
import * as tooltip from '../ui/tooltip';
import * as validate from '../ui/validate';
import * as slider from '../ui/slider';
import { getLogger } from '../utils/logger';
import DOM from '../utils/Dom';
import { isObject, isPresent, isNumber } from '../utils/is';
import { defer } from '../utils/defer';

const log = getLogger('chayns.core'),
	html = document.documentElement,
	prefix = Config.get('cssPrefix'),
	chaynsReadyDefer = defer();
export const ready = chaynsReadyDefer.promise;

/**
 * Run necessary operations to prepare chayns.
 *
 * @param {object} config Reference passed
 * @returns {undefined}
 */
export function register(config) {
	if (!isObject(config)) {
		throw new Error('Invalid config object');
	}

	log.info('chayns.register');
	Config.setConfig(config);
}

/**
 * Run necessary operations to prepare chayns.
 *
 * @returns {undefined}
 */
export function setup() {
	log.info('start chayns setup');

	// chayns is running
	html.classList.add('chayns');

	// add vendor classes (OS, Browser, ColorScheme) which is already in chayns.env
	html.classList.add(`${prefix}os--${environment.os}`);
	html.classList.add(`${prefix}browser--${environment.browser.name}`);

	// set color scheme from url parameter
	if (environment.site.colorScheme) {
		html.classList.add(`${prefix}color--${environment.site.colorScheme}`);
	}

	// DOM  ready promise
	// interactive can occur when chayns.js is dynamically loaded
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		domReadySetup();
	} else {
		const domReady = function domReady() {
			domReadySetup();
			window.removeEventListener('DOMContentLoaded', domReady, true);
		};
		window.addEventListener('DOMContentLoaded', domReady, true);
	}
}

/**
 * When the DOM is ready
 * Chayns sets all the default classes and receives App/Chayns Web Information
 *
 * @returns {undefined}
 */
function domReadySetup() {
	log.debug('DOM ready');

	// dom-ready class
	html.classList.add('dom-ready');

	// Environment
	if (environment.isChaynsWeb) {
		html.classList.add(`${prefix}-web`);
	}
	if (environment.isChaynsWebMobile) {
		html.classList.add(`${prefix}-mobile`);
	}
	if (environment.isChaynsWebDesktop || environment.isChaynsWebLight) {
		html.classList.add(`${prefix}-desktop`);
	}
	if (environment.isChaynsParent) {
		html.classList.add(`${prefix}-parent`);
	}
	if (environment.isApp) {
		html.classList.add(`${prefix}-app`);
	}
	if (environment.isInFrame) {
		html.classList.add(`${prefix}-frame`);
	}
	if(environment.isTablet){
		html.classList.add(`${prefix}-tablet`);
	}

	// start window.on('message') listener for iFrame communication
	messageListener();

	// wait for the ios javascript interface to be ready
	const shouldWait = environment.isIOS && (!window.webkit || !window.webkit.messageHandlers || !window.webkit.messageHandlers.jsonCall);

	setTimeout(() => {
		// get chayns data (either from Chayns Web (parent frame) or chayns app)
		// get the App Information
		getGlobalData()
			.then(chaynsReadySetup)
			.catch(() => {
				log.debug('Error: The App Information could not be received.');
				chaynsReadyDefer.reject('The App Information could not be received.');
			}).then(() => {
				accordion.init();
				equalizer.init();
				gallery.init();
				tooltip.init();
				finder.init();
				autogrow.init();
				validate.init();
				slider.init();
			});
	}, shouldWait ? 200 : 0);
}

/**
 * When Chayns has received data from Chayns Web or an Chayns App
 * The data is passed to this function
 *
 * @param {{}} data Global Data
 * @returns {undefined}
 */
function chaynsReadySetup(data) {
	// now Chayns is officially ready
	if (!data) {
		chaynsReadyDefer.reject(new Error('There is no app Data'));
		return;
	}

    if (environment.isChaynsWeb && environment.isInFrame || environment.isWidget) {
		resizeListener();
	}

	setupEnvironment(data);

	// add chayns root element
	// only used for popup fallback
	const chaynsRoot = document.createElement('div');
	chaynsRoot.setAttribute('id', `${prefix}root`);
	chaynsRoot.setAttribute('class', 'chayns__root');
	document.body.appendChild(chaynsRoot);

	// update colorScheme
	html.classList.add(`${prefix}color--${environment.site.colorScheme || 0}`);

	if (environment.site.tapp.isExclusiveView) {
		html.classList.add(`${prefix}-exclusive`);
	}

	if (isPresent(environment.site.colorMode)) {
		html.classList.add(`${prefix}color-mode--${environment.site.colorMode}`);
	}

	// chayns is ready
	html.classList.add(`${prefix}ready`);

	log.info('finished chayns setup');

	chaynsReadyDefer.resolve(data);

	// remove cloak to show content
	DOM.removeAttribute(document.querySelector('[chayns-cloak]'), 'chayns-cloak');
	DOM.removeClass(document.querySelector('.chayns-cloak'), 'chayns-cloak');
}

export function setupEnvironment(data) {
	// store received information
	let site = {'tapp': {}};
	if (isObject(data.AppInfo)) {
		const appInfo = data.AppInfo;
		let colorMode = isPresent(environment._parameters.colormode) ? (isNumber(parseInt(environment._parameters.colormode, 10)) ? parseInt(environment._parameters.colormode, 10) : undefined) : undefined;
		site = {
			'id': appInfo.SiteID,
			'locationId': appInfo.LocationID,
			'locationPersonId': appInfo.LocationPersonID,
			'title': appInfo.Title,
			'language':  appInfo.Language,
			'tapps': (appInfo.Tapps || []).map(parseTapp),
			'facebookAppId': appInfo.FacebookAppID,
			'facebookPageId': appInfo.FacebookPageID,
			'colorScheme': appInfo.ColorScheme || environment.site.colorScheme || 0,
			'color': appInfo.color || `#${environment.parameters.color}`,
			'colorMode': isPresent(colorMode) ? colorMode : parseInt(appInfo.colorMode, 10),
			'version': appInfo.Version,
			'domain': appInfo.domain,
			'tapp': {},
			'isArEnabled': appInfo.isArEnabled,
			'isAdEnabled': appInfo.isAdEnabled
		};

		if (appInfo.TappSelected) {
			site.tapp = parseTapp(appInfo.TappSelected);
            if(environment._parameters.parenttappid) {
                site.tapp.parent = { 'id': parseInt(environment._parameters.parenttappid, 10)};
            }
		}

		if (appInfo.CurrentUrl) {
			site.url = appInfo.CurrentUrl;
		}

		setEnv('isInFacebookFrame', !!appInfo.IsFacebookFrame);
	}
	site.tapp.id = parseInt(environment._parameters.tappid, 10);
	setEnv('site', site);

	let user = {};
	if (isObject(data.AppUser)) {
		const appUser = data.AppUser;

		user = {
			'name': appUser.FacebookUserName || '',
			'id': parseInt(appUser.TobitUserID, 10) || 0,
			'facebookId': appUser.FacebookID || '',
			'personId': appUser.PersonID || '',
			'tobitAccessToken': appUser.TobitAccessToken || '',
			'facebookAccessToken': appUser.FacebookAccessToken || '',
			'groups': (appUser.UACGroups || []).map(parseGroup),
			'isAuthenticated': !!(appUser.TobitAccessToken && appUser.TobitAccessToken.length > 0),
			'language': appUser.Language
		};
	}
	setEnv('user', user);

	let device = {},
		app = {};
	if (isObject(data.Device)) {
		const deviceData = data.Device;

		app = {
			'languageId': deviceData.LanguageID,
			'model': deviceData.Model,
			'name': deviceData.SystemName,
			'version': deviceData.SystemVersion,
			'uid': deviceData.UID,
			'flavor': data.AppInfo.AppFlavor
		};

		device = {
			'languageId': deviceData.LanguageID,
			'model': deviceData.Model,
			'uid': deviceData.UID,
			'systemName': deviceData.SystemName,
			'imei': deviceData.IMEI,
			'fontScale': deviceData.FontScale
		};
	}
	setEnv('app', app);
	setEnv('device', device);
}


/**
 * Resize Listener (Height check interval)
 * Checks each 200ms whether the window heights did change
 * and sends the new height to the parent frame window (Chayns Web)
 * in order that it can update the iframe height
 *
 * @returns {undefined}
 */
function resizeListener() {
	if (!Config.get('autoResize')) {
		return;
	}

	let heightCache;
	if (Config.get('initialHeight') > 0) {
		heightCache = Config.get('initialHeight');
		setHeight({
			'height': heightCache,
			'growOnly': false
		}); // default value is 500
	}

	const resizeHandler = function resizeHandler() {
		let requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
		if(requestAnimationFrame) {
			requestAnimationFrame(() => {
				if (heightCache === document.body.offsetHeight) {
					return;
				}

				log.debug('old height', heightCache, 'new height: ', document.body.offsetHeight);
				heightCache = document.body.offsetHeight;
				setHeight({
					'height': heightCache,
					'growOnly': false
				});
			});
		}
	};

	log.debug('start height observer interval');
	setInterval(resizeHandler, 200);
}

// parser methods
function parseGroup(group) {
	return group ? {
			'id': group.GroupID,
			'name': group.Name,
			'isSystemGroup': group.IsSystemGroup,
			'isActive': !!group.Active
		} : undefined;
}

function parseTapp(tapp) {
	return tapp ? {
			'id': tapp.TappID || tapp.Id,
			'showName': tapp.ShowName,
			'internalName': tapp.InternalName,
			'isExclusiveView': tapp.ExclusiveMode || tapp.isExclusiveView,
			'isKioskMode': tapp.isKioskMode,
			'isSubTapp': tapp.isSubTapp,
			'sortId': tapp.SortID,
			'userGroupIds': tapp.UserGroupIds || tapp.UACGroupIDs,
			'customUrl': tapp.customUrl,
        	'isHiddenFromMenu': tapp.HideFromMenu
    } : undefined;
}
