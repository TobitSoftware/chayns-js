/**
 * LogLevel Enum
 * none is 0
 * debug is 4
 * @type Object
 */
export const levels = {
	'none': 0,
	'error': 1,
	'warn': 2,
	'info': 3,
	'debug': 4
};

/**
 * Can store multiple loggers
 * @type {Object} loggers
 */
const loggers = {};

/**
 * Assign the logger method.
 * By default the window.console `Object`
 * @type Console
 */
const logger = window.console;

/**
 * Set the current log Level
 * use `setLevel(newLogLevel)` to overwrite this value.
 */
let logLevel = levels.error;

/**
 * Executes logging
 *
 * @param {number} level Level
 * @param {{}} args Arguments
 * @returns {undefined}
 */
function log(level, args) {
	try {
		if (logger[level]) {
			logger[level](args);
		} else {
			logger.log(args);
		}
	} catch (ex) {
		console.error('LogError', log);
	}
}

/**
 * Set the current logLevel in order to show or hide logs
 *
 * @param {number} level level
 * @returns {undefined}
 */
export function setLevel(level) {
	logLevel = level;
}

/**
 * @returns {number} Log level
 */
export function getLevel() {
	return logLevel;
}

/**
 * Logger class
 */
class Logger {

	/**
	 * Each logger is identified by it's name.
	 *
	 * @param {string} name Name of the logger (e.g. `chayns.core`)
	 * @returns {undefined}
	 */
	constructor(name) {
		this.name = `[${name || 'chayns.tapp'}]: `;
	}

	/**
	 * Logs a debug message.
	 *
	 * @returns {undefined}
	 */
	debug() {
		if (logLevel < levels.debug) {
			return;
		}
		log('debug', arguments, this.name);
	}

	/**
	 * Logs info message.
	 *
	 * @returns {undefined}
	 */
	info() {
		if (logLevel < levels.info) {
			return;
		}
		log('info', arguments, this.name);
	}


	/**
	 * Logs a warning.
	 *
	 * @returns {undefined}
	 */
	warn() {
		if (logLevel < levels.warn) {
			return;
		}
		log('warn', arguments, this.name);
	}

	/**
	 * Logs an error.
	 *
	 * @returns {undefined}
	 */
	error() {
		if (logLevel < levels.error) {
			return;
		}
		log('error', arguments, this.name);
	}
}

/**
 * Get Logger Singleton Instance
 * @param  {string} name The Logger's name
 * @returns {Logger} Logger instance, either existing one or creates a new one
 */
export function getLogger(name) {
	return loggers[name] || (loggers[name] = new Logger(name));
}
