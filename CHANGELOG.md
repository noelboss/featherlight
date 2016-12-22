Featherlight – Changelog
===================================

Master
-----------------------------------


1.7.0 - 2016-12-22
-----------------------------------
- Can now specify standard iFrame attributes and CSS [#269]
- Hopefully Fix iOS scroll issue [#77]

1.6.0 - 2016-11-16
-----------------------------------
- Changed close icon to a <button>. Be sure to use current CSS files too. [#260]
- Improved focus handling [#259]

1.5.0 - 2016-06-27
-----------------------------------
- CSS now sets box-sizing to border-box

1.4.0 - 2016-03-21
-----------------------------------
- New method `resize` that can be overriden if need be.

1.3.5 - 2015-11-13
-----------------------------------
- Bug fixes

1.3.4 - 2015-09-09
-----------------------------------
- Tweak auto binding to work with persist and remove limitation on filter.

1.3.3 - 2015-08-17
-----------------------------------
- Bug fixes

1.3.2 - 2015-06-09
-----------------------------------
- Gallery: renamed 'images' to 'slides'

1.3.1 - 2015-06-04
-----------------------------------
- Bug fix for 1.3.0

1.3.0 - 2015-06-03
-----------------------------------
- New `persist` option to persist content [#122]

1.2.3 - 2015-03-21
-----------------------------------
- Bump z-index to insure dialogs appear above everything else.
- Open & Close return promises that are resolved when their action successfully finishes.

1.2.2 - 2015-03-11
-----------------------------------
- Fixed Hammer support [#119]

1.2.1 - 2015-03-08
-----------------------------------
- Fixed `namespace` option.

1.2.0 - 2015-02-20
-----------------------------------
### Features
- New setting: loading (default is '') is shown initially while content loads. The lightbox also has a class '.featherlight-loading' while content is loading.
- New content-filter "iframe" to generate an iframe with the given URL.
  Options iframeWidth, iframeMinWidth, etc. or their corresponding data attributes
  are used as CSS when present.

### Changes
- Basic error handling for images that won't load

1.1.0 - 2015-02-17
-----------------------------------
### Features
- New callback: onResize called for new content and when the window is resized.
- onResize is used to automatically resize images if needed.

### Changes
- current() now returns null if no lightbox is currently opened
- now avoids memory leaks
- onKeyDown() renamed onKeyUp()

1.0.4 - 2015-01-27
-----------------------------------


1.0.3 - 2014-12-09
-----------------------------------
- Fix bug in IE8. Thanks a barry!

1.0.2 - 2014-11-26
-----------------------------------
- Gallery: Bug with beforeOpen callback. Thanks Cristian Bica!

1.0.1 - 2014-11-17
-----------------------------------
- Re-release, removing afterSlide & beforeSlide and some debugging code

1.0.0 - 2014-11-16
-----------------------------------
### Features
- New option filter to attach lazily like `$(sel).on('click', filter, ...)`. Attaching is done for the whole set, not on each individual element. Attributes of the whole set and the filtered
element are combined.
- New option otherClose to support extra closing buttons.
- New option root to support appending featherlight elsewhere than on the body.
- New content filter 'text' for plain text messages.
- New callback onKeyDown, beforeContent, afterContent
- Gallery can display mixed content, not just images.
- Gallery defaults are accessible with $.featherlightGallery.defaults
- Callbacks like afterOpen can be set using data-featherlight-after-open
- Gallery inherits Featherlight's prototype and class methods.
- Gallery can be called entirely from javascript.
- Gallery can be navigated using left and right arrow keys.
- Gallery uses its `autoBind` setting to automatically bind galleries. Its recommended to use it with the `filter` setting.

### Breaking changes
- `$.featherlight` now always trigger a new lightbox. Use `$.fn.featherlight` for attaching events to elements.
- The order of the arguments of `$.fn.featherlight` has been reversed, for consistency and ease of use, but remain optional.
- The configuration options `open` and `close` have been removed.
- The configuration options `autostart`, `context` and `selector` have been merged to the global `$.featherlight.autoBind`. It's also lazily attached, so items added via ajax, for example, will be automatically attached too.
- The `$elm` attribute has been removed.
- The `config` attribute has been removed and merged with the `this` object.
- The `methods` global attribute has been removed. Methods have changed quite a bit. Access the prototype instead if needed.
- Content returned from filters isn't cloned anymore.
- Gallery configuration has changed and is no longer nested under `gallery`.

### Maintenance & Fixes
- Small bugs fixed
- Content filter 'jquery' now clones content *and* bound handlers.


0.4.9 - 2014-06-12
-----------------------------------
### Maintenance & Fixes
- Bug fix with loading ajax [#63]

0.4.8 - 2014-06-11
-----------------------------------
### Maintenance & Fixes
- Bug fix with gallery navigation (bis) [#62]

0.4.7 - 2014-06-10
-----------------------------------
### Maintenance & Fixes
- Bug fix with gallery navigation [#62]

0.4.6 - 2014-06-05
-----------------------------------
### Maintenance & Fixes
- Fix bower manifest

0.4.5 - 2014-06-04
-----------------------------------
### Maintenance & Fixes
- Bugfix for IE 8.

0.4.4 - 2014-05-31
-----------------------------------
### Maintenance & Fixes
- Call `afterClose` callback after the end of the fadeout

0.4.2 - 2014-05-29
-----------------------------------
### Maintenance & Fixes
- Avoid using global events since they are undocumented and apparently deprecated.

0.4.1 - 2014-04-17
-----------------------------------
### Maintenance & Fixes
- Fix dialog disappearing for large fixed width content
- Fig gallery navigation on IE

0.4.0 - 2014-04-07
-----------------------------------
### Features
- New option closeOnClick to support closing by clicking anywhere
– Any element inside the lightbox with the class "featherlight-close" will now trigger the closing event
- Support for nested lightboxes
- Gallery uses swipes on touch devices (if a supported library present)
- Gallery support and uses events to navigate through the images
- New functions: `$.featherlight.close()` and `current()`
- All configuration options have their equivalent html attribute.
- Improved and extensible content filters.

### Breaking changes
- `closeOnBg` no longer supported, use `closeOnClick`
- Gallery: class `.featherlight-prev` renamed to `.featherlight-previous`

The following changes could require changes to your custom CSS:

– Improves the way tall images are handled using a bottom border to maintain space (cut of instead of shrunken unproportionally)
– Improves the way the with of the lightbox is handled
– Changed paddings from % to pixels
– Changed closing icon class to featherlight-close-icon

### Maintenance & Fixes
- Improvements for mobile devices
- Many small bugs fixed
- Tests added
- $.fn.featherlight is now chainable



0.3.1 - 2014-03-01
-----------------------------------
### Maintenance & Fixes
- This.$content in after functions as well as open and close method now references actual elements inside the lightbox
- If open function has no content to open, afterOpen is prevented


0.3.0 - 2014-03-01
-----------------------------------
### Features
- Hooks! Added  before and after functions:
	´beforeClose´ ´beforeOpen´ ´afterOpen´ ´afterClose´
- Manually initialize all config.selector elements after config.autostart = false;


	$.featherlight();


### Maintenance & Fixes
- Take care, open and clouse defaults have been rewritten for Hooks!
- Preventing text selection
- Fixed issue #8
- Fixed issue #9


0.2.2 - 2014-02-10
-----------------------------------
### Features
- Added closeIcon option
- Added Gallery Configuration Options:


	gallery: {
		previous: '&#9664;',   /* Code that is used as previous icon */
		next: '&#9654;',       /* Code that is used as next icon */
		fadeIn: 100,           /* fadeIn speed when image is loaded */
		fadeOut: 300           /* fadeOut speed before image is loaded */
	}


0.2.1 - 2014-02-10
-----------------------------------
### Maintenance & Fixes
- Added image scale based on viewport height vh



0.2.0 - 2014-02-10
-----------------------------------
### Features
- Added Gallery Extension. Check out the [example page](http://noelboss.github.io/featherlight/gallery.html).


0.1.13 - 2014-02-09
-----------------------------------
### Maintenance & Fixes
- Fixed issue #7 where links inside featherlight don't work


0.1.12 - 2014-02-03
-----------------------------------
### Features
- Added configuration option 'openSpeed' and 'closeSpeed' to set animation duration

### Maintenance & Fixes
- Featherlight checks for jQuery and throws an error if not loaded
- Some jslint improvements
– Moved minified files to release/ folder
- Using grunt


0.1.11 - 2013-12-11
-----------------------------------
### Maintenance & Fixes
- Fixed iFrame detection
- Fixed close icon CSS


0.1.10 - 2013-12-10
-----------------------------------
### Features
- Added configuration object 'type' with two keys: type.image: false, type.ajax: false, to manually set type of lightbox

### Maintenance & Fixes
- Fixed behavior with missing data in targetAttr and handling of non found content


0.1.9 - 2013-12-05
-----------------------------------
### Features
- Added support for ESC key to close lightbox

### Maintenance & Fixes
- Renamed option clickBgClose to closeOnBg for consistency


0.1.8 - 2013-11-11
-----------------------------------
### Maintenance & Fixes
- Improved code readability
- Fixed typos


0.1.7 - 2013-11-06
-----------------------------------
### Maintenance & Fixes
- Fixed IE8 Issue


0.1.6 - 2013-11-05
-----------------------------------
### Features
- Added support for ajax using data-featherlight="ajax" and a href attribute
- Added support for ajax using data-featherlight="url.html .jQuery-selector"
- Modified the way how images are handeled to match ajax method using data-featherlight="image"
- Added $.featherlight.methods so all methods are accessible

### Maintenance & Fixes
- Improved JS code
- Moved defaults to $.featherlight.defaults


0.1.5 - 2013-11-05
-----------------------------------
### Features
- Added support for images
- Added option to reset css – { resetCss: true }

### Maintenance & Fixes
- Improved CSS to use flexible height and vertical alignment
- Improved JS code


0.1.3 & 0.1.4 - 2013-11-05
-----------------------------------
### Maintenance & Fixes
- Added support for jQuery plugin site: http://plugins.jquery.com/featherlight/


0.1.2 - 2013-11-04
-----------------------------------
### Maintenance & Fixes
- Fixed close behavior
- Added changelog
- Fixed version numbers and dates


0.1.1 - 2013-10-24
-----------------------------------
### Features
- Added support for variant CSS class


0.1.0 - 2013-10-24
-----------------------------------

- Initial Commit
