import { environment } from './environment';
import { isNumber } from '../utils/is';

const schemeColors = {
	'1': '#6E6E6E',
	'4': '#0055A4',
	'5': '#37913C',
	'6': '#AC0000',
	'7': '#836849',
	'8': '#FF811A',
	'9': '#5E4883',
	'11': '#009EE0',
	'12': '#0A4013',
	'13': '#337380',
	'14': '#2E2E67',
	'15': '#73031f',
	'16': '#D11f87',
	'17': '#8C2372',
	'18': '#E6b440',
	'19': '#4D2417'
};

export function getSchemeColor(saturation, color) {
	color = color || environment.site.color;

	if (isNumber(color)) {
		let colorSchemeId = color || environment.site.colorScheme || '1';

		if (!schemeColors.hasOwnProperty(colorSchemeId)) {
			colorSchemeId = 1;
		}

		color = schemeColors[colorSchemeId];
	}

	if (isNumber(saturation) && saturation > 0 && saturation < 100) {
		saturation = 1 - (saturation / 100);

		const rgb = color.match(/[0-9A-F]{2}/gi);
		let retColor = '#';

		for (let i = 0, l = rgb.length; i < l; i++) {
			let colorPart = parseInt(rgb[i], 16);
			colorPart += Math.floor((255 - colorPart) * saturation);

			retColor += colorPart.toString(16);
		}

		return retColor;
	}

	return color;
}
