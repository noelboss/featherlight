/**
 * Featherlight Gallery – an extension for the ultra slim jQuery lightbox
 * Version 0.4.9 - http://noelboss.github.io/featherlight/
 *
 * Copyright 2014, Noël Raoul Bossart (http://www.noelboss.com)
 * MIT Licensed.
**/
(function($) {
	"use strict";

	if('undefined' === typeof $) {
		if('console' in window){ window.console.info('Too much lightness, Featherlight needs jQuery.');
			if(!('featherlight' in $)){	window.console.info('Load the featherlight plugin before the gallery plugin'); }
		}
		return;
	}


	var isTouchAware = 'ontouchstart' in document.documentElement,
		jQueryConstructor = $.event && $.event.special.swipeleft && $,
		hammerConstructor = ('Hammer' in window) && function($el){ new window.Hammer(el[0]); },
		swipeAwareConstructor = isTouchAware && (jQueryConstructor || hammerConstructor);

	/* extend jQuery with selector featherlight method $(elm).featherlight(config, elm); */
	$.fn.featherlightGallery = function(config) {
		var flg = {
				gallery: {
					$gallery: this,
					$current: null         /* Current source */
				}
			},
			customAfterOpen = config && config.afterOpen,
			customAfterClose = config && config.afterClose,
			overrideCallbacks = {				/* provide an afterOpen function */
				afterClose: function(event){
					var fl = this;
					fl.$instance.off('next.'+fl.config.namespace+' previous.'+fl.config.namespace);
					if (swipeAwareConstructor) {
						fl.$instance.off('swipeleft');
						fl.$instance.off('swiperight');
					}
					if('function' === typeof customAfterClose) {
						customAfterClose.call(this, event);
					}
				},
				afterOpen: function(event){
					var self = this,
						config = this.gallery,
						$img = self.$instance.find('img');

					config.$current = $(event.currentTarget);

					self.$instance.on('next.'+self.namespace+' previous.'+self.namespace, function(event){
							var offset = event.type === 'next' ? +1 : -1;
							config.$current = config.$gallery.eq((config.$gallery.length + config.$gallery.index(config.$current) + offset) % config.$gallery.length);
							config.beforeImage.call(self, event);
							$.when(
								$.featherlight.contentFilters.image.process(config.$current.attr('href')),
								$img.fadeTo(config.fadeOut,0.2)
							).done(function($i) {
									$img[0].src = $i[0].src;
									config.afterImage.call(self, event);
									$img.fadeTo(config.fadeIn,1);
								});
							});

					if (swipeAwareConstructor) {
						swipeAwareConstructor(self.$instance)
							.on('swipeleft', function()  { self.$instance.trigger('next'); })
							.on('swiperight', function() { self.$instance.trigger('previous'); });
					} else {
						var createNav = function(target){
								return $('<span title="'+target+'" class="'+self.namespace+'-'+target+'"><span>'+config[target]+'</span></span>').click(function(){
									$(this).trigger(target+'.'+self.namespace);
								});
							};

						$img.after(createNav('previous'))
							.after(createNav('next'));
					}

					if('function' === typeof customAfterOpen) {
						customAfterOpen.call(self, event);
					}
					config.afterImage.call(self, event);
				}
			};
		this.featherlight($.extend(true, {}, $.featherlightGallery.defaults, flg, config, overrideCallbacks));
		return this;
	};


	/* extend jQuery with standalone featherlight method  $.featherlight(elm, config); */
	$.featherlightGallery = function($targets, config) {
		if('object' !== typeof $targets){
			$targets = $($targets);
		}
		$targets.featherlightGallery(config);
	};

	$.featherlightGallery.defaults = {
		gallery: {
			beforeImage: $.noop,   /* Callback before an image is changed */
			afterImage: $.noop,    /* Callback after an image is presented */
			previous: '&#9664;',   /* Code that is used as previous icon */
			next: '&#9654;',       /* Code that is used as next icon */
			fadeIn: 100,           /* fadeIn speed when image is loaded */
			fadeOut: 300           /* fadeOut speed before image is loaded */
		},
		type: 'image'
	};

}(jQuery));
