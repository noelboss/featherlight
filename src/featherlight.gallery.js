/**
 * Featherlight Gallery – an extension for the ultra slim jQuery lightbox
 * Version 0.3.1 - http://noelboss.github.io/featherlight/
 *
 * Copyright 2014, Noël Raoul Bossart (http://www.noelboss.com)
 * MIT Licensed.
**/
(function($) {
	"use strict";
	if($ === 'undefined') {return; }
	if(typeof $.featherlight !== 'function' && typeof window.console === 'object'){
		window.console.log('Load the featherlight plugin before the gallery plugin');
		return;
	}

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
				type: {
					image: true
				}
			},
			customAfterOpen = config.afterOpen,
			cb = {				/* provide an afterOpen function */
				afterOpen: function(event){
					var fl = this,
						$img = fl.$instance.find('img');

					$img.load(function(){
						$img.stop().fadeTo(fl.config.gallery.fadeIn,1);
					});

					fl.$instance.on('next.'+fl.config.namespace+' previous.'+fl.config.namespace, function(evt){
							var offset = evt.type === 'next' ? +1 : -1;
							var $nx = $gallery.eq(($gallery.index(fl.$elm)+offset) % $gallery.length);
							$img.fadeTo(fl.config.gallery.fadeOut,0.2);
							fl.$elm = $nx;
							$img[0].src = $nx.attr('href');
						});
					var createNav = function(which){
							return $('<em title="'+which+'" class="'+fl.config.namespace+'-'+which+'"><span>'+fl.config.gallery[which]+'</span></em>').click(function(){
								$(this).trigger(which+'.'+fl.config.namespace);
							})
						};

					$img.after(createNav('previous'))
						.after(createNav('next'));

					if(typeof customAfterOpen === 'function') {
						customAfterOpen.call(this, event);
					}
				}
			};
		$gallery.featherlight($.extend(true, {}, flg, config, cb));
	};


	/* extend jQuery with standalone featherlight method  $.featherlight(elm, config); */
	$.featherlightGallery = function($targets, config) {
		if(typeof $targets !== 'object'){
			$targets = $($targets);
		}
		$targets.featherlightGallery(config);
	};
}(typeof jQuery === 'function' ? jQuery : console.error('Too much lightness, Featherlight needs jQuery.')));
