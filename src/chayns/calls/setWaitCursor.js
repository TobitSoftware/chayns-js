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

export function showWaitCursor(text, timeout, action) {
    if (typeof window !== 'undefined' && window.chaynsLoggerConfigs) {
        const config = window.chaynsLoggerConfigs[0];
        if (config) {
            if (!startDate) {
                startDate = new Date();
                cursorUid = generateGuid();
            }
            appUid = config.applicationUid;
            currentText = text;
            currentAction = action;
            logTimeout = setTimeout(() => {
                const body = {
                    appUid,
                    'startTime': startDate.toISOString(),
                    'message': currentText || null,
                    'tappId': chayns.env.site.tapp.id,
                    'siteId': chayns.env.site.id,
                    action,
                    cursorUid
                };
                sendWaitCursorLog(config.useDevServer, body);
            }, 1000);
        }
    }
    return setWaitCursor(true, text, timeout);
}

export function hideWaitCursor() {
    if (typeof window !== 'undefined' && window.chaynsLoggerConfigs && startDate) {
        clearTimeout(logTimeout);
        const config = window.chaynsLoggerConfigs[0];
        if (config) {
            const body = {
                appUid,
                'startTime': startDate.toISOString(),
                'endTime': new Date().toISOString(),
                'message': currentText || null,
                'tappId': chayns.env.site.tapp.id,
                'siteId': chayns.env.site.id,
                'action': currentAction,
                cursorUid
            };
            sendWaitCursorLog(config.useDevServer, body);
            startDate = undefined;
            appUid = undefined;
            currentText = undefined;
            cursorUid = undefined;
            currentAction = undefined;
        }
    }
    return setWaitCursor(false);
}
