var expect = chai.expect;

(function($) {
  var $htmlFixtures = null;
  var resetFixtures = function(){
    if (!$htmlFixtures) $htmlFixtures = $('#fixtures').detach();
    $('body >:not(#mocha)').remove()
    $('body').append($htmlFixtures.clone(true));
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
        $('.featherlight').trigger('next');
      }, function() {
        expect($('.featherlight img')).to.have.attr('src').match(/photo_large.jpg\?0/);
        $('.featherlight').trigger('previous');
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
  });
}(jQuery));
