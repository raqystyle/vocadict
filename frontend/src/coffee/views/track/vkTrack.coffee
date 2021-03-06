define 'views/track/vkTrack',
['jquery','underscore','backbone','app','text!templates/track/vkTrack.html'],
($, _, Backbone, app, html) ->
  View = Backbone.View.extend
    tagName: 'section'
    className: 'item'

    initialize: ->
      this.template = html;
      _.bindAll this, 'selectMe', 'playTrack', 'render', 'toggleActive'

    events:
      'click a': 'selectMe'
      'click .start-play': 'playTrack'

    selectMe: (e) ->
      e.preventDefault()
      e.stopPropagation()

      app.log 'vkTrack clicked: event', e

      app.trigger 'list.load',
        type: 'lastfm'
        $domElement: $(e.currentTarget).closest('.track-line').next()
        artist: app.methods.decodeStr this.model.get 'artist'
        title: app.methods.decodeStr this.model.get 'title'
        listTitle: 'Similar tracks to "' + this.model.getTrackCreds() + '"'

    playTrack: (e) ->
      e.preventDefault()
      e.stopPropagation()

      app.log 'vkTrack: playTrack'

      app.trigger 'track.play',
        title: this.model.getTrackCreds()
        url: this.model.get('url')

      app.trigger 'track.setActive', view: this

    toggleActive: ->
      this.$el.toggleClass 'active'

    render: ->
      data = @model.toJSON()

      minutes = Math.floor (data.duration / 60) % 60
      seconds = Math.floor data.duration % 60

      minutes = "0" + minutes if minutes.toString().length is 1
      seconds = "0" + seconds if seconds.toString().length is 1

      data.durationStr = minutes + ':' + seconds
      itemHTML = _.template @template, data
      $(@el).append itemHTML
