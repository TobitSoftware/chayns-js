import '@babel/polyfill';

import * as calls from './chayns/calls';
import * as event from './chayns/events';
import * as tappApi from './chayns/tapp-api';
import {invokeCall, chaynsCall} from './chayns/chaynsCall';
import {environment} from './chayns/environment';
import {ready, register, dynamicFontSize} from './chayns/core';
import * as utils from './utils';

const chayns = {
    register,
    ready,
    dynamicFontSize,

    env: environment,

    utils,

    invokeCall,
    _call: chaynsCall,

    ...calls,
    event,
    ...tappApi
};

global.chayns = chayns;

export default chayns;
