/**
 * Featherlight Gallery – an extension for the ultra slim jQuery lightbox
 * Version 0.4.1 - http://noelboss.github.io/featherlight/
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
					$current: null,        /* Current source */
					beforeImage: $.noop,   /* Callback before an image is changed */
					afterImage: $.noop,    /* Callback after an image is presented */
					previous: '&#9664;',   /* Code that is used as previous icon */
					next: '&#9654;',       /* Code that is used as next icon */
					fadeIn: 100,           /* fadeIn speed when image is loaded */
					fadeOut: 300           /* fadeOut speed before image is loaded */
				},
				type: 'image'
			},
			customAfterOpen = config && config.afterOpen,
			overrideCallbacks = {				/* provide an afterOpen function */
				afterOpen: function(event){
					var fl = this,
						config = this.gallery,
						$img = fl.$instance.find('img');

					config.$current = $(event.currentTarget);

					$img.load(function(){
						$img.stop().fadeTo(config.fadeIn,1);
					});

					fl.$instance.on('next.'+fl.namespace+' previous.'+fl.namespace, function(event){
							var offset = event.type === 'next' ? +1 : -1;
							config.$current = config.$gallery.eq((config.$gallery.length + config.$gallery.index(config.$current) + offset) % config.$gallery.length);
							config.beforeImage.call(fl, event);
							$img.fadeTo(config.fadeOut,0.2);
							$img[0].src = config.$current.attr('href');
							config.afterImage.call(fl, event);
						});

					if (swipeAwareConstructor) {
						swipeAwareConstructor(fl.$instance)
							.on('swipeleft', function()  { fl.$instance.trigger('next'); })
							.on('swiperight', function() { fl.$instance.trigger('previous'); });
					} else {
						var createNav = function(target){
								return $('<span title="'+target+'" class="'+fl.namespace+'-'+target+'"><span>'+config[target]+'</span></span>').click(function(){
									$(this).trigger(target+'.'+fl.namespace);
								});
							};

						$img.after(createNav('previous'))
							.after(createNav('next'));
					}

					if('function' === typeof customAfterOpen) {
						customAfterOpen.call(fl, event);
					}
					config.afterImage.call(fl, event);
				}
			};
		this.featherlight($.extend(true, {}, flg, config, overrideCallbacks));
	};


	/* extend jQuery with standalone featherlight method  $.featherlight(elm, config); */
	$.featherlightGallery = function($targets, config) {
		if('object' !== typeof $targets){
			$targets = $($targets);
		}
		$targets.featherlightGallery(config);
	};
}(jQuery));
