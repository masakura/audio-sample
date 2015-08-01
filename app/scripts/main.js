(function () {
  'use strict';

  $(document).on('mousedown mouseup', '.play', function (e) {
    var channel = document.querySelector('[preset="' +
                                         e.currentTarget.id +
                                         '"]');

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
