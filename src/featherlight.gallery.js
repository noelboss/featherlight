/**
 * Featherlight Gallery – an extension for the ultra slim jQuery lightbox
 * Version 0.2.0 - http://noelboss.github.io/featherlight/
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

	/* extend jQuery with standalone featherlight method  $.featherlight(elm, config); */
	$.featherlightGallery = function($targets, config) {
		if(typeof $targets !== 'object'){
			$targets = $($targets);
		}
		$targets.featherlightGallery(config);
	};

	/* extend jQuery with selector featherlight method $(elm).featherlight(config, elm); */
	$.fn.featherlightGallery = function(config) {

		var $gallery = $(this),
			galleryConfig = {
				type: {
					image: true
				},
				/* extending the open function */
				open: function(event){
					$.proxy($.featherlight.methods.open, this, event)();

					var fl = this,
						$img = fl.$instance.find('img');

					$img.load(function(){

						$img.stop().fadeTo(300,1)
							.nextAll().remove();

						var img = this,
							loadNext = function($nx){
								$img.fadeTo(100,0.2);
								fl.$elm = $nx;
								img.src = $nx.attr('href');
							},
							$next = $('<em title="next" class="'+fl.config.namespace+'-next"><span>&#9658;<span></em>').click(function(){
								var $nx = $gallery.eq($gallery.index(fl.$elm)+1);
								if($nx.length < 1){
									$nx = $gallery.first();
								}
								loadNext($nx);
							}),
							$prev = $('<em title="preview" class="'+fl.config.namespace+'-prev"><span>&#9668;<span></em>').click(function(){
								var $nx = $gallery.eq($gallery.index(fl.$elm)-1);
								if($nx.length < 1){
									$nx = $gallery.last();
								}
								loadNext($nx);
							});

						$img.after($prev)
							.after($next);
					});
				}
			};

		/* extend featherlight with defaults and methods */
		$.extend(galleryConfig, config);

		/* call featherlight */
		$gallery.featherlight(galleryConfig);
	};
}(typeof jQuery === 'function' ? jQuery : console.error('Too much lightness, Featherlight needs jQuery.')));
