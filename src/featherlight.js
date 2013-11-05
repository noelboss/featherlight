/**
* Featherlight – ultra slim jQuery lightbox
* Version 0.1.5 – https://github.com/noelboss/featherlight
*
* Copyright 2013, Noel Bossart
* MIT Licensed.
*/
(function($) {
	"use strict";

	/* featherlight object */
	var fl = {
		setup: function(config, content){
			var $elm = $(this),
				c = $.extend({}, $.fn.featherlight.defaults, config),
				variant = $elm.attr('data-'+c.namespace+'-variant') || c.variant,
				css = !c.resetCss ? c.namespace : c.namespace+'-reset', /* by adding -reset to the classname, we reset all the default css */
				$bg = $(c.bg || '<div class="'+css+'"><div class="'+css+'-content"><span class="'+css+'-close">X</span></div></div>');

			/* everything that we need later is stored in t (target) */
			var t = {
				c: c,
				content: content,
				$elm: $elm,
				$fl: $bg.clone() /* clone DOM for the background, wrapper and the closebutton */
			}

			/* add css class to override styles */
			if(variant){
				t.$fl.addClass(variant);
			}

			/* close when click on background */
			t.$fl.on(c.closeTrigger+'.'+c.namespace, $.proxy(c.close, t));

			/* bind or call open function */
			if(this.hasOwnProperty('nodeName')){
				$elm.on(c.openTrigger+'.'+c.namespace, $.proxy(c.open, t));
			} else {
				$.proxy(c.open, t)();
			}
		},

		/* this method prepares the content and converts it into a jQuery object */
		getContent: function(){
			var t = this,
				attr = t.$elm.attr(t.c.targetAttr);

			/* if we have DOM, convert to jQuery Object */
			if(typeof t.content === 'string'){
				t.content = $(t.content);
			} else if(t.content instanceof $ === false){ /* if we have no jQuery Object */

				/* check if targetAttr references an other attribute on the same element and use this attribute */
				if(t.$elm.attr(attr)){
					attr = t.$elm.attr(attr);
				}

				/* check if we have an image and create element */
				if(attr.match(/\.(png|jpg|jpeg|gif|tiff|bmp)$/i)){
					t.content = $('<img src="'+attr+'" alt="" class="'+t.c.namespace+'-image" />');
				} else { /* otherwise create jquery elemnt by using the attribute as selector */
					t.content = $($(attr), t.c.context);
				}
			}

			/* we need a special class for the iframe */
			if(t.content.is('iframe') || $('iframe', t.content).length > 0){
				t.$fl.addClass(t.c.namespace+'-iframe');
			}
		},

		/* opens the lightbox "this" contains $fl with the lightbox, and c with the configuration */
		open: function(e){
			if(e) e.preventDefault();
			var t = this;

			$.proxy(fl.getContent, t)();

			/* bind close function on close button */
			t.$fl.find('.'+t.c.namespace+'-close')
				.after(t.content.show()); /* add content after closebutton */

			t.$fl.prependTo('body').fadeIn();
		},

		/* closes the lightbox "this" contains $fl with the lightbox, and c with the configuration */
		close: function(e){
			if (e) e.preventDefault();
			var t = this,
				c = t.c,
				$t = $(e.target);

			if(c.clickBgClose && $t.is('.'+c.namespace) || $t.is('.'+c.namespace+'-close') ){
				t.$fl.fadeOut(function(){
					t.$fl.detach();
				});
			}
		}
	};

	/* extend jQuery with standalone featherlight method  $.featherlight(elm, config); */
	$.featherlight = function($content, config) {
		$.proxy(fl.setup, null, config, $content)();
	};

	/* extend jQuery with selector featherlight method $(elm).featherlight(config, elm); */
	$.fn.featherlight = function(config, $content) {
		$(this).each(function(){
			$.proxy(fl.setup, this, config, $content)();
		});
	};

	/* featherlight defaults */
	$.fn.featherlight.defaults = {
		selector:     '[data-featherlight]',  /* elements that trigger the lightbox */
		context:      'body',                 /* context used to search for the lightbox content and triggers */
		targetAttr:   'data-featherlight',    /* attribut of the triggered element that contains the selector to the lightbox content */
		openTrigger:  'click',                /* event that triggers the lightbox */
		closeTrigger: 'click',                /* event that triggers the closing of the lightbox */
		namespace:    'featherlight',         /* name of the events and css class prefix */
		resetCss:     false,                  /* reset all css */
		variant:      null,                   /* class that will be added to change look of the lightbox instance */
		clickBgClose: true,                   /* close lightbox on click on the background */
		bg: null,                             /* custom DOM for the background, wrapper and the closebutton */
		autostart:    true,                   /* initialize all links with that match "selector" on document ready */
		open: function(e){                    /* opens the lightbox "this" contains $fl with the lightbox, and c with the configuration */
			$.proxy(fl.open, this, e)();
		},
		close: function(e){                   /* closes the lightbox "this" contains $fl with the lightbox, and c with the configuration */
			$.proxy(fl.close, this, e)();
		}
	};

	/* bind featherlight on ready if config autostart is true */
	$(document).ready(function(){
		var c = $.fn.featherlight.defaults;
		if(c.autostart){
			$(c.selector, c.context).featherlight();
		}
	});
}(jQuery));
