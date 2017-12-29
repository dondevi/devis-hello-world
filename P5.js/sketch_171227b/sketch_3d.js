/**
 * @author dondevi
 * @create 2017-12-28
 */

let img;

function preload () {
  img = loadImage("./img.jpg");
}

function setup () {
  createCanvas(800, 600, WEBGL).parent("sketch");
  fill(random(255), random(255), random(255));
  stroke(random(255), random(255), random(255));
}

function draw () {
  background(64, 64, 128);

  let dirX = (mouseX / width - 0.5) * 2;
  let dirY = (mouseY / height - 0.5) * 2;
  pointLight(128, 0, 0, dirX, -dirY, 0.25);

  if (mouseIsPressed) {
    camera(dirX, -dirY, 0, width / 2, height / 2, 0, 0, 0, 0);
  }

  translate(-300, -200, 0);
  plane(50);

  translate(150, 0, 0);
  sphere(30)

  translate(150, 0, 0);
  rotate(45, [1, 1, 1]);
  texture(img);
  box(100);

  translate(-300, 0, 0);
  rotate(-45, [1, 1, 1]);
  ellipsoid(50, 30);

  translate(150, 0, 0);
  cone(50);

  translate(0, 150, 0);
  cylinder(80);

  translate(150, 0, 0);
  torus();
}

function mouseClicked () {
}
