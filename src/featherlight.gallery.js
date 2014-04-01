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
		var $gallery = $(this),
			flg = {
				gallery: {
					previous: '&#9664;',   /* Code that is used as previous icon */
					next: '&#9654;',       /* Code that is used as next icon */
					fadeIn: 100,           /* fadeIn speed when image is loaded */
					fadeOut: 300           /* fadeOut speed before image is loaded */
				},
				type: 'image'
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
					var fl = this,
						$img = fl.$instance.find('img');

					fl.$currentTarget = $(event.currentTarget);

					$img.load(function(){
						$img.stop().fadeTo(fl.config.gallery.fadeIn,1);
					});

					fl.$instance.on('next.'+fl.config.namespace+' previous.'+fl.config.namespace, function(event){
							var offset = event.type === 'next' ? +1 : -1;
							var $nx = $gallery.eq(($gallery.index(fl.$currentTarget)+offset) % $gallery.length);
							$img.fadeTo(fl.config.gallery.fadeOut,0.2);
							fl.$currentTarget = $nx;
							$img[0].src = $nx.attr('href');
						});

					if (swipeAwareConstructor) {
						swipeAwareConstructor(fl.$instance)
							.on('swipeleft', function()  { fl.$instance.trigger('next'); })
							.on('swiperight', function() { fl.$instance.trigger('previous'); });
					} else {
						var createNav = function(target){
								return $('<span title="'+target+'" class="'+fl.config.namespace+'-'+target+'"><span>'+fl.config.gallery[target]+'</span></span>').click(function(){
									$(this).trigger(target+'.'+fl.config.namespace);
								});
							};

						$img.after(createNav('previous'))
							.after(createNav('next'));
					}

					if('function' === typeof customAfterOpen) {
						customAfterOpen.call(this, event);
					}
				}
			};
		$gallery.featherlight($.extend(true, {}, flg, config, overrideCallbacks));
	};


	/* extend jQuery with standalone featherlight method  $.featherlight(elm, config); */
	$.featherlightGallery = function($targets, config) {
		if('object' !== typeof $targets){
			$targets = $($targets);
		}
		$targets.featherlightGallery(config);
	};
}(jQuery));
