import { isObject } from './is';

/**
 * Extends for first object passed with the properties from the other objects.
 *
 * @param {{}} object Object
 * @param {...{}} sources Sources
 * @returns {{}} Extended object
 */
export function extend(object, ...sources) {
	if (!isObject(object)) {
		return object;
	}

	let source, prop;
	for (let i = 0, l = sources.length; i < l; i++) {
		source = sources[i];
		for (prop in source) {
			// noinspection JSUnfilteredForInLoop
			object[prop] = source[prop];
		}
	}

	return object;
}
