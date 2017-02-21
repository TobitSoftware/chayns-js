import { isNumber, isString, isObject, isArray, isFunction, isBoolean, isDate, isPresent } from '../utils/is';
import { getLogger } from '../utils/logger';
import Config from './Config';

const log = getLogger('chayns.core.chayns_calls');

export const propTypes = {
	'number': createChainedCheck(isNumber),
	'string': createChainedCheck(isString),
	'object': createChainedCheck(isObject),
	'array': createChainedCheck(isArray),
	'function': createChainedCheck(isFunction),
	'boolean': createChainedCheck(isBoolean),
	'date': createChainedCheck((value) => isDate(value) || isNumber(value)),
	'oneOfType': (pt) => createChainedCheck(oneOfType.bind(undefined, pt)),
	'shape': (pt) => createChainedCheck(shape.bind(undefined, pt))
};

function createChainedCheck(validate) {
	const chainedCheck = check.bind(undefined, validate, false);
	chainedCheck.validate = validate.bind(undefined);
	chainedCheck.isRequired = check.bind(undefined, validate, true);

	return chainedCheck;
}

function check(validate, isRequired, key, parameters) {
	let value = null;
	if (parameters && key && parameters.hasOwnProperty(key)) {
		value = parameters[key];
	}

	if (isRequired) {
		if (!isPresent(value)) {
			log.error(`${key} property is required and missing! value:`, value);
			return false;
		} else if (!validate(value)) {
			log.error(`${key} property is required and of wrong type! value:`, value);
			return false;
		}
	} else if (isPresent(value) && !validate(value)) {
		log.debug(`${key} property is of wrong type! value:`, value);
	}

	return true;
}

export function validatePropTypes(pts, parameters) {
	let isValid = true;

	for (let propKey in pts) {
		if (pts.hasOwnProperty(propKey) && !pts[propKey](propKey, parameters)) {
			isValid = false;
		}
	}

	// Config needs to be checked after prop type validation. Missing/Wrong propTypes are logged.
	return !Config.get('strictMode') || isValid;
}

function oneOfType(pts, value) {
	for (let propKey in pts) {
		if (pts.hasOwnProperty(propKey)) {
			if (pts[propKey].validate(value)) {
				return true;
			}
		}
	}

	return false;
}

function shape(pts, parameters) {
	if (!isObject(pts) || !isObject(parameters)) {
		return false;
	}

	return validatePropTypes(pts, parameters);
}
