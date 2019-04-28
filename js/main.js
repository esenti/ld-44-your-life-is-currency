(function() {
 var DEBUG, before, c, clamp, collides, ctx, delta, draw, elapsed, keysDown, keysPressed, load, loading, now, ogre, setDelta, tick, update;

 c = document.getElementById('draw');

 ctx = c.getContext('2d');

 delta = 0;

 now = 0;

 before = Date.now();

 elapsed = 0;

 loading = 0;

 //DEBUG = false;
 DEBUG = true;

 c.width = 800;

 c.height = 600;

 keysDown = {};

 keysPressed = {};
 click = {};

 images = [];

 audios = [];

 framesThisSecond = 0;
 fpsElapsed = 0;
 fps = 0

 popups = [];
 toBoom = 1;
 toToBoom = 1;
 boom = {};
 money = 0;
 killed = 0;

state = {
  points: 0,
  clickMultiplier: 1,
  multiplier: 1,
  tentacles: 0,
  organ: 0,
  thing: 0,
  config: {
    tentacles: {
      pps: 1,
      cost: 10,
    },
    organ: {
      pps: 5,
      cost: 50,
    },
    thing: {
      pps: 15,
      cost: 200,
    }
  }
}

 window.addEventListener("keydown", function(e) {
         keysDown[e.keyCode] = true;
         return keysPressed[e.keyCode] = true;
         }, false);

 window.addEventListener("keyup", function(e) {
         return delete keysDown[e.keyCode];
         }, false);

 c.addEventListener("click", function(e) {
   click = {
     'x': e.offsetX,
     'y': e.offsetY,
   }

   console.log(click);
 })

 setDelta = function() {
     now = Date.now();
     delta = (now - before) / 1000;
     return before = now;
 };

 if (!DEBUG) {
     console.log = function() {
         return null;
     };
 }

 ogre = false;

 clamp = function(v, min, max) {
     if (v < min) {
         return min;
     } else if (v > max) {
         return max;
     } else {
         return v;
     }
 };

 collides = function(a, b) {
     return a.x + a.w > b.x && a.x < b.x + b.w && a.y + a.h > b.y && a.y < b.y + b.h;
 };

 clicked = function(c, x, y, w, h) {
    return c.x >= x && c.x <= x + w && c.y >= y && c.y <= y + h;
 }

 player = {
   x: 400,
   y: 480,
   w: 50,
   h: 50,
 }

 storedState = JSON.parse(localStorage.getItem('state'));

 if(storedState) {
   state = storedState;
 }

 tick = function() {
     setDelta();
     elapsed += delta;
     update(delta);
     draw(delta);
     keysPressed = {};
     click = null;
     if (!ogre) {
         return window.requestAnimationFrame(tick);
     }
 };

 speed = 120;
 pps = 0;

 update = function(delta) {
     framesThisSecond += 1;
     fpsElapsed += delta;

     var yes = click && clicked(click, 350, 60, 100, 100);

     buy = {}
     buy['tentacles'] = click && clicked(click, 100, 400, 100, 100);
     buy['organ'] = click && clicked(click, 250, 400, 100, 100);
     buy['thing'] = click && clicked(click, 400, 400, 100, 100);

     ['tentacles', 'organ', 'thing'].forEach(name => {
       if(buy[name] && state.points >= state.config[name].cost) {
         state.points -= state.config[name].cost;
         state.config[name].cost = Math.floor(state.config[name].cost * 1.1);
         state[name] += 1
       }
     })

     pps = 0;

     ['tentacles', 'organ', 'thing'].forEach(name => {
       state.points += state[name] * state.config[name].pps * state.multiplier * delta;
       pps += state[name] * state.config[name].pps * state.multiplier;
     })

     if(yes) {
       state.points += state.clickMultiplier * state.multiplier;
     }

     toBoom -= delta;

     if(toBoom <= 0) {
       localStorage.setItem('state', JSON.stringify(state));
       toBoom = toToBoom;
     }

     if(fpsElapsed >= 1) {
        fps = framesThisSecond / fpsElapsed;
        framesThisSecond = fpsElapsed = 0;
     }
 };

 draw = function(delta) {
     ctx.fillStyle = "#1b3a00";
     ctx.fillRect(0, 0, c.width, c.height);

     if(DEBUG) {
        ctx.fillStyle = "#888888";
        ctx.font = "20px Visitor";
        ctx.fillText(Math.round(fps), 20, 590);
     }

     ctx.fillStyle = "#521515";

     ctx.textAlign = 'center';

    ctx.fillStyle = "#eeeeee";

     ctx.textAlign = 'center';
    ctx.font = "32px Visitor";
    ctx.fillText(`ýÔïïÞ: ${Math.floor(state.points)}Í (${pps}Í/ÇæêïðÞ)`, 400, 40);

    ctx.drawImage(images['drop'], 350, 60);

    ctx.textAlign = 'center';

    ctx.drawImage(images['tentacles'], 100, 400);
    ctx.font = "26px Visitor";
    ctx.fillText(`x${state.tentacles}`, 170, 490);
    ctx.font = "20px Visitor";
    ctx.fillText(`${state.config.tentacles.pps}Í/ÇæêïðÞ`, 150, 525);
    ctx.fillText(`${state.config.tentacles.cost}Í`, 150, 550);

    ctx.drawImage(images['organ'], 250, 400);
    ctx.font = "26px Visitor";
    ctx.fillText(`x${state.organ}`, 320, 490);
    ctx.font = "20px Visitor";
    ctx.fillText(`${state.config.organ.pps}Í/ÇæêïðÞ`, 300, 525);
    ctx.fillText(`${state.config.organ.cost}Í`, 300, 550);

    ctx.drawImage(images['thing'], 400, 400);
    ctx.font = "26px Visitor";
    ctx.fillText(`x${state.thing}`, 470, 490);
    ctx.font = "20px Visitor";
    ctx.fillText(`${state.config.thing.pps}Í/ÇæêïðÞ`, 450, 525);
    ctx.fillText(`${state.config.thing.cost}Í`, 450, 550);

    ctx.drawImage(images['you'], 300, 180);
 };

 (function() {
  var targetTime, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  vendor = _ref[_i];
  if (w.requestAnimationFrame) {
  break;
  }
  w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
  }
  if (!w.requestAnimationFrame) {
  targetTime = 0;
  return w.requestAnimationFrame = function(callback) {
  var currentTime;
  targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
  return w.setTimeout((function() {
          return callback(+(new Date));
          }), targetTime - currentTime);
  };
  }
 })();

 loadImage = function(name, callback) {
    var img = new Image()
    console.log('loading')
    loading += 1
    img.onload = function() {
        console.log('loaded ' + name)
        images[name] = img
        loading -= 1
        if(callback) {
            callback(name);
        }
    }

    img.src = 'img/' + name + '.png'
 }

    loadImage('tentacles');
    loadImage('drop');
    loadImage('organ');
    loadImage('thing');
    loadImage('you');

//  audios["jeb"] = new Audio('sounds/jeb.ogg');
//  audios["ultimate_jeb"] = new Audio("sounds/ultimate_jeb.ogg");

//  loadMusic("melody1");

 load = function() {
     if(loading) {
         window.requestAnimationFrame(load);
     } else {
         window.requestAnimationFrame(tick);
     }
 };

 load();

}).call(this);
