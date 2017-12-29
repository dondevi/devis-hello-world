/**
 * Processing Hello World
 *
 * @author dondevi
 * @create 2017-12-27
 */

var socket;
var img;
var lineColor;
// var matrix;



/**
 * -----------------------------------------------------------------------------
 *  Structure Function
 * -----------------------------------------------------------------------------
 */

function preload () {
  // matrix = loadJSON("./data.json");
  img = loadImage("./img.jpg");
}

function setup () {
  socket = io.connect("http://192.168.0.81:3000");
  socket.on("mouse", data => {
    ellipse(data.x, data.y, 30, 30);
  });

  var canvas = createCanvas(800, 600);
  canvas.parent("sketch");
  canvas.mouseClicked(event => {
    socket.emit("mouse", { x: mouseX, y: mouseY });
  });

  _init();
}

function draw () {
  if (mouseIsPressed) {
    point(random(800), random(600));
  }
}

function mousePressed () {
}

function mouseDragged () {
  _main();
}

function mouseReleased () {
  if (RIGHT === mouseButton) {
    _reset();
  }
}

function mouseClicked () {
}

function doubleClicked () {
}

function mouseWheel (event) {
}



/**
 * -----------------------------------------------------------------------------
 *  Biz Function
 * -----------------------------------------------------------------------------
 */

function _main () {
  let alpha = random(1);

  stroke(lineColor, alpha);
  line(400, 300, mouseX, mouseY);

  noStroke();
  fill(random(255), random(255), random(255), alpha);
  ellipse(mouseX, mouseY, 20, 20);
}

function _init () {
  document.body.oncontextmenu = event => false;
  var divDom = createDiv(`<a href="http://192.168.0.81:8971" target="_blank">Hello World!</a>`);
  var imgDom = createImg("./img.jpg");
  imgDom.size(200, 200);
  imgDom.position(300, 200);
  imgDom.mouseClicked(_reset);
  _reset();
}

function _reset () {
  clear();

  colorMode(RGB, 255, 255, 255, 1);
  var bgColor = color(64, 64, 128);
  var bgRed   = red(bgColor);
  var bgGreen = green(bgColor);
  var bgBlue  = blue(bgColor);
  var bgAlpha = alpha(bgColor);
  console.log(bgColor.toString());
  console.log(`R: ${bgRed}, G: ${bgGreen}, B: ${bgBlue}, A: ${bgAlpha}`);

  background(bgColor);

  colorMode(HSB, 255, 255, 255, 1);
  var xAxisColor = color(64, 0, 255, 0.6);
  var xAxisHue   = hue(xAxisColor);
  var xAxisSta   = saturation(xAxisColor);
  var xAxisBri   = brightness(xAxisColor);
  console.log(xAxisColor.toString());
  console.log(`H: ${xAxisHue}, S: ${xAxisSta}, B: ${xAxisBri}`);

  stroke(xAxisColor);
  line(0, 300, 800, 300);

  colorMode(HSL, 255, 255, 255, 1);
  var yAxisColor = color(64, 0, 255, 0.6);
  var yAxisLig   = lightness(yAxisColor);
  console.log(yAxisColor.toString());
  console.log(`L: ${yAxisLig}`);

  stroke(yAxisColor);
  line(400, 0, 400, 600);

  colorMode(RGB, 255, 255, 255, 1);
  lineColor = lerpColor(bgColor, xAxisColor, 0.5);

  noFill();
  rect(300, 200, 200, 200);

  image(img, 0, 0, 128, 128);
}
