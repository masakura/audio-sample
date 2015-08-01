(function () {
  'use strict';

  $(document).on('mousedown', '#down', () => {
    var sample = document.querySelector('my-sample');
    sample.down();
  });

  $(document).on('mousedown', '#sound', () => {
    var sound = document.querySelector('x-sound');
    sound.down();
  });
})();
