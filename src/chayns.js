import * as calls from './chayns/calls';
import { invokeCall } from './chayns/chaynsCall';
import * as event from './chayns/events';
import * as tappApi from './chayns/tapp-api';
import { environment } from './chayns/environment';
import { getSchemeColor } from './chayns/colors';
import { ready, register, setup } from './chayns/core';
import * as utils from './utils';
import * as ui from './ui';

export const chayns = {};

utils.extend(chayns,
	{'getLogger': utils.getLogger},
	{'$': utils.DOM},
	{utils},

	{ui},

	{'env': environment},

	{getSchemeColor},
	{register},
	{ready},
	{setup},

	calls,
	{invokeCall},
	{event},
	tappApi
);

global.chayns = chayns;

setup();
