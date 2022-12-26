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
  // $(".download").addClass("hidden");
};

let showDuckie = function () {
  let duckieID = Number($(".number-input").val());
  removeDuckie();

  $.getJSON("duckies/duckie" + duckieID + ".json", function (json) {
    $(".btn").removeClass("disable");

    let i = 1;
    let duckieType = json.traits.find((o) => o.trait_type === "Type").value;

    $.each(json.traits, function (key, trait) {
      setTimeout(() => {
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
      }, i * 400);
      i++;
    });

    // setTimeout(() => {
    //   $(".download").removeClass("hidden");
    // }, i * 250);
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
  $(".duckie-head-extra").css(
    "background-image",
    "url('layers/head/xmas-hat-1.png')"
  );
});

$(".xmas2").click(function () {
  $(".duckie-head-extra").css(
    "background-image",
    "url('layers/head/xmas-hat-2.png')"
  );
});

$(".mcdonalds").click(function () {
  $(".duckie-head-extra").css(
    "background-image",
    "url('layers/head/mcdonalds-hat.png')"
  );
});

$(".btn-default-hat").click(function () {
  $(".duckie-head").toggleClass("hidden");
});

// function setpixelated(context) {
//   context["imageSmoothingEnabled"] = false;
//   context["mozImageSmoothingEnabled"] = false;
//   context["oImageSmoothingEnabled"] = false;
//   context["webkitImageSmoothingEnabled"] = false;
//   context["msImageSmoothingEnabled"] = false;
// }

// $(".download").click(function () {
//   html2canvas(document.getElementById("duckie-image"), {
//     onrendered: function (canvas) {
//       setpixelated(canvas.getContext("2d"));
//     },
//   }).then(function (canvas) {
//     var a = document.createElement("a");
//     a.href = canvas.toDataURL("image/png");
//     a.download = "duckie.png";
//     a.click();
//   });
// });
