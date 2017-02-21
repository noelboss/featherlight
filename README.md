Featherlight - ultra slim jQuery lightbox [![Build Status](https://travis-ci.org/noelboss/featherlight.svg?branch=master)](https://travis-ci.org/noelboss/featherlight)
------------------------

**Featherlight is a very lightweight jQuery lightbox plugin. For more information and demos, visit the [official website](http://noelboss.github.io/featherlight/).**

* Simple yet flexible
* Image, Ajax, iFrame and custom content support
* [Gallery Extension](https://github.com/noelboss/featherlight/#featherlight-gallery)
* Minimal CSS
* Name-spaced CSS and JavaScript
* Responsive
* Accessible
* Customizable via javascript or attributes



## [» Download Current Release 1.7.1](https://github.com/noelboss/featherlight/archive/1.7.1.zip)

Here you'll find a [list of all the changes](https://github.com/noelboss/featherlight/blob/master/CHANGELOG.md) and you can also download [old releases](https://github.com/noelboss/featherlight/releases) or [the master including all the latest  bling](https://github.com/noelboss/featherlight/archive/master.zip).


# Installation

All styling is done using CSS so you'll want to include the Featherlight CSS in your head.

	<link href="//cdn.rawgit.com/noelboss/featherlight/1.7.1/release/featherlight.min.css" type="text/css" rel="stylesheet" />

Be aware that Featherlight uses very unspecific CSS selectors to help you overwrite every aspect. This means in turn, that if you're not following a modularized approach to write CSS (which you should! It's terrific!) and have many global and specific definitions (read ID's and such – which you shouldn't), these definitions can break the Featherlight styling.

Featherlight requires jQuery version 1.7.0 or higher. It's recommended to include the javascript at the bottom of the page before the closing `</body>` tag.

	<script src="//code.jquery.com/jquery-latest.js"></script>
	<script src="//cdn.rawgit.com/noelboss/featherlight/1.7.1/release/featherlight.min.js" type="text/javascript" charset="utf-8"></script>


# Usage

By default, featherlight acts on all elements using the 'data-featherlight' attribute. An element with this attribute triggers the lightbox. The value of the attribute acts as selector for an element that's opened as lightbox.

	<a href="#" data-featherlight="#mylightbox">Open element in lightbox</a>
	<div id="mylightbox">This div will be opened in a lightbox</div>

Featherlight is smart. 'data-featherlight' can also contain a link to an image, an ajax-url or even DOM code:

	<a href="#" data-featherlight="myimage.png">Open image in lightbox</a>
	<a href="#" data-featherlight="myhtml.html .selector">Open ajax content in lightbox</a>
	<a href="#" data-featherlight="<p>Fancy DOM Lightbox!</p>">Open some DOM in lightbox</a>

it also works with links using href and the "image" and "ajax" keywords (this can also be manually set with the configuration options like `{image: 'photo.jpg}` or `{type: 'image'}`):

	<a href="myimage.png" data-featherlight="image">Open image in lightbox</a>
	<a href="myhtml.html .selector" data-featherlight="ajax">Open ajax content in lightbox</a>
	<a href="#" data-featherlight-ajax="myhtml.html .selector">Open ajax content in lightbox</a>
	<a href="#" data-featherlight="myhtml.html .selector" data-featherlight-type="ajax">Open ajax content in lightbox</a>

By default, Featherlight initializes all elements matching `$.featherlight.autoBind` on document ready. If you want to prevent this, set `$.featherlight.autoBind` to `false` before the DOM is ready.

## Bind Featherlight
You can bind the Featherlight events on any element using the following code:

	$('.myElement').featherlight($content, configuration);

It will then look for the `targetAttr` (by default "data-featherlight") on this element and use its value to find the content that will be opened as lightbox when you click on the element.

***$content*** – jQuery Object or String: You can manually pass a jQuery object or a string (see [content filters](#content-filters)) to be opened in the ligthbox. Optional

***configuration*** – Object: Object to configure certain aspects of the plugin. See [Configuration](#configuration). Optional

## Manual calling of Featherlight
In cases where you don't want an Element to act as Trigger you can call Featherlight manually. You can use this for example in an ajax callback to display the response data.

	$.featherlight($content, configuration);

***$content*** – jQuery Object or String: You can manually pass a jQuery object or a string (see [content filters](#content-filters)) to be opened in the ligthbox. Optional

***configuration*** – Object: Object to configure certain aspects of the plugin. See [Configuration](#configuration). Optional

# Configuration

Featherlight comes with a bunch of configuration-options which make it very flexible.
These options can be passed when calling `featherlight`.
Alternatively, they can specified as attribute on the elements triggering the lightbox;
for example, `<a data-featherlight-close-on-esc="false" ...>` has the same effect as
passing `{closeOnEsc: false}`.
You can also modify the `$.featherlight.defaults` directly which holds all the defaults:

```javascript
/* you can access and overwrite all defaults using $.featherlight.defaults */
defaults: {
	namespace:      'featherlight',        /* Name of the events and css class prefix */
	targetAttr:     'data-featherlight',   /* Attribute of the triggered element that contains the selector to the lightbox content */
	variant:        null,                  /* Class that will be added to change look of the lightbox */
	resetCss:       false,                 /* Reset all css */
	background:     null,                  /* Custom DOM for the background, wrapper and the closebutton */
	openTrigger:    'click',               /* Event that triggers the lightbox */
	closeTrigger:   'click',               /* Event that triggers the closing of the lightbox */
	filter:         null,                  /* Selector to filter events. Think $(...).on('click', filter, eventHandler) */
	root:           'body',                /* Where to append featherlights */
	openSpeed:      250,                   /* Duration of opening animation */
	closeSpeed:     250,                   /* Duration of closing animation */
	closeOnClick:   'background',          /* Close lightbox on click ('background', 'anywhere', or false) */
	closeOnEsc:     true,                  /* Close lightbox when pressing esc */
	closeIcon:      '&#10005;',            /* Close icon */
	loading:        '',                    /* Content to show while initial content is loading */
	persist:        false,                 /* If set, the content will persist and will be shown again when opened again. 'shared' is a special value when binding multiple elements for them to share the same content */
	otherClose:     null,                  /* Selector for alternate close buttons (e.g. "a.close") */
	beforeOpen:     $.noop,                /* Called before open. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
	beforeContent:  $.noop,                /* Called when content is about to be presented. `this` is the featherlight instance. Gets event as parameter */
	beforeClose:    $.noop,                /* Called before close. can return false to prevent opening of lightbox. `this` is the featherlight instance. Gets event as parameter  */
	afterOpen:      $.noop,                /* Called after open. `this` is the featherlight instance. Gets event as parameter  */
	afterContent:   $.noop,                /* Called after content is ready and has been set. Gets event as parameter, this contains all data */
	afterClose:     $.noop,                /* Called after close. `this` is the featherlight instance. Gets event as parameter  */
	onKeyUp:        $.noop,                /* Called on key up for the frontmost featherlight */
	onResize:       $.noop,                /* Called after new content and when a window is resized */
	type:           null,                  /* Specify content type. If unset, it will check for the targetAttrs value. */
	contentFilters: ['jquery', 'image', 'html', 'ajax', 'text'] /* List of content filters to use to determine the content */
	jquery/image/html/ajax/text: undefined /* Specify content type and data */
}
```

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

	closeIcon – String: '&#10005;';
Oh the naming...

================================================

	loading – String: '';
Shown initially while content loads. The lightbox also has a class '.featherlight-loading' while content is loading. This makes it easy to specify a "Loading..." message or a spinner.

================================================

	persist - Boolean or 'shared': false;
If set, the content will persist and will be shown again when opened again.
In case where multiple buttons need to persist the same content, use the special value 'shared'.
The content filter `jquery` (used for links like `.some-class` or `#some-id`) will clone the given content if and only if it is not persisted. Otherwise it will be moved into the lightbox.

================================================

	otherClose - String: null
While the close icon generated by featherlight will have class 'featherlight-close', you may specify alternate selector for other buttons having the same effect in your dialog, for example "a:contains('Cancel')".

================================================

	background – DOM String: null
You can provide the wrapping DOM. This is a bit tricky and just for the advanced users. It's recommended to study the plugin code. But you need to provide an element with a "{namespace}-inner" class: the content of the lightbox will replace this element. It is recommended that instead of providing this option you modify the lightbox on `beforeOpen` or `afterOpen`.


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

	onKeyUp, onResize – Function: null
The function receives the event object. `this` is an object and contains the triggering DOM element (if existing) and the related Featherlight objects.

================================================

	type – String: null

The type object allows you to manually set what type the lightbox is. Set the value to 'image', 'ajax' or any of the content filters. Otherwise, the value from targetAttr will used be to determine the type of the lightbox. Example:

	$('.image-lightbox').featherlight({type: 'image'});


# Methods

`$.featherlight` is actually a constructor of new featherlight objects. Modify `$.featherlight.prototype` to change the default properties, or use the `configuration` object passed to the constructor to override the properties of that specific new instance.

It's possible to use or change these methods, but the API isn't guaranteed to remain constant; enquire if you have particular needs.

	var current = $.featherlight.current();
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
	<script>$('#example').featherlight('photo.gif');</script>

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
		regex: /^feed:/,
		process: function(url) { /* deal with url */ return $('Loading...'); }
	};
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

	<a href="#" data-featherlight="myimage.jpg">Open Image</a>

## Open lightbox with ajax content
Use Featherlight with ajax using 'ajax' keyword or providing a url. It even supports selecting elements inside the response document.

	<a href="url.html .jQuery-Selector" data-featherlight="ajax">Open Ajax Content</a>

or you can provide the link directly as the featherlight-attribute:

	<a href="#" data-featherlight="url.html .jQuery-Selector">Open Ajax Content</a>

## Open lightbox with iframe
Featherlight generates an iframe with the 'iframe' keyword and a given url

	<a href="http://www.example.com" data-featherlight="iframe">Open example.com in an iframe</a>

Options `iframeWidth`, `iframeMinWidth`, etc. or their corresponding data attributes `data-featherlight-iframe-width`, `data-featherlight-iframe-min-width` are used as CSS when present.

	$.featherlight({iframe: 'editor.html', iframeMaxWidth: '80%', iframeWidth: 500,
		iframeHeight: 300});

# IE8 background transparency
If you want the background in IE8 to be translucent, use data:image before the rgba background:

	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAA1BMVEUAAACnej3aAAAAAXRSTlPHReaPdQAAAApJREFUCNdjwAsAAB4AAdpxxYoAAAAASUVORK5CYII=);
	background: rgba(0, 0, 0, 0.8);

---

# Featherlight Gallery
You will need to use an extension (featherlight.gallery.js).  Since Featherlight was created to be as small and simple as possible, it has selected functionality, and  allows you to add additional functionality by using extensions.  featherlight.gallery.js is a small extension that turns your set of links into a [gallery](http://noelboss.github.io/featherlight/gallery.html).

## Gallery installation

Simply include the extension CSS and JavaScript Files after the regular featherlight files like this:

	<link href="//cdn.rawgit.com/noelboss/featherlight/1.7.1/release/featherlight.min.css" type="text/css" rel="stylesheet" />
	<link href="//cdn.rawgit.com/noelboss/featherlight/1.7.1/release/featherlight.gallery.min.css" type="text/css" rel="stylesheet" />

Add the JavaScript at the bottom of the body:

```html
	<script src="//code.jquery.com/jquery-latest.js"></script>
	<script src="//cdn.rawgit.com/noelboss/featherlight/1.7.1/release/featherlight.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="//cdn.rawgit.com/noelboss/featherlight/1.7.1/release/featherlight.gallery.min.js" type="text/javascript" charset="utf-8"></script>
```

Check out the example here: [Gallery with Featherlight](gallery.html)


## Gallery configuration

The gallery also has a range of configuration options and the following defaults:


```javascript
	$('a.gallery').featherlightGallery({
		previousIcon: '&#9664;',     /* Code that is used as previous icon */
		nextIcon: '&#9654;',         /* Code that is used as next icon */
		galleryFadeIn: 100,          /* fadeIn speed when slide is loaded */
		galleryFadeOut: 300          /* fadeOut speed before slide is loaded */
	});
```


It also overrides its `autoBind` global option:

```javascript
	autoBind: '[data-featherlight-gallery]' /* Will automatically bind elements matching this selector. Clear or set before onReady */
```

Example in pure HTML:

```html
    <section
      data-featherlight-gallery
      data-featherlight-filter="a"
    >
      <h>This is a gallery</h>
      <a href="photo_large.jpg"><img src="photo_thumbnail.jpg"></a>
      <a href="other_photo_large.jpg"><img src="other_photo_thumbnail.jpg"></a>
    </section>
```

Example in JavaScript (assuming there are `a` tags of class `gallery` in the page):

```javascript
	$('a.gallery').featherlightGallery({
		previousIcon: '«',
		nextIcon: '»',
		galleryFadeIn: 300,

		openSpeed: 300
	});
```

The gallery responds to custom events `previous` and `next` to navigate to the previous and next images.

Instead of navigation buttons it will use swipe events on touch devices, assuming that one of the [supported swipe libraries](https://github.com/noelboss/featherlight/wiki/Gallery:-swipe-on-touch-devices) is also installed.

It sets the classes `'featherlight-first-slide'` and `'featherlight-last-slide'` if the current slide is the first and/or last one.

## Gallery installation

Simply include the extension CSS and JavaScript Files after the regular featherlight files like this:

	<link href="//cdn.rawgit.com/noelboss/featherlight/1.7.1/release/featherlight.min.css" type="text/css" rel="stylesheet" />
	<link href="//cdn.rawgit.com/noelboss/featherlight/1.7.1/release/featherlight.gallery.min.css" type="text/css" rel="stylesheet" />
	<script src="//code.jquery.com/jquery-latest.js"></script>
	<script src="//cdn.rawgit.com/noelboss/featherlight/1.7.1/release/featherlight.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="//cdn.rawgit.com/noelboss/featherlight/1.7.1/release/featherlight.gallery.min.js" type="text/javascript" charset="utf-8"></script>

## Gallery on Mobile Devices
To support mobile/tablet and all touch devices, you will need to include one of the supported libraries. For example, to use swipe_detect library, include it in the header:

```html
 <script src="//cdnjs.cloudflare.com/ajax/libs/detect_swipe/2.1.1/jquery.detect_swipe.min.js"></script>
```


# Support

## Questions

For questions, please use [Stack Overflow](http://stackoverflow.com/questions/ask) and be sure to use the `featherlight.js` tag. Please **provide an example**, starting for example from [this jsfiddle](http://jsfiddle.net/JNsu6/15/)

## Reporting bugs and issues

If you believe you've found a bug, please open an issue on [Github](https://github.com/noelboss/featherlight/issues/new) and **provide an example** starting from [this jsfiddle](http://jsfiddle.net/JNsu6/15/).

## Pull requests

Pull requests are welcome (good tips can be found on [Stack Overflow](http://stackoverflow.com/questions/14680711/how-to-do-a-github-pull-request))

To run the tests, you can open `test/featherlight.html` or `test/featherlight_gallery.html` in your browser.
Alternatively, run them from the console with `grunt test`; you will need to run `npm install` the first time.
