/**
* Featherlight – ultra slim jQuery lightbox
* https://github.com/noelboss/featherlight
*
* Copyright 2012, Noel Bossart
* MIT Licensed.
*/
(function($) {
	"use strict";

	// extend jQuery
	$.fn.featherlight = function(config, $content) {
		var $a = $(this),                // contains the triggering element
			$bg = null,                  // contains background
			$content = $content || $(),  // contains content (lightbox)
			$fl = null,                  // contains content (lightbox) and background
			c = config || {};            // user config

		c =  $.extend({}, $.fn.featherlight.defaults, c);
		$bg = $(c.bg || '<div class="'+c.namespace+'"><div class="'+c.namespace+'-content"><span class="'+c.namespace+'-close">X</span></div></div>');

		$a.each(function(){
			var t = this,
				$t = $(this),
				variant = $t.attr('data-'+c.namespace+'-variant');

			if($content.length < 1){
				t.$content = $($t.attr(c.targetAttr), c.context);
			} else {
				t.$content = $content;
			}
			if(t.$content.length > 0){
				// clone DOM for the background, wrapper and the closebutton
				t.$fl = $bg.clone();

				// add css class to override styles
				if(variant){
					t.$fl.addClass(variant);
				}

				// bind close function on close button
				t.$fl.find('.'+c.namespace+'-close')
					.on(c.closeTrigger+'.'+c.namespace, $.proxy(c.close, t))
					.after(t.$content.show()); // add content after closebutton

				// close when click on background
				if(c.clickBgClose){
					t.$fl.on(c.closeTrigger+'.'+c.namespace, $.proxy(c.close, t));
				}

				// bind open function
				$t.on(c.openTrigger+'.'+c.namespace, $.proxy(c.open, t));
			}
		});
	};

	// featherlight defaults
	$.fn.featherlight.defaults = {
		selector:     '[data-featherlight]',  // elements that trigger the lightbox
		targetAttr:   'data-featherlight',    // attribut of the triggered element that contains the selector to the lightbox content
		openTrigger:  'click',                // event that triggers the lightbox
		closeTrigger: 'click',                // event that triggers the closing of the lightbox
		context:      'body',                 // context used to search for the lightbox content and triggers
		namespace:    'featherlight',         // name of the events and css class prefix
		clickBgClose: true,                   // close lightbox on click on the background
		bg: null,                             // custom DOM for the background, wrapper and the closebutton
		autostart:    true,                   // initialize all links with that match "selector" on document ready
		open: function(e){                     // opens the lightbox "this" contains $fl with the lightbox, and c with the configuration
			var t = this;
			t.$fl.prependTo('body').fadeIn();
			e.preventDefault();
		},
		close: function(e){                    // closes the lightbox "this" contains $fl with the lightbox, and c with the configuration
			var t = this;
			t.$fl.fadeOut(function(){
				t.$fl.detach();
			});
			e.preventDefault();
		}
	};

	// bind featherlight on ready if config autostart is true
	$(document).ready(function(){
		var c = $.fn.featherlight.defaults;
		if(c.autostart){
			$(c.selector, c.context).featherlight();
		}
	});
}(jQuery));
