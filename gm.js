"use strict";

let defaultDuck = {
  background: "url('layers/background/Blue.png')",
  type: "url('layers/type/Yellow.png')",
  mug: "url('layers/mug/Small-Mug-Yellow.png')",
  gm: "url('layers/gm/Big-Gm-1.png')",
};

let resetDuckie = function () {
  $(".duckie-background").css("background-image", defaultDuck.background);

  $(".duckie-layers").each(function (index, element) {
    $(element).css("background-image", "");
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
  } else $(".duckie-mug").css("background-image", "url('layers/mug/" + mug + ".png')");
});

$(document).on("click", ".btn-gm", function () {
  let parent = $(this).parent();
  parent.children(".btn-gm").not(this).removeClass("selected");
  $(this).toggleClass("selected");

  let gm = $(this).attr("title").split(" ").join("-");

  if (!$(this).hasClass("selected")) {
    $(".duckie-gm").css("background-image", defaultDuck.gm);
    parent.children(":first").addClass("selected");
  } else $(".duckie-gm").css("background-image", "url('layers/gm/" + gm + ".png')");
});

let removeDuckie = function () {
  $(".duckie-background").css("background-image", "");
  $(".duckie-layers")
    .not(".duckie-mug")
    .not(".duckie-gm")
    .each(function (index, element) {
      $(element).css("background-image", "");
    });
};

let showDuckie = function () {
  let duckieID = Number($(".number-input").val());
  if (!(duckieID > 0 && duckieID <= 5000)) duckieID = 1;
  removeDuckie();

  $.getJSON("duckies/duckie" + duckieID + ".json", function (json) {
    $(".btn-show").removeClass("disable");

    let duckieType = json.traits.find((o) => o.trait_type === "Type").value;

    $.each(json.traits, function (key, trait) {
      let traitType = trait.trait_type.toLowerCase();
      let traitValue = trait.value.split(" ").join("-");

      $(".duckie-" + traitType).css(
        "background-image",
        "url('layers/" + traitType + "/" + traitValue + ".png')"
      );

      if (
        traitValue.match(
          /^(Pilot-Sunglasses|Reading-Glasses|Black-Eye|Third-Eye|Diving-Mask|Power-Level-Meter|Shower-Cap)$/
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
