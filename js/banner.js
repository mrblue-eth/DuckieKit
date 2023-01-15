"use strict";

let defaultDuck = {
  background: "url('data/layers/background/Purple.png')",
  type: "url('data/layers/type/Yellow.png')",
};

let duckies = [];
const template = document.getElementById("duckie");
const target = $(".banner");
let scale = 1;
if (screen.width < 800) scale = 2 / 3;
if (screen.width < 550) scale = 1 / 2;

let duckieDefaultBgWidth = 750 * scale;
let duckieDefaultWidth = 250 * scale;

let findBestWidth = function (widthSize) {
  let standardSizes = [24, 48, 72, 96, 120, 144, 168, 192, 216, 240];

  return standardSizes.reduce(function (prev, curr) {
    return Math.abs(curr - widthSize) < Math.abs(prev - widthSize)
      ? curr
      : prev;
  });
};

let resetDuckie = function () {
  const templateItem = template.content.cloneNode(true);
  const templateDuckie = templateItem.querySelector(".duckie-image");
  const templateBg = templateItem.querySelector(".duckie-background");
  const templateType = templateItem.querySelector(".duckie-type");

  $(templateDuckie).addClass("duckie-0");
  $(templateBg).css("background-image", defaultDuck.background);
  $(templateType).css("background-image", defaultDuck.type);
  target.append(templateItem);
};

resetDuckie();

let removeDuckie = function (duckieNumber) {
  $(".duckie-" + duckieNumber).remove();
};

let addDuckie = function () {
  let duckieID = Number($(".number-input").val());
  if (!(duckieID > 0 && duckieID <= 5000)) duckieID = 1;
  duckies.push(duckieID);

  const templateItem = template.content.cloneNode(true);

  const templateDuckie = templateItem.querySelector(".duckie-image");
  const templateBg = templateItem.querySelector(".duckie-background");
  const templateType = templateItem.querySelector(".duckie-type");
  const templateFace = templateItem.querySelector(".duckie-face");
  const templateBeak = templateItem.querySelector(".duckie-beak");
  const templateEyes = templateItem.querySelector(".duckie-eyes");
  const templateBody = templateItem.querySelector(".duckie-body");
  const templateHead = templateItem.querySelector(".duckie-head");
  removeDuckie(0);
  let numOfDuckies = $(".duckie-image").length + 1;
  $(templateDuckie).addClass("duckie-" + numOfDuckies);

  let duckieWidth = duckieDefaultBgWidth / numOfDuckies;
  let initialWidth =
    duckieWidth < duckieDefaultWidth ? duckieWidth : duckieDefaultWidth;

  let bestWidth = findBestWidth(initialWidth);

  $(templateItem.querySelector(".duckie-layers")).css(
    "width",
    bestWidth + "px"
  );

  $(templateBg).css("width", duckieWidth + "px");

  $.getJSON("data/duckies/duckie" + duckieID + ".json", function (json) {
    let duckieBackground = json.traits.find(
      (o) => o.trait_type === "Background"
    ).value;

    $(templateBg).css(
      "background-image",
      "url('data/layers/background/" + duckieBackground + ".png')"
    );

    let duckieType = json.traits.find((o) => o.trait_type === "Type").value;
    $(templateType).css(
      "background-image",
      "url('data/layers/type/" + duckieType + ".png')"
    );

    let faceTrait = json.traits.find((o) => o.trait_type === "Face");
    faceTrait &&
      $(templateFace).css(
        "background-image",
        "url('data/layers/face/" + faceTrait.value + ".png')"
      );

    let beakTrait = json.traits.find((o) => o.trait_type === "Beak");
    beakTrait &&
      $(templateBeak).css(
        "background-image",
        "url('data/layers/beak/" + beakTrait.value + ".png')"
      );

    let eyesTrait = json.traits.find((o) => o.trait_type === "Eyes");
    if (typeof eyesTrait !== "undefined") {
      let duckieEyes = eyesTrait.value.split(" ").join("-");
      if (
        duckieEyes.match(
          /^(Pilot-Sunglasses|Reading-Glasses|Black-Eye|Third-Eye|Diving-Mask)$/
        )
      )
        $(templateEyes).css(
          "background-image",
          "url('data/layers/eyes/" + duckieEyes + "-" + duckieType + ".png')"
        );
      else
        $(templateEyes).css(
          "background-image",
          "url('data/layers/eyes/" + duckieEyes + ".png')"
        );
    }

    let bodyTrait = json.traits.find((o) => o.trait_type === "Body");
    bodyTrait &&
      $(templateBody).css(
        "background-image",
        "url('data/layers/body/" +
          bodyTrait.value.split(" ").join("-") +
          ".png')"
      );

    let headTrait = json.traits.find((o) => o.trait_type === "Head");

    if (typeof headTrait !== "undefined") {
      let duckieHead = headTrait.value.split(" ").join("-");
      if (duckieHead.match(/^(Shower-Cap)$/))
        $(templateHead).css(
          "background-image",
          "url('data/layers/head/" + duckieHead + "-" + duckieType + ".png')"
        );
      else
        $(templateHead).css(
          "background-image",
          "url('data/layers/head/" + duckieHead + ".png')"
        );
    }
  });

  target.append(templateItem);

  $(".banner")
    .find(".duckie-layers")
    .css("width", bestWidth + "px");

  $(".banner")
    .find(".duckie-background")
    .css("width", duckieWidth + "px");
};

