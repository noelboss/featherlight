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
		var customAfterOpen = config && config.afterOpen,
			customAfterClose = config && config.afterClose,
			overrideCallbacks = {				/* provide an afterOpen function */
				afterClose: function(event){
					var self = this;
					self.$instance.off('next.'+self.namespace+' previous.'+self.namespace);
					if (swipeAwareConstructor) {
						swipeAwareConstructor(self.$instance).off('swipeleft', self._swipeleft); /* See http://stackoverflow.com/questions/17367198/hammer-js-cant-remove-event-listener */
						swipeAwareConstructor(self.$instance).off('swiperight', self._swiperight);
					}
					if('function' === typeof customAfterClose) {
						customAfterClose.call(this, event);
					}
				},
				afterOpen: function(event){
					var self = this,
						$img = self.$instance.find('img');

					self.$instance.on('next.'+self.namespace+' previous.'+self.namespace, function(event){
							var offset = event.type === 'next' ? +1 : -1;
							self.$currentTarget = self.$gallery.eq((self.$gallery.length + self.$gallery.index(self.$currentTarget) + offset) % self.$gallery.length);
							self.beforeImage.call(self, event);
							$.when(
								$.featherlight.contentFilters.image.process(self.$currentTarget.attr('href')),
								$img.fadeTo(self.galleryFadeOut,0.2)
							).done(function($i) {
									$img[0].src = $i[0].src;
									self.afterImage.call(self, event);
									$img.fadeTo(self.galleryFadeIn,1);
								});
							});

					if (swipeAwareConstructor) {
						swipeAwareConstructor(self.$instance)
							.on('swipeleft', self._swipeleft = function()  { self.$instance.trigger('next'); })
							.on('swiperight', self._swiperight = function() { self.$instance.trigger('previous'); });
					} else {
						var createNav = function(target){
								return $('<span title="'+target+'" class="'+self.namespace+'-'+target+'"><span>'+self[target+'Icon']+'</span></span>').click(function(){
									$(this).trigger(target+'.'+self.namespace);
								});
							};

						$img.after(createNav('previous'))
							.after(createNav('next'));
					}

					if('function' === typeof customAfterOpen) {
						customAfterOpen.call(self, event);
					}
					self.afterImage.call(self, event);
				}
			};
		this.featherlight($.extend({$gallery: this}, $.featherlightGallery.defaults, config, overrideCallbacks));
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
		type: 'image',
		/** Additional settings for Gallery **/
		beforeImage: $.noop,         /* Callback before an image is changed */
		afterImage: $.noop,          /* Callback after an image is presented */
		previousIcon: '&#9664;',     /* Code that is used as previous icon */
		nextIcon: '&#9654;',         /* Code that is used as next icon */
		galleryFadeIn: 100,          /* fadeIn speed when image is loaded */
		galleryFadeOut: 300          /* fadeOut speed before image is loaded */
	};

}(jQuery));
