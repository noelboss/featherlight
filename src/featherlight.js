/**
* Featherlight – ultra slim jQuery lightbox
* Version 0.1.7 – https://github.com/noelboss/featherlight
*
* Copyright 2013, Noel Bossart
* MIT Licensed.
*/
(function($) {
	"use strict";

	/* featherlight object */
	var fl = {
		defaults: { /* you can access and override all defaults using $.featherlight.defaults */
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
				$.proxy($.featherlight.methods.open, this, e)();
			},
			close: function(e){                   /* closes the lightbox "this" contains $fl with the lightbox, and c with the configuration */
				$.proxy($.featherlight.methods.close, this, e)();
			}
		},
		methods: { /* you can access and override all methods using $.featherlight.methods */
			setup: function(config, content){
				var $elm = $(this) || $(),
					c = $.extend({}, fl.defaults, config),
					variant = $elm.attr('data-'+c.namespace+'-variant') || c.variant,
					css = !c.resetCss ? c.namespace : c.namespace+'-reset', /* by adding -reset to the classname, we reset all the default css */
					$bg = $(c.bg || '<div class="'+css+'"><div class="'+css+'-content"><span class="'+css+'-close">X</span></div></div>'),

					/* everything that we need later is stored in t (target) */
					t = {
						c: c,
						content: content,
						$elm: $elm,
						$fl: $bg.clone().addClass(variant) /* clone DOM for the background, wrapper and the closebutton */
					};

				/* close when click on background */
				t.$fl.on(c.closeTrigger+'.'+c.namespace, $.proxy(c.close, t));

				/* bind or call open function */
				if($elm.length > 0 && this.tagName){
					$elm.on(c.openTrigger+'.'+c.namespace, $.proxy(c.open, t));
				} else {
					$.proxy(c.open, t)();
				}
			},

			/* this method prepares the content and converts it into a jQuery object */
			getContent: function(){
				var t = this,
					content = t.content,
					attr = t.$elm.attr(t.c.targetAttr);

				/* if we have DOM, convert to jQuery Object */
				if(typeof content === 'string'){
					t.content = $(content);
				} else if(content instanceof $ === false){ /* if we have no jQuery Object */
					/* check if we have an image and create element */
					if(attr === 'image' || attr.match(/\.(png|jpg|jpeg|gif|tiff|bmp)$/i)){
						var url = attr.match(/\.(png|jpg|jpeg|gif|tiff|bmp)$/i) ? attr : t.$elm.attr('href');
						t.content = $('<img src="'+url+'" alt="" class="'+t.c.namespace+'-image" />');
					}
					/* check if we have an ajax link */
					else if(attr === 'ajax' || attr.match(/(http|htm|php)/i)){
						var url = attr.match(/(http|htm|php)/i) ? attr : t.$elm.attr('href'),
						/* we are using load so one can specify a target with: url.html #targetelement */
						content = url ? $('<div></div>').load(url, function(response, status){
							if ( status !== "error" ) {
								$.featherlight(content.html());
							}
						}) : null;
						return false;
					}
					/* otherwise create jquery elemnt by using the attribute as selector */
					else {
						t.content = $($(attr), t.c.context);
					}
				}

				/* we need a special class for the iframe */
				if(t.content.is('iframe') || $('iframe', t.content).length > 0){
					t.$fl.addClass(t.c.namespace+'-iframe');
				}
				t.content.addClass(t.c.namespace+'-inner');
			},

			/* opens the lightbox "this" contains $fl with the lightbox, and c with the configuration */
			open: function(e){
				if(e){e.preventDefault();}
				var t = this;

				/* If we have content, add it and show lightbox */
				if($.proxy(fl.methods.getContent, t)() !== false){
					t.$fl
						.prependTo('body').fadeIn()
						.find('.'+t.c.namespace+'-close')
						.after(t.content);
				}
			},

			/* closes the lightbox "this" contains $fl with the lightbox, and c with the configuration */
			close: function(e){
				if(e){e.preventDefault();}
				var t = this,
					c = t.c,
					$t = $(e.target);

				if((c.clickBgClose && $t.is('.'+c.namespace)) || $t.is('.'+c.namespace+'-close') ){
					t.$fl.fadeOut(function(){
						t.$fl.detach();
					});
				}
			}
		}
	};

	/* extend jQuery with standalone featherlight method  $.featherlight(elm, config); */
	$.featherlight = function($content, config) {
		$.proxy(fl.methods.setup, null, config, $content)();
	};

	/* extend jQuery with selector featherlight method $(elm).featherlight(config, elm); */
	$.fn.featherlight = function(config, $content) {
		$(this).each(function(){
			$.proxy(fl.methods.setup, this, config, $content)();
		});
	};

	/* extend featherlight with defaults and methods */
	$.extend($.featherlight, fl);

	/* bind featherlight on ready if config autostart is true */
	$(document).ready(function(){
		var c = $.featherlight.defaults;
		if(c.autostart){
			$(c.selector, c.context).featherlight();
		}
	});
}(jQuery));