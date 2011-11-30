var Method = {
  args: [],
  call: function() {}
}

var Timeouts = {
  none: 0,
  move: 1400,
  jump: 650,
  roll: 650,
  turn: 450
};

var Methods = {
  move: $.extend({}, Method, {args: ['Forward', 'Backward'], call: function(arg, callback, command, commandList) {
    PrivateMethods["move" + arg](function() {callback(command, commandList)});
  }}),

  roll: $.extend({}, Method, {call: function(arg, callback, command, commandList) {
    if  (Stage.dino.attr('src') == "images/sprites/1.png") {
      var anim = Stage.dino.animate(
        {transform: "r360,"+(Stage.dino.width / 2)+","+(Stage.dino.height / 2)},
        500, 'linear', function(){
          Stage.dino.transform("r0");
          callback(command, commandList);
        });
    } else if (Stage.dino.attr("src") == "images/sprites/l1.png") {
      var anim = Stage.dino.animate(
        {transform: "r-360,"+(-Stage.dino.width / 2)+","+(Stage.dino.height / 2)},
        500, 'linear', function(){
          Stage.dino.transform("r0");
          callback(command, commandList);
        } );
    }
  }}),

  jump: $.extend({}, Method, {call:
                 function(args, callback, command, commandList) {
    if  (Stage.dino.attr('src') == "images/sprites/1.png") {
      setTimeout(function(){ Stage.dino.attr('src', 'images/sprites/3.png')  }, 10);
      setTimeout(function(){ Stage.dino.attr('src', 'images/sprites/4.png')  }, 250);
      setTimeout(function(){ Stage.dino.attr('src', 'images/sprites/1.png')  }, 500);
      Stage.dino.animate(
        {y: Stage.dino.attr('y') - 50}, 250, 'linear',
        function(){
          Stage.dino.animate({y: Stage.dino.attr('y') + 50}, 250, 'linear', function() {callback(command, commandList)})
        });
    } else if (Stage.dino.attr('src') == "images/sprites/l1.png") {
      setTimeout(function(){ Stage.dino.attr('src', 'images/sprites/l3.png')  }, 10);
      setTimeout(function(){ Stage.dino.attr('src', 'images/sprites/l4.png')  }, 250);
      setTimeout(function(){ Stage.dino.attr('src', 'images/sprites/l1.png')  }, 500);
      Stage.dino.animate(
        {y: Stage.dino.attr('y') - 50}, 250, 'linear',
        function(){ Stage.dino.animate({y: Stage.dino.attr('y') + 50}, 250, 'linear', function() {callback(command, commandList)}) });
    }
  }
  }),

  turn: $.extend({}, Method, {call: function(args, callback, command, commandList) {
    if (Stage.dino.attr('src') == "images/sprites/l1.png") {
      setTimeout(function(){ Stage.dino.attr('src', 'images/sprites/back.png')  }, 150);
      setTimeout(function(){ 
                  Stage.dino.attr('src', 'images/sprites/1.png'); 
                  callback(command, commandList);
      }, 300);
    } else {
      setTimeout(function(){ Stage.dino.attr('src', 'images/sprites/front.png')  }, 150)
      setTimeout(function(){ 
        Stage.dino.attr('src', 'images/sprites/l1.png'); 
        callback(command, commandList);
      }, 300)
    };
  }}),

  loop: $.extend({}, Method, {call: function(args, callback, command, commandList) {}}),
  when: $.extend({}, Method, {args: ['shake', 'touch'], call: function(arg, callback, command, commandList) {
    var prevX = 1.0;
    var axl = new Accelerometer();
    var threshold = 1;
    axl.watchAcceleration(
      function (Accel)
      {
        if (true === Accel.is_updating){
          return;
        }
        var diffX = Math.abs(Accel.x) - prevX;

        if (diffX >= threshold)
        {
        // The user has shaken their device. Do something
          Program.executeEvent();
        }
        prevX = Math.abs(Accel.x);
      },
      function(){},
      {frequency : 100}
    );
    callback(command, commandList);
  }}),
};

var PrivateMethods = {
  moveForward: function(callback) {
    var x = Stage.dino.attr('x');
    if  (Stage.dino.attr('src') == "images/sprites/l1.png") {
      PrivateMethods.animateLeft(1, x, -10, callback);
    } else if (Stage.dino.attr('src') == "images/sprites/1.png") {
      PrivateMethods.animateRight(1, x, 10, callback);
    }

  },

  moveBackward: function(callback) {
    var x = Stage.dino.attr('x');
    if  (Stage.dino.attr('src') == "images/sprites/l1.png") {
      PrivateMethods.animateLeft(1, x, 10, callback);
    } else if (Stage.dino.attr('src') == "images/sprites/1.png") {
      PrivateMethods.animateRight(1, x, -10, callback);
    }
  },

  animateRight: function(index, x, offset, callback) {
    if (x + offset > Stage.width - 99  || x + offset < 0) {
      offset = 0;
    }
    if (index < 10) {
      Stage.dino.animate({x: x+offset}, 100, 'linear', function() {
        Stage.dino.attr('src', 'images/sprites/' + index + '.png');
        PrivateMethods.animateRight(index + 1, x + offset, offset, callback);
      });
    } else if (index == 10) {
      Stage.dino.animate({x: x + offset}, 100, 'linear', function() {
        Stage.dino.attr('src', 'images/sprites/1.png');
        callback();
      });
    }

  },

  animateLeft: function(index, x, offset, callback) {
    if (x + offset > Stage.width - 97  || x + offset < 0) {
      offset = 0;
    }
    if (index < 10) {
      Stage.dino.animate({x: x + offset}, 100, 'linear', function() {
        Stage.dino.attr('src', 'images/sprites/l' + index + '.png');
        PrivateMethods.animateLeft(index + 1, x + offset, offset, callback);
      });
    } else if (index == 10) {
      Stage.dino.animate({x: x + offset}, 100, 'linear', function() {
        Stage.dino.attr('src', 'images/sprites/l1.png');
        callback();
      });
    }
  }
}
