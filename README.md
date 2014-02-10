Featherlight – ultra slim jQuery lightbox
================================================

**Featherlight is a very lightweight jQuery lightbox plugin. For more information and demos, visit the [official website](http://noelboss.github.io/featherlight/).**

* Simple yet flexible
* Image, Ajax, iFrame and custom content support
* [Gallery Extension](https://github.com/noelboss/featherlight/#featherlight-gallery)
* Minimal CSS
* Name-spaced CSS and JavaScript
* Responsive
* Customizable via configuration object


## [Download Current Release 0.2.2](https://github.com/noelboss/featherlight/archive/0.2.2.zip)

* [Old releases](https://github.com/noelboss/featherlight/releases)
* [Changelog](https://github.com/noelboss/featherlight/blob/master/CHANGELOG.md)


# Installation

All styling is done using CSS so you'll want to include the Featherlight CSS in your head.

	<link href="//rawgithub.com/noelboss/featherlight/master/src/featherlight.min.css" type="text/css" rel="stylesheet" title="Featherlight Styles" />

Be aware that Featherlight uses very unspecific CSS selectors to help you overwrite every aspect. This means in turn, that if you're not following a modularized approach to write CSS (which you should! It's terrific!) and have many global and specific definitions (read ID's and such – which you shouldn't), these definitions can break the Featherlight styling.

Featherlight requires jQuery version 1.7.0 or higher. It's recommended to include the javascript at the bottom of the page before the closing `</body>` tag.

	<script src="//code.jquery.com/jquery-latest.js"></script>
	<script src="//rawgithub.com/noelboss/featherlight/master/src/featherlight.min.js" type="text/javascript" charset="utf-8"></script>


# Usage

By default, featherlight acts on all elements using the 'data-featherlight' attribute. An element with this attribute triggers the lightbox. The value of the attribute acts as selector for an element that's opened as lightbox.

	<a href="#" data-featherlight="#mylightbox">Open element in lightbox</a>
	<div id="mylightbox">This div will be opened in a lightbox</div>

Featherlight is smart. 'data-featherlight' can also contain a link to an image, an ajax-url or even DOM code:

	<span data-featherlight="myimage.png">Open image in lightbox</a>
	<span data-featherlight="myhtml.html .selector">Open ajax content in lightbox</a>
	<span data-featherlight="<p>Fancy DOM Lightbox!</p>">Open some DOM in lightbox</span>

it also works with links using href and the "image" and "ajax" keywords (this can also be manually set with the configuration options `type.image` and `type.ajax`):

	<a href="myimage.png" data-featherlight="image">Open image in lightbox</a>
	<a href="myhtml.html .selector" data-featherlight="ajax">Open ajax content in lightbox</a>

By default, Featherlight initializes all elements matching `defaults.selector` on document ready. If you want to prevent this, set `$.featherlight.defaults.autostart` to false before the DOM is ready.

## Bind Featherlight
You can bind the Featherlight events on any element using the following code:

	$('.myElement').featherlight(configuration, $content);

It will then look for the `targetAttr` (by default "data-featherlight") on this element and use its value to find the content that will be opened as lightbox when you click on the element.

***configuration*** – Object: Object to configure certain aspects of the plugin. See [Configuration](#configuration).

***$content*** – jQuery Object or String: You can manually pass a jQuery object or a string containing HTML Code to be opened in the ligthbox.

## Manual calling of Featherlight
In cases where you don't want an Element to act as Trigger you can call Featherlight manually. You can use this for example in an ajax callback to display the response data.

	$.featherlight($content, configuration);

***$content*** – jQuery Object or String: You can manually pass a jQuery object or a string containing HTML Code to be opened in the ligthbox.

***configuration*** – Object: Object to configure certain aspects of the plugin. See [Configuration](#configuration).

# Configuration

Featherlight comes with a bunch of configuration-options which make it very flexible. Pass your options in an object to the function call or overwrite $.featherlight.defaults. This is the whole default object:

	/* you can access and overwrite all defaults using $.fl.defaults */
	defaults: {
		selector:     '[data-featherlight]',  /* elements that trigger the lightbox */
		context:      'body',                 /* context used to search for the lightbox content and triggers */
		type: {                               /* manually set type of lightbox. Otherwise, it will check for the targetAttrs value. */
			image: false,
			ajax: false
		},
		targetAttr:   'data-featherlight',    /* attribute of the triggered element that contains the selector to the lightbox content */
		openTrigger:  'click',                /* event that triggers the lightbox */
		closeTrigger: 'click',                /* event that triggers the closing of the lightbox */
		openSpeed:    250,                    /* duration of opening animation */
		closeSpeed:   250,                    /* duration of closing animation */
		namespace:    'featherlight',         /* name of the events and css class prefix */
		resetCss:     false,                  /* reset all css */
		variant:      null,                   /* class that will be added to change look of the lightbox */
		closeOnBg:    true,                   /* close lightbox on click on the background */
		closeOnEsc:   true,                   /* close lightbox when pressing esc */
		closeIcon:    '&#10005;',             /* close icon */
		background:   null,                   /* custom DOM for the background, wrapper and the closebutton */
		autostart:    true,                   /* initialize all links with that match "selector" on document ready */
		open: function(event){                /* opens the lightbox "this" contains $instance with the lightbox, and with the config */
			$.proxy($.featherlight.methods.open, this, event)();
		},
		close: function(event){                   /* closes the lightbox "this" contains $instance with the lightbox, and with the config */
			$.proxy($.featherlight.methods.close, this, event)();
		}
	}

================================================

	selector – String: '[data-featherlight]'
Selector used to collect triggering elements when document is ready.

================================================

	context – String: 'body'
Context used for selecting elements matching "selector". Useful of you only want to bind featherbox to parts of the DOM, for example in content loaded via ajax.

================================================

	type – Object: image: false, ajax: false
The type object allows you to manually set what type the lightbox is. Set the value of type.image or type.ajax to true. Otherwise, the value from targetAttr will be to determine the type of the lightbox. Example:

	$('.image-lightbox', $('.gallery')).featherlight({
		type: {
			image: true
		}
	});

================================================

	targetAttr – String:  'data-featherlight'
Attribute on the triggering element pointing to the target element that will be opened in the lightbox.

================================================

	openTrigger & closeTrigger – String:  'click'
Events that are used to open or close the lightbox. The close event is bound to the close button and to the lightbox background (if enabled)

================================================

	openSpeed & closeSpeed – Integer or String:  250
Defines the speed for the opening and close animations. Values allowed are [jQuery animation durations](http://api.jquery.com/animate/#duration). Avoid the usage of 0 since this would cause a reversal of time and the end of the world! (Okay, kidding, just the closing callback would not be fired and unused ghost-DOM would linger around, but still.)

================================================

	namespace – String:  'featherlight'
All functions bound to elements are namespaced. This is also used to prefix all CSS classes for the background, the content-wrapper and the close button.

================================================

	resetCss – Boolean: false
Set this to true to remove all default css and start from designing scratch.

================================================

	variant – String:  null
Pass your own CSS class to adjust the styling of the lightbox according to your need. You can also use the  `data-featherlight-variant` attribute on the element triggering the lightbox.

================================================

	closeOnBg – Boolean: true
If true, the close event is also bound to the background

================================================

	closeOnEsc – Boolean: true
If true, the lightbox is closed when pressing the ESC key

================================================

	closeIcon – String: &#10005`;
Oh the naming...

================================================

	background – DOM String: null
You can provide the wrapping DOM. This is a bit tricky and just for the advanced users. It's recommended to study the plugin code. But you need to provide an element with a "{namespace}-close" class: the content of the lightbox will be added *after* this element.

================================================

	autostart – Boolean: true
By default, Featherlight finds all elements that match "selector" and binds the open and close functions. To disable, set $.featherlight.defaults.autostart = false; before the document ready event is fired.

================================================

	 open – Function
This is the open function used to open the lightbox. It receives the event object. "this" is an object and contains the triggering DOM element (if existing) and the related Featherlight objects:
*$fl* – Containing the whole lightbox: background, content wrapper, close button and content.
*$content* – The content thats wrapped with the background and prepended with the close button.

	open: function(e){
		$.proxy($.featherlight.methods.open, this, e)();
	}

================================================

	close – Function
This is the close function used to close the lightbox. It receives the event object. "this" is an object and contains the triggering DOM element (if existing) and the related Featherlight objects:
*$fl* – Containing the whole lightbox: background, content wrapper, close button and content.
*$content* – The content thats wrapped with the background and prepended with the close button.

	close: function(e){
		$.proxy($.featherlight.methods.close, this, e)();
	}


# Methods

All of Featherlight's methods are stored in $.featherlight.methods and can therefore be overwritten like the configuration defaults.

	methods: { /* you can access and overwrite all methods using */
		/* setup iterates over a single instance of featherlight and prepares the background and binds the events */
		setup: function(config, content){
			// ...
		},

		/* this method prepares the content and converts it into a jQuery object */
		getContent: function(){
			// ...
		},

		/* opens the lightbox "this" contains $instance with the lightbox, and with the config */
		open: function(event){
			// ...
		},

		/* closes the lightbox "this" contains $instance with the lightbox, and with the config */
		close: function(event){
			// ...
		}
	}

You can overwrite a function like this:

	$.featherlight.methods.open = function() { alert('open!'); }

# Examples

## Use link-hashtags to open lightbox
	<a href="#targetElement" class="fl">Open</a>
	<div id="targetElement">Lightbox</div>

	$('a.fl').featherlight({
		targetAttr: 'href'
	});

## Open images with Featherlight
Us a link and point the data-featherlight attribute to the desired attribute which contains the link...

	<a href="myimage.jpg" data-featherlight="image">Open Image</a>

...or directly provide the link as the data-featherlight attribute:

	<span data-featherlight="myimage.jpg">Open Image</span>

## Open lightbox with ajax content
Use Featherlight with ajax using 'ajax' keyword or providing a url. It even supports selecting elements inside the response document.

	<a href="url.html .jQuery-Selector" data-featherlight="ajax">Open Ajax Content</a>

or you can provide the link directly as the featherlight-attribute:

	<a href="url.html .jQuery-Selector" data-featherlight="ajax">Open Ajax Content</a>


## Featherlight Gallery
Featherlight was created to be as small and simple as possible. Therefore it does not provide all functionality imaginable. But, since its small and simple, it can be extended easily. featherlight.gallery.js is a small extension that turns your set of links into a [gallery](http://noelboss.github.io/featherlight/gallery.html).

	$('a.gallery').featherlightGallery({
		openSpeed: 300
	});

The gallery also has a range of configuration options and the following defaults:

	gallery: {
		previous: '&#9664;',   /* Code that is used as previews icon */
		next: '&#9654;',       /* Code that is used as next icon */
		fadeIn: 100,           /* fadeIn speed when image is loaded */
		fadeOut: 300           /* fadeOut speed before image is loaded */
	}

Example:

	$('a.gallery').featherlightGallery({
		gallery: {
			previous: '«',
			next: '»',
			fadeIn: 300
		},
		openSpeed: 300
	});

### Installation

Simply include the extension CSS and JavaScript Files after the regular featherlight files like this:

	<link href="//rawgithub.com/noelboss/featherlight/master/src/featherlight.min.css" type="text/css" rel="stylesheet" title="Featherlight Styles" />
	<link href="//rawgithub.com/noelboss/featherlight/master/src/featherlight.gallery.min.css" type="text/css" rel="stylesheet" title="Featherlight Gallery Styles" />

Add the JavaScript at the bottom of the body:

	<script src="//code.jquery.com/jquery-latest.js"></script>
	<script src="//rawgithub.com/noelboss/featherlight/master/src/featherlight.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="//rawgithub.com/noelboss/featherlight/master/src/featherlight.gallery.min.js" type="text/javascript" charset="utf-8"></script>

Check out the example here: [Gallery with Featherlight](http://noelboss.github.io/featherlight/gallery.html)

### Configuration


# IE8 background transparency
If you want the background in IE8 to be translucent, use data:image before the rgba background:

	background: url(data:image/png;base64,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TUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDEzLTExLTA2VDIyOjExOjgxPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuMDwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj41PC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4xPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KbQS91AAAAB1JREFUGBljZGBgOA7EBAETQRVQBaMK8YYU0cEDAE1HANt9zybzAAAAAElFTkSuQmCC);
	background: rgba(0, 0, 0, 0.8);
