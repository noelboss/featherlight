/**
 * Featherlight - ultra slim jQuery lightbox
 * Version 0.3.1 - http://noelboss.github.io/featherlight/
 *
 * Copyright 2014, Noël Raoul Bossart (http://www.noelboss.com)
 * MIT Licensed.
**/
(function($) {
	"use strict";
	if($ === 'undefined') {return; }

	/* featherlight object */
	var fl = {
		id: 0,                                    /* Used to id single featherlight instances */
		defaults: {                               /* You can access and override all defaults using $.fl.defaults */
			autostart:    true,                   /* Initialize all links with that match "selector" on document ready */
			namespace:    'featherlight',         /* Name of the events and css class prefix */
			selector:     '[data-featherlight]',  /* Elements that trigger the lightbox */
			context:      'body',                 /* Context used to search for the lightbox content and triggers */
			type: {                               /* Manually set type of lightbox. Otherwise, it will check for the targetAttrs value. */
				image: false,
				ajax: false
			},
			targetAttr:   'data-featherlight',    /* Attribute of the triggered element that contains the selector to the lightbox content */
			variant:      null,                   /* Class that will be added to change look of the lightbox */
			resetCss:     false,                  /* Reset all css */
			background:   null,                   /* Custom DOM for the background, wrapper and the closebutton */
			openTrigger:  'click',                /* Event that triggers the lightbox */
			closeTrigger: 'click',                /* Event that triggers the closing of the lightbox */
			openSpeed:    250,                    /* Duration of opening animation */
			closeSpeed:   250,                    /* Duration of closing animation */
			closeOnBg:    true,                   /* Close lightbox on click on the background */
			closeOnEsc:   true,                   /* Close lightbox when pressing esc */
			closeOnAny:   false,                  /* Close lightbox when clicking anywhere */
			closeIcon:    '&#10005;',             /* Close icon */
			beforeOpen:   null,                   /* Called before open. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
			beforeClose:  null,                   /* Called before close. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
			afterOpen:    null,                   /* Called after open. Gets event as parameter, this contains all data */
			afterClose:   null,                   /* Called after close. Gets event as parameter, this contains all data */
			/* opens the lightbox. "this" contains $instance with the lightbox, and with the config */
			open: function(event){
				var open = true;
				/* check if before function exists */
				if(typeof this.config.beforeOpen === 'function'){
					open = this.config.beforeOpen.call(this, event);
				}
				/* if no before function or before function did not stop propagation */
				if(open !== false){
					/* call open method */
					open = $.featherlight.methods.open.call(this, event);
				}

				/* check if after function exists */
				if(open !== false && typeof this.config.afterOpen === 'function'){
					this.config.afterOpen.call(this, event);
				}
			},
			/* closes the lightbox. "this" contains $instance with the lightbox, and with the config */
			close: function(event){
				var close = true;
				/* check if before Function exists */
				if(typeof this.config.beforeClose === 'function'){
					close = this.config.beforeClose.call(this, event);
				}

				/* if no before function or before function did not stop propagation */
				if(close !== false){
					/* call open method */
					close = $.featherlight.methods.close.call(this, event);
				}

				/* check if after Function exists */
				if(close !== false && typeof this.config.afterClose === 'function'){
					this.config.afterClose.call(this, event);
				}
			}
		},
		/* you can access and override all methods using $.featherlight.methods */
		methods: {
			/* setup iterates over a single instance of featherlight and prepares the background and binds the events */
			setup: function(config, content){
				config = $.extend({}, fl.defaults, config);

				var $elm = $(this) || $(),
					variant = $elm.attr('data-'+config.namespace+'-variant') || config.variant,
					css = !config.resetCss ? config.namespace : config.namespace+'-reset', /* by adding -reset to the classname, we reset all the default css */
					$background = $(config.background || '<div class="'+css+'"><div class="'+css+'-content"><span class="'+css+'-close">'+config.closeIcon+'</span></div></div>'),


					/* everything that we need later is stored in self (target) */
					self = {
						id: fl.id++,
						config: config,
						content: content,
						$elm: $elm,
						$instance: $background.clone().addClass(variant) /* clone DOM for the background, wrapper and the close button */
					};


				/* close when click on background */
				self.$instance.on(config.closeTrigger+'.'+config.namespace, $.proxy(config.close, self));

				/* bind close on esc */
				if(self.config.closeOnEsc){
					$(document).bind('keyup.'+self.config.namespace+self.id, function(e) {
						if (e.keyCode === 27) { // esc keycode
							self.$instance.find('.'+self.config.namespace+'-close').click();
						}
					});
				}

				/* bind or call open function */
				if($elm.length > 0 && this.tagName){
					$elm.on(config.openTrigger+'.'+config.namespace, $.proxy(config.open, self));
				} else {
					config.open.call(self);
				}

			},

			/* this method prepares the content and converts it into a jQuery object */
			getContent: function(){
				var self = this,
					ok = true,
					content = self.content,
					$content = null,
					attr = self.$elm.attr(self.config.targetAttr) || '',
					url = '';

				/* if we have DOM, convert to jQuery Object */
				if(self.$content instanceof $ === false && typeof content === 'string'){
					$content = $(content);
				} else if(content instanceof $ === false){ /* if we have no jQuery Object */
					/* check if we have an image and create element */
					if(self.config.type.image === true || attr === 'image' || attr.match(/\.(png|jpg|jpeg|gif|tiff|bmp)$/i)){
						url = attr.match(/\.(png|jpg|jpeg|gif|tiff|bmp)$/i) ? attr : self.$elm.attr('href');
						$content = $('<img src="'+url+'" alt="" class="'+self.config.namespace+'-image" />');
					}
					/* check if we have an ajax link */
					else if(self.config.type.ajax === true || attr === 'ajax' || attr.match(/(http|htm|php)/i)){
						url = attr.match(/(http|htm|php)/i) ? attr : self.$elm.attr('href');
						/* we are using load so one can specify a target with: url.html #targetelement */
						content = url ? $('<div></div>').load(url, function(response, status){
							if ( status !== "error" ) {
								$.featherlight(content.html(), self.config);
							}
						}) : null;
						ok = false;
					}
					/* otherwise create jquery element by using the attribute as selector */
					else if(attr) {
						$content = $($(attr), self.config.context);
					}
					/* could not find any content */
					else {
						ok = false;
					}
				}
				if(ok && $content instanceof $){
					/* we need a special class for the iframe */
					if($content.is('iframe') || $('iframe', $content).length > 0){
						self.$instance.addClass(self.config.namespace+'-iframe');
					}
					$content.addClass(self.config.namespace+'-inner');
					self.$content = $content.clone();

					/* remove existing content */
					self.$instance.find('.'+self.config.namespace+'-inner').remove();
					self.$instance.find('.'+self.config.namespace+'-content').append(self.$content);
				}
				return ok;
			},

			/* opens the lightbox. "this" contains $instance with the lightbox, and with the config */
			open: function(event){
				if(event){event.preventDefault();}
				var self = this;

				/* If we have content, add it and show lightbox */
				if(fl.methods.getContent.call(self) !== false){
					self.$instance.prependTo('body').fadeIn(self.config.openSpeed);
				} else {
					return false;
				}
			},

			/* closes the lightbox. "this" contains $instance with the lightbox, and with the config */
			close: function(event){
				var self = this,
					config = self.config,
					$target = $(event.target);

				if(config.closeOnAny || (config.closeOnBg && $target.is('.'+config.namespace)) || $target.is('.'+config.namespace+'-close')){
					if(event){
						event.preventDefault();
					}
					if(self.config.closeOnEsc){
						$(document).unbind('keyup.'+self.config.namespace+self.id);
					}
					self.$instance.fadeOut(self.config.closeSpeed,function(){
						self.$instance.detach();
					});
				}
			}
		}
	};

	/* extend jQuery with standalone featherlight method  $.featherlight(elm, config); */
	$.featherlight = function($content, config) {
		/* if $.featherlight() was called only with config or without anything, initialize manually */
		if(typeof $content !== 'string' && $content instanceof $ === false){
			config = typeof $content === 'Object' ? $.extend({}, fl.defaults, $content) : fl.defaults;

			$(config.selector, config.context).featherlight();
		} else {
			fl.methods.setup.call(null, config, $content);
		}
	};

	/* extend jQuery with selector featherlight method $(elm).featherlight(config, elm); */
	$.fn.featherlight = function(config, $content) {
		$(this).each(function(){
			fl.methods.setup.call(this, config, $content);
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
}(typeof jQuery === 'function' ? jQuery : alert('Too much lightness, Featherlight needs jQuery.')));
