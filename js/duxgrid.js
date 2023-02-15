"use strict";

let gridSize = 6;
let screenSize = 1250;
let itemSize = 120;
let walletLoaded = [];

let grid = new Muuri("#duckieGrid", {
  dragEnabled: true,
});

let findBestWidth = function (size) {
  return Math.floor(size / 24) * 24;
};

let initialize = function () {
  screenSize = screen.width;
  itemSize = Math.round((screenSize - 50) / 10);

  $("#duckieGrid").width(gridSize * itemSize);
  $("#duckieGrid").css("min-height", itemSize + "px");
  grid.layout();

  $("#gridsize").on("input", function () {
    gridSize = this.value;
    $("#rangevalue").text(gridSize);
    $("#duckieGrid").width(gridSize * itemSize);
    grid.layout();
  });
};

initialize();

let addDuckie = function (duckieID) {
  let item = document.createElement("div");

  item.classList.add("item");
  item.style.width = itemSize + "px";
  item.style.height = itemSize + "px";

  let itemContent = document.createElement("div");
  itemContent.classList.add("item-content");
  itemContent.style.backgroundSize = "contain";

  $(itemContent).css(
    "background-image",
    "url('data/dux/" + duckieID + ".png')"
  );

  let itemRemove = document.createElement("div");
  itemRemove.classList.add("item-remove");
  itemRemove.innerHTML = `<i class="material-icons">&#xE5CD;</i>`;
  itemContent.append(itemRemove);

  let itemID = document.createElement("div");
  itemID.classList.add("item-id");
  itemID.innerHTML = duckieID;
  itemContent.append(itemID);

  item.append(itemContent);

  return grid.add([item]);
};

$(document).on("click", ".item-remove", function () {
  let itemToRemove = grid.getItem(this.parentNode.parentNode);
  return grid.remove([itemToRemove], { removeElements: true });
});

$(".btn-add").click(function () {
  let duckieID = Number($("#duckieID").val());
  if (!(duckieID > 0 && duckieID <= 512)) duckieID = 1;
  addDuckie(duckieID);
});

$("#duckieID").keypress(function (e) {
  let key_code = e.which || e.keyCode;
  if (key_code == 13) {
    let duckieID = Number($(this).val());
    if (!(duckieID > 0 && duckieID <= 512)) duckieID = 1;
    addDuckie(duckieID);
  }
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
    if ($(this).hasClass("grayscale")) context.filter = "grayscale(1)";
    else context.filter = "grayscale(0)";
    context.drawImage(duckieSVGImage, itemXth * 240, itemYth * 240, 240, 240);
  });
  let a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "DuxGrid.png";
  a.click();
});
