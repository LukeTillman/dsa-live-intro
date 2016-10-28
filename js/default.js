(function initPresentation() {
  'use strict';

  // Find root and section elements under the root that aren't steps
  var rootEl = document.getElementById('impress');
  var sectionEls = rootEl.querySelectorAll('section:not(.step)');

  // Group step elements by section and count number of regular steps
  var stepCount = 0;
  var sections = [];
  sectionEls.forEach(function(sectionEl) {
    var header = sectionEl.querySelector('header');
    var steps = sectionEl.querySelectorAll('section.step');
    sections.push({
      header: header,
      steps: steps
    });

    stepCount += steps.length;
  });

  // Some information for the cirle we're arranging the steps around
  var stepRadius = 2000;
  var headerRadius = 2500;
  var rotationPerStep = 360 / stepCount;

  var stepIdx = 0;
  sections.forEach(function(section) {
    // Figure out where to place the header around its outer circle
    var headerDeg = (rotationPerStep * ((section.steps.length - 1) / 2)) + (stepIdx * rotationPerStep);
    var headerRadians = headerDeg * (Math.PI / 180);
    var headerX = Math.round(Math.sin(headerRadians) * headerRadius);
    var headerY = Math.round(Math.cos(headerRadians) * headerRadius * -1);

    // Set the data attributes used by impress
    section.header.dataset.x = headerX;
    section.header.dataset.y = headerY;
    section.header.dataset.rotateZ = headerDeg.toString();
    section.header.dataset.scale = 2;

    section.steps.forEach(function(step) {
      // Use some geometry to figure out the position and rotation for the step
      var rotationDeg = stepIdx * rotationPerStep;
      var radians = rotationDeg * (Math.PI / 180);
      var x = Math.round(Math.sin(radians) * stepRadius);
      var y = Math.round(Math.cos(radians) * stepRadius * -1);

      // Set the data attributes used by impress
      step.dataset.rotateZ = rotationDeg.toString();
      step.dataset.x = x;
      step.dataset.y = y;

      stepIdx++;
    });
  });

  // Function for setting customizable content on the presentation
  function updatePresentation(ev) {
    var location = document.getElementById('customize-location');
    var name = document.getElementById('customize-name');
    var title = document.getElementById('customize-title');
    var twitter = document.getElementById('customize-twitter');

    document.getElementById('event-location').innerText = location.value;
    document.getElementById('presenter-name').innerText = name.value;
    document.getElementById('presenter-title').innerText = title.value;
    document.getElementById('presenter-twitter').innerText = twitter.value;

    if (ev) {
      ev.preventDefault();
    }
  }

  // Do initial update based on form values
  updatePresentation();

  // Init impress
  impress().init();

  // Event listeners for controls
  var bodyEl = document.getElementById('the-body');
  
  document.getElementById('toggle-notes').addEventListener('click', function(ev) {
    bodyEl.classList.toggle('show-speaker-notes');
  });

  document.getElementById('toggle-customize').addEventListener('click', function(ev) {
    document.getElementById('customize').classList.toggle('hidden');
  });

  document.getElementById('customize-form').addEventListener('submit', updatePresentation);

  // Don't propagate keys pressed in the customize form
  document.getElementById('customize').addEventListener('keyup', function(ev) { ev.stopPropagation(); });
  document.getElementById('customize').addEventListener('keydown', function(ev) { ev.stopPropagation(); });
}());