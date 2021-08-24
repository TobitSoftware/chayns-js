import generateGuid from '../../utils/generateGuid';
import sendWaitCursorLog from '../../utils/sendWaitCursorLog';
import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

let appUid;
let cursorUid;
let startDate;
let logTimeout;
let currentText;
let currentAction;
let tappUrl;

function setWaitCursor({enabled, text, timeout, progress, progressText, disappearTimeout}) {
    return chaynsCall({
        'call': {
            'action': 1,
            'value': {
                enabled,
                text,
                timeout,
                progress,
                progressText,
                disappearTimeout
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        'propTypes': {
            'enabled': propTypes.boolean.isRequired,
            'text': propTypes.string,
            'timeout': propTypes.number
        }
    });
}

function getConfig() {
    if (window.chaynsLoggerConfigs && window.chaynsLoggerConfigs.length > 0) {
        return window.chaynsLoggerConfigs[0];
    }
    return {'applicationUid': undefined, 'useDevServer': false};
}

export function showWaitCursor(text, timeout, action, {progress, progressText} = {}) {
    let validatedProgress = progress;
    if (progress < 0) {
        validatedProgress = 0;
    } else if (progress > 100) {
        validatedProgress = 100;
    }
    try {
        if (typeof window !== 'undefined') {
            const {applicationUid, useDevServer} = getConfig();
            if (!startDate) {
                startDate = new Date();
                cursorUid = generateGuid();
            }
            appUid = applicationUid;
            currentText = text;
            currentAction = action;
            tappUrl = !appUid ? window.location.host + window.location.pathname : null;
            const body = {
                appUid,
                'startTime': startDate.toISOString(),
                'message': currentText || null,
                'tappId': chayns.env.site.tapp.id,
                'siteId': chayns.env.site.id,
                action,
                cursorUid,
                tappUrl
            };
            logTimeout = setTimeout(() => {
                sendWaitCursorLog(useDevServer, body);
            }, 1000);
        }
    } catch (e) {
        console.error(e);
    }
    return setWaitCursor({'enabled': true, text, timeout, 'progress': validatedProgress, progressText});
}

export function hideWaitCursor(disappearTimeout = 200) {
    let validatedDisappearTimeout = disappearTimeout;
    if (disappearTimeout < 0) {
        validatedDisappearTimeout = 0;
    } else if (disappearTimeout > 3000) {
        validatedDisappearTimeout = 3000;
    }
    try {
        if (typeof window !== 'undefined' && startDate) {
            clearTimeout(logTimeout);
            const {useDevServer} = getConfig();
            const body = {
                appUid,
                'startTime': startDate.toISOString(),
                'endTime': new Date().toISOString(),
                'message': currentText || null,
                'tappId': chayns.env.site.tapp.id,
                'siteId': chayns.env.site.id,
                'action': currentAction,
                cursorUid,
                tappUrl
            };
            sendWaitCursorLog(useDevServer, body);
            startDate = undefined;
            appUid = undefined;
            currentText = undefined;
            cursorUid = undefined;
            currentAction = undefined;
            tappUrl = undefined;
        }
    } catch (e) {
        console.error(e);
    }

    return setWaitCursor({'enabled': false, 'disappearTimeout': validatedDisappearTimeout});
}
