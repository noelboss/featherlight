Featherlight – ultra slim jQuery lightbox
================================================

Featherlight is a very lightweight jQuery lightbox plugin.

* simple but flexible
* minimal css
* no inline css
* name-spaced
* completely customizable via config object
* iframe support out of the box
* call with custom content

http://noelboss.github.io/featherlight/

================================================

# Installation

All styling is done using CSS so you'll want to include the Featherlight CSS in your head.

	<link type="text/css" rel="stylesheet" href="src/featherlight.min.css" title="Featherlight Styles" />

Be aware that Featherlight uses very unspecific CSS selectors to help you override every aspact. This means in turn, that if you're not following a modularized approach to write CSS (which you should! It's terrific!) and have many global and specific definitions (read ID's and such – which you shouldn't), these definitions can break the Featherbox styling.

Featherlight requires jQuery version 1.7.0 or higher. It's recommended to include the javascript at the bottom of the page before the closing `</body>` tag.

	<script src="http://code.jquery.com/jquery-latest.js"></script>
	<script src="src/featherlight.min.js" type="text/javascript" charset="utf-8"></script>


# Usage

By default, featherlight acts on all elements using the data-featherlight attribute. An Element with this attribute triggers the lightbox. The value of the attribute acts as selector for an element thats opened as lightbox.

	<a herf="#" data-featherlight="#mylightbox">Open Lightbox</a>
	<div id="mylightbox">This div will be opened in a lightbox</div>

By default, Featherbox initializes all elements found with the configured selector on document ready. If you want to prevent this, set $.fn.featherlight.defaults.autostart to false before the DOM is ready.

## Bind Featherlight
You can bind the Featherlight events on any element using the following code:

	$('.myElement').featherlight(configuration, $content);

It will then look for the "targetAttr" (by default "data-featherlight") on this element and use its value to find the content that will be opened as lightbox when you click on the element.

***configuration*** – Object: Object to configure certain aspects of the plugin. See configuration.

***$content*** – jQuery Object or String: You can manually pass a jQuery Object or a String with containing HTML Code to be opened in the ligthbox.

## Manual calling of Featherlight
In cases where you don't want an Element to act as Trigger you can call Featherlight manually. You can use this for example in an ajax callback to display the response data.

	$.featherlight($content, configuration);

***$content*** – jQuery Object or String: You can manually pass a jQuery Object or a String with containing HTML Code to be opened in the ligthbox.

***configuration*** – Object: Object to configure certain aspects of the plugin. See configuration.

# Configuration

Featherbox comes with a bunch of configuration-options which make it very flexible. Pass this options in an object to the function call or override $.fn.featherlight.defaults.

================================================

	selector – String: '[data-featherlight]'
Selector used to collect triggering elements when document is ready.

================================================

	context – String: 'body'
Context used for selecting elements matching "selector". Usefull of you only want to bind featherbox to parts of the DOM, for example in content loaded via ajax.

================================================

	targetAttr – String:  'data-featherlight'
Attribute on the triggering element pointing to the target element that will be opened in the lightbox

================================================

	openTrigger & closeTrigger – String:  'click'
Events that are used to open or close the lightbox. The close event is bound to the close button and to the lightbox background (if enabled)

================================================

	namespace – String:  'featherlight'
All functions bound to elements are namespaced. This is also used to prefix all CSS classes for the background, the content-wrapper and the close button.

================================================

	variant – String:  null
Pass your own CSS class to adjust the styling of the lightbox according to your need. You can also use the  `data-featherlight-variant` attribute on the element triggering the lightbox.

================================================

	clickBgClose – Boolean: true
If true, the close event is also bound to the background

================================================

	clickBgClose – DOM String: null
You can provide the wrapping DOM. This is a bit tricky and just for the advanced users. It's recommended to study the plugin code. But you need to provide an element with a "{namespace}-close" class: the content of the lightbox will be added *after* this element.

================================================

	autostart – Boolean: true
By default, Featherbox finds all elements that match "selector" and binds the open and close functions. To disable, set $.fn.featherlight.defaults.autostart = false; before the document ready event is fired.

================================================

	 open – Function
This is the open function used to open the lightbox. It receives the event object. "this" is an object and contains the triggering DOM element (if existing) and the related Featherbox objects:
*$fl* – Containing the whole lightbox: background, content wrapper, close button and content.
*$content* – The content thats wrapped with the background and prepended with the close button.

	open: function(e){
		var t = this;
		t.$fl.prependTo('body').fadeIn();
		if(e) e.preventDefault();
	}

================================================

	close – Function
This is the close function used to close the lightbox. It receives the event object. "this" is an object and contains the triggering DOM element (if existing) and the related Featherbox objects:
*$fl* – Containing the whole lightbox: background, content wrapper, close button and content.
*$content* – The content thats wrapped with the background and prepended with the close button.

	close: function(e){
		var t = this;
		t.$fl.fadeOut(function(){
			t.$fl.detach();
		});
		if (e) e.preventDefault();
	}

# Examples

## Use link-hashtags to open lightbox
	<a href="#targetElement" class="fl">Open</a>
	<div id="targetElement">Lightbox</div>

	$('a.fl').featherlight({
		targetAttr: 'href'
	});

## Open Image with Featherlight
	<a href="myimage.jpg" class="fl" title="Feather">Open Image</a>

	$('a.fl').each(function(){
		$.featherlight('<img src="'+this.href+'" alt="'+this.title+'" />');
	});

## Open lightbox after loading data from ajax
Use Featherlight with ajax.

	$('a.ajax').click(function(){
		$.ajax(this.href, {
			success: function(data){
				$.featherlight(data);
			}
		});
		return false;
	});

## Featherlight your own style
Add class to override styling. For a full example check out the index.html

	$('a.fl').featherlight({
		variant: 'myCssClass'
	});

You can also use a data attribute:

	<a href="#" data-featherlight="#myLightbox" data-featherlight-variant="blingbling">Special Lightbox</a>

