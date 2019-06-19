import {chaynsCall} from '../../chaynsCall';
import {getCallbackName} from '../../callback';
import {propTypes} from '../../propTypes';
import {isArray, isDate, isNumber, isObject} from '../../../utils/is';
import {environment} from '../../environment';
import {isDialogPermitted} from '../../../utils/isPermitted';
import {buttonText, buttonType, dialogAction} from './chaynsDialog';
import {open} from './open';

/**
 * The config object for date dialog
 * @typedef {Object} dateConfig
 * @property {Date} preSelect  - The date object which should be preselected.
 * @property {Date} minDate   - The min date which you could select.
 * @property {Date} maxDate  - The max date which you could select.
 * @property {dateDialogType} dateType  - The type of dialog you want to display.
 * @property {number} minuteIntervall - The interval for special minutes, possible are 2, 3, 4, 5, 6, 12, 15, 20, 30. Default is 1.
 * @property {string} message - The message that is displayed above the date dialog, only in apps supported
 * @property {string} title - The title that is displayed above the message, only in apps supported
 */

/**
 * This call will open a date select dialog.
 * <div>Call: 30</div>
 * @param {dateConfig} config - Define the configuration of this call
 * @return {Promise} contains a timestamp as result
 * @example chayns.dialog.date({
 *  'dateType': chayns.dialog.dateType.DATE_TIME,
 *  'preSelect': new Date(2018, 6, 14, 0, 0, 0),
 *  'minDate':  new Date(2018, 6, 1, 15, 0, 0),
 *  'maxDate': new Date(2019, 6, 1, 0, 23, 0),
 *  'minuteInterval': 15
 * ).then(function (data) {
 *  console.log(data);
 * });
 */

export function date(config = {}) {
    const callbackName = 'date';
    let {preSelect, minDate, maxDate, title, message, minuteInterval} = config,
        type = config.dateType || dateType.DATE;

    // This will fix the iOS problem with not preselectedDate without user interaction. That it return the wrog time.
    if (minuteInterval && minuteInterval > 1 && environment.isIOS && environment.isApp) {
        preSelect = roundInterval(preSelect, minuteInterval);
    } else {
        preSelect = validateValue(preSelect);
    }
    minDate = validateValue(minDate);
    maxDate = validateValue(maxDate);

    if (isDialogPermitted()) {
        let buttons = [];
        buttons = [{
            'text': buttonText.OK,
            'buttonType': buttonType.POSITIVE
        }];
        return open({
            'callType': dialogAction.DATE,
            type,
            'selectedDate': preSelect,
            minDate,
            maxDate,
            title,
            message,
            buttons,
            minuteInterval
        }).then((data) => {
            return Promise.resolve(data.selectedDate);
        });
    }

    return chaynsCall({
        'call': {
            'action': 30,
            'value': {
                'callback': getCallbackName(callbackName),
                type,
                'selectedDate': preSelect,
                minDate,
                maxDate,
                title,
                message,
                minuteInterval
            }
        },
        'app': {
            'support': {'android': 4732, 'ios': 4301}
        },
        callbackName,
        'propTypes': {
            'callback': propTypes.string.isRequired,
            'type': propTypes.number.isRequired,
            'selectedDate': propTypes.date.isRequired,
            'minDate': propTypes.date.isRequired,
            'maxDate': propTypes.date.isRequired,
            'text': propTypes.string,
            'message': propTypes.string
        }
    }).then((data) => Promise.resolve(data.selectedDate));
}

export function advancedDate(config = {}) {
    let {preSelect, minDate, maxDate, title, message, minuteInterval, buttons, multiselect, disabledDates, textBlocks, monthSelect, yearSelect, interval, maxInterval, minInterval} = config, // minInterval and maxInterval in minutes
        type = config.dateType || dateType.DATE;

    minDate = validateValue(minDate);
    maxDate = validateValue(maxDate);

    if (isArray(preSelect)) {
        let count = preSelect.length;
        for (let p = 0; p < count; p++) {
            preSelect[p] = validateValue(preSelect[p]);
        }
    } else if (isObject(preSelect)) {
        if(preSelect.start && preSelect.end) {
            if (minuteInterval && minuteInterval > 1 && environment.isIOS && environment.isApp) {
                preSelect = [roundInterval(preSelect.start, minuteInterval), roundInterval(preSelect.end, minuteInterval)];
            } else {
                preSelect = [validateValue(preSelect.start), validateValue(preSelect.end)];
            }
        }
    } else {
        // This will fix the iOS problem with not preselectedDate without user interaction. That it return the wrong time.
        // eslint-disable-next-line no-lonely-if
        if (minuteInterval && minuteInterval > 1 && environment.isIOS && environment.isApp) {
            preSelect = roundInterval(preSelect, minuteInterval);
        } else {
            preSelect = validateValue(preSelect);
        }
    }

    if (isArray(disabledDates)) {
        let count = disabledDates.length;
        for (let d = 0; d < count; d++) {
            disabledDates[d] = validateValue(disabledDates[d]);
        }
    }

    if (!buttons || !isArray(buttons)) {
        buttons = [{
            'text': buttonText.OK,
            'buttonType': buttonType.POSITIVE
        }];
    }

    return open({
        'callType': dialogAction.ADVANCED_DATE,
        type,
        'selectedDate': isArray(preSelect) ? undefined : preSelect,
        minDate,
        maxDate,
        title,
        message,
        minuteInterval,
        buttons,
        multiselect,
        'selectedDates': isArray(preSelect) ? preSelect : undefined,
        disabledDates,
        textBlocks,
        monthSelect,
        yearSelect,
        interval,
        minInterval,
        maxInterval
    }).then((data) => {
        return Promise.resolve(data);
    });
}


/**
 * @typedef {number} dateDialogType
 */

/**
 * Enum for date dialog
 * <div>DATE will open a dialog where you can select a special day</div>
 * <div>TIME will open a dialog where you can only select a special time</div>
 * <div>DATE_TIME will open a dialog where you can select a special time on a special day</div>
 * @readonly
 * @enum {dateDialogType}
 * @type {{DATE: number, TIME: number, DATE_TIME: number}}
 */
export const dateType = {
    'DATE': 1,
    'TIME': 2,
    'DATE_TIME': 3
};

function validateValue(value) {
    if (!isNumber(value)) {
        if (isDate(value)) {
            return parseInt(value.getTime() / 1000, 10);
        }
        return isDialogPermitted() ? undefined : -1;
    }
    return value;
}

function roundInterval(preDate = new Date(), interval) {
    if (!isDate(preDate)) {
        if (isNumber(preDate)) {
            preDate = new Date(preDate);
        } else {
            return -1;
        }
    }
    let minutes = preDate.getMinutes();
    preDate.setMinutes(minutes - (minutes % interval));
    preDate.setSeconds(0);
    return parseInt(preDate.getTime() / 1000, 10);
}
