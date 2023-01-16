"use strict";

let grid = new Muuri("#duckieGrid", {
  dragEnabled: true,
});

let findBestWidth = function (size) {
  return Math.floor(size / 24) * 24;
};

let gridSize = 6;
let screenSize = screen.width;
// let itemSize = findBestWidth((screenSize - 22) / 10);
let itemSize = Math.round((screenSize - 50) / 10);
$("#duckieGrid").width(gridSize * itemSize);
$("#duckieGrid").css("min-height", itemSize + "px");
grid.layout();

$("#gridsize").on("input", function () {
  gridSize = this.value;
  $("#rangevalue").text(gridSize);
  $("#duckieGrid").width(gridSize * itemSize);
  grid.layout();
});

let encodeSvg = function (svgString) {
  return svgString
    .replace(
      "<svg",
      ~svgString.indexOf("xmlns")
        ? "<svg"
        : '<svg xmlns="http://www.w3.org/2000/svg"'
    )
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/{/g, "%7B")
    .replace(/}/g, "%7D")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/\s+/g, " ");
};

let loadDuckieFromWallet = function (wallet) {
  $(".btn-wallet-add").html("<img src='/images/loading.gif' />");
  $(".btn").addClass("disable");
  $.getJSON("data/duckies-owner.json", function (data) {
    let duckieIDs = data
      .filter(
        (duckie) =>
          (duckie.owner === wallet || duckie.ens === wallet) && duckie.migrated
      )
      .map((duckie) => duckie.id);

    $.each(duckieIDs, function (key, val) {
      addDuckie(val);
    });
  }).done(function () {
    $(".btn-wallet-add").html("Show");
    $(".btn").removeClass("disable");
  });
};

let addDuckie = function (duckieID) {
  let item = document.createElement("div");

  item.classList.add("item");
  item.style.width = itemSize + "px";
  item.style.height = itemSize + "px";

  let itemContent = document.createElement("div");
  itemContent.classList.add("item-content");

  $.getJSON("data/duckies/duckie" + duckieID + ".json", function (json) {
    let duckieSVG = encodeSvg(json.imageSVG.replaceAll(`\"`, `'`));

    $(itemContent).css(
      "background-image",
      `url("data:image/svg+xml;utf8,${duckieSVG}")`
    );
  });

  let itemRemove = document.createElement("div");
  itemRemove.classList.add("item-remove");
  itemRemove.innerHTML = `<i class="material-icons">&#xE5CD;</i>`;
  itemContent.append(itemRemove);

  item.append(itemContent);

  return grid.add([item]);
};

$(document).on("click", ".item-remove", function () {
  let itemToRemove = grid.getItem(this.parentNode.parentNode);
  return grid.remove([itemToRemove], { removeElements: true });
});

$(".btn-add").click(function () {
  let duckieID = Number($("#duckieID").val());
  if (!(duckieID > 0 && duckieID <= 5000)) duckieID = 1;
  addDuckie(duckieID);
});

$("#duckieID").keypress(function (e) {
  let key_code = e.which || e.keyCode;
  if (key_code == 13) {
    let duckieID = Number($(this).val());
    if (!(duckieID > 0 && duckieID <= 5000)) duckieID = 1;
    addDuckie(duckieID);
  }
});

$(".btn-wallet-add").click(function () {
  loadDuckieFromWallet($("#walletAdr").val());
});

$("#walletAdr").keypress(function (e) {
  let key_code = e.which || e.keyCode;
  if (key_code == 13) loadDuckieFromWallet($(this).val());
});

$("#downloadbutton").click(function () {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;

  let numOfDuckies = $(".item").length;
  let numOfRows = Math.ceil(numOfDuckies / gridSize);

  canvas.height = 240 * numOfRows;
  canvas.width = 240 * gridSize;

  context.fillStyle = "#908aa0";
  context.fillRect(0, 0, canvas.width, canvas.height);

  $(".item").each(function (index, element) {
    let duckieSVGImage = new Image();

    duckieSVGImage.src = $(element)
      .find(".item-content")
      .css("background-image")
      .slice(5, -2);

    let itemTransform = $(element).css("transform").split(",");
    let itemX = parseInt(itemTransform[4]);
    let itemY = parseInt(itemTransform[5]);

    let itemXth = itemX / itemSize;
    let itemYth = itemY / itemSize;

    context.drawImage(duckieSVGImage, itemXth * 240, itemYth * 240, 240, 240);
  });
  let a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "DuckieGrid.png";
  a.click();
});
