var expect = chai.expect;

(function($) {
  var $htmlFixtures = null;
  var resetFixtures = function(){
    if (!$htmlFixtures) $htmlFixtures = $('#fixtures').detach();
    $('body >:not(#mocha)').remove()
    $('body').append($htmlFixtures.clone(true));
  };
  var triggerKeyCode = function(keyCode) {
    $(document).trigger($.Event("keyup", { keyCode: keyCode }));
  };
  $.fx.off = true;

  describe('Featherlight Gallery', function() {
    beforeEach(resetFixtures);
    after(resetFixtures);

    it ('works as expected', function(done) {
      $('#basic-test a').featherlightGallery();
      $('#basic-test a').eq(2).click();
      patiently(done, [function() {
        expect($('.featherlight img')).to.have.attr('src').match(/photo_large.jpg\?2/);
        $('.featherlight').trigger('next');
      }, function() {
        expect($('.featherlight img')).to.have.attr('src').match(/photo_large.jpg\?3/);
        $('.featherlight-next').click();
      }, function() {
        expect($('.featherlight img')).to.have.attr('src').match(/photo_large.jpg\?0/);
        $('.featherlight').trigger('previous');
      }, function() {
        expect($('.featherlight img')).to.have.attr('src').match(/photo_large.jpg\?3/);
      }]);
    });

    it ('can be navigated using arrow keys', function(done) {
      $('#basic-test a').featherlightGallery();
      $('#basic-test a').eq(2).click();
      patiently(done, [function() {
        expect($('.featherlight img')).to.have.attr('src').match(/photo_large.jpg\?2/);
        triggerKeyCode(39);
      }, function() {
        expect($('.featherlight img')).to.have.attr('src').match(/photo_large.jpg\?3/);
        triggerKeyCode(39);
      }, function() {
        expect($('.featherlight img')).to.have.attr('src').match(/photo_large.jpg\?0/);
        triggerKeyCode(37);
      }, function() {
        expect($('.featherlight img')).to.have.attr('src').match(/photo_large.jpg\?3/);
      }]);
    });

    it ('is chainable', function() {
      var $anchors = $('#basic-test a');
      expect($anchors.featherlight()).to.equal($anchors);
    });

    it ('accepts an afterImage config', function(done) {
      var lastCurrent = null;
      $('#basic-test a').featherlightGallery({
        afterImage: function() { lastCurrent = this.$currentTarget; }
      });
      $('#basic-test a').eq(2).click();
      patiently(done, [function(){
        expect(lastCurrent).to.not.be.null
        expect(lastCurrent).to.have.attr('href').match(/photo_large.jpg\?2/);
        $('.featherlight').trigger('next');
      }, function() {
        expect(lastCurrent).to.have.attr('href').match(/photo_large.jpg\?3/);
      }]);
    });

    describe('$.featherlightGallery', function() {
      it ('can be called directly', function(done) {
        var lastCurrent = null;
        var imgs =  '<img src="fixtures/photo.jpeg?direct_1"/>' +
                    '<img src="fixtures/photo.jpeg?direct_2"/>' +
                    '<img src="fixtures/photo.jpeg?direct_3"/>';
        $.featherlightGallery($(imgs), {
          targetAttr: 'src',
          afterImage: function(){ lastCurrent = this.$currentTarget }
        });
        patiently(done, [function(){
          expect($('.featherlight img')).to.have.attr('src').match(/direct_1$/);
          $('.featherlight').trigger('previous');
        }, function() {
          expect(lastCurrent).to.have.attr('src').match(/direct_3$/);
        }]);
      });
    });

    it ('accepts config as data-attributes', function(done) {
      var $cur;
      $('#extra-test').featherlightGallery();
      $('#extra-test a:first').click();
      patiently(done, [function(){
        $cur = $.featherlightGallery.current()
        expect($cur).to.be.an.instanceof($.featherlightGallery)
        expect($cur).to.not.have.property('called');
        $('.featherlight').trigger('next');
      }, function(){
        expect($cur).to.have.property('called', true);
      }]);
    });

    describe('.current', function() {
      it ('only returns actual featherlight gallery instances', function() {
        $.featherlight('<p>This is a test<p>');
        expect($.featherlight.current()).to.not.be.undefined;
        expect($.featherlightGallery.current()).to.be.undefined;
      });
    });
  });
}(jQuery));
