"use strict";

let shuffleArray = function* (array) {
  let i = array.length;

  while (i--) {
    yield array.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
  }
};

let changeHeaderDuckies = function () {
  let imageArray = [
    "burning.gif",
    "joint.gif",
    "masks.gif",
    "nutpfp.gif",
    "orange-beanie.gif",
    "rainbow.gif",
    "raincoat.gif",
    "robot-eye.gif",
    "spacesuit.gif",
    "turban.gif",
    "zombie.gif",
  ];

  let randomImage = shuffleArray(imageArray);
  $(".header-duckie img").each(function (index, element) {
    element.src = "images/gif-duckies/" + randomImage.next().value;
  });
};

changeHeaderDuckies();
