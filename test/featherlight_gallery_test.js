var expect = chai.expect;

(function($) {
  var $htmlFixtures = null;
  var resetFixtures = function(){
    if (!$htmlFixtures) $htmlFixtures = $('#fixtures').detach();
    $('body >:not(#mocha)').remove()
    $('body').append($htmlFixtures.clone());
  };
  $.fx.off = true;

  describe('Featherlight Gallery', function() {
    beforeEach(resetFixtures);
    after(resetFixtures);

    it ('works as expected', function() {
      $('#basic-test a').featherlightGallery();
      $('#basic-test a').eq(2).click();
      expect($('.featherlight img')).to.have.attr('src').equal('fixtures/photo_large.jpg?2');
      $('.featherlight').trigger('next');
      expect($('.featherlight img')).to.have.attr('src').equal('fixtures/photo_large.jpg?3');
      $('.featherlight').trigger('next');
      expect($('.featherlight img')).to.have.attr('src').equal('fixtures/photo_large.jpg?0');
      $('.featherlight').trigger('previous');
      expect($('.featherlight img')).to.have.attr('src').equal('fixtures/photo_large.jpg?3');
    });

    it ('accepts an afterImage config', function() {
      var lastCurrent = null;
      $('#basic-test a').featherlightGallery({gallery:
        {afterImage: function() { lastCurrent = this.gallery.$current; }}
      });
      expect(lastCurrent).to.be.null;
      $('#basic-test a').eq(2).click();
      expect(lastCurrent).to.have.attr('href').equal('fixtures/photo_large.jpeg?2');
      $('.featherlight').trigger('next');
      expect(lastCurrent).to.have.attr('href').equal('fixtures/photo_large.jpeg?3');
    });
  });
}(jQuery));
