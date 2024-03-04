/* Carrd Site JS | carrd.co | License: MIT */

(function() {

	// Main.
		var	on = addEventListener,
			off = removeEventListener,
			$ = function(q) { return document.querySelector(q) },
			$$ = function(q) { return document.querySelectorAll(q) },
			$body = document.body,
			$inner = $('.inner'),
			client = (function() {
		
				var o = {
						browser: 'other',
						browserVersion: 0,
						os: 'other',
						osVersion: 0,
						mobile: false,
						canUse: null,
						flags: {
							lsdUnits: false,
						},
					},
					ua = navigator.userAgent,
					a, i;
		
				// browser, browserVersion.
					a = [
						[
							'firefox',
							/Firefox\/([0-9\.]+)/
						],
						[
							'edge',
							/Edge\/([0-9\.]+)/
						],
						[
							'safari',
							/Version\/([0-9\.]+).+Safari/
						],
						[
							'chrome',
							/Chrome\/([0-9\.]+)/
						],
						[
							'chrome',
							/CriOS\/([0-9\.]+)/
						],
						[
							'ie',
							/Trident\/.+rv:([0-9]+)/
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.browser = a[i][0];
							o.browserVersion = parseFloat(RegExp.$1);
		
							break;
		
						}
		
					}
		
				// os, osVersion.
					a = [
						[
							'ios',
							/([0-9_]+) like Mac OS X/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'ios',
							/CPU like Mac OS X/,
							function(v) { return 0 }
						],
						[
							'ios',
							/iPad; CPU/,
							function(v) { return 0 }
						],
						[
							'android',
							/Android ([0-9\.]+)/,
							null
						],
						[
							'mac',
							/Macintosh.+Mac OS X ([0-9_]+)/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'windows',
							/Windows NT ([0-9\.]+)/,
							null
						],
						[
							'undefined',
							/Undefined/,
							null
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.os = a[i][0];
							o.osVersion = parseFloat( a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1 );
		
							break;
		
						}
		
					}
		
					// Hack: Detect iPads running iPadOS.
						if (o.os == 'mac'
						&&	('ontouchstart' in window)
						&&	(
		
							// 12.9"
								(screen.width == 1024 && screen.height == 1366)
							// 10.2"
								||	(screen.width == 834 && screen.height == 1112)
							// 9.7"
								||	(screen.width == 810 && screen.height == 1080)
							// Legacy
								||	(screen.width == 768 && screen.height == 1024)
		
						))
							o.os = 'ios';
		
				// mobile.
					o.mobile = (o.os == 'android' || o.os == 'ios');
		
				// canUse.
					var _canUse = document.createElement('div');
		
					o.canUse = function(property, value) {
		
						var style;
		
						// Get style.
							style = _canUse.style;
		
						// Property doesn't exist? Can't use it.
							if (!(property in style))
								return false;
		
						// Value provided?
							if (typeof value !== 'undefined') {
		
								// Assign value.
									style[property] = value;
		
								// Value is empty? Can't use it.
									if (style[property] == '')
										return false;
		
							}
		
						return true;
		
					};
		
				// flags.
					o.flags.lsdUnits = o.canUse('width', '100dvw');
		
				return o;
		
			}()),
			trigger = function(t) {
				dispatchEvent(new Event(t));
			},
			cssRules = function(selectorText) {
		
				var ss = document.styleSheets,
					a = [],
					f = function(s) {
		
						var r = s.cssRules,
							i;
		
						for (i=0; i < r.length; i++) {
		
							if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)
								(f)(r[i]);
							else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText)
								a.push(r[i]);
		
						}
		
					},
					x, i;
		
				for (i=0; i < ss.length; i++)
					f(ss[i]);
		
				return a;
		
			},
			thisHash = function() {
		
				var h = location.hash ? location.hash.substring(1) : null,
					a;
		
				// Null? Bail.
					if (!h)
						return null;
		
				// Query string? Move before hash.
					if (h.match(/\?/)) {
		
						// Split from hash.
							a = h.split('?');
							h = a[0];
		
						// Update hash.
							history.replaceState(undefined, undefined, '#' + h);
		
						// Update search.
							window.location.search = a[1];
		
					}
		
				// Prefix with "x" if not a letter.
					if (h.length > 0
					&&	!h.match(/^[a-zA-Z]/))
						h = 'x' + h;
		
				// Convert to lowercase.
					if (typeof h == 'string')
						h = h.toLowerCase();
		
				return h;
		
			},
			scrollToElement = function(e, style, duration) {
		
				var y, cy, dy,
					start, easing, offset, f;
		
				// Element.
		
					// No element? Assume top of page.
						if (!e)
							y = 0;
		
					// Otherwise ...
						else {
		
							offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
		
							switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
		
								case 'default':
								default:
		
									y = e.offsetTop + offset;
		
									break;
		
								case 'center':
		
									if (e.offsetHeight < window.innerHeight)
										y = e.offsetTop - ((window.innerHeight - e.offsetHeight) / 2) + offset;
									else
										y = e.offsetTop - offset;
		
									break;
		
								case 'previous':
		
									if (e.previousElementSibling)
										y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight + offset;
									else
										y = e.offsetTop + offset;
		
									break;
		
							}
		
						}
		
				// Style.
					if (!style)
						style = 'smooth';
		
				// Duration.
					if (!duration)
						duration = 750;
		
				// Instant? Just scroll.
					if (style == 'instant') {
		
						window.scrollTo(0, y);
						return;
		
					}
		
				// Get start, current Y.
					start = Date.now();
					cy = window.scrollY;
					dy = y - cy;
		
				// Set easing.
					switch (style) {
		
						case 'linear':
							easing = function (t) { return t };
							break;
		
						case 'smooth':
							easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
							break;
		
					}
		
				// Scroll.
					f = function() {
		
						var t = Date.now() - start;
		
						// Hit duration? Scroll to y and finish.
							if (t >= duration)
								window.scroll(0, y);
		
						// Otherwise ...
							else {
		
								// Scroll.
									window.scroll(0, cy + (dy * easing(t / duration)));
		
								// Repeat.
									requestAnimationFrame(f);
		
							}
		
					};
		
					f();
		
			},
			scrollToTop = function() {
		
				// Scroll to top.
					scrollToElement(null);
		
			},
			loadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of unloaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Load.
								a[i].contentWindow.location.replace(a[i].dataset.src);
		
							// Save initial src.
								a[i].dataset.initialSrc = a[i].dataset.src;
		
							// Mark as loaded.
								a[i].dataset.src = '';
		
						}
		
				// Video.
		
					// Get list of videos (autoplay).
						a = parent.querySelectorAll('video[autoplay]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Play if paused.
								if (a[i].paused)
									a[i].play();
		
						}
		
				// Autofocus.
		
					// Get first element with data-autofocus attribute.
						e = parent.querySelector('[data-autofocus="1"]');
		
					// Determine type.
						x = e ? e.tagName : null;
		
						switch (x) {
		
							case 'FORM':
		
								// Get first input.
									e = e.querySelector('.field input, .field select, .field textarea');
		
								// Found? Focus.
									if (e)
										e.focus();
		
								break;
		
							default:
								break;
		
						}
		
			},
			unloadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of loaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src=""]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Don't unload? Skip.
								if (a[i].dataset.srcUnload === '0')
									continue;
		
							// Mark as unloaded.
		
								// IFRAME was previously loaded by loadElements()? Use initialSrc.
									if ('initialSrc' in a[i].dataset)
										a[i].dataset.src = a[i].dataset.initialSrc;
		
								// Otherwise, just use src.
									else
										a[i].dataset.src = a[i].src;
		
							// Unload.
								a[i].contentWindow.location.replace('about:blank');
		
						}
		
				// Video.
		
					// Get list of videos.
						a = parent.querySelectorAll('video');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Pause if playing.
								if (!a[i].paused)
									a[i].pause();
		
						}
		
				// Autofocus.
		
					// Get focused element.
						e = $(':focus');
		
					// Found? Blur.
						if (e)
							e.blur();
		
		
			};
		
			// Expose scrollToElement.
				window._scrollToTop = scrollToTop;
	
	// Spoiler markdown.
		(function() {
		
			$body.addEventListener('click', function(e) {
		
				if (e.target.tagName == 'SPOILER-TEXT')
					e.target.classList.toggle('active');
		
			});
		
		})();
	
	// "On Load" animation.
		// Set loader timeout.
			var loaderTimeout = setTimeout(function() {
				$body.classList.add('with-loader');
			}, 500);
		
		// Create load handler.
			var loadHandler = function() {
				setTimeout(function() {
		
					// Stop loader.
						clearTimeout(loaderTimeout);
		
					// Unmark as loading.
						$body.classList.remove('is-loading');
		
					// Mark as playing.
						$body.classList.add('is-playing');
		
					// Wait for animation to complete.
						setTimeout(function() {
		
							// Remove loader.
								$body.classList.remove('with-loader');
		
							// Unmark as playing.
								$body.classList.remove('is-playing');
		
							// Mark as ready.
								$body.classList.add('is-ready');
		
						}, 1000);
		
				}, 100);
			};
		
		// Load event.
			on('load', loadHandler);
	
	// Sections.
		(function() {
		
			var initialSection, initialScrollPoint, initialId,
				header, footer, name, hideHeader, hideFooter, disableAutoScroll,
				h, e, ee, k,
				locked = false,
				scrollPointParent = function(target) {
		
					while (target) {
		
						if (target.parentElement
						&&	target.parentElement.tagName == 'SECTION')
							break;
		
						target = target.parentElement;
		
					}
		
					return target;
		
				},
				scrollPointSpeed = function(scrollPoint) {
		
					let x = parseInt(scrollPoint.dataset.scrollSpeed);
		
					switch (x) {
		
						case 5:
							return 250;
		
						case 4:
							return 500;
		
						case 3:
							return 750;
		
						case 2:
							return 1000;
		
						case 1:
							return 1250;
		
						default:
							break;
		
					}
		
					return 750;
		
				},
				doNextScrollPoint = function(event) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find next scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doPreviousScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find previous scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doFirstScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find first scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doLastScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find last scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doNextSection = function() {
		
					var section;
		
					section = $('#main > .inner > section.active').nextElementSibling;
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + section.id.replace(/-section$/, '');
		
				},
				doPreviousSection = function() {
		
					var section;
		
					section = $('#main > .inner > section.active').previousElementSibling;
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + (section.matches(':first-child') ? '' : section.id.replace(/-section$/, ''));
		
				},
				doFirstSection = function() {
		
					var section;
		
					section = $('#main > .inner > section:first-of-type');
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + section.id.replace(/-section$/, '');
		
				},
				doLastSection = function() {
		
					var section;
		
					section = $('#main > .inner > section:last-of-type');
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + section.id.replace(/-section$/, '');
		
				},
				resetSectionChangeElements = function(section) {
		
					var ee, e, x;
		
					// Get elements with data-reset-on-section-change attribute.
						ee = section.querySelectorAll('[data-reset-on-section-change="1"]');
		
					// Step through elements.
						for (e of ee) {
		
							// Determine type.
								x = e ? e.tagName : null;
		
								switch (x) {
		
									case 'FORM':
		
										// Reset.
											e.reset();
		
										break;
		
									default:
										break;
		
								}
		
						}
		
				},
				activateSection = function(section, scrollPoint) {
		
					var sectionHeight, currentSection, currentSectionHeight,
						name, hideHeader, hideFooter, disableAutoScroll,
						ee, k;
		
					// Section already active?
						if (!section.classList.contains('inactive')) {
		
							// Get options.
								name = (section ? section.id.replace(/-section$/, '') : null);
								disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
							// Scroll to scroll point (if applicable).
								if (scrollPoint)
									scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
							// Otherwise, just scroll to top (if not disabled for this section).
								else if (!disableAutoScroll)
									scrollToElement(null);
		
							// Bail.
								return false;
		
						}
		
					// Otherwise, activate it.
						else {
		
							// Lock.
								locked = true;
		
							// Clear index URL hash.
								if (location.hash == '#homepage')
									history.replaceState(null, null, '#');
		
							// Get options.
								name = (section ? section.id.replace(/-section$/, '') : null);
								hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
								hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
								disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
							// Deactivate current section.
		
								// Hide header and/or footer (if necessary).
		
									// Header.
										if (header && hideHeader) {
		
											header.classList.add('hidden');
											header.style.display = 'none';
		
										}
		
									// Footer.
										if (footer && hideFooter) {
		
											footer.classList.add('hidden');
											footer.style.display = 'none';
		
										}
		
								// Deactivate.
									currentSection = $('#main > .inner > section:not(.inactive)');
									currentSection.classList.add('inactive');
									currentSection.classList.remove('active');
									currentSection.style.display = 'none';
		
								// Unload elements.
									unloadElements(currentSection);
		
								// Reset section change elements.
									resetSectionChangeElements(currentSection);
		
									// Event: On Close.
										doEvent(currentSection.id, 'onclose');
		
							// Activate target section.
		
								// Show header and/or footer (if necessary).
		
									// Header.
										if (header && !hideHeader) {
		
											header.style.display = '';
											header.classList.remove('hidden');
		
										}
		
									// Footer.
										if (footer && !hideFooter) {
		
											footer.style.display = '';
											footer.classList.remove('hidden');
		
										}
		
								// Activate.
									section.classList.remove('inactive');
									section.classList.add('active');
									section.style.display = '';
		
									// Event: On Open.
										doEvent(section.id, 'onopen');
		
							// Trigger 'resize' event.
								trigger('resize');
		
							// Load elements.
								loadElements(section);
		
							// Scroll to scroll point (if applicable).
								if (scrollPoint)
									scrollToElement(scrollPoint, 'instant');
		
							// Otherwise, just scroll to top (if not disabled for this section).
								else if (!disableAutoScroll)
									scrollToElement(null, 'instant');
		
							// Unlock.
								locked = false;
		
						}
		
				},
				doEvent = function(id, type) {
		
					var name = id.split(/-[a-z]+$/)[0], result, i;
		
					if (name in sections
					&&	'events' in sections[name]
					&&	type in sections[name].events) {
		
						for (i in sections[name].events[type]) {
		
							result = (sections[name].events[type][i])();
		
							if (result === false)
								delete sections[name].events[type][i];
		
						}
		
					}
		
				},
				sections = {
					'homepage': {
						hideHeader: true,
						hideFooter: true,
						disableAutoScroll: true,
						events: {
							onopen: [
								function() { umami.track('Opened home'); },
							],
						},
					},
					'now': {
						events: {
							onopen: [
								function() { umami.track('Opened now'); },
							],
						},
					},
					'about': {
						events: {
							onopen: [
								function() { umami.track('Opened about'); },
							],
						},
					},
					'socials': {
						events: {
							onopen: [
								function() { umami.track('Opened socials'); },
							],
						},
					},
					'share': {
						events: {
							onopen: [
								function() { umami.track('Opened share'); },
							],
						},
					},
					'caps': {
						events: {
							onopen: [
								function() { umami.track('Opened caps'); },
							],
						},
					},
					'site': {
						events: {
							onopen: [
								function() { umami.track('Opened site'); },
							],
						},
					},
					'peek': {
						events: {
							onopen: [
								function() { umami.track('Opened peek'); },
							],
						},
					},
				};
		
			// Expose doNextScrollPoint, doPreviousScrollPoint, doFirstScrollPoint, doLastScrollPoint.
				window._nextScrollPoint = doNextScrollPoint;
				window._previousScrollPoint = doPreviousScrollPoint;
				window._firstScrollPoint = doFirstScrollPoint;
				window._lastScrollPoint = doLastScrollPoint;
		
			// Expose doNextSection, doPreviousSection, doFirstSection, doLastSection.
				window._nextSection = doNextSection;
				window._previousSection = doPreviousSection;
				window._firstSection = doFirstSection;
				window._lastSection = doLastSection;
		
			// Override exposed scrollToTop.
				window._scrollToTop = function() {
		
					var section, id;
		
					// Scroll to top.
						scrollToElement(null);
		
					// Section active?
						if (!!(section = $('section.active'))) {
		
							// Get name.
								id = section.id.replace(/-section$/, '');
		
								// Index section? Clear.
									if (id == 'homepage')
										id = '';
		
							// Reset hash to section name (via new state).
								history.pushState(null, null, '#' + id);
		
						}
		
				};
		
			// Initialize.
		
				// Set scroll restoration to manual.
					if ('scrollRestoration' in history)
						history.scrollRestoration = 'manual';
		
				// Header, footer.
					header = $('#header');
					footer = $('#footer');
		
				// Show initial section.
		
					// Determine target.
						h = thisHash();
		
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								h = null;
		
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
		
								initialScrollPoint = e;
								initialSection = initialScrollPoint.parentElement;
								initialId = initialSection.id;
		
							}
		
						// Section.
							else if (e = $('#' + (h ? h : 'homepage') + '-section')) {
		
								initialScrollPoint = null;
								initialSection = e;
								initialId = initialSection.id;
		
							}
		
						// Missing initial section?
							if (!initialSection) {
		
								// Default to index.
									initialScrollPoint = null;
									initialSection = $('#' + 'homepage' + '-section');
									initialId = initialSection.id;
		
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
		
							}
		
					// Get options.
						name = (h ? h : 'homepage');
						hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
						hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
						disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
					// Deactivate all sections (except initial).
		
						// Initially hide header and/or footer (if necessary).
		
							// Header.
								if (header && hideHeader) {
		
									header.classList.add('hidden');
									header.style.display = 'none';
		
								}
		
							// Footer.
								if (footer && hideFooter) {
		
									footer.classList.add('hidden');
									footer.style.display = 'none';
		
								}
		
						// Deactivate.
							ee = $$('#main > .inner > section:not([id="' + initialId + '"])');
		
							for (k = 0; k < ee.length; k++) {
		
								ee[k].className = 'inactive';
								ee[k].style.display = 'none';
		
							}
		
					// Activate initial section.
						initialSection.classList.add('active');
		
							// Event: On Open.
								doEvent(initialId, 'onopen');
		
					// Load elements.
						loadElements(initialSection);
		
						if (header)
							loadElements(header);
		
						if (footer)
							loadElements(footer);
		
					// Scroll to top (if not disabled for this section).
						if (!disableAutoScroll)
							scrollToElement(null, 'instant');
		
				// Load event.
					on('load', function() {
		
						// Scroll to initial scroll point (if applicable).
					 		if (initialScrollPoint)
								scrollToElement(initialScrollPoint, 'instant');
		
					});
		
			// Hashchange event.
				on('hashchange', function(event) {
		
					var section, scrollPoint,
						h, e;
		
					// Lock.
						if (locked)
							return false;
		
					// Determine target.
						h = thisHash();
		
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								return false;
		
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
		
								scrollPoint = e;
								section = scrollPoint.parentElement;
		
							}
		
						// Section.
							else if (e = $('#' + (h ? h : 'homepage') + '-section')) {
		
								scrollPoint = null;
								section = e;
		
							}
		
						// Anything else.
							else {
		
								// Default to index.
									scrollPoint = null;
									section = $('#' + 'homepage' + '-section');
		
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
		
							}
		
					// No section? Bail.
						if (!section)
							return false;
		
					// Activate section.
						activateSection(section, scrollPoint);
		
					return false;
		
				});
		
				// Hack: Allow hashchange to trigger on click even if the target's href matches the current hash.
					on('click', function(event) {
		
						var t = event.target,
							tagName = t.tagName.toUpperCase(),
							scrollPoint, section;
		
						// Find real target.
							switch (tagName) {
		
								case 'IMG':
								case 'SVG':
								case 'USE':
								case 'U':
								case 'STRONG':
								case 'EM':
								case 'CODE':
								case 'S':
								case 'MARK':
								case 'SPAN':
		
									// Find ancestor anchor tag.
										while ( !!(t = t.parentElement) )
											if (t.tagName == 'A')
												break;
		
									// Not found? Bail.
										if (!t)
											return;
		
									break;
		
								default:
									break;
		
							}
		
						// Target is an anchor *and* its href is a hash?
							if (t.tagName == 'A'
							&&	t.getAttribute('href') !== null
							&&	t.getAttribute('href').substr(0, 1) == '#') {
		
								// Hash matches an invisible scroll point?
									if (!!(scrollPoint = $('[data-scroll-id="' + t.hash.substr(1) + '"][data-scroll-invisible="1"]'))) {
		
										// Prevent default.
											event.preventDefault();
		
										// Get section.
											section = scrollPoint.parentElement;
		
										// Section is inactive?
											if (section.classList.contains('inactive')) {
		
												// Reset hash to section name (via new state).
													history.pushState(null, null, '#' + section.id.replace(/-section$/, ''));
		
												// Activate section.
													activateSection(section, scrollPoint);
		
											}
		
										// Otherwise ...
											else {
		
												// Scroll to scroll point.
													scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
											}
		
									}
		
								// Hash matches the current hash?
									else if (t.hash == window.location.hash) {
		
										// Prevent default.
											event.preventDefault();
		
										// Replace state with '#'.
											history.replaceState(undefined, undefined, '#');
		
										// Replace location with target hash.
											location.replace(t.hash);
		
									}
		
							}
		
					});
		
		})();
	
	// Browser hacks.
		// Init.
			var style, sheet, rule;
		
			// Create <style> element.
				style = document.createElement('style');
				style.appendChild(document.createTextNode(''));
				document.head.appendChild(style);
		
			// Get sheet.
				sheet = style.sheet;
		
		// Mobile.
			if (client.mobile) {
		
				// Prevent overscrolling on Safari/other mobile browsers.
				// 'vh' units don't factor in the heights of various browser UI elements so our page ends up being
				// a lot taller than it needs to be (resulting in overscroll and issues with vertical centering).
					(function() {
		
						// Lsd units available?
							if (client.flags.lsdUnits) {
		
								document.documentElement.style.setProperty('--viewport-height', '100svh');
								document.documentElement.style.setProperty('--background-height', '100lvh');
		
							}
		
						// Otherwise, use innerHeight hack.
							else {
		
								var f = function() {
									document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
									document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
								};
		
								on('load', f);
								on('orientationchange', function() {
		
									// Update after brief delay.
										setTimeout(function() {
											(f)();
										}, 100);
		
								});
		
							}
		
					})();
		
			}
		
		// Android.
			if (client.os == 'android') {
		
				// Prevent background "jump" when address bar shrinks.
				// Specifically, this fix forces the background pseudoelement to a fixed height based on the physical
				// screen size instead of relying on "vh" (which is subject to change when the scrollbar shrinks/grows).
					(function() {
		
						// Insert and get rule.
							sheet.insertRule('body::after { }', 0);
							rule = sheet.cssRules[0];
		
						// Event.
							var f = function() {
								rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
							};
		
							on('load', f);
							on('orientationchange', f);
							on('touchmove', f);
		
					})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
		
		// iOS.
			else if (client.os == 'ios') {
		
				// <=11: Prevent white bar below background when address bar shrinks.
				// For some reason, simply forcing GPU acceleration on the background pseudoelement fixes this.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body::after { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = '-webkit-transform: scale(1.0)';
		
						})();
		
				// <=11: Prevent white bar below background when form inputs are focused.
				// Fixed-position elements seem to lose their fixed-ness when this happens, which is a problem
				// because our backgrounds fall into this category.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body.ios-focus-fix::before { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = 'height: calc(100% + 60px)';
		
							// Add event listeners.
								on('focus', function(event) {
									$body.classList.add('ios-focus-fix');
								}, true);
		
								on('blur', function(event) {
									$body.classList.remove('ios-focus-fix');
								}, true);
		
						})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
	
	// Scroll events.
		var scrollEvents = {
		
			/**
			 * Items.
			 * @var {array}
			 */
			items: [],
		
			/**
			 * Adds an event.
			 * @param {object} o Options.
			 */
			add: function(o) {
		
				this.items.push({
					element: o.element,
					triggerElement: (('triggerElement' in o && o.triggerElement) ? o.triggerElement : o.element),
					enter: ('enter' in o ? o.enter : null),
					leave: ('leave' in o ? o.leave : null),
					mode: ('mode' in o ? o.mode : 4),
					threshold: ('threshold' in o ? o.threshold : 0.25),
					offset: ('offset' in o ? o.offset : 0),
					initialState: ('initialState' in o ? o.initialState : null),
					state: false,
				});
		
			},
		
			/**
			 * Handler.
			 */
			handler: function() {
		
				var	height, top, bottom, scrollPad;
		
				// Determine values.
					if (client.os == 'ios') {
		
						height = document.documentElement.clientHeight;
						top = document.body.scrollTop + window.scrollY;
						bottom = top + height;
						scrollPad = 125;
		
					}
					else {
		
						height = document.documentElement.clientHeight;
						top = document.documentElement.scrollTop;
						bottom = top + height;
						scrollPad = 0;
		
					}
		
				// Step through items.
					scrollEvents.items.forEach(function(item) {
		
						var	elementTop, elementBottom, viewportTop, viewportBottom,
							bcr, pad, state, a, b;
		
						// No enter/leave handlers? Bail.
							if (!item.enter
							&&	!item.leave)
								return true;
		
						// No trigger element? Bail.
							if (!item.triggerElement)
								return true;
		
						// Trigger element not visible?
							if (item.triggerElement.offsetParent === null) {
		
								// Current state is active *and* leave handler exists?
									if (item.state == true
									&&	item.leave) {
		
										// Reset state to false.
											item.state = false;
		
										// Call it.
											(item.leave).apply(item.element);
		
										// No enter handler? Unbind leave handler (so we don't check this element again).
											if (!item.enter)
												item.leave = null;
		
									}
		
								// Bail.
									return true;
		
							}
		
						// Get element position.
							bcr = item.triggerElement.getBoundingClientRect();
							elementTop = top + Math.floor(bcr.top);
							elementBottom = elementTop + bcr.height;
		
						// Determine state.
		
							// Initial state exists?
								if (item.initialState !== null) {
		
									// Use it for this check.
										state = item.initialState;
		
									// Clear it.
										item.initialState = null;
		
								}
		
							// Otherwise, determine state from mode/position.
								else {
		
									switch (item.mode) {
		
										// Element falls within viewport.
											case 1:
											default:
		
												// State.
													state = (bottom > (elementTop - item.offset) && top < (elementBottom + item.offset));
		
												break;
		
										// Viewport midpoint falls within element.
											case 2:
		
												// Midpoint.
													a = (top + (height * 0.5));
		
												// State.
													state = (a > (elementTop - item.offset) && a < (elementBottom + item.offset));
		
												break;
		
										// Viewport midsection falls within element.
											case 3:
		
												// Upper limit (25%-).
													a = top + (height * (item.threshold));
		
													if (a - (height * 0.375) <= 0)
														a = 0;
		
												// Lower limit (-75%).
													b = top + (height * (1 - item.threshold));
		
													if (b + (height * 0.375) >= document.body.scrollHeight - scrollPad)
														b = document.body.scrollHeight + scrollPad;
		
												// State.
													state = (b > (elementTop - item.offset) && a < (elementBottom + item.offset));
		
												break;
		
										// Viewport intersects with element.
											case 4:
		
												// Calculate pad, viewport top, viewport bottom.
													pad = height * item.threshold;
													viewportTop = (top + pad);
													viewportBottom = (bottom - pad);
		
												// Compensate for elements at the very top or bottom of the page.
													if (Math.floor(top) <= pad)
														viewportTop = top;
		
													if (Math.ceil(bottom) >= (document.body.scrollHeight - pad))
														viewportBottom = bottom;
		
												// Element is smaller than viewport?
													if ((viewportBottom - viewportTop) >= (elementBottom - elementTop)) {
		
														state =	(
																(elementTop >= viewportTop && elementBottom <= viewportBottom)
															||	(elementTop >= viewportTop && elementTop <= viewportBottom)
															||	(elementBottom >= viewportTop && elementBottom <= viewportBottom)
														);
		
													}
		
												// Otherwise, viewport is smaller than element.
													else
														state =	(
																(viewportTop >= elementTop && viewportBottom <= elementBottom)
															||	(elementTop >= viewportTop && elementTop <= viewportBottom)
															||	(elementBottom >= viewportTop && elementBottom <= viewportBottom)
														);
		
												break;
		
									}
		
								}
		
						// State changed?
							if (state != item.state) {
		
								// Update state.
									item.state = state;
		
								// Call handler.
									if (item.state) {
		
										// Enter handler exists?
											if (item.enter) {
		
												// Call it.
													(item.enter).apply(item.element);
		
												// No leave handler? Unbind enter handler (so we don't check this element again).
													if (!item.leave)
														item.enter = null;
		
											}
		
									}
									else {
		
										// Leave handler exists?
											if (item.leave) {
		
												// Call it.
													(item.leave).apply(item.element);
		
												// No enter handler? Unbind leave handler (so we don't check this element again).
													if (!item.enter)
														item.leave = null;
		
											}
		
									}
		
							}
		
					});
		
			},
		
			/**
			 * Initializes scroll events.
			 */
			init: function() {
		
				// Bind handler to events.
					on('load', this.handler);
					on('resize', this.handler);
					on('scroll', this.handler);
		
				// Do initial handler call.
					(this.handler)();
		
			}
		};
		
		// Initialize.
			scrollEvents.init();
	
	// Deferred.
		(function() {
		
			var items = $$('.deferred'),
				loadHandler, enterHandler;
		
			// Handlers.
		
				/**
				 * "On Load" handler.
				 */
				loadHandler = function() {
		
					var i = this,
						p = this.parentElement;
		
					// Not "done" yet? Bail.
						if (i.dataset.src !== 'done')
							return;
		
					// Show image.
						if (Date.now() - i._startLoad < 375) {
		
							p.classList.remove('loading');
							p.style.backgroundImage = 'none';
							i.style.transition = '';
							i.style.opacity = 1;
		
						}
						else {
		
							p.classList.remove('loading');
							i.style.opacity = 1;
		
							setTimeout(function() {
								i.style.backgroundImage = 'none';
								i.style.transition = '';
							}, 375);
		
						}
		
				};
		
				/**
				 * "On Enter" handler.
				 */
				enterHandler = function() {
		
					var	i = this,
						p = this.parentElement,
						src;
		
					// Get src, mark as "done".
						src = i.dataset.src;
						i.dataset.src = 'done';
		
					// Mark parent as loading.
						p.classList.add('loading');
		
					// Swap placeholder for real image src.
						i._startLoad = Date.now();
						i.src = src;
		
				};
		
			// Initialize items.
				items.forEach(function(p) {
		
					var i = p.firstElementChild;
		
					// Set parent to placeholder.
						if (!p.classList.contains('enclosed')) {
		
							p.style.backgroundImage = 'url(' + i.src + ')';
							p.style.backgroundSize = '100% 100%';
							p.style.backgroundPosition = 'top left';
							p.style.backgroundRepeat = 'no-repeat';
		
						}
		
					// Hide image.
						i.style.opacity = 0;
						i.style.transition = 'opacity 0.375s ease-in-out';
		
					// Load event.
						i.addEventListener('load', loadHandler);
		
					// Add to scroll events.
						scrollEvents.add({
							element: i,
							enter: enterHandler,
							offset: 250,
						});
		
				});
		
		})();
	
	// "On Visible" animation.
		var onvisible = {
		
			/**
			 * Effects.
			 * @var {object}
			 */
			effects: {
				'blur-in': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.filter = 'none';
					},
				},
				'zoom-in': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'scale(' + (1 - ((alt ? 0.25 : 0.05) * intensity)) + ')';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'zoom-out': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'scale(' + (1 + ((alt ? 0.25 : 0.05) * intensity)) + ')';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'slide-left': {
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.transform = 'translateX(100vw)';
					},
					play: function() {
						this.style.transform = 'none';
					},
				},
				'slide-right': {
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.transform = 'translateX(-100vw)';
					},
					play: function() {
						this.style.transform = 'none';
					},
				},
				'flip-forward': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? 45 : 15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'flip-backward': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? -45 : -15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'flip-left': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? 45 : 15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'flip-right': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? -45 : -15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'tilt-left': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'rotate(' + ((alt ? 45 : 5) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'tilt-right': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'rotate(' + ((alt ? -45 : -5) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-right': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateX(' + (-1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-left': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateX(' + (1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-down': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateY(' + (-1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-up': {
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateY(' + (1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-in': {
					transition: function (speed, delay) {
						return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'fade-in-background': {
					custom: true,
					transition: function (speed, delay) {
		
						this.style.setProperty('--onvisible-speed', speed + 's');
		
						if (delay)
							this.style.setProperty('--onvisible-delay', delay + 's');
		
					},
					rewind: function() {
						this.style.removeProperty('--onvisible-background-color');
					},
					play: function() {
						this.style.setProperty('--onvisible-background-color', 'rgba(0,0,0,0.001)');
					},
				},
				'zoom-in-image': {
					target: 'img',
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.transform = 'scale(1)';
					},
					play: function(intensity) {
						this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
					},
				},
				'zoom-out-image': {
					target: 'img',
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
					},
					play: function() {
						this.style.transform = 'none';
					},
				},
				'focus-image': {
					target: 'img',
					transition: function (speed, delay) {
						return  'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.transform = 'scale(' + (1 + (0.05 * intensity)) + ')';
						this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
					},
					play: function(intensity) {
						this.style.transform = 'none';
						this.style.filter = 'none';
					},
				},
			},
		
			/**
			 * Regex.
			 * @var {RegExp}
			 */
			regex: new RegExp('([a-zA-Z0-9\.\,\-\_\"\'\?\!\:\;\#\@\#$\%\&\(\)\{\}]+)', 'g'),
		
			/**
			 * Adds one or more animatable elements.
			 * @param {string} selector Selector.
			 * @param {object} settings Settings.
			 */
			add: function(selector, settings) {
		
				var	_this = this,
					style = settings.style in this.effects ? settings.style : 'fade',
					speed = parseInt('speed' in settings ? settings.speed : 1000) / 1000,
					intensity = ((parseInt('intensity' in settings ? settings.intensity : 5) / 10) * 1.75) + 0.25,
					delay = parseInt('delay' in settings ? settings.delay : 0) / 1000,
					replay = 'replay' in settings ? settings.replay : false,
					stagger = 'stagger' in settings ? (parseInt(settings.stagger) >= 0 ? (parseInt(settings.stagger) / 1000) : false) : false,
					staggerOrder = 'staggerOrder' in settings ? settings.staggerOrder : 'default',
					staggerSelector = 'staggerSelector' in settings ? settings.staggerSelector : null,
					threshold = parseInt('threshold' in settings ? settings.threshold : 3),
					state = 'state' in settings ? settings.state : null,
					effect = this.effects[style],
					scrollEventThreshold;
		
				// Determine scroll event threshold.
					switch (threshold) {
		
						case 1:
							scrollEventThreshold = 0;
							break;
		
						case 2:
							scrollEventThreshold = 0.125;
							break;
		
						default:
						case 3:
							scrollEventThreshold = 0.25;
							break;
		
						case 4:
							scrollEventThreshold = 0.375;
							break;
		
						case 5:
							scrollEventThreshold = 0.475;
							break;
		
					}
		
				// Step through selected elements.
					$$(selector).forEach(function(e) {
		
						var children, enter, leave, targetElement, triggerElement;
		
						// Stagger in use, and stagger selector is "all children"? Expand text nodes.
							if (stagger !== false
							&&	staggerSelector == ':scope > *')
								_this.expandTextNodes(e);
		
						// Get children.
							children = (stagger !== false && staggerSelector) ? e.querySelectorAll(staggerSelector) : null;
		
						// Define handlers.
							enter = function(staggerDelay=0) {
		
								var _this = this,
									transitionOrig;
		
								// Target provided? Use it instead of element.
									if (effect.target)
										_this = this.querySelector(effect.target);
		
								// Not a custom effect?
									if (!effect.custom) {
		
										// Save original transition.
											transitionOrig = _this.style.transition;
		
										// Apply temporary styles.
											_this.style.setProperty('backface-visibility', 'hidden');
		
										// Apply transition.
											_this.style.transition = effect.transition(speed, delay + staggerDelay);
		
									}
		
								// Otherwise, call custom transition handler.
									else
										effect.transition.apply(_this, [speed, delay + staggerDelay]);
		
								// Play.
									effect.play.apply(_this, [intensity, !!children]);
		
								// Not a custom effect?
									if (!effect.custom)
										setTimeout(function() {
		
											// Remove temporary styles.
												_this.style.removeProperty('backface-visibility');
		
											// Restore original transition.
												_this.style.transition = transitionOrig;
		
										}, (speed + delay + staggerDelay) * 1000 * 2);
		
							};
		
							leave = function() {
		
								var _this = this,
									transitionOrig;
		
								// Target provided? Use it instead of element.
									if (effect.target)
										_this = this.querySelector(effect.target);
		
								// Not a custom effect?
									if (!effect.custom) {
		
										// Save original transition.
											transitionOrig = _this.style.transition;
		
										// Apply temporary styles.
											_this.style.setProperty('backface-visibility', 'hidden');
		
										// Apply transition.
											_this.style.transition = effect.transition(speed);
		
									}
		
								// Otherwise, call custom transition handler.
									else
										effect.transition.apply(_this, [speed]);
		
								// Rewind.
									effect.rewind.apply(_this, [intensity, !!children]);
		
								// Not a custom effect?
									if (!effect.custom)
										setTimeout(function() {
		
											// Remove temporary styles.
												_this.style.removeProperty('backface-visibility');
		
											// Restore original transition.
												_this.style.transition = transitionOrig;
		
										}, speed * 1000 * 2);
		
							};
		
						// Initial rewind.
		
							// Determine target element.
								if (effect.target)
									targetElement = e.querySelector(effect.target);
								else
									targetElement = e;
		
							// Children? Rewind each individually.
								if (children)
									children.forEach(function(targetElement) {
										effect.rewind.apply(targetElement, [intensity, true]);
									});
		
							// Otherwise. just rewind element.
								else
									effect.rewind.apply(targetElement, [intensity]);
		
						// Determine trigger element.
							triggerElement = e;
		
							// Has a parent?
								if (e.parentNode) {
		
									// Parent is an onvisible trigger? Use it.
										if (e.parentNode.dataset.onvisibleTrigger)
											triggerElement = e.parentNode;
		
									// Otherwise, has a grandparent?
										else if (e.parentNode.parentNode) {
		
											// Grandparent is an onvisible trigger? Use it.
												if (e.parentNode.parentNode.dataset.onvisibleTrigger)
													triggerElement = e.parentNode.parentNode;
		
										}
		
								}
		
						// Add scroll event.
							scrollEvents.add({
								element: e,
								triggerElement: triggerElement,
								initialState: state,
								threshold: scrollEventThreshold,
								enter: children ? function() {
		
									var staggerDelay = 0,
										childHandler = function(e) {
		
											// Apply enter handler.
												enter.apply(e, [staggerDelay]);
		
											// Increment stagger delay.
												staggerDelay += stagger;
		
										},
										a;
		
									// Default stagger order?
										if (staggerOrder == 'default') {
		
											// Apply child handler to children.
												children.forEach(childHandler);
		
										}
		
									// Otherwise ...
										else {
		
											// Convert children to an array.
												a = Array.from(children);
		
											// Sort array based on stagger order.
												switch (staggerOrder) {
		
													case 'reverse':
		
														// Reverse array.
															a.reverse();
		
														break;
		
													case 'random':
		
														// Randomly sort array.
															a.sort(function() {
																return Math.random() - 0.5;
															});
		
														break;
		
												}
		
											// Apply child handler to array.
												a.forEach(childHandler);
		
										}
		
								} : enter,
								leave: (replay ? (children ? function() {
		
									// Step through children.
										children.forEach(function(e) {
		
											// Apply leave handler.
												leave.apply(e);
		
										});
		
								} : leave) : null),
							});
		
					});
		
			},
		
			/**
			 * Expand text nodes within an element into <text-node> elements.
			 * @param {DOMElement} e Element.
			 */
			expandTextNodes: function(e) {
		
				var s, i, w, x;
		
				// Step through child nodes.
					for (i = 0; i < e.childNodes.length; i++) {
		
						// Get child node.
							x = e.childNodes[i];
		
						// Not a text node? Skip.
							if (x.nodeType != Node.TEXT_NODE)
								continue;
		
						// Get node value.
							s = x.nodeValue;
		
						// Convert to <text-node>.
							s = s.replace(
								this.regex,
								function(x, a) {
									return '<text-node>' + a + '</text-node>';
								}
							);
		
						// Update.
		
							// Create wrapper.
								w = document.createElement('text-node');
		
							// Populate with processed text.
							// This converts our processed text into a series of new text and element nodes.
								w.innerHTML = s;
		
							// Replace original element with wrapper.
								x.replaceWith(w);
		
							// Step through wrapper's children.
								while (w.childNodes.length > 0) {
		
									// Move child after wrapper.
										w.parentNode.insertBefore(
											w.childNodes[0],
											w
										);
		
								}
		
							// Remove wrapper (now that it's no longer needed).
								w.parentNode.removeChild(w);
		
						}
		
			},
		
		};
	
	// Slideshow backgrounds.
		/**
		 * Slideshow background.
		 * @param {string} id ID.
		 * @param {object} settings Settings.
		 */
		function slideshowBackground(id, settings) {
		
			var _this = this;
		
			// Settings.
				if (!('images' in settings)
				||	!('target' in settings))
					return;
		
				this.id = id;
				this.wait = ('wait' in settings ? settings.wait : 0);
				this.defer = ('defer' in settings ? settings.defer : false);
				this.navigation = ('navigation' in settings ? settings.navigation : false);
				this.order = ('order' in settings ? settings.order : 'default');
				this.preserveImageAspectRatio = ('preserveImageAspectRatio' in settings ? settings.preserveImageAspectRatio : false);
				this.transition = ('transition' in settings ? settings.transition : { style: 'crossfade', speed: 1000, delay: 6000, resume: 12000 });
				this.images = settings.images;
		
			// Properties.
				this.preload = true;
				this.locked = false;
				this.$target = $(settings.target);
				this.$wrapper = ('wrapper' in settings ? $(settings.wrapper) : null);
				this.pos = 0;
				this.lastPos = 0;
				this.$slides = [];
				this.img = document.createElement('img');
				this.preloadTimeout = null;
				this.resumeTimeout = null;
				this.transitionInterval = null;
		
			// Using preserveImageAspectRatio and transition style is crossfade? Force to regular fade.
				if (this.preserveImageAspectRatio
				&&	this.transition.style == 'crossfade')
					this.transition.style = 'fade';
		
			// Adjust transition delay (if in use).
				if (this.transition.delay !== false)
					switch (this.transition.style) {
		
						case 'crossfade':
							this.transition.delay = Math.max(this.transition.delay, this.transition.speed * 2);
							break;
		
		
						case 'fade':
							this.transition.delay = Math.max(this.transition.delay, this.transition.speed * 3);
							break;
		
						case 'instant':
						default:
							break;
		
					}
		
			// Force navigation to false if using random order or a wrapper wasn't provided.
				if (!this.$wrapper
				||	this.order == 'random')
					this.navigation = false;
		
			// Defer?
				if (this.defer) {
		
					// Add to scroll events.
						scrollEvents.add({
							element: this.$target,
							enter: function() {
								_this.preinit();
							}
						});
		
				}
		
			// Otherwise ...
				else {
		
					// Preinit immediately.
						this.preinit();
		
				}
		
		};
		
			/**
			 * Gets the speed class name for a given speed.
			 * @param {int} speed Speed.
			 * @return {string} Speed class name.
			 */
			slideshowBackground.prototype.speedClassName = function(speed) {
		
				switch (speed) {
		
					case 1:
						return 'slow';
		
					default:
					case 2:
						return 'normal';
		
					case 3:
						return 'fast';
		
				}
		
			};
		
			/**
			 * Pre-initializes the slideshow background.
			 */
			slideshowBackground.prototype.preinit = function() {
		
				var _this = this;
		
				// Preload?
					if (this.preload) {
		
						// Mark as loading (after delay).
							this.preloadTimeout = setTimeout(function() {
								_this.$target.classList.add('is-loading');
							}, this.transition.speed);
		
						// Init after a delay (to prevent load events from holding up main load event).
							setTimeout(function() {
								_this.init();
							}, 0);
		
					}
		
				// Otherwise ...
					else {
		
						// Init immediately.
							this.init();
		
					}
		
			};
		
			/**
			 * Initializes the slideshow background.
			 */
			slideshowBackground.prototype.init = function() {
		
				var	_this = this,
					loaded = 0,
					hasLinks = false,
					dragStart = null,
					dragEnd = null,
					$slide, intervalId, i;
		
				// Apply classes.
					this.$target.classList.add('slideshow-background');
					this.$target.classList.add(this.transition.style);
		
				// Create navigation (if enabled).
					if (this.navigation) {
		
						// Next arrow (if allowed).
							this.$next = document.createElement('div');
								this.$next.classList.add('nav', 'next');
								this.$next.addEventListener('click', function(event) {
		
									// Stop transitioning.
										_this.stopTransitioning();
		
									// Show next slide.
										_this.next();
		
								});
								this.$wrapper.appendChild(this.$next);
		
						// Previous arrow (if allowed).
							this.$previous = document.createElement('div');
								this.$previous.classList.add('nav', 'previous');
								this.$previous.addEventListener('click', function(event) {
		
									// Stop transitioning.
										_this.stopTransitioning();
		
									// Show previous slide.
										_this.previous();
		
								});
								this.$wrapper.appendChild(this.$previous);
		
						// Swiping.
							this.$wrapper.addEventListener('touchstart', function(event) {
		
								// More than two touches? Bail.
									if (event.touches.length > 1)
										return;
		
								// Record drag start.
									dragStart = {
										x: event.touches[0].clientX,
										y: event.touches[0].clientY
									};
		
							});
		
							this.$wrapper.addEventListener('touchmove', function(event) {
		
								var dx, dy;
		
								// No drag start, or more than two touches? Bail.
									if (!dragStart
									||	event.touches.length > 1)
										return;
		
								// Record drag end.
									dragEnd = {
										x: event.touches[0].clientX,
										y: event.touches[0].clientY
									};
		
								// Determine deltas.
									dx = dragStart.x - dragEnd.x;
									dy = dragStart.y - dragEnd.y;
		
								// Doesn't exceed threshold? Bail.
									if (Math.abs(dx) < 50)
										return;
		
								// Prevent default.
									event.preventDefault();
		
								// Positive value? Move to next.
									if (dx > 0) {
		
										// Stop transitioning.
											_this.stopTransitioning();
		
										// Show next slide.
											_this.next();
		
									}
		
								// Negative value? Move to previous.
									else if (dx < 0) {
		
										// Stop transitioning.
											_this.stopTransitioning();
		
										// Show previous slide.
											_this.previous();
		
									}
		
							});
		
							this.$wrapper.addEventListener('touchend', function(event) {
		
								// Clear drag start, end.
									dragStart = null;
									dragEnd = null;
		
							});
		
					}
		
				// Create slides.
					for (i=0; i < this.images.length; i++) {
		
						// Preload?
							if (this.preload) {
		
								// Create img.
									this.$img = document.createElement('img');
										this.$img.src = this.images[i].src;
										this.$img.addEventListener('load', function(event) {
		
											// Increment loaded count.
												loaded++;
		
										});
		
							}
		
						// Create slide.
							$slide = document.createElement('div');
								$slide.style.backgroundImage = 'url(\'' + this.images[i].src + '\')';
								$slide.style.backgroundPosition = this.images[i].position;
								$slide.style.backgroundRepeat = 'no-repeat';
								$slide.style.backgroundSize = (this.preserveImageAspectRatio ? 'contain' : 'cover');
								$slide.setAttribute('role', 'img');
								$slide.setAttribute('aria-label', this.images[i].caption);
								this.$target.appendChild($slide);
		
							// Apply motion classes (if applicable).
								if (this.images[i].motion != 'none') {
		
									$slide.classList.add(this.images[i].motion);
									$slide.classList.add(this.speedClassName(this.images[i].speed));
		
								}
		
							// Link URL provided?
								if ('linkUrl' in this.images[i]) {
		
									// Set cursor style to pointer.
										$slide.style.cursor = 'pointer';
		
									// Set linkUrl property on slide.
										$slide._linkUrl = this.images[i].linkUrl;
		
									// Mark hasLinks as true.
										hasLinks = true;
		
								}
		
						// Add to array.
							this.$slides.push($slide);
		
					}
		
				// Has links? Add click event listener to target.
					if (hasLinks)
						this.$target.addEventListener('click', function(event) {
		
							var slide;
		
							// Target doesn't have linkUrl property? Bail.
								if (!('_linkUrl' in event.target))
									return;
		
							// Get slide.
								slide = event.target;
		
							// Onclick provided?
								if ('onclick' in slide._linkUrl) {
		
									// Run handler.
										(slide._linkUrl.onclick)(event);
		
									return;
		
								}
		
							// Href provided?
								if ('href' in slide._linkUrl) {
		
									// URL is a hash URL?
										if (slide._linkUrl.href.charAt(0) == '#') {
		
											// Go to hash URL.
												window.location.href = slide._linkUrl.href;
		
											return;
		
										}
		
									// Target provided and it's "_blank"? Open URL in new tab.
										if ('target' in slide._linkUrl
										&&	slide._linkUrl.target == '_blank')
											window.open(slide._linkUrl.href);
		
									// Otherwise, just go to URL.
										else
											window.location.href = slide._linkUrl.href;
		
								}
		
						});
		
				// Determine starting position.
					switch (this.order) {
		
						case 'random':
		
							// Randomly pick starting position.
								this.pos = (Math.ceil(Math.random() * this.$slides.length) - 1);
		
							break;
		
						case 'reverse':
		
							// Start at end.
								this.pos = this.$slides.length - 1;
		
							break;
		
						case 'default':
						default:
		
							// Start at beginning.
								this.pos = 0;
		
							break;
		
					}
		
					// Update last position.
						this.lastPos = this.pos;
		
				// Preload?
					if (this.preload)
						intervalId = setInterval(function() {
		
							// All images loaded?
								if (loaded >= _this.images.length) {
		
									// Stop checking.
										clearInterval(intervalId);
		
									// Clear loading.
										clearTimeout(_this.preloadTimeout);
										_this.$target.classList.remove('is-loading');
		
									// Start.
										_this.start();
		
								}
		
						}, 250);
		
				// Otherwise ...
					else {
		
						// Start.
							this.start();
		
					}
		
			};
		
			/**
			 * Moves to an adjacent slide.
			 * @param {int} direction Direction (1 = forwards, -1 = backwards).
			 */
			slideshowBackground.prototype.move = function(direction) {
		
				var pos, order;
		
				// Determine effective order based on chosen direction.
					switch (direction) {
		
						// Forwards: use order as-is.
							case 1:
								order = this.order;
								break;
		
						// Backwards: inverse order.
							case -1:
								switch (this.order) {
		
									case 'random':
										order = 'random';
										break;
		
									case 'reverse':
										order = 'default';
										break;
		
									case 'default':
									default:
										order = 'reverse';
										break;
		
								}
		
								break;
		
						// Anything else: bail.
							default:
								return;
		
					}
		
				// Determine new position based on effective order.
					switch (order) {
		
						case 'random':
		
							// Randomly pick position.
								for (;;) {
		
									pos = (Math.ceil(Math.random() * this.$slides.length) - 1);
		
									// Didn't pick current position? Stop.
										if (pos != this.pos)
											break;
		
								}
		
							break;
		
						case 'reverse':
		
							// Decrement position.
								pos = this.pos - 1;
		
							// Wrap to end if necessary.
								if (pos < 0)
									pos = this.$slides.length - 1;
		
							break;
		
						case 'default':
						default:
		
							// Increment position.
								pos = this.pos + 1;
		
							// Wrap to beginning if necessary.
								if (pos >= this.$slides.length)
									pos = 0;
		
							break;
		
					}
		
				// Show pos.
					this.show(pos);
		
			};
		
			/**
			 * Moves to next slide.
			 */
			slideshowBackground.prototype.next = function() {
		
				// Move forwards.
					this.move(1);
		
			};
		
			/**
			 * Moves to previous slide.
			 */
			slideshowBackground.prototype.previous = function() {
		
				// Move backwards.
					this.move(-1);
		
			};
		
			/**
			 * Shows a slide.
			 * @param {int} pos Position.
			 */
			slideshowBackground.prototype.show = function(pos) {
		
				var _this = this;
		
				// Locked? Bail.
					if (this.locked)
						return;
		
				// Capture current position.
					this.lastPos = this.pos;
		
				// Switch to new position.
					this.pos = pos;
		
				// Perform transition.
					switch (this.transition.style) {
		
						case 'instant':
		
							// Swap top slides.
								this.$slides[this.lastPos].classList.remove('top');
								this.$slides[this.pos].classList.add('top');
		
							// Show current slide.
								this.$slides[this.pos].classList.add('visible');
		
							// Start playing current slide.
								this.$slides[this.pos].classList.add('is-playing');
		
							// Hide last slide.
								this.$slides[this.lastPos].classList.remove('visible');
								this.$slides[this.lastPos].classList.remove('initial');
		
							// Stop playing last slide.
								this.$slides[this.lastPos].classList.remove('is-playing');
		
							break;
		
						case 'crossfade':
		
							// Lock.
								this.locked = true;
		
							// Swap top slides.
								this.$slides[this.lastPos].classList.remove('top');
								this.$slides[this.pos].classList.add('top');
		
							// Show current slide.
								this.$slides[this.pos].classList.add('visible');
		
							// Start playing current slide.
								this.$slides[this.pos].classList.add('is-playing');
		
							// Wait for fade-in to finish.
								setTimeout(function() {
		
									// Hide last slide.
										_this.$slides[_this.lastPos].classList.remove('visible');
										_this.$slides[_this.lastPos].classList.remove('initial');
		
									// Stop playing last slide.
										_this.$slides[_this.lastPos].classList.remove('is-playing');
		
									// Unlock.
										_this.locked = false;
		
								}, this.transition.speed);
		
							break;
		
						case 'fade':
		
							// Lock.
								this.locked = true;
		
							// Hide last slide.
								this.$slides[this.lastPos].classList.remove('visible');
		
							// Wait for fade-out to finish.
								setTimeout(function() {
		
									// Stop playing last slide.
										_this.$slides[_this.lastPos].classList.remove('is-playing');
		
									// Swap top slides.
										_this.$slides[_this.lastPos].classList.remove('top');
										_this.$slides[_this.pos].classList.add('top');
		
									// Start playing current slide.
										_this.$slides[_this.pos].classList.add('is-playing');
		
									// Show current slide.
										_this.$slides[_this.pos].classList.add('visible');
		
									// Unlock.
										_this.locked = false;
		
								}, this.transition.speed);
		
							break;
		
						default:
							break;
		
					}
		
			};
		
			/**
			 * Starts the slideshow.
			 */
			slideshowBackground.prototype.start = function() {
		
				var _this = this;
		
				// Prepare initial slide.
					this.$slides[_this.pos].classList.add('visible');
					this.$slides[_this.pos].classList.add('top');
					this.$slides[_this.pos].classList.add('initial');
					this.$slides[_this.pos].classList.add('is-playing');
		
				// Single slide? Bail.
					if (this.$slides.length == 1)
						return;
		
				// Wait (if needed).
					setTimeout(function() {
		
						// Start transitioning.
							_this.startTransitioning();
		
					}, this.wait);
		
			};
		
			/**
			 * Starts transitioning.
			 */
			slideshowBackground.prototype.startTransitioning = function() {
		
				var _this = this;
		
				// Delay not in use? Bail.
					if (this.transition.delay === false)
						return;
		
				// Start transition interval.
					this.transitionInterval = setInterval(function() {
		
						// Move to next slide.
							_this.next();
		
					}, this.transition.delay);
		
			};
		
			/**
			 * Stops transitioning.
			 */
			slideshowBackground.prototype.stopTransitioning = function() {
		
				var _this = this;
		
				// Clear transition interval.
					clearInterval(this.transitionInterval);
		
				// Resume in use?
					if (this.transition.resume !== false) {
		
						// Clear resume timeout (if one already exists).
							clearTimeout(this.resumeTimeout);
		
						// Set resume timeout.
							this.resumeTimeout = setTimeout(function() {
		
								// Start transitioning.
									_this.startTransitioning();
		
							}, this.transition.resume);
		
					}
		
			};
	
	// Container: background.
		(function() {
		
			var $target, $slideshowBackground;
		
			$target = $('#background');
		
			$slideshowBackground = document.createElement('div');
				$slideshowBackground.className = 'slideshow-background';
				$target.insertBefore($slideshowBackground, $target.firstChild);
		
			new slideshowBackground('background', {
				target: '#background > .slideshow-background',
				wait: 0,
				defer: true,
				order: 'default',
				transition: {
					style: 'fade',
					speed: 3000,
					delay: 1000,
				},
				images: [
					{
						src: 'assets/images/background-4afb57dd.jpg',
						position: 'top left',
						motion: 'down',
						speed: 2,
						caption: 'xan.lol stickers',
					},
					{
						src: 'assets/images/background-fca5f0c6.jpg',
						position: 'center',
						motion: 'in',
						speed: 1,
						caption: 'A cat named Jack',
					},
					{
						src: 'assets/images/background-1d82f158.jpg',
						position: 'bottom right',
						motion: 'in',
						speed: 2,
						caption: 'Some shampoo',
					},
					{
						src: 'assets/images/background-5ab18195.jpg',
						position: 'center',
						motion: 'none',
						speed: 2,
						caption: 'A cat I found outside',
					},
					{
						src: 'assets/images/background-76b36ab5.jpg',
						position: 'center',
						motion: 'in',
						speed: 2,
						caption: 'A hat with Marvel&#039;s Captain America on it, next to a pin with writing that says &quot;I&#039;m Xan!&quot; with a drawing of a smiling below',
					},
					{
						src: 'assets/images/background-e7aa2ffd.jpg',
						position: 'center',
						motion: 'in',
						speed: 2,
						caption: 'The cat named Molly',
					},
					{
						src: 'assets/images/background-976648f2.jpg',
						position: 'center',
						motion: 'out',
						speed: 2,
						caption: 'A car driving on a wet highway with clouds and a bright reflection of sunlight on the ground',
					},
					{
						src: 'assets/images/background-cd21823b.jpg',
						position: 'left',
						motion: 'right',
						speed: 1,
						caption: 'A Guinea pig',
					},
					{
						src: 'assets/images/background-6cda4671.jpg',
						position: 'right',
						motion: 'left',
						speed: 2,
						caption: 'Some stuffed reindeer',
					},
					{
						src: 'assets/images/background-bd4ae7e9.jpg',
						position: 'right',
						motion: 'left',
						speed: 2,
						caption: 'Another cat (it looks ginger)',
					},
					{
						src: 'assets/images/background-ff935909.jpg',
						position: 'bottom',
						motion: 'up',
						speed: 2,
						caption: 'The Captain America shield from Marvel films',
					},
					{
						src: 'assets/images/background-cf491dd2.jpg',
						position: 'center',
						motion: 'down',
						speed: 2,
						caption: 'A cat consuming an electrical cord?',
					},
					{
						src: 'assets/images/background-51a201d8.jpg',
						position: 'center',
						motion: 'none',
						speed: 2,
						caption: 'A cat who is now dead :( rest in peace',
					},
				]
			});
		
		})();
	
	// Links: links08.
		$('#links08 > li:nth-child(2) > a').addEventListener(
			'click',
			function(event) { 
				let sitelink = {
				title: 'xan.lol/now',
				text: "\"What Xan's up to at the moment\" - /now",
				url: window.location.href,
				};
				
				navigator.share(sitelink);
			}
		);
	
	// Links: links07.
		$('#links07 > li:nth-child(2) > a').addEventListener(
			'click',
			function(event) { 
				let sitelink = {
				title: 'xan.lol/about',
				text: "\"About Xan and who Xan is\" - /about",
				url: window.location.href,
				};
				
				navigator.share(sitelink);
			}
		);
	
	// Links: links04.
		$('#links04 > li:nth-child(2) > a').addEventListener(
			'click',
			function(event) { 
				let sitelink = {
				title: 'xan.lol/socials',
				text: "\"Websites Xan has accounts on\" - /socials",
				url: window.location.href,
				};
				
				navigator.share(sitelink);
			}
		);
	
	// Links: links06.
		$('#links06 > li:nth-child(2) > a').addEventListener(
			'click',
			function(event) { 
				let sitelink = {
				title: 'xan.lol',
				text: "Xan's swaggy site",
				url: window.location.href,
				};
				
				navigator.share(sitelink);
			}
		);
	
	// Links: links03.
		$('#links03 > li:nth-child(2) > a').addEventListener(
			'click',
			function(event) { 
				let sitelink = {
				title: 'xan.lol/caps',
				text: "\"The official Cap Counter\" - /caps",
				url: window.location.href,
				};
				
				alert("No cap, I actually have 20 ball/dad/baseball hats/caps. 🧢");
				
				// navigator.share(sitelink);
			}
		);
	
	// Links: links02.
		$('#links02 > li:nth-child(2) > a').addEventListener(
			'click',
			function(event) { 
				let sitelink = {
				title: 'xan.lol/site',
				text: "\"Info regarding xan.lol\" - /site",
				url: window.location.href,
				};
				
				navigator.share(sitelink);
			}
		);
	
	// Links: links05.
		$('#links05 > li:nth-child(2) > a').addEventListener(
			'click',
			function(event) { 
				let sitelink = {
				title: 'xan.lol/peek',
				text: "\"Story regarding Gerald the giraffe\" - /peek",
				url: window.location.href,
				};
				
				navigator.share(sitelink);
			}
		);
	
	// Initialize "On Visible" animations.
		onvisible.add('#hometext', { style: 'fade-right', speed: 750, intensity: 5, threshold: 3, delay: 125, replay: true });
		onvisible.add('#text05', { style: 'fade-right', speed: 750, intensity: 5, threshold: 3, delay: 250, replay: true });
		onvisible.add('#homelinks', { style: 'fade-up', speed: 250, intensity: 5, threshold: 3, delay: 125, stagger: 125, staggerOrder: 'reverse', staggerSelector: ':scope > li', replay: true });
		onvisible.add('.links.style1', { style: 'fade-right', speed: 500, intensity: 5, threshold: 3, delay: 0, stagger: 125, staggerSelector: ':scope > li', replay: false });
		onvisible.add('h1.style2, h2.style2, h3.style2, p.style2', { style: 'flip-left', speed: 750, intensity: 10, threshold: 3, delay: 0, replay: false });
		onvisible.add('h1.style3, h2.style3, h3.style3, p.style3', { style: 'flip-forward', speed: 750, intensity: 10, threshold: 3, delay: 500, replay: false });
		onvisible.add('h1.style4, h2.style4, h3.style4, p.style4', { style: 'flip-forward', speed: 750, intensity: 10, threshold: 3, delay: 500, replay: true });
		onvisible.add('h1.style6, h2.style6, h3.style6, p.style6', { style: 'fade-right', speed: 750, intensity: 10, threshold: 3, delay: 250, replay: false });
		onvisible.add('.buttons.style1', { style: 'flip-forward', speed: 750, intensity: 5, threshold: 3, delay: 500, stagger: 125, staggerSelector: ':scope > li', replay: false });
		onvisible.add('#links09', { style: 'flip-forward', speed: 500, intensity: 5, threshold: 3, delay: 0, stagger: 125, staggerOrder: 'reverse', staggerSelector: ':scope > li', replay: true });
		onvisible.add('#image02', { style: 'flip-forward', speed: 500, intensity: 5, threshold: 3, delay: 250, replay: false });
		onvisible.add('#text09', { style: 'flip-forward', speed: 750, intensity: 10, threshold: 3, delay: 0, replay: false });

})();