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
        /^(Pilot-Sunglasses|Reading-Glasses|Black-Eye|Third-Eye|Diving-Mask|Power-Level-Meter)$/
      )
    )
      $(".duckie-eyes").css(
        "background-image",
        "url('layers/eyes/" + eyesTraitValue + "-" + duckieType + ".png')"
      );
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
  }

  if (traitType === "type") typeChange();
});
