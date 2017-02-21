/**
 * Libs and polyfills
 */
import Promise from 'es6-promise';
import 'whatwg-fetch';
import 'raf';
import 'classlist-polyfill';
import 'custom-event-polyfill';

// load promise polyfill
Promise.polyfill();

/**
 * Modules
 *
 * Do not change order!
 */
export * from './defer';
export * from './delegate';
export DOM from './Dom';
export * from './extend';
export * from './helper';
export * from './is';
export * from './isPermitted';
export ls from './LocalStorage';
export * from './logger';
