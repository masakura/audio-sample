(function () {
  'use strict';

  var createEnvelope = function (context, envelope) {
    return {
      down: function (gain) {
        var now = context.currentTime;
        gain.gain.cancelScheduledValues(0);
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(1, now + envelope.attack);
        gain.gain.linearRampToValueAtTime(1 * envelope.sustain,
                                          now + envelope.attack + envelope.decay);
      },
      up: function (gain) {
        var now = context.currentTime;
        var level = gain.gain.value;
        gain.gain.cancelScheduledValues(0);
        gain.gain.setValueAtTime(level, now);
        gain.gain.linearRampToValueAtTime(0.0, now + envelope.release);
      }
    };
  };

  var makePreset = function (context, type, envelope) {
    var operator = createOperator(context, type, envelope);
      return {
        getConnectableOperators: function () {
          return [operator];
        },
        getOperators: function () {
          return [operator];
        }
      };
  };

  var presets = {
    sine: function (context) {
      return makePreset(context, 'sine');
    },
    square: function (context) {
      return makePreset(context, 'square');
    },
    sawtooth: function (context) {
      return makePreset(context, 'sawtooth');
    },
    triangle: function (context) {
      return makePreset(context, 'triangle');
    },
    pararrel4: function (context) {
      var operators = [
        createOperator(context, 'sine'),
        createOperator(context, 'sine'),
        createOperator(context, 'sine'),
        createOperator(context, 'sine')
      ];

      return {
        getConnectableOperators: function () {
          return operators;
        },
        getOperators: function () {
          return operators;
        }
      };
    },
    serial4: function (context) {
      var operators = [
        createOperator(context, 'sine'),
        createOperator(context, 'sine'),
        createOperator(context, 'sine'),
        createOperator(context, 'sine')
      ];
      operators[3].connect(operators[2].getConnector());
      operators[2].connect(operators[1].getConnector());
      operators[1].connect(operators[0].getConnector());

      return {
        getConnectableOperators: function () {
          return [operators[0]];
        },
        getOperators: function () {
          return operators;
        }
      };
    }
  };

  var createChannel = function (context, algorithm) {
    var operators = algorithm(context);
    var vcf = context.createBiquadFilter();

    operators.getConnectableOperators()
      .forEach(function (operator) {
        operator.connect(vcf);
      });
    vcf.connect(context.destination);

    return {
      down: function () {
        operators.getOperators()
          .forEach(function (operator) {
            operator.down();
          });
      },
      up: function () {
        operators.getOperators()
          .forEach(function (operator) {
            operator.up();
          });
      }
    };
  };

  var createOperator = function (context, type, envelope) {
    envelope = envelope || createEnvelope(context, {
      attack: 0.1,
      decay: 0.5,
      sustain: 0.8,
      release: 2
    });

    var oscillator  = context.createOscillator();
    var gain = context.createGain();
    if (type) {
      oscillator.type = type;
    }
    oscillator.connect(gain);
    gain.gain.value = 0;

    oscillator.start(0);

    return {
      connect: function (destination) {
        gain.connect(destination);
      },
      getConnector: function () {
        return oscillator.frequency;
      },
      down: function () {
        envelope.down(gain);
      },
      up: function () {
        envelope.up(gain);
      }
    };
  };

  var createSound = function (context) {
    return {
      createChannel: function (algorithm) {
        return createChannel(context, algorithm);
      }
    };
  };

  var sound = createSound(new AudioContext());
  var channels = {
    sine: sound.createChannel(presets.sine),
    pararrel4: sound.createChannel(presets.pararrel4),
    serial4: sound.createChannel(presets.serial4),
    square: sound.createChannel(presets.square),
    sawtooth: sound.createChannel(presets.sawtooth),
    triangle: sound.createChannel(presets.triangle)
  };

  $(document).on('mousedown mouseup', '.play', function (e) {
    var channel = channels[e.currentTarget.id];

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
