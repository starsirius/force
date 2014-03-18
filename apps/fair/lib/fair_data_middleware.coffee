#
# Fetches all of the data needed to render the fair page, setting up locals,
# sharify data, caching, and so on. Then passes on the request for routes to render
# the given page.
#

cache = require '../../../lib/cache'
Profile = require '../../../models/profile'
Fair = require '../../../models/fair'

module.exports = (req, res, next) ->
  # TODO: Replace this profile fetch for a more generic solution:
  # https://www.pivotaltracker.com/story/show/67567624
  new Profile(id: req.params.id).fetch
    cache: true
    error: res.backboneError
    success: (profile) ->
      return next() unless profile.isFairOranizer()
      end = (data) ->
        res.locals[k] = v for k, v of data
        res.locals.mediums = data.filterSuggest.mediumsHash()
        res.locals.sd.EXHIBITORS_COUNT = data.galleries.length
        res.locals.sd.FAIR = data.fair.toJSON()
        res.locals.sd.PROFILE = data.profile.toJSON()
        next()
      key = "fair:#{req.params.id}"
      cache.getHash key, {
        fair:                  require '../../../models/fair'
        profile:               require '../../../models/profile'
        filterSuggest:         require '../../../models/filter_suggest'
        filteredSearchOptions: require '../../../models/filter_suggest'
        filteredSearchColumns: null # Vanilla JS object
        sections:              require('backbone').Collection
        primarySets:           require '../../../collections/ordered_sets'
        galleries:             require('backbone').Collection
        exhibitorsCount:       null # Just a Number
        exhibitorsAToZGroup:   null # Complex data structures that can't simply be wrapped in a class.
        artistsAToZGroup:      null # We'll need to deserialized this manually.
        coverImage:            require '../../../models/cover_image'
      }, (err, cachedData) ->
        return next err if err
        return end cachedData if cachedData
        # After the above TODO req.profile.get('owner') should be available
        new Fair(id: profile.get('owner').default_fair_id).fetchOverviewData
          error: res.backboneError
          success: (data) ->
            cache.setHash key, data
            end data