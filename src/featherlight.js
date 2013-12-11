/**
* Featherlight – ultra slim jQuery lightbox
* Version 0.1.11 – https://github.com/noelboss/featherlight
*
* Copyright 2013, Noel Bossart
* MIT Licensed.
*/
(function($) {
	"use strict";

	/* featherlight object */
	var fl = {
		id: 0, /* used to manage ids */
		defaults: { /* you can access and override all defaults using $.fl.defaults */
			selector:     '[data-featherlight]',  /* elements that trigger the lightbox */
			context:      'body',                 /* context used to search for the lightbox content and triggers */
			type: {                               /* manually set type of lightbox. Otherwise, it will check for the targetAttrs value. */
				image: false,
				ajax: false
			},
			targetAttr:   'data-featherlight',    /* attribute of the triggered element that contains the selector to the lightbox content */
			openTrigger:  'click',                /* event that triggers the lightbox */
			closeTrigger: 'click',                /* event that triggers the closing of the lightbox */
			namespace:    'featherlight',         /* name of the events and css class prefix */
			resetCss:     false,                  /* reset all css */
			variant:      null,                   /* class that will be added to change look of the lightbox */
			closeOnBg:    true,                   /* close lightbox on click on the background */
			closeOnEsc:   true,                   /* close lightbox when pressing esc */
			background:   null,                   /* custom DOM for the background, wrapper and the closebutton */
			autostart:    true,                   /* initialize all links with that match "selector" on document ready */
			open: function(event){                /* opens the lightbox "this" contains $instance with the lightbox, and with the config */
				$.proxy($.featherlight.methods.open, this, event)();
			},
			close: function(event){                   /* closes the lightbox "this" contains $instance with the lightbox, and with the config */
				$.proxy($.featherlight.methods.close, this, event)();
			}
		},
		methods: { /* you can access and override all methods using $.featherlight.methods */
			/* setup iterrates over a single instance of featherlight and prepares the background and binds the events */
			setup: function(config, content){
				var $elm = $(this) || $(),
					config = $.extend({}, fl.defaults, config),
					variant = $elm.attr('data-'+config.namespace+'-variant') || config.variant,
					css = !config.resetCss ? config.namespace : config.namespace+'-reset', /* by adding -reset to the classname, we reset all the default css */
					$background = $(config.background || '<div class="'+css+'"><div class="'+css+'-content"><span class="'+css+'-close">X</span></div></div>'),

					/* everything that we need later is stored in self (target) */
					self = {
						id: fl.id++,
						config: config,
						content: content,
						$elm: $elm,
						$instance: $background.clone().addClass(variant) /* clone DOM for the background, wrapper and the closebutton */
					};

				/* close when click on background */
				self.$instance.on(config.closeTrigger+'.'+config.namespace, $.proxy(config.close, self));

				/* bind or call open function */
				if($elm.length > 0 && this.tagName){
					$elm.on(config.openTrigger+'.'+config.namespace, $.proxy(config.open, self));
				} else {
					$.proxy(config.open, self)();
				}
			},

			/* this method prepares the content and converts it into a jQuery object */
			getContent: function(){
				var self = this,
					content = self.content,
					attr = self.$elm.attr(self.config.targetAttr) || '';

				/* if we have DOM, convert to jQuery Object */
				if(typeof content === 'string'){
					self.content = $(content);
				} else if(content instanceof $ === false){ /* if we have no jQuery Object */
					/* check if we have an image and create element */
					if(self.config.type.image == true || attr === 'image' || attr.match(/\.(png|jpg|jpeg|gif|tiff|bmp)$/i)){
						var url = attr.match(/\.(png|jpg|jpeg|gif|tiff|bmp)$/i) ? attr : self.$elm.attr('href');
						self.content = $('<img src="'+url+'" alt="" class="'+self.config.namespace+'-image" />');
					}
					/* check if we have an ajax link */
					else if(self.config.type.ajax == true || attr === 'ajax' || attr.match(/(http|htm|php)/i)){
						var url = attr.match(/(http|htm|php)/i) ? attr : self.$elm.attr('href'),
						/* we are using load so one can specify a target with: url.html #targetelement */
						content = url ? $('<div></div>').load(url, function(response, status){
							if ( status !== "error" ) {
								$.featherlight(content.html());
							}
						}) : null;
						return false;
					}
					/* otherwise create jquery element by using the attribute as selector */
					else if(attr) {
						self.content = $($(attr), self.config.context);
					}
					/* could not find any content */
					else {
						return false;
					}
				}

				/* we need a special class for the iframe */
				if(self.content.is('iframe') || $('iframe', self.content).length > 0){
					self.$instance.addClass(self.config.namespace+'-iframe');
				}
				self.content.addClass(self.config.namespace+'-inner');
			},

			/* opens the lightbox "this" contains $instance with the lightbox, and with the config */
			open: function(event){
				if(event){event.preventDefault();}
				var self = this;

				/* If we have content, add it and show lightbox */
				if($.proxy(fl.methods.getContent, self)() !== false){

					if(self.config.closeOnEsc){
						$(document).bind('keyup.'+self.config.namespace+self.id, function(e) {
							if (e.keyCode == 27) { // esc keycode
								self.$instance.find('.'+self.config.namespace+'-close').click();
							}
						});
					}

					self.$instance
						.prependTo('body').fadeIn()
						.find('.'+self.config.namespace+'-close')
						.after(self.content);
				}
			},

			/* closes the lightbox "this" contains $instance with the lightbox, and with the config */
			close: function(event){
				if(event){
					event.preventDefault();
				}
				var self = this,
					config = self.config,
					$instance = $(event.target);

				if((config.closeOnBg && $instance.is('.'+config.namespace)) || $instance.is('.'+config.namespace+'-close') ){
					if(self.config.closeOnEsc){
						$(document).unbind('keyup.'+self.config.namespace+self.id);
					}

					self.$instance.fadeOut(function(){
						self.$instance.detach();
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
		var config = $.featherlight.defaults;
		if(config.autostart){
			$(config.selector, config.context).featherlight();
		}
	});
}(jQuery));