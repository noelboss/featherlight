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
		swipeAwareConstructor = isTouchAware && (jQueryConstructor || hammerConstructor),
		callbackChain = {
			afterClose: function(_super, event) {
					var self = this;
					self.$instance.off('next.'+self.namespace+' previous.'+self.namespace);
					if (swipeAwareConstructor) {
						swipeAwareConstructor(self.$instance).off('swipeleft', self._swipeleft); /* See http://stackoverflow.com/questions/17367198/hammer-js-cant-remove-event-listener */
						swipeAwareConstructor(self.$instance).off('swiperight', self._swiperight);
					}
					return _super(event);
			},
			afterOpen: function(_super, event){
					var self = this,
						$img = self.$instance.find('img');

					self.$instance.on('next.'+self.namespace+' previous.'+self.namespace, function(event){
						var offset = event.type === 'next' ? +1 : -1;
						self.navigateTo(self.currentNavigation() + offset);
					});

					if (swipeAwareConstructor) {
						swipeAwareConstructor(self.$instance)
							.on('swipeleft', self._swipeleft = function()  { self.$instance.trigger('next'); })
							.on('swiperight', self._swiperight = function() { self.$instance.trigger('previous'); });
					} else {
						$img.after(self.createNavigation('previous'))
							.after(self.createNavigation('next'));
					}

					_super(event);

					self.afterImage(event);
			}
		};

	function FeatherlightGallery($source, config) {
		if(this instanceof FeatherlightGallery) {  /* called with new */
			$.featherlight.apply(this, arguments);
			this.chainCallbacks(callbackChain);
		} else {
			var flg = new FeatherlightGallery($.extend({$source: $source, $currentTarget: $source.first()}, config));
			flg.open();
			return flg;
		}
	}

	$.featherlight.extend(FeatherlightGallery);

	$.extend(FeatherlightGallery.prototype, {
		type: 'image',
		/** Additional settings for Gallery **/
		beforeImage: $.noop,         /* Callback before an image is changed */
		afterImage: $.noop,          /* Callback after an image is presented */
		previousIcon: '&#9664;',     /* Code that is used as previous icon */
		nextIcon: '&#9654;',         /* Code that is used as next icon */
		galleryFadeIn: 100,          /* fadeIn speed when image is loaded */
		galleryFadeOut: 300,         /* fadeOut speed before image is loaded */

		currentNavigation: function() {
			return this.$source.index(this.$currentTarget);
		},

		navigateTo: function(index) {
			var self = this,
				len = self.$source.length,
				$img = self.$instance.find('img');
			index = ((index % len) + len) % len; /* pin index to [0, len[ */

			self.$currentTarget = self.$source.eq(index);
			self.beforeImage(event);
			return $.when(
				self.getContent(),
				$img.fadeTo(self.galleryFadeOut,0.2)
			).done(function($i) {
					$img[0].src = $i[0].src;
					self.afterImage(event);
					$img.fadeTo(self.galleryFadeIn,1);
			});
		},

		createNavigation: function(target) {
			var self = this;
			return $('<span title="'+target+'" class="'+this.namespace+'-'+target+'"><span>'+this[target+'Icon']+'</span></span>').click(function(){
				$(this).trigger(target+'.'+self.namespace);
			});
		}
	});

	FeatherlightGallery.functionAttributes = FeatherlightGallery.functionAttributes.concat([
		'beforeImage', 'afterImage'
	]);

	$.featherlightGallery = FeatherlightGallery;

	/* extend jQuery with selector featherlight method $(elm).featherlight(config, elm); */
	$.fn.featherlightGallery = function(config) {
		return FeatherlightGallery.attach(this, config);
	};

}(jQuery));
