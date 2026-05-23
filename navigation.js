/**
 * Astro / ClientRouter helpers for @umamichi-ui/windows-phone-motion.
 */

/** @typedef {'forward' | 'back'} WpmNavDirection */
/** @typedef {'turnstile' | 'slide'} WpmRoutePreset */

/** @type {WpmNavDirection} */
let pendingDirection = 'forward';

/** @type {WpmRoutePreset | null} */
let pendingRoutePreset = null;

/**
 * @param {WpmNavDirection} direction
 * @param {WpmRoutePreset} [route='turnstile']
 */
export function applyRouteTransition(direction, route = 'turnstile') {
	const root = document.documentElement;
	root.dataset.wpmNavDirection = direction;
	root.dataset.wpmRoute = route;
}

/**
 * @param {Element | null | undefined} source
 * @returns {WpmRoutePreset}
 */
export function resolveRoutePresetFromSource(source) {
	if (!(source instanceof Element)) {
		return 'turnstile';
	}

	if (source.closest('[data-wpm-route="slide"]')) {
		return 'slide';
	}

	return 'turnstile';
}

/**
 * @param {MouseEvent} event
 * @returns {boolean}
 */
function isInternalNavigationClick(event) {
	const target = event.target;

	if (!(target instanceof Element)) {
		return false;
	}

	const anchor = target.closest('a[href]');

	if (!(anchor instanceof HTMLAnchorElement)) {
		return false;
	}

	if (anchor.target && anchor.target !== '_self') {
		return false;
	}

	if (anchor.hasAttribute('download')) {
		return false;
	}

	const href = anchor.getAttribute('href');

	if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
		return false;
	}

	try {
		const url = new URL(anchor.href, window.location.href);
		return url.origin === window.location.origin;
	} catch {
		return false;
	}
}

function onDocumentClick(event) {
	if (!isInternalNavigationClick(event)) {
		return;
	}

	const target = event.target;

	if (!(target instanceof Element)) {
		return;
	}

	const route = resolveRoutePresetFromSource(target);
	pendingDirection = 'forward';
	pendingRoutePreset = route;
	applyRouteTransition('forward', route);
}

function onPopState() {
	pendingDirection = 'back';
	pendingRoutePreset = null;
	applyRouteTransition('back', 'turnstile');
}

function onBeforePreparation(event) {
	const source = event.detail?.sourceElement ?? event.detail?.source ?? null;
	const route = pendingRoutePreset ?? resolveRoutePresetFromSource(source);
	applyRouteTransition(pendingDirection, route);
	pendingDirection = 'forward';
	pendingRoutePreset = null;
}

function onAfterSwap() {
	/* Keep last direction/route for active view-transition; clear only optional overrides */
}

/**
 * @param {object} [options]
 * @param {boolean} [options.activateFeather=true]
 */
export function initWindowsPhoneMotionNavigation(options = {}) {
	const { activateFeather = true } = options;
	const root = document.documentElement;

	if (!root.dataset.wpmRoute) {
		applyRouteTransition('forward', 'turnstile');
	}

	document.addEventListener('click', onDocumentClick, true);
	window.addEventListener('popstate', onPopState);
	document.addEventListener('astro:before-preparation', onBeforePreparation);
	document.addEventListener('astro:after-swap', onAfterSwap);

	if (activateFeather) {
		activateFeatherGroups();
		document.addEventListener('astro:after-swap', activateFeatherGroups);
	}
}

export function activateFeatherGroups() {
	for (const group of document.querySelectorAll('.wpm-feather')) {
		group.classList.remove('wpm-feather-active');
		// Reflow so repeated navigations replay feather
		void group.getBoundingClientRect();
		group.classList.add('wpm-feather-active');
	}
}

export function suppressMotionTemporarily() {
	const root = document.documentElement;
	root.dataset.wpmMotionSuppressed = 'true';
	window.requestAnimationFrame(() => {
		window.requestAnimationFrame(() => {
			delete root.dataset.wpmMotionSuppressed;
		});
	});
}