$(document).on("click", ".btn-icon", function () {
  let parent = $(this).parent();
  parent.children(".btn-icon").not(this).removeClass("selected");
  $(this).toggleClass("selected");

  if (!$(this).hasClass("selected"))
    $(".duckie-background").css("display", "block");
  else {
    $(".banner").css(
      "background-image",
      "url('data/layers/background/" + $(this).attr("title") + ".png')"
    );
    $(".duckie-background").css("display", "contents");
  }
});

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

$(document).on("click", ".btn-mug", function () {
  let parent = $(this).parent();
  parent.children(".btn-mug").not(this).removeClass("selected");
  $(this).toggleClass("selected");

  let mug = $(this).attr("title").split(" ").join("-");

  if (!$(this).hasClass("selected")) {
    $(".duckie-mug").css("background-image", defaultDuck.mug);
    parent.children(":first").addClass("selected");
  } else $(".duckie-mug").css("background-image", "url('data/layers/mug/" + mug + ".png')");
});

$(".btn-add").click(function () {
  addDuckie();
});

$(".number-input").keypress(function (e) {
  let key_code = e.which || e.keyCode;
  if (key_code == 13) addDuckie();
});

$("#downloadbutton").click(function () {
  let canvas = document.createElement("canvas");
  canvas.width = 1500;
  canvas.height = 500;
  let context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;

  let numOfDuckies = $(".duckie-image").length;
  let duckieWidth = 750 / numOfDuckies;
  let layerInitialSize = duckieWidth < 250 ? duckieWidth : 250;

  let layerSize = findBestWidth(layerInitialSize) * 2;
  duckieWidth *= 2;

  let isBackgroundSet = false;
  if ($("#background-btns").find(".selected").length !== 0) {
    let bannerBackgroundImage = new Image();
    bannerBackgroundImage.src =
      "data/layers/background/" +
      $("#background-btns").find(".selected").attr("title") +
      ".png";
    context.drawImage(bannerBackgroundImage, 0, 0, 1500, 500);

    isBackgroundSet = true;
  }
  $(".duckie-image").each(function (index, element) {
    if (!isBackgroundSet) {
      let duckieBackgroundImage = new Image();
      duckieBackgroundImage.src = $(element)
        .find(".duckie-background")
        .css("background-image")
        .slice(5, -2);
      context.drawImage(
        duckieBackgroundImage,
        duckieWidth * index,
        0,
        duckieWidth,
        500
      );
    }

    let duckieTypeImage = new Image();
    duckieTypeImage.src = $(element)
      .find(".duckie-type")
      .css("background-image")
      .slice(5, -2);
    context.drawImage(
      duckieTypeImage,
      Math.round(duckieWidth * index + duckieWidth / 2 - layerSize / 2),
      500 - layerSize,
      layerSize,
      layerSize
    );

    let duckieFaceImage = new Image();
    duckieFaceImage.src = $(element)
      .find(".duckie-face")
      .css("background-image")
      .slice(5, -2);
    context.drawImage(
      duckieFaceImage,
      Math.round(duckieWidth * index + duckieWidth / 2 - layerSize / 2),
      500 - layerSize,
      layerSize,
      layerSize
    );

    let duckieBodyImage = new Image();
    duckieBodyImage.src = $(element)
      .find(".duckie-body")
      .css("background-image")
      .slice(5, -2);
    context.drawImage(
      duckieBodyImage,
      Math.round(duckieWidth * index + duckieWidth / 2 - layerSize / 2),
      500 - layerSize,
      layerSize,
      layerSize
    );

    let duckieBeakImage = new Image();
    duckieBeakImage.src = $(element)
      .find(".duckie-beak")
      .css("background-image")
      .slice(5, -2);
    context.drawImage(
      duckieBeakImage,
      Math.round(duckieWidth * index + duckieWidth / 2 - layerSize / 2),
      500 - layerSize,
      layerSize,
      layerSize
    );

    let duckieEyesImage = new Image();
    duckieEyesImage.src = $(element)
      .find(".duckie-eyes")
      .css("background-image")
      .slice(5, -2);
    context.drawImage(
      duckieEyesImage,
      Math.round(duckieWidth * index + duckieWidth / 2 - layerSize / 2),
      500 - layerSize,
      layerSize,
      layerSize
    );

    let duckieHeadImage = new Image();
    duckieHeadImage.src = $(element)
      .find(".duckie-head")
      .css("background-image")
      .slice(5, -2);
    context.drawImage(
      duckieHeadImage,
      Math.round(duckieWidth * index + duckieWidth / 2 - layerSize / 2),
      500 - layerSize,
      layerSize,
      layerSize
    );
  });
  let a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "DuckieBanner.png";
  a.click();
});
