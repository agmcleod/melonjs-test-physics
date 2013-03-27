(function() {
  var App = {
    init: function() {
      if(!me.video.init("app", 800, 600, false, "1", true)) {
        window.location = "http://getfirefox.com";
      }

      me.loader.onload = this.loaded.bind(this);
      me.loader.preload([]);
      me.state.change(me.state.LOADING);
    },

    loaded: function() {
      me.state.set(me.state.PLAY, new PlayScreen());
    }
  };

  var Game = me.ObjectEntity.extend({
    
  });

  var PlayScreen = me.ScreenObject.extend({
    onDestroyEvent: function() {

    },

    onResetEvent: function() {
      me.input.bindKey(me.input.key.LEFT, "left");
      me.input.bindKey(me.input.key.RIGHT, "right");
      me.input.bindKey(me.input.key.UP, "up");
      me.game.add(new Game(), 0);
      me.game.sort();
    }
  });

  window.onload = function() {
    App.init();
  }
}).call(this);