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

function setWaitCursor(enabled, text, timeout) {
    return chaynsCall({
        'call': {
            'action': 1,
            'value': {
                enabled,
                text,
                timeout
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
    return { 'applicationUid': undefined, 'useDevServer': false };
}

export function showWaitCursor(text, timeout, action) {
    if (typeof window !== 'undefined') {
        const { applicationUid, useDevServer } = getConfig();
        if (!startDate) {
            startDate = new Date();
            cursorUid = generateGuid();
        }
        appUid = applicationUid;
        currentText = text;
        currentAction = action;
        tappUrl = !appUid ? window.location.host + window.location.pathname : null;
        logTimeout = setTimeout(() => {
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
            sendWaitCursorLog(useDevServer, body);
        }, 1000);
    }
    return setWaitCursor(true, text, timeout);
}

export function hideWaitCursor() {
    if (typeof window !== 'undefined' && startDate) {
        clearTimeout(logTimeout);
        const { useDevServer } = getConfig();
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
    return setWaitCursor(false);
}
