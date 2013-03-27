(function() {
  var App = {
    init: function() {
      if(!me.video.init("app", 800, 600, false, "1", true)) {
        window.location = "http://getfirefox.com";
      }

      me.loader.onload = this.loaded.bind(this);
      me.loader.preload([{
        name: "hearts",
        type: "image",
        src: "hearts.png"
      }]);
      me.state.change(me.state.LOADING);
    },

    loaded: function() {
      me.state.set(me.state.PLAY, new PlayScreen());
      me.state.change(me.state.PLAY);
    }
  };

  var Game = me.ObjectEntity.extend({
    init: function() {
      this.player = new Player();
      me.game.add(this.player, 100);
      me.game.sort();
    },

    update: function() {
      me.video.clearSurface(me.video.getScreenCanvas().getContext("2d"), "#000000");
    }
  });

  var Player = me.ObjectEntity.extend({
    init: function() {
      var settings = {
        image: "hearts",
        spritewidth: 32,
        spriteheight: 32
      }
      this.collidable = true;
      this.parent(400, 400, settings);
      this.jumping = false;
      this.falling = true;
      
      this.setMaxVelocity(5, 30);
      this.renderable.addAnimation("idle", [0]);
      this.renderable.setCurrentAnimation("idle");
    },
    update: function() {
      if(me.input.isKeyPressed("left")) {
        this.vel.x -= 1 * me.timer.tick;
        if(this.vel.x < -this.maxVel.x * me.timer.tick) {
          this.vel.x = -this.maxVel.x * me.timer.tick;
        }
      }
      else if(me.input.isKeyPressed("right")) {
        this.vel.x += 1 * me.timer.tick;
        if(this.vel.x > this.maxVel.x * me.timer.tick) {
          this.vel.x = this.maxVel.x * me.timer.tick;
        }
      }
      else {
        if(this.vel.x > 0) {
          this.vel.x -= 0.5 * me.timer.tick;
        }
        else if(this.vel.x < 0) {
          this.vel.x += 0.5 * me.timer.tick;
        }
      }

      if(me.input.isKeyPressed("jump")) {
        if(!this.falling && !this.jumping) {
          this.vel.y = -this.maxVel.y * me.timer.tick;
          this.jumping = true;
          this.falling = true;
        }
      }
      else if(this.jumping) {
        this.vel.y = 0;
        this.jumping = false;
      }

      if(this.falling) {
        this.vel.y += 2 * me.timer.tick;
        if(this.vel.y > this.maxVel.y) {
          this.vel.y = this.maxVel.y;
        }
      }

      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      if(this.pos.y + 32 >= 600) {
        this.vel.y = 0;
        this.pos.y = 600-32;
        this.falling = false;
        this.jumping = false;
      }
      this.parent(this);
      return true;
    }
  }); 

  var PlayScreen = me.ScreenObject.extend({
    onDestroyEvent: function() {
      me.input.unbindKey(me.input.KEY.LEFT);
      me.input.unbindKey(me.input.KEY.RIGHT);
      me.input.unbindKey(me.input.KEY.UP);
    },

    onResetEvent: function() {
      me.input.bindKey(me.input.KEY.LEFT, "left");
      me.input.bindKey(me.input.KEY.RIGHT, "right");
      me.input.bindKey(me.input.KEY.UP, "jump");
      me.game.add(new Game(), 0);
      me.game.sort();
    }
  });

  window.onReady(function() {
    App.init();
  });
}).call(this);