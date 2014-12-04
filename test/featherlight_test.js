var expect = chai.expect;
var stubAjaxLoad = function(content) {
  var oldLoad = $.fn.load;
  $.fn.load = function(url, callback) {
    var $this = this;
    $.fn.load = oldLoad;
    window.setTimeout(function() {
      $this.html(content);
      callback(null, "success");
    });
    return this;
  };
};

(function($) {
	var $htmlFixtures = null;
	var resetFixtures = function(){
		if (!$htmlFixtures) $htmlFixtures = $('#fixtures').detach();
		$('body >:not(#mocha)').remove()
		$('body').append($htmlFixtures.clone(true));
	};
	var triggerKeyCode = function(keyCode) {
		$(window).trigger($.Event("keyup", { keyCode: keyCode }));
	};
	var triggerEscape = function(){
		triggerKeyCode(27);
	};

	$.fx.off = true;
	$.fn.toJSON = function() { return 'jQuery: ' + this.selector + ' (' + this.length + ')' };

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
				expect($.featherlight.current()).to.be.null;
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
				expect($.featherlight.current()).to.be.null;
				/* even if opened and then closed */
				$.featherlight('<p class="testing">This is a test<p>');
				$('.featherlight').click();
				expect($.featherlight.current()).to.be.null;
				/* even if savagely removed */
				$.featherlight('<p class="testing">This is a test<p>');
				$('.featherlight').remove();
				expect($.featherlight.current()).to.be.null;
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

		describe('jQuery.featherlight.opened', function() {
			it('returns [] ]if no dialogbox is currently opened', function() {
				expect($.featherlight.opened()).to.eql([]);
				/* even if opened and then closed */
				$.featherlight('<p class="testing">This is a test<p>');
				$('.featherlight').click();
				expect($.featherlight.opened()).to.eql([]);
				/* even if savagely removed */
				$.featherlight('<p class="testing">This is a test<p>');
				$('.featherlight').remove();
				expect($.featherlight.opened()).to.eql([]);
			});

			it('returns the featherlight objects of the currently opened dialog', function() {
				var first = $.featherlight('<p>First<p>');
				expect($.featherlight.opened()).to.eql([first]);
				var second = $.featherlight('<p>Inner<p>', {namespace: 'different_namespace'});
				expect($.featherlight.opened()).to.eql([first, second]);
				$('.different_namespace').click();
				expect($.featherlight.opened()).to.eql([first]);
			});
		});

		describe('jQuery.featherlight.close', function() {
			it('closes the currently opened window, if any', function() {
				$.featherlight('<p class="testing">This is a test<p>');
				$.featherlight.close();
				expect($.featherlight.current()).to.be.null;
				$.featherlight.close(); /* should not create error */
			});
		});

		describe('image content filter', function() {
			it('stores the natural width & height', function(done) {
				$('#plain-photo-link').featherlight({
					afterOpen: function() {
						expect(this.$content.naturalWidth).to.equal(200);
						done();
					}
				}).click();
			});
		});

		describe('configuration', function() {
			it('can be set using data-feather-*', function() {
				$('#data-attr-test a').featherlight().click();
				expect($.featherlight.current()).to.have.properties({
					variant: 'test',
					closeOnEsc: false,
					closeSpeed: 42,
				});
				expect($.featherlight.current().$instance.find('b')).to.have.text('Added in callback');
			});

			it('can be set using data-feather-* on filtered element too', function() {
				$('#data-attr-filter-test a:first').click();
				expect($.featherlight.current()).to.have.property('variant').equal('wrapper');
				$('#data-attr-filter-test a:last').click();
				expect($.featherlight.current()).to.have.property('variant').equal('inner');
				$('<a data-featherlight-variant="dynamic" href=".some-content">z</a>')
					.appendTo($('#data-attr-filter-test')).click()
				expect($.featherlight.current()).to.have.property('variant').equal('dynamic');
			});

			it('can specify to close or not on escape key', function() {
				var first = $.featherlight('<p/>'),
					second = $.featherlight('<p/>'),
					third = $.featherlight('<p/>', {closeOnEsc: false}),
					last = $.featherlight('<p/>', {closeOnEsc: true});
				expect($.featherlight._globalHandlerInstalled).to.be.true;
				triggerEscape();
				expect($.featherlight.current()).to.equal(third);
				triggerEscape();
				expect($('.featherlight')).with.length(3);
				$('.featherlight:last').click();
				expect($.featherlight.current()).to.equal(second);
				triggerEscape();
				expect($.featherlight.current()).to.equal(first);
				expect($.featherlight._globalHandlerInstalled).to.be.true;
				$.featherlight.current().close();
				expect($.featherlight._globalHandlerInstalled).to.be.false;
			});

			it('can specify to a close icon', function() {
				var fl = $.featherlight('<p/>', {closeIcon: '<div class="test">X</div>'});
				expect($.featherlight.current()).to.equal(fl);
				$('.test').click();
				expect($.featherlight.current()).to.be.null;
			});

			it('can specify a key handler', function() {
				var lastKeyCode;
				$.featherlight('<p/>', {
					onKeyUp: function(event) {
						lastKeyCode = event.keyCode;
					}
				});
				triggerKeyCode(25);
				expect(lastKeyCode).to.equal(25);
				triggerKeyCode(27);
				expect(lastKeyCode).to./* still be */equal(25); /* since event is handled by FL */
				expect($.featherlight.current()).to.be.null;
			});

			it('can specify a resize handler', function() {
				var resizes = [],
				  open = function() {
						$.featherlight('<p/>', {
							onResize: function(event) { resizes.push(this.id); }
						});
					}
				open();
				open();
				$(window).trigger('resize');
				open();
				$.featherlight.current().close();
				$.featherlight.current().close();
				$(window).trigger('resize');
				resizes = $.map(resizes, function(id) { return id - $.featherlight.current().id });
				expect(resizes).to.eql([0, 1, 1, 0, 2, 0]);
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
			});

			it('ajax content can be text only', function(done) {
				stubAjaxLoad('Hello <b>world</b>');
				$.featherlight({ajax: 'stubbed'});
				patiently(done, function() {
					expect($('.featherlight')).to.contain('Hello');
				});
			});

			it('can specify an alternate close button selector', function() {
				var fl = $.featherlight('<div>Test<div class="close-me">close</div></div>', {otherClose: '.close-me'});
				expect($.featherlight.current()).to.equal(fl);
				$('.close-me').click();
				expect($.featherlight.current()).to.be.null;
			});

			it('can specify an alternate root selector', function() {
				$.featherlight('<div>Test<div class="close-me">close</div></div>', {root: '#fixtures'});
				expect($('#fixtures').children().last()).to.have.class('featherlight');
			});

			it('can specify callbacks to track the progress of the dialog', function() {
				var callbacks = ['beforeOpen', 'beforeContent', 'afterContent', 'afterOpen', 'beforeClose', 'afterClose'],
					lastCallback = undefined,
					options = {};
				$.each(callbacks, function(i, cb){
					options[cb] = function() {
						expect(lastCallback).to.equal(callbacks[i-1]);
						lastCallback = cb;
					}
				});
				$.featherlight($('<p>Hello</p>'), options);
				expect(lastCallback).to.equal('afterOpen');
				$.featherlight.current().close();
				expect(lastCallback).to.equal('afterClose');
			});

		});

	});
}(jQuery));
