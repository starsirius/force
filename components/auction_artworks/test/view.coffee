_ = require 'underscore'
benv = require 'benv'
Backbone = require 'backbone'
{ resolve } = require 'path'
{ fabricate } = require 'antigravity'
Auction = require '../../../models/auction'
Artworks = require '../../../collections/artworks'
AuctionArtworksView = benv.requireWithJadeify resolve(__dirname, '../view'), ['template']

describe 'AuctionArtworksView', ->
  before (done) ->
    benv.setup =>
      benv.expose $: benv.require 'jquery'
      Backbone.$ = $
      done()

  after ->
    benv.teardown()

  beforeEach ->
    $('body').html """
      <section>
        <a class='js-toggle-artworks-sort' href='#' data-mode='grid' data-sort='default'>Grid</a>
        <a class='js-toggle-artworks-sort' href='#' data-mode='list' data-sort='name_asc'>Artists A–Z</a>
        <div class='js-auction-artworks'></div>
      </section>
    """

    @user = new Backbone.Model
    @artworks = new Artworks [
      fabricate 'artwork', id: 'z-z', artist: sortable_id: 'z-z'
      fabricate 'artwork', id: 'a-a', artist: sortable_id: 'a-a'
    ]

  describe 'default auction', ->
    beforeEach ->
      @view = new AuctionArtworksView
        el: $('section')
        model: @auction = new Auction fabricate 'sale'
        collection: @artworks
        user: @user

    describe '#render', ->
      it 'renders the default state', ->
        @view.render()
        @view.$('.js-auction-artworks').data('mode').should.equal 'grid'
        @view.$('.auction-grid-artwork').should.have.lengthOf 2
        @view.$('.js-bid-button').should.have.lengthOf 2
        @view.$('.js-inquiry-button').should.have.lengthOf 0

    describe '#setState', ->
      beforeEach ->
        @view.$('a[data-sort="name_asc"]').click()

      it 'sets the view state', ->
        @view.state.attributes.should.eql mode: 'list', sort: 'name_asc'

      it 'activates the link', ->
        @view.$('.is-active').data('sort').should.equal 'name_asc'

      it 'triggers a sort and re-render', ->
        @view.$('.auction-grid-artwork').should.have.lengthOf 0
        @view.$('.auction-list-artwork').should.have.lengthOf 2
        @view.$('.auction-list-artwork:first-child a').attr('href').should.containEql '/artwork/a-a'
        @view.$('.auction-list-artwork:last-child a').attr('href').should.containEql '/artwork/z-z'

    describe '#displayBlurbs', ->
      it 'returns true if any artworks have a blurb', ->
        @view.displayBlurbs().should.be.false
        @view.collection.first().set 'blurb', 'Existence!'
        @view.displayBlurbs().should.be.true

    describe '#maxBlurbHeight', ->
      it 'returns a pixel value based on the estimated height of the longest blurb', ->
        @view.maxBlurbHeight(true).should.equal '22px' # A single line
        _.isUndefined(@view.maxBlurbHeight(false)).should.be.true
        @view.collection.first().set 'blurb', 'Existence!'
        @view.maxBlurbHeight(true).should.equal '27px'
        @view.collection.last().set 'blurb', 'Existence! Existence! Existence! Existence! Existence! Existence! Existence! Existence! Existence! Existence!'
        @view.maxBlurbHeight(true).should.equal '70px'

  describe 'auction promo', ->
    beforeEach ->
      @view = new AuctionArtworksView
        el: $('section')
        model: @auction = new Auction fabricate 'sale', sale_type: 'auction promo'
        collection: @artworks
        user: @user

    describe '#render', ->
      beforeEach ->
        @view.render()

      describe 'nav', ->
        it 'renders the approprate sort options', ->
          @view.$('.garamond-tab').should.have.lengthOf 4
          @view.$('.garamond-tab').text().should.equal 'DefaultArtists A–ZHighest EstimateLowest Estimate'

      describe 'isPreview', ->
        beforeEach ->
          @auction.set 'auction_state', 'preview'
          @view.render()

        it 'renders correctly', ->
          @view.$('.auction-grid-artwork').should.have.lengthOf 2
          @view.$('.js-bid-button').should.have.lengthOf 0
          @view.$('.js-inquiry-button').should.have.lengthOf 2

      describe 'isOpen', ->
        beforeEach ->
          @auction.set 'auction_state', 'open'
          @view.render()

        it 'renders correctly', ->
          @view.$('.auction-grid-artwork').should.have.lengthOf 2
          @view.$('.js-bid-button').should.have.lengthOf 0
          @view.$('.js-inquiry-button').should.have.lengthOf 0

      describe 'isClosed', ->
        beforeEach ->
          @auction.set 'auction_state', 'closed'
          @view.render()

        it 'renders correctly', ->
          @view.$('.auction-grid-artwork').should.have.lengthOf 2
          @view.$('.js-bid-button').should.have.lengthOf 0
          @view.$('.js-inquiry-button').should.have.lengthOf 0
