"use strict";

let defaultDuck = {
  background: "url('data/layers/background/Purple.png')",
  type: "url('data/layers/type/Yellow.png')",
  mug: "url('data/layers/mug/Small-Mug-Yellow.png')",
  gm: "url('data/layers/gm/Big-Gm-1.png')",
};

let resetDuckie = function () {
  $(".duckie-background").css("background-image", defaultDuck.background);

  $(".duckie-layers").each(function (index, element) {
    $(element).css("background-image", "none");
  });

  $(".duckie-type").css("background-image", defaultDuck.type);

  $(".duckie-mug").css("background-image", defaultDuck.mug);

  $("#mug-btns").children(":first").addClass("selected");

  $(".duckie-gm").css("background-image", defaultDuck.gm);

  $("#gm-btns").children(":first").addClass("selected");
};

resetDuckie();

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

$(document).on("click", ".btn-gm", function () {
  let parent = $(this).parent();
  parent.children(".btn-gm").not(this).removeClass("selected");
  $(this).toggleClass("selected");

  let gm = $(this).attr("title").split(" ").join("-");

  if (!$(this).hasClass("selected")) {
    $(".duckie-gm").css("background-image", defaultDuck.gm);
    parent.children(":first").addClass("selected");
  } else $(".duckie-gm").css("background-image", "url('data/layers/gm/" + gm + ".png')");
});

let removeDuckie = function () {
  $(".duckie-background").css("background-image", "none");
  $(".duckie-layers")
    .not(".duckie-mug")
    .not(".duckie-gm")
    .each(function (index, element) {
      $(element).css("background-image", "none");
    });
};

let showDuckie = function () {
  let duckieID = Number($(".number-input").val());
  if (!(duckieID > 0 && duckieID <= 5000)) duckieID = 1;
  removeDuckie();

  $.getJSON("data/duckies/duckie" + duckieID + ".json", function (json) {
    $(".btn-show").removeClass("disable");

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
    });
  });
};

$(".btn-show").click(function () {
  showDuckie();
});

$(".number-input").keypress(function (e) {
  let key_code = e.which || e.keyCode;
  if (key_code == 13)
    // the enter key code
    showDuckie();
});

let moveMug2Left = function (pixels) {
  let mugRight = parseInt($(".duckie-mug").css("right"), 10);
  let mugHeight = parseInt($(".duckie-mug").css("height"), 10);
  if (
    (mugRight < 200 && mugHeight > 150) ||
    (mugRight < 90 && mugHeight < 150)
  ) {
    $(".duckie-mug").animate({ right: "+=" + pixels + "px" });
    $(".duckie-gm").animate({ right: "+=" + pixels + "px" });
  }
};
let moveMug2Right = function (pixels) {
  let mugRight = parseInt($(".duckie-mug").css("right"), 10);
  let mugHeight = parseInt($(".duckie-mug").css("height"), 10);
  if ((mugRight > 60 && mugHeight > 150) || (mugRight > 0 && mugHeight < 150)) {
    $(".duckie-mug").animate({ right: "-=" + pixels + "px" });
    $(".duckie-gm").animate({ right: "-=" + pixels + "px" });
  }
};

$("body").keyup(function (e) {
  let key_code = e.which || e.keyCode;
  switch (key_code) {
    case 37: //left arrow key
      moveMug2Left(10);
      break;
    case 39: //right arrow key
      moveMug2Right(10);
      break;
  }
});

$(".btn-right").click(function () {
  moveMug2Right(10);
});

$(".btn-left").click(function () {
  moveMug2Left(10);
});

$("#downloadbutton").click(function () {
  let canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 675;
  let context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;

  let backgroundImage = new Image();
  backgroundImage.src = $("#duckie-image").css("background-image").slice(5, -2);
  context.drawImage(backgroundImage, 0, 0, 1200, 675);

  let duckieTypeImage = new Image();
  duckieTypeImage.src = $(".duckie-type").css("background-image").slice(5, -2);
  context.drawImage(duckieTypeImage, 100, 0, 675, 675);

  let duckieFaceImage = new Image();
  duckieFaceImage.src = $(".duckie-face").css("background-image").slice(5, -2);
  context.drawImage(duckieFaceImage, 100, 0, 675, 675);

  let duckieBodyImage = new Image();
  duckieBodyImage.src = $(".duckie-body").css("background-image").slice(5, -2);
  context.drawImage(duckieBodyImage, 100, 0, 675, 675);

  let duckieBeakImage = new Image();
  duckieBeakImage.src = $(".duckie-beak").css("background-image").slice(5, -2);
  context.drawImage(duckieBeakImage, 100, 0, 675, 675);

  let duckieEyesImage = new Image();
  duckieEyesImage.src = $(".duckie-eyes").css("background-image").slice(5, -2);
  context.drawImage(duckieEyesImage, 100, 0, 675, 675);

  let duckieHeadImage = new Image();
  duckieHeadImage.src = $(".duckie-head").css("background-image").slice(5, -2);
  context.drawImage(duckieHeadImage, 100, 0, 675, 675);

  let duckieGmImage = new Image();
  duckieGmImage.src = $(".duckie-gm").css("background-image").slice(5, -2);

  let duckieMugImage = new Image();
  duckieMugImage.src = $(".duckie-mug").css("background-image").slice(5, -2);

  let scale = 2;

  if (screen.width < 650) scale = 3.05;

  context.drawImage(
    duckieGmImage,
    parseInt($(".duckie-gm").css("left"), 10) * scale + 100,
    75,
    275,
    200
  );

  context.drawImage(
    duckieMugImage,
    parseInt($(".duckie-mug").css("left"), 10) * scale + 100,
    300,
    250,
    375
  );

  let a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "DuckieGM.png";
  a.click();
});
