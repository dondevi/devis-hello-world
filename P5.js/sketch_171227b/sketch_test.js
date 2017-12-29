
let particles     = []
let maxLength     = 100
let maxDistance   = 80

let baseSpeed     = 0.5
let particleSize  = 10

let bgColor       = "#f0f5e0"
let lineColor     = "#24521b"
let particleColor = "#24521b"


function setup () {
  let divDom = createDiv("").position(0)
  setInterval(e => divDom.html(frameRate().toFixed(1)), 300)
  createCanvas(windowWidth, windowHeight - 24)
  fill(particleColor)
  particles = Array(maxLength).fill(null).map(p => {
    let speedX = (random(2) - 1) * baseSpeed
    let speedY = (random(2) - 1) * baseSpeed
    return [random(width), random(height), speedX, speedY]
  })
}


function draw () {
  background(bgColor)

  for (let i = 0, p1; p1 = particles[i]; i += 1) {

    noStroke()
    let [ x1, y1, speedX, speedY ] = p1;
    x1 += speedX
    y1 += speedY
    if (x1 > width) { x1 -= width }
    if (y1 > height) { y1 -= height }
    if (x1 < 0) { x1 += width }
    if (y1 < 0) { y1 += height }
    ellipse(x1, y1, particleSize, particleSize)
    p1[0] = x1
    p1[1] = y1

    stroke(lineColor)
    for (let j = i + 1, p2; p2 = particles[j]; j += 1) {
      let [x2, y2] = p2;
      if (pow(x1 - x2, 2) + pow(y1 - y2, 2) < pow(maxDistance, 2)) {
        line(x1, y1, x2, y2)
      }
    }

  }
}
