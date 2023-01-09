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
    element.src = "gif-duckies/" + randomImage.next().value;
  });
};

changeHeaderDuckies();

let removeDuckie = function () {
  $(".btn-default-hat").addClass("hidden");
  $(".btn-default-hat img").attr("src", "");
  $(".duckie-background").css("background-image", "");
  $(".duckie-layers").each(function (index, element) {
    $(element).css("background-image", "");
  });
  $(".btn-download").addClass("hidden");
};

let showDuckie = function () {
  let duckieID = Number($(".number-input").val());
  if (!(duckieID > 0 && duckieID <= 5000)) duckieID = 1;
  removeDuckie();

  $.getJSON("duckies/duckie" + duckieID + ".json", function (json) {
    $(".btn").removeClass("disable");

    // let i = 1;
    let duckieType = json.traits.find((o) => o.trait_type === "Type").value;

    $.each(json.traits, function (key, trait) {
      // setTimeout(() => {
      let traitType = trait.trait_type.toLowerCase();
      let traitValue = trait.value.split(" ").join("-");

      $(".duckie-" + traitType).css(
        "background-image",
        "url('layers/" + traitType + "/" + traitValue + ".png')"
      );

      if (
        traitValue.match(
          /^(Pilot-Sunglasses|Reading-Glasses|Black-Eye|Third-Eye|Diving-Mask|Shower-Cap)$/
        )
      )
        $(".duckie-" + traitType).css(
          "background-image",
          "url('layers/" +
            traitType +
            "/" +
            traitValue +
            "-" +
            duckieType +
            ".png')"
        );

      if (traitType === "head") {
        $(".duckie-head").removeClass("hidden");
        $(".btn-default-hat").removeClass("hidden");
        $(".btn-default-hat img").attr(
          "src",
          "layers/head/" + traitValue + ".png"
        );
      }
      // }, i * 400);
      // i++;
    });

    setTimeout(() => {
      $(".btn-download").removeClass("hidden");
    }, 250);
  });
};

$(".show").click(function () {
  showDuckie();
});

$(".number-input").keypress(function (e) {
  var key = e.which;
  if (key == 13)
    // the enter key code
    showDuckie();
});

$(".xmas1").click(function () {
  if ($(".duckie-head-extra").css("background-image").includes("xmas-hat-1"))
    $(".duckie-head-extra").css("background-image", "none");
  else
    $(".duckie-head-extra").css(
      "background-image",
      "url('layers/head/xmas-hat-1.png')"
    );
});

$(".mcdonalds").click(function () {
  if ($(".duckie-head-extra").css("background-image").includes("mcdonalds-hat"))
    $(".duckie-head-extra").css("background-image", "none");
  else
    $(".duckie-head-extra").css(
      "background-image",
      "url('layers/head/mcdonalds-hat.png')"
    );
});

$(".btn-default-hat").click(function () {
  $(".duckie-head").toggleClass("hidden");
});

$(".btn-download").click(function () {
  let canvas = document.createElement("canvas");
  canvas.width = canvas.height = 960;
  let context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;

  let backgroundImage = new Image();
  backgroundImage.src = $("#duckie-image").css("background-image").slice(5, -2);
  context.drawImage(backgroundImage, 0, 0, 960, 960);

  let duckieTypeImage = new Image();
  duckieTypeImage.src = $(".duckie-type").css("background-image").slice(5, -2);
  context.drawImage(duckieTypeImage, 0, 0, 960, 960);

  let duckieFaceImage = new Image();
  duckieFaceImage.src = $(".duckie-face").css("background-image").slice(5, -2);
  context.drawImage(duckieFaceImage, 0, 0, 960, 960);

  let duckieBodyImage = new Image();
  duckieBodyImage.src = $(".duckie-body").css("background-image").slice(5, -2);
  context.drawImage(duckieBodyImage, 0, 0, 960, 960);

  let duckieBeakImage = new Image();
  duckieBeakImage.src = $(".duckie-beak").css("background-image").slice(5, -2);
  context.drawImage(duckieBeakImage, 0, 0, 960, 960);

  let duckieEyesImage = new Image();
  duckieEyesImage.src = $(".duckie-eyes").css("background-image").slice(5, -2);
  context.drawImage(duckieEyesImage, 0, 0, 960, 960);

  let duckieHeadImage = new Image();
  duckieHeadImage.src = $(".duckie-head").css("background-image").slice(5, -2);
  context.drawImage(duckieHeadImage, 0, 0, 960, 960);

  let duckieHeadExtraImage = new Image();
  duckieHeadExtraImage.src = $(".duckie-head-extra")
    .css("background-image")
    .slice(5, -2);
  context.drawImage(duckieHeadExtraImage, 0, 0, 960, 960);

  let a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "duckie.png";
  a.click();
});
