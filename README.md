Featherlight - ultra slim jQuery lightbox [![Build Status](https://travis-ci.org/noelboss/featherlight.svg?branch=master)](https://travis-ci.org/noelboss/featherlight)
------------------------

**Featherlight is a very lightweight jQuery lightbox plugin. For more information and demos, visit the [official website](http://noelboss.github.io/featherlight/).**

* Simple yet flexible
* Image, Ajax, iFrame and custom content support
* [Gallery Extension](https://github.com/noelboss/featherlight/#featherlight-gallery)
* Minimal CSS
* Name-spaced CSS and JavaScript
* Responsive
* Customizable via configuration object


## [» Download Current Release 1.0.3](https://github.com/noelboss/featherlight/archive/1.0.3.zip)

Here you'll find a [list of all the changes](https://github.com/noelboss/featherlight/blob/master/CHANGELOG.md) and you can also download [old releases](https://github.com/noelboss/featherlight/releases) or [the master including all the latest  bling](https://github.com/noelboss/featherlight/archive/master.zip).


# Installation

All styling is done using CSS so you'll want to include the Featherlight CSS in your head.

	<link href="//cdn.rawgit.com/noelboss/featherlight/1.0.3/release/featherlight.min.css" type="text/css" rel="stylesheet" title="Featherlight Styles" />

Be aware that Featherlight uses very unspecific CSS selectors to help you overwrite every aspect. This means in turn, that if you're not following a modularized approach to write CSS (which you should! It's terrific!) and have many global and specific definitions (read ID's and such – which you shouldn't), these definitions can break the Featherlight styling.

Featherlight requires jQuery version 1.7.0 or higher. It's recommended to include the javascript at the bottom of the page before the closing `</body>` tag.

	<script src="//code.jquery.com/jquery-latest.js"></script>
	<script src="//cdn.rawgit.com/noelboss/featherlight/1.0.3/release/featherlight.min.js" type="text/javascript" charset="utf-8"></script>


# Usage

By default, featherlight acts on all elements using the 'data-featherlight' attribute. An element with this attribute triggers the lightbox. The value of the attribute acts as selector for an element that's opened as lightbox.

	<a href="#" data-featherlight="#mylightbox">Open element in lightbox</a>
	<div id="mylightbox">This div will be opened in a lightbox</div>

Featherlight is smart. 'data-featherlight' can also contain a link to an image, an ajax-url or even DOM code:

	<span data-featherlight="myimage.png">Open image in lightbox</a>
	<span data-featherlight="myhtml.html .selector">Open ajax content in lightbox</a>
	<span data-featherlight="<p>Fancy DOM Lightbox!</p>">Open some DOM in lightbox</span>

it also works with links using href and the "image" and "ajax" keywords (this can also be manually set with the configuration options like `{image: 'photo.jpg}` or `{type: 'image'}`):

	<a href="myimage.png" data-featherlight="image">Open image in lightbox</a>
	<a href="myhtml.html .selector" data-featherlight="ajax">Open ajax content in lightbox</a>
	<a href="#" data-featherlight-ajax="myhtml.html .selector">Open ajax content in lightbox</a>
	<a href="#" data-featherlight="myhtml.html .selector" data-featherlight-type="ajax">Open ajax content in lightbox</a>

By default, Featherlight initializes all elements matching `defaults.selector` on document ready. If you want to prevent this, set `$.featherlight.defaults.autostart` to false before the DOM is ready.

## Bind Featherlight
You can bind the Featherlight events on any element using the following code:

	$('.myElement').featherlight($content, configuration);

It will then look for the `targetAttr` (by default "data-featherlight") on this element and use its value to find the content that will be opened as lightbox when you click on the element.

***configuration*** – Object: Object to configure certain aspects of the plugin. See [Configuration](#configuration).

***$content*** – jQuery Object or String: You can manually pass a jQuery object or a string (see [content filters](#content-filters)) to be opened in the ligthbox.

## Manual calling of Featherlight
In cases where you don't want an Element to act as Trigger you can call Featherlight manually. You can use this for example in an ajax callback to display the response data.

	$.featherlight($content, configuration);

***$content*** – jQuery Object or String: You can manually pass a jQuery object or a string (see [content filters](#content-filters)) to be opened in the ligthbox.

***configuration*** – Object: Object to configure certain aspects of the plugin. See [Configuration](#configuration).

# Configuration

Featherlight comes with a bunch of configuration-options which make it very flexible.
These options can be passed when calling `featherlight`.
Alternatively, they can specified as attribute on the elements triggering the lightbox;
for example, `<a data-featherlight-close-on-esc="false" ...>` has the same effect as
passing `{closeOnEsc: false}`.
You can also modify the `$.featherlight.defaults` directly which holds all the defaults:

	/* you can access and overwrite all defaults using $.featherlight.defaults */
	defaults: {
		namespace:    'featherlight',         /* Name of the events and css class prefix */
		targetAttr:   'data-featherlight',    /* Attribute of the triggered element that contains the selector to the lightbox content */
		variant:      null,                   /* Class that will be added to change look of the lightbox */
		resetCss:     false,                  /* Reset all css */
		background:   null,                   /* Custom DOM for the background, wrapper and the closebutton */
		openTrigger:  'click',                /* Event that triggers the lightbox */
		closeTrigger: 'click',                /* Event that triggers the closing of the lightbox */
		filter:       null,                   /* Selector to filter events. Think $(...).on('click', filter, eventHandler) */
		root:         'body',                 /* Where to append featherlights */
		openSpeed:    250,                    /* Duration of opening animation */
		closeSpeed:   250,                    /* Duration of closing animation */
		closeOnClick: 'background',           /* Close lightbox on click ('background', 'anywhere', or false) */
		closeOnEsc:   true,                   /* Close lightbox when pressing esc */
		closeIcon:    '&#10005;',             /* Close icon */
		otherClose:   null,                   /* Selector for alternate close buttons (e.g. "a.close") */
		beforeOpen:   $.noop,                 /* Called before open. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
		beforeContent: $.noop,                /* Called when content is loaded. Gets event as parameter, this contains all data */
		beforeClose:  $.noop,                 /* Called before close. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
		afterOpen:    $.noop,                 /* Called after open. Gets event as parameter, this contains all data */
		afterContent: $.noop,                 /* Called after content is ready and has been set. Gets event as parameter, this contains all data */
		afterClose:   $.noop,                 /* Called after close. Gets event as parameter, this contains all data */
		onKeyDown:    $.noop,									/* Called on key down for the frontmost featherlight */
		type:         null,                   /* Specify content type. If unset, it will check for the targetAttrs value. */
		contentFilters: ['jquery', 'image', 'html', 'ajax', 'text'] /* List of content filters to use to determine the content */
		jquery/image/html/ajax/text: undefined     /* Specify content type and data */
	}

================================================

	namespace – String:  'featherlight'
All functions bound to elements are namespaced. This is also used to prefix all CSS classes for the background, the content-wrapper and the close button.


================================================

	targetAttr – String:  'data-featherlight'
Attribute on the triggering element pointing to the target element or content that will be opened in the lightbox.

================================================

	variant – String:  null
Pass your own CSS class to adjust the styling of the lightbox according to your need.


================================================

	resetCss – Boolean: false
Set this to true to remove all default css and start from designing scratch.

================================================


	openTrigger & closeTrigger – String:  'click'
Events that are used to open or close the lightbox. The close event is bound to the close button and to the lightbox background (if enabled).
Has no effect if $.featherlight is called directly.

================================================

	filter - String: null
A selector to filter events, when calling `featherlight` on a jQuery set, in a similar fashion to `$(...).on('click', filter, eventHandler)`.

Attributes both the selector and the filtered element are taken into account.

In the following example, the first link will make an ajax request while the second will display the text "second".

    <div data-featherlight data-featherlight-filter="a"
         data-featherlight-type="ajax">
      <a href="first">Hello</a>
      <a href="second" data-featherlight-type="text">World</a>
    </div>

Limitation: While auto bound elements added dynamically after onReady (e.g. via Ajax) will work fine, those with a `filter` are only supported supported if present before onReady.

================================================

	root - String: 'body'
This selector specified where the featherlight should be appended.

================================================

	openSpeed & closeSpeed – Integer or String:  250
Defines the speed for the opening and close animations. Values allowed are [jQuery animation durations](http://api.jquery.com/animate/#duration). Avoid the usage of 0 since this would cause a reversal of time and the end of the world! (Okay, kidding, just the closing callback would not be fired and unused ghost-DOM would linger around, but still.)


================================================

	closeOnClick – 'background', 'anywhere' or false
If set, the close event is also bound to the either the background only or anywhere

================================================

	closeOnEsc – Boolean: true
If true, the lightbox is closed when pressing the ESC key

================================================

	closeIcon – String: &#10005`;
Oh the naming...

================================================

  otherClose - String: null
While the close icon generated by featherlight will have class 'featherlight-close', you may specify alternate selector for other buttons having the same effect in your dialog, for example "a:contains('Cancel')".

================================================

	background – DOM String: null
You can provide the wrapping DOM. This is a bit tricky and just for the advanced users. It's recommended to study the plugin code. But you need to provide an element with a "{namespace}-close" class: the content of the lightbox will be added *after* this element.


================================================

	beforeOpen, beforeClose – Function: null
Called before the open or close method is executed. This function can return false to prevent open or
close method from execution. `this` is an object and contains the triggering DOM element (if existing) and the related Featherlight objects.

	// example
	beforeOpen: function(event){
		console.log(this); // this contains all related elements
		return false; // prevent lightbox from opening
	}


================================================

	beforeContent, afterContent – Function: null
Called before and after the loading of the content. For ajax calls or images, there can be a significant delay, for inline content the two calls will occur one right after the other. It receives the event object. `this` is an object and contains the triggering DOM element (if existing) and the related Featherlight objects.

================================================

	afterOpen, afterClose – Function: null
Called after the open or close method is executed – it is not called, if the `before-` or `open` function returns `false`! It receives the event object. `this` is an object and contains the triggering DOM element (if existing) and the related Featherlight objects.

	// example
	afterOpen: function(event){
		console.log(this); // this contains all related elements
		alert(this.$content.hasClass('true')); // alert class of content
	}

================================================

	type – String: null

The type object allows you to manually set what type the lightbox is. Set the value to 'image', 'ajax' or any of the content filters. Otherwise, the value from targetAttr will used be to determine the type of the lightbox. Example:

	$('.image-lightbox').featherlight({type: 'image'});


# Methods

`$.featherlight` is actually a constructor with `$.featherlight.methods` as a prototype and all the configuration options as attributes.

It's possible to use or change these methods, but the API isn't guaranteed to remain constant; enquire if you have particular needs.

	var current = $.featherlight.current()
	current.close();
	// do something else
	current.open(); // reopen it

Check the source code for more details.

# Globals

`$.featherlight` has the following globals:

	autoBind: '[data-featherlight]' /* Will automatically bind elements matching this selector. Clear or set before onReady */
	current: function() /* returns the currently opened featherlight, or undefined */
	close:   function() /* closes the currently opened featherlight (if any) */

# Content Filters

There are many ways to specify content to featherlight. Featherlight uses a set of heuristics to determine the type, for example data ending with `.gif` will be assumed to be an image. The following are equivalent:

	<a href="#" data-featherlight="photo.gif">See in a lightbox</a>

	<a href="photo.gif" data-featherlight>See in a lightbox</a>

	<a id="#example" href="#">See in a lightbox</a>
	<script>$('#example').featherlight('photo.gif')</script>

In case the heuristic wouldn't work, you can specify which contentFiter to use:

	<a href="photo_without_extension" data-featherlight="image">See in a lightbox</a>

	<a id="force_as_image" href="photo_without_extension">See in a lightbox</a>
	<script>
		$('#force_as_image').featherlight('image');
		// Equivalent:
		$('#force_as_image').featherlight({type: {image: true}});
	</script>

	<a id="force_as_image2" href="#">See in a lightbox</a>
	<script>$('#force_as_image2').featherlight('photo_without_extension', {type:{image: true}});</script>

You can add your own heuristics, for example:

	$.featherlight.contentFilters.feed = {
		regex: /^feed:/
		process: function(url) { /* deal with url */ return $('Loading...'); }
	}
	$.featherlight.defaults.contentFilters.unshift('feed');

This way the following would be possible:

	<a href="feed://some_url" data-featherlight>See the feed in a lightbox</a>

The content filter 'text' needs to be specified explicitly, it has no heuristic attached to it:

	<a href="Hello, world" data-featherlight="text">Example</a>

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

	<a href="#" data-featherlight="url.html .jQuery-Selector">Open Ajax Content</a>


# IE8 background transparency
If you want the background in IE8 to be translucent, use data:image before the rgba background:

	background: url(data:image/png;base64,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TUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDEzLTExLTA2VDIyOjExOjgxPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuMDwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj41PC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4xPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KbQS91AAAAB1JREFUGBljZGBgOA7EBAETQRVQBaMK8YYU0cEDAE1HANt9zybzAAAAAElFTkSuQmCC);
	background: rgba(0, 0, 0, 0.8);

---

# Featherlight Gallery
Featherlight was created to be as small and simple as possible. Therefore it does not provide all functionality imaginable. But, since its small and simple, it can be extended easily. featherlight.gallery.js is a small extension that turns your set of links into a [gallery](http://noelboss.github.io/featherlight/gallery.html).

	$('a.gallery').featherlightGallery({
		openSpeed: 300
	});


## Gallery configuration

The gallery also has a range of configuration options and the following defaults:

	previousIcon: '&#9664;',     /* Code that is used as previous icon */
	nextIcon: '&#9654;',         /* Code that is used as next icon */
	galleryFadeIn: 100,          /* fadeIn speed when slide is loaded */
	galleryFadeOut: 300          /* fadeOut speed before slide is loaded */

It also overrides its `autoBind` global option:

	autoBind: '[data-featherlight-gallery]' /* Will automatically bind elements matching this selector. Clear or set before onReady */

Example in pure HTML:

    <section
      data-featherlight-gallery
      data-featherlight-filter="a"
    >
      <h>This is a gallery</h>
      <a href="photo_large.jpg"><img src="photo_thumbnail.jpg"></a>
      <a href="other_photo_large.jpg"><img src="other_photo_thumbnail.jpg"></a>
    </section>


Example in JavaScript (assuming there are `a` tags of class `gallery` in the page):

	$('a.gallery').featherlightGallery({
		previousIcon: '«',
		nextIcon: '»',
		galleryFadeIn: 300,

		openSpeed: 300
	});


The gallery responds to custom events `previous` and `next` to navigate to the previous and next images.

Instead of navigation buttons it will use swipe events on touch devices, assuming that one of the [supported swipe libraries](https://github.com/noelboss/featherlight/wiki/Gallery:-swipe-on-touch-devices) is also installed.

## Gallery installation

Simply include the extension CSS and JavaScript Files after the regular featherlight files like this:

	<link href="//cdn.rawgit.com/noelboss/featherlight/1.0.3/release/featherlight.min.css" type="text/css" rel="stylesheet" title="Featherlight Styles" />
	<link href="//cdn.rawgit.com/noelboss/featherlight/1.0.3/release/featherlight.gallery.min.css" type="text/css" rel="stylesheet" title="Featherlight Gallery Styles" />

Add the JavaScript at the bottom of the body:

	<script src="//code.jquery.com/jquery-latest.js"></script>
	<script src="//cdn.rawgit.com/noelboss/featherlight/1.0.3/release/featherlight.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="//cdn.rawgit.com/noelboss/featherlight/1.0.3/release/featherlight.gallery.min.js" type="text/javascript" charset="utf-8"></script>

Check out the example here: [Gallery with Featherlight](http://noelboss.github.io/featherlight/gallery.html)

# Support

## Reporting bugs and issues

If you believe you've found a bug, please open an issue on [Github](https://github.com/noelboss/featherlight/issues/new) and **provide an example** starting from [this jsfiddle](http://jsfiddle.net/JNsu6/15/).

## Pull requests

Pull requests are welcome (good tips can be found on [Stack Overflow](http://stackoverflow.com/questions/14680711/how-to-do-a-github-pull-request))

To run the tests, you can open `test/featherlight.html` or `test/featherlight_gallery.html` in your browser.
Alternatively, run them from the console with `grunt test`; you will need to run `npm install` the first time.
