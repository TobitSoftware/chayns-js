import { delegate } from '../utils/delegate';
import { isNumber, isDefined } from '../utils/is';
import { environment } from '../chayns/environment';

const SELECTOR = '.mode-switch__head';
let config = null,
	useActiveFlag = false,
	$modeSwitch = null,
	$activeItem = null;

export function init(c) {
	if ($modeSwitch) {
		remove();
	}

	if (c && c.items && !$modeSwitch) {
		delegate(document, SELECTOR, 'click', toggleModeSwitch);
		config = c;

		// used for backwards compatibility
		useActiveFlag = c.items.some((item) => isDefined(item.active));

		$modeSwitch = createModeSwitch();

		if (environment.isAndroid) {
			setAndroidPadding();
			window.addEventListener('orientationchange', setAndroidPadding);
		}

		add();
	}
}

export function add() {
	if ($modeSwitch && !$modeSwitch.parentNode) {
		document.querySelector('.tapp').classList.add('mode-switch__tapp-padding');
		document.body.appendChild($modeSwitch);
	}
}

export function remove() {
	if ($modeSwitch && $modeSwitch.parentNode) {
		document.querySelector('.tapp').classList.remove('mode-switch__tapp-padding');
		$modeSwitch.parentNode.removeChild($modeSwitch);
	}
}

function toggleModeSwitch() {
	$modeSwitch.classList.toggle('mode-switch--open');
}

function createModeSwitch() {
	const $ms = document.createElement('div');
	$ms.classList.add('mode-switch', 'mode-switch--default', 'mode-switch__bounce');

	const $msBody = document.createElement('div');
	$msBody.classList.add('mode-switch__body');
	$ms.appendChild($msBody);

	const $msContent = document.createElement('div');
	$msContent.classList.add('mode-switch__content');
	$msBody.appendChild($msContent);

	const $msHeadline = document.createElement('h2');
	$msHeadline.innerHTML = config.headline || 'Diese Seite verwenden als:';
	$msContent.appendChild($msHeadline);

	const $msGrid = document.createElement('div');
	$msGrid.classList.add('grid');

	for (let i = 0, l = config.items.length; i < l; i++) {
		$msGrid.appendChild(createModeSwitchItem(config.items[i], i));
	}

	$msContent.appendChild($msGrid);

	const $msHead = document.createElement('div');
	$msHead.classList.add('mode-switch__head');
	$ms.appendChild($msHead);

	return $ms;
}

function createModeSwitchItem(item, index, preventChecked = false) {
	const $item = document.createElement('div');
	$item.classList.add('grid__item', 'col-1-2-desktop', 'col-1-1-mobile');

	const $input = document.createElement('input');
	$input.setAttribute('name', 'mode-switch__modes');
	$input.setAttribute('type', 'radio');
	$input.classList.add('radio');
	$input.setAttribute('id', `mode-switch__${index}`);

    if (!preventChecked && ((!useActiveFlag && item.default) || (useActiveFlag && item.active))) {
		$input.setAttribute('checked', '');
	}

	$input.addEventListener('change', modeSwitchChangeListener.bind(undefined, item));

	const $label = document.createElement('label');
	$label.setAttribute('for', `mode-switch__${index}`);
	$label.innerHTML = item.name;

	$item.appendChild($input);
	$item.appendChild($label);

	return $item;
}

export function setAndroidPadding() {
	setTimeout(() => {
		const paddingTop = document.body.style.paddingTop;
		if (paddingTop) {
			$modeSwitch.style.paddingTop = paddingTop;
		}
	}, 100);
}

function modeSwitchChangeListener(item) {
	if (!config.preventClose) {
		$modeSwitch.classList.remove('mode-switch--open');
	}

	if (item.default) {
		$modeSwitch.classList.add('mode-switch--default');
	} else {
		$modeSwitch.classList.remove('mode-switch--default');
	}

	if (config.callback) {
		config.callback(item, $activeItem);
	}

	$activeItem = item;
}

export function addItem(item, index) {
    const $grid = $modeSwitch.querySelector('.grid');

    if(item.id) {
        let length = config.items.length;
        for (let i = 0; i < length; i++) {
            if (config.items[i].id === item.id) {
                return 'Cannot add Item with the same Id';
            }
        }
    }
    if (!isNumber(index)) {
        config.items.push(item);
        $grid.appendChild(createModeSwitchItem(item, config.items.length - 1));
    } else {
        config.items.splice(index, 0, item);
        let $child = $grid.children[index];
        $grid.insertBefore(createModeSwitchItem(item, index), $child);

        let i = index + 1;
        do {
            $child.children[0].setAttribute('id', `mode-switch__${i}`);
            $child.children[1].setAttribute('for', `mode-switch__${i}`);
            $child = $child.nextSibling;
            i++;
        } while ($child);
    }
}

export function removeItem(id) {
    let length = config.items.length;
    for(let i = 0; i < length; i++) {
        if(config.items[i].id === id) {
            let element = document.querySelector('#mode-switch__' + i);
            element = element.parentNode;
            element.parentNode.removeChild(element);
            config.items[i] = {};
            break;
        }
    }
}

export function changeMode(item) {
	if (config) {
		let $item = null;

		if (isNumber(item)) {
			$item = $modeSwitch.querySelector(`#mode-switch__${item}`);
		} else {
			item = JSON.stringify(item);
			for (let i = 0, l = config.items.length; i < l; i++) {
				if (JSON.stringify(config.items[i]) === item) {
					$item = $modeSwitch.querySelector(`#mode-switch__${i}`);
					break;
				}
			}
		}

		if ($item) {
			$item.click();
			return true;
		}
	}

	return false;
}

export function updateItem(index, item) {
	config.items[index] = item;

	const $item = $modeSwitch.querySelector(`#mode-switch__${index} + label`);

	if ($item) {
		$item.innerHTML = item.name;

        if ($item.parentElement && $item.parentElement.parentElement) {
            const $newItem = createModeSwitchItem(item, index, true);
            $item.parentElement.parentElement.replaceChild($newItem, $item.parentElement);
        }
	}
}
