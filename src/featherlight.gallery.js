/**
 * Featherlight Gallery – an extension for the ultra slim jQuery lightbox
 * Version 1.2.0 - http://noelboss.github.io/featherlight/
 *
 * Copyright 2015, Noël Raoul Bossart (http://www.noelboss.com)
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
			beforeOpen: function(_super, event){
					var self = this;

					self.$instance.on('next.'+self.namespace+' previous.'+self.namespace, function(event){
						var offset = event.type === 'next' ? +1 : -1;
						self.navigateTo(self.currentNavigation() + offset);
					});

					if (swipeAwareConstructor) {
						swipeAwareConstructor(self.$instance)
							.on('swipeleft', self._swipeleft = function()  { self.$instance.trigger('next'); })
							.on('swiperight', self._swiperight = function() { self.$instance.trigger('previous'); });
					} else {
						self.$instance.find('.'+self.namespace+'-content')
							.append(self.createNavigation('previous'))
							.append(self.createNavigation('next'));
					}
					return _super(event);
			},
			onKeyUp: function(_super, event){
				var dir = {
					37: 'previous', /* Left arrow */
					39: 'next'			/* Rigth arrow */
				}[event.keyCode];
				if(dir) {
					this.$instance.trigger(dir);
					return false;
				} else {
					return _super(event);
				}
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

	$.featherlight.extend(FeatherlightGallery, {
		autoBind: '[data-featherlight-gallery]'
	});

	$.extend(FeatherlightGallery.prototype, {
		/** Additional settings for Gallery **/
		previousIcon: '&#9664;',     /* Code that is used as previous icon */
		nextIcon: '&#9654;',         /* Code that is used as next icon */
		galleryFadeIn: 100,          /* fadeIn speed when image is loaded */
		galleryFadeOut: 300,         /* fadeOut speed before image is loaded */

		images: function() {
			if (this.filter) {
				return this.$source.find(this.filter);
			}
			return this.$source;
		},

		currentNavigation: function() {
			return this.images().index(this.$currentTarget);
		},

		navigateTo: function(index) {
			var self = this,
				source = self.images(),
				len = source.length,
				$inner = self.$instance.find('.' + self.namespace + '-inner');
			index = ((index % len) + len) % len; /* pin index to [0, len[ */

			self.$currentTarget = source.eq(index);
			self.beforeContent();
			return $.when(
				self.getContent(),
				$inner.fadeTo(self.galleryFadeOut,0.2)
			).always(function($newContent) {
					self.setContent($newContent);
					self.afterContent();
					$newContent.fadeTo(self.galleryFadeIn,1);
			});
		},

		createNavigation: function(target) {
			var self = this;
			return $('<span title="'+target+'" class="'+this.namespace+'-'+target+'"><span>'+this[target+'Icon']+'</span></span>').click(function(){
				$(this).trigger(target+'.'+self.namespace);
			});
		}
	});

	$.featherlightGallery = FeatherlightGallery;

	/* extend jQuery with selector featherlight method $(elm).featherlight(config, elm); */
	$.fn.featherlightGallery = function(config) {
		return FeatherlightGallery.attach(this, config);
	};

	/* bind featherlight on ready if config autoBind is set */
	$(document).ready(function(){ FeatherlightGallery._onReady(); });

}(jQuery));
