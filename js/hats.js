"use strict";

let defaultHeadtrait = "none";

let removeDuckie = function () {
  $(".btn-default-hat").addClass("hidden");
  $(".btn-default-hat img").attr("src", "");
  $(".duckie-background").css("background-image", "");
  $(".duckie-layers").each(function (index, element) {
    $(element).css("background-image", "none");
  });
  $("#downloadbutton").addClass("hidden");
};

let showDuckie = function () {
  let duckieID = Number($(".number-input").val());
  if (!(duckieID > 0 && duckieID <= 5000)) duckieID = 1;
  removeDuckie();

  $.getJSON("data/duckies/duckie" + duckieID + ".json", function (json) {
    $(".btn").removeClass("disable");
    $("#extrahats").children(".btn-extrahat").removeClass("selected");

    let duckieType = json.traits.find((o) => o.trait_type === "Type").value;

    $.each(json.traits, function (key, trait) {
      let traitType = trait.trait_type.toLowerCase();
      let traitValue = trait.value.split(" ").join("-");

      $(".duckie-" + traitType).css(
        "background-image",
        "url('data/layers/" + traitType + "/" + traitValue + ".png')"
      );

      if (
        traitValue.match(
          /^(Pilot-Sunglasses|Reading-Glasses|Black-Eye|Third-Eye|Diving-Mask|Shower-Cap)$/
        )
      )
        $(".duckie-" + traitType).css(
          "background-image",
          "url('data/layers/" +
            traitType +
            "/" +
            traitValue +
            "-" +
            duckieType +
            ".png')"
        );

      if (traitType === "head") {
        defaultHeadtrait = traitValue;
        $(".btn-default-hat").removeClass("hidden").addClass("selected");
        $(".btn-default-hat img").attr(
          "src",
          "data/layers/head/" + traitValue + ".png"
        );
      }
    });

    setTimeout(() => {
      $("#downloadbutton").removeClass("hidden");
    }, 250);
  });
};

$("#showbutton").click(function () {
  showDuckie();
});

$(".number-input").keypress(function (e) {
  var key = e.which;
  if (key == 13)
    // the enter key code
    showDuckie();
});

$(document).on("click", ".btn-extrahat", function () {
  let parent = $(this).parent();
  parent.children(".btn-extrahat").not(this).removeClass("selected");
  $(this).toggleClass("selected");

  let traitValue = $(this).attr("title").split(" ").join("-");

  if (!$(this).hasClass("selected"))
    $(".duckie-head-extra").css("background-image", "none");
  else
    $(".duckie-head-extra").css(
      "background-image",
      "url('data/layers/head/" + traitValue + ".png')"
    );
});

$(".btn-default-hat").click(function () {
  $(this).toggleClass("selected");
  if (!$(this).hasClass("selected"))
    $(".duckie-head").css("background-image", "none");
  else
    $(".duckie-head").css(
      "background-image",
      "url('data/layers/head/" + defaultHeadtrait + ".png')"
    );
});

$("#downloadbutton").click(function () {
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
  a.download = "Duckie.png";
  a.click();
});
