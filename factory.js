"use strict";

let defaultDuck = {
  background: "url('layers/background/Blue.png')",
  type: "url('layers/type/Yellow.png')",
};

let resetDuckie = function () {
  $("#background-btns")
    .children(".btn-icon")
    .not(".bg-blue")
    .removeClass("selected");

  $("#background-btns").children(".bg-blue").addClass("selected");

  $(".duckie-background").css("background-image", defaultDuck.background);

  $(".duckie-layers").each(function (index, element) {
    $(element).css("background-image", "");
  });

  $("#type-btns")
    .children(".btn-icon")
    .not(".type-yellow")
    .removeClass("selected");

  $("#type-btns").children(".type-yellow").addClass("selected");

  $(".duckie-type").css("background-image", defaultDuck.type);
};

resetDuckie();

let typeChange = function () {
  let duckieType = $("#type-btns").children(".selected").attr("title");
  let eyesTraitTitle = $("#eyes-btns").children(".selected").attr("title");

  if (eyesTraitTitle) {
    let eyesTraitValue = eyesTraitTitle.split(" ").join("-");
    if (
      eyesTraitValue.match(
        /^(Pilot-Sunglasses|Reading-Glasses|Black-Eye|Third-Eye|Diving-Mask)$/
      )
    )
      $(".duckie-eyes").css(
        "background-image",
        "url('layers/eyes/" + eyesTraitValue + "-" + duckieType + ".png')"
      );

    if (eyesTraitValue.match(/^(Wink|Closed-Eyes)$/)) {
      let eyes =
        duckieType === "Alien"
          ? eyesTraitValue + "-" + duckieType
          : eyesTraitValue;

      $(".duckie-eyes").css(
        "background-image",
        "url('layers/eyes/" + eyes + ".png')"
      );
    }
  }

  let headTraitTitle = $("#head-btns").children(".selected").attr("title");

  if (headTraitTitle) {
    let headTraitValue = headTraitTitle.split(" ").join("-");

    if (headTraitValue.match(/^(Shower-Cap)$/))
      $(".duckie-head").css(
        "background-image",
        "url('layers/head/" + headTraitValue + "-" + duckieType + ".png')"
      );
  }
};

$(document).on("click", ".accordion", function () {
  $(this).toggleClass("active");
  let span = $(this).find("span");
  let text = span.html();
  span.html(text == "+" ? "-" : "+");
  let panel = $(this).next();
  let maxHeight = panel.css("maxHeight");
  panel.css(
    "maxHeight",
    maxHeight == "0px" ? panel.prop("scrollHeight") : "0px"
  );
});

$(document).on("click", ".btn-icon", function () {
  let parent = $(this).parent();
  parent.children(".btn-icon").not(this).removeClass("selected");
  $(this).toggleClass("selected");

  let duckieType = $("#type-btns").children(".selected").attr("title");
  let traitType = parent.attr("id").split("-")[0];
  let traitValue = $(this).attr("title").split(" ").join("-");

  if (!$(this).hasClass("selected")) {
    if (parent.hasClass("panel"))
      $(".duckie-" + traitType).css("background-image", "");
    else {
      $(".duckie-" + traitType).css("background-image", defaultDuck[traitType]);
      parent.children(":first").addClass("selected");
      if (traitType === "type") typeChange();
    }
  } else {
    $(".duckie-" + traitType).css(
      "background-image",
      "url('layers/" + traitType + "/" + traitValue + ".png')"
    );

    if (
      traitValue.match(
        /^(Pilot-Sunglasses|Reading-Glasses|Black-Eye|Third-Eye|Diving-Mask|Shower-Cap)$/
      ) ||
      (duckieType === "Alien" && traitValue.match(/^(Wink|Closed-Eyes)$/))
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
  }

  if (traitType === "type") typeChange();
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

  let a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "duckie.png";
  a.click();
});
