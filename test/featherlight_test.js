var expect = chai.expect;

(function($) {
	var $htmlFixtures = null;
	var resetFixtures = function(){
		if (!$htmlFixtures) $htmlFixtures = $('#fixtures').detach();
		$('body >:not(#mocha)').remove()
		$('body').append($htmlFixtures.clone());
	};
	$.fx.off = true;

	describe('Featherlight', function() {
		beforeEach(resetFixtures);
		after(resetFixtures);

		it ('works on items with data-featherlight by default', function(done) {
			expect($('img')).to.not.be.visible;
			$('#auto-bound').click();
			patiently(done, [
				function() {
					expect($('.featherlight img')).to.be.visible;
					expect($('.featherlight img')).to.have.attr('src').equal('fixtures/photo.jpeg');
					$('.featherlight').click();
				}, function() {
					expect($('img')).to.not.be.visible;
				}
			]);
		});

		describe('jQuery#featherlight', function() {

			it('is chainable', function() {
				// Not a bad test to run on collection methods.
				var $all_links = $('a')
				expect($all_links.featherlight()).to.equal($all_links);
			});

			it("won't open a dialog if the event is already prevented", function(){
				$('#auto-bound').on('click', function(event) { event.preventDefault(); }).click()
				expect($.featherlight.current()).to.be.undefined;
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

		describe('jQuery.featherlight.close', function() {
			it('closes the currently opened window, if any', function() {
				$.featherlight('<p class="testing">This is a test<p>');
				$.featherlight.close();
				expect($.featherlight.current()).to.be.undefined;
				$.featherlight.close(); /* should not create error */
			});
		});


		describe('configuration', function() {
			it('can be set using data-feather-*', function() {
				$('<a href=".some-content" \
							data-featherlight-variant="test" \
							data-featherlight-close-speed="42" \
							data-featherlight-close-on-esc="false">').featherlight().click();
				expect($.featherlight.current()).to.have.properties({
					variant: 'test',
					closeOnEsc: false,
					closeSpeed: 42,
				});
			});

			it('can specify to close or not on escape key', function() {
				var first = $.featherlight('<p/>'),
					second = $.featherlight('<p/>'),
					third = $.featherlight('<p/>', {closeOnEsc: false}),
					last = $.featherlight('<p/>', {closeOnEsc: true}),
					triggerEscape = function(){
						$(document).trigger($.Event("keyup", { keyCode: 27 }));
					};
				triggerEscape();
				expect($.featherlight.current()).to.equal(third);
				triggerEscape();
				expect($('.featherlight')).with.length(3);
				$('.featherlight:last').click();
				expect($.featherlight.current()).to.equal(second);
				triggerEscape();
				expect($.featherlight.current()).to.equal(first);
			});

			it('can specify a filter for events', function() {
				$("#filter-test .group").featherlight({filter: '.yes', type: 'text'})
					.append('<span class="yes"  href="filter Appended">Photo</span>');
				$("#filter-test span").each(function(){ $(this).click(); });
				expect($('.featherlight')).with.length(2);
				expect($('.featherlight:first .featherlight-content')).to.contain('filter Yes');
				expect($('.featherlight:last  .featherlight-content')).to.contain('filter Appended');
			});

			it('can specify explicit content', function() {
				$.featherlight({text: 'A <div> & "quoted text"'});
				expect($('.featherlight')).to.contain('A <div> & "quoted text"');
			});

			it('can specify ajax content', function(done) {
				$.featherlight({ajax: 'featherlight.html .some-content'});
				patiently(done, function() {
					expect($('.featherlight')).to.contain('Hello');
				});
			})

			it('can specify an alternate close button selector', function() {
				var fl = $.featherlight('<div>Test<div class="close-me">close</div></div>', {otherClose: '.close-me'});
				expect($.featherlight.current()).to.equal(fl);
				$('.close-me').click();
				expect($.featherlight.current()).to.be.undefined;
			});

		});

	});
}(jQuery));
