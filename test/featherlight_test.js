if(!this.chai) { chai = require("chai"); }
var expect = chai.expect;

(function($) {
	var cleanupDom = function(){
		$('body >:not(#mocha)').remove()
	};
	$.fx.off = true;
	describe('Featherlight', function() {
		afterEach(cleanupDom);

		it ('works on items with data-featherlight by default', function() {
			var $bound = $('#auto-bound')
			expect($('img').length).to.equal(0);
			$bound.click();
			expect($('.featherlight img')).to.be.visible;
			expect($('.featherlight img')).to.have.attr('src').equal('fixtures/photo.jpeg');
			$('.featherlight').click();
			expect($('img')).to.not.be.visible;
		});

		describe('jQuery#featherlight', function() {

			it('is chainable', function() {
				// Not a bad test to run on collection methods.
				var $all_links = $('a')
				expect($all_links.featherlight()).to.equal($all_links);
			});

		});

		describe('jQuery.featherlight', function() {

			it('opens a dialog box', function() {
				$.featherlight('<p class="testing">This is a test<p>');
				expect($('.featherlight p.testing')).to.be.visible;
			});

		});

		describe('jQuery.featherlight.current', function() {
			it('returns null if no dialogbox is currently opened', function() {
				expect($.featherlight.current()).to.be.undefined;
				/* even if opened and then closed */
				$.featherlight('<p class="testing">This is a test<p>');
				$('.featherlight').click();
				expect($.featherlight.current()).to.be.undefined;
				/* even if savagely removed */
				$.featherlight('<p class="testing">This is a test<p>');
				$('.featherlight').remove();
				expect($.featherlight.current()).to.be.undefined;
			});

			it('returns the featherlight object of the last currently opened dialog', function() {
				var first = $.featherlight('<p>First<p>');
				expect($.featherlight.current()).to.equal(first);
				var second = $.featherlight('<p>Inner<p>', {namespace: 'different_namespace'});
				expect($.featherlight.current()).to.equal(second);
				$('.different_namespace').click();
				expect($.featherlight.current()).to.equal(first);
			});

		});

		describe('configuration', function() {
			it('can be set using data-feather-*', function() {
				$('<a href="fixtures/photo.jpeg" \
							data-featherlight-variant="test" \
							data-featherlight-close-speed="42" \
							data-featherlight-close-on-esc="false">').featherlight().click();
				expect($.featherlight.current().config).to.have.properties({
					variant: 'test',
					closeOnEsc: false,
					closeSpeed: 42,
				});
			});
		});

	});
}(jQuery));
