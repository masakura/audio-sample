(function () {
  'use strict';

  var createChannel = function (context) {
    var operator = createOperator(context);
    var vcf = context.createBiquadFilter();

    operator.connect(vcf);
    vcf.connect(context.destination);

    return {
      down: function () {
        operator.down();
      },
      up: function () {
        operator.up();
      }
    };
  };

  var createOperator = function (context) {
    var oscillator  = context.createOscillator();
    var gain = context.createGain();
    oscillator.connect(gain);
    gain.gain.value = 0;

    oscillator.start(0);

    return {
      connect: function (destination) {
        gain.connect(destination);
      },
      down: function () {
        gain.gain.value = 1;
      },
      up: function () {
        gain.gain.value = 0;
      }
    };
  };

  var createSound = function (context) {
    return {
      createChannel: function () {
        return createChannel(context);
      }
    };
  };

  var sound = createSound(new AudioContext());
  var channel = sound.createChannel();

  $(document).on('mousedown mouseup', '#button', function (e) {
    switch (e.type) {
    case 'mousedown':
      channel.down();
      break;

    case 'mouseup':
      channel.up();
      break;
    }
  });
})();
