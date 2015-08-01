(function () {
  'use strict';

  var createSound = my.sound.createSound;
  var presets = my.sound.presets;

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
