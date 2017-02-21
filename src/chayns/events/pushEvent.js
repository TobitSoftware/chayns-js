import { addChaynsEventListener } from '../chaynsEvent';
import { getLastPushNotification } from '../calls/getLastPushNotification';

export function addPushListener(callback) {
	getLastPushNotification()
		.then((data) => {
			for (let i = 0, l = data.retVal.items.length; i < l; i++) {
				if (data.retVal.items[i].actionId === -1) {
					return callback(parsePush(data.retVal.items[i]));
				}
			}
		});

	return addChaynsEventListener({
		'event': {
			'name': 'Push',
			callback: (data) => callback(parsePush(data)),
			'useCapture': false
		},
		'web': false,
		'app': {'android': 4961, 'ios': 4516}
	});
}

export function removePushListener(callback) {
	document.removeEventListener('Push', callback);
}

function parsePush(data) {
	const {push, category, actionId, value} = data;

	return {
		push: {
			alert: push.aps.alert,
			payload: {
				tappId: push.tp1.t,
				actions: push.tp1.a.map(parsePushAction)
			},
			customPayload: push.tp1.pl
		},
		category: parsePushCategory(category),
		actionId,
		value
	};
}

function parsePushCategory(category) {
	if (!category) {
		return undefined;
	}

	return {
		id: category.id,
		inputPlaceholder: category.textInput,
		buttons: category.buttons.map(parsePushButton)
	};
}

function parsePushAction(action) {
	return {
		id: action.id,
		type: action.a,
		url: action.u
	};
}

function parsePushButton(button) {
	return {
		id: button.id,
		title: button.title,
		active: button.activeMode
	};
}