/**
 * VK TRACK ITEM VIEW
**/

define([
  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Deps
  'app',
  'views/track/prototype',

  // Template
  'text!templates/track/lastfmTrack.html'
],
  function ($, _, Backbone, app, TrackViewPrototype, html) {

    var View = TrackViewPrototype.extend({
        initialize: function () {
          this.template = html;
          TrackViewPrototype.prototype.initialize.apply(this, arguments);
        },
        /**
         * Cliked on track's tag.
         **/
        selectMe: function selectMe(e) {
          app.log('lastfmTrack clicked');

          e.preventDefault();
          e.stopPropagation();

          TrackViewPrototype.prototype.selectMe.apply(this, arguments);
          app.trigger('list.load', {
            deleteable: true,
            $domElement: $(e.currentTarget).find('.sub-track'),
            artist: app.methods.decodeStr(this.model.get('artist').name),
            title: app.methods.decodeStr(this.model.get('name')),
            listTitle: 'Similar tracks to "' + this.model.getTrackCreds() + '"'
          });
        },
        /**
         * Button Play clicked.
         **/
        playTrack: function playTrack(e) {
          app.log('lastfmTrack: playTrack: model: ', this.model);

          e.preventDefault();
          e.stopPropagation();

          app.trigger('track.search', {
            type: 'search',
            artist: app.methods.decodeStr(this.model.get('artist').name),
            title: app.methods.decodeStr(this.model.get('name'))
          });
        }
      });

    return View;
  });