/**
 * Processing Hello World
 *
 * @author dondevi
 * @create 2017-12-29
 */

const matrixSize = 8;
const matrixNum = 4;

const pixelDrawSize = 20;
const matrixDrawSize = matrixSize * pixelDrawSize;

let matrixData = [];
let matrixs = [];

let data;
let data2;

function preload () {
  data = loadJSON("./data.json");
  data2 = loadJSON("./data2.json");
}

function setup () {
  let canvasWidth  = matrixDrawSize * 4;
  let canvasHeight = (matrixNum + 0.125) * matrixDrawSize;
  createCanvas(canvasWidth, canvasHeight).parent("sketch");
  colorMode(RGB, 1, 1, 1, 1);

  _main(data);
  translate(matrixDrawSize, -matrixDrawSize);
  _main(data2);
}


function _main (data) {
  matrixData = Object.values(data);

  matrixData.forEach((v, i) => {
    _drawPixel(v, i);
    let mi = Math.floor(Math.floor(i / matrixSize) / matrixSize);
    if (matrixNum > mi) {
      matrixs[mi] = matrixs[mi] || [];
      matrixs[mi].push(v);
    }
  });

  let matrixSum = matrixs.reduce(_sumMatrix, []);
  translate(matrixDrawSize, 0);
  matrixSum.forEach(_drawPixel);

  let matrixRGBA = matrixs.reduce((acc, cur, mi) => {
    cur.forEach((v, i) => {
      acc[i] = acc[i] || [];
      acc[i][mi] = 3 === mi ? 1 - v : v;
    });
    return acc;
  }, []);
  translate(0, matrixDrawSize);
  matrixRGBA.forEach(_drawPixel);
}


function _drawPixel (v, i) {
  let row = Math.floor(i / matrixSize);
  let col = Math.floor(i % matrixSize);
  let x = col * pixelDrawSize;
  let y = row * pixelDrawSize;
  if ("number" === typeof v) {
    fill(v);
  }
  if (Array.isArray(v)) {
    fill(...v);
  }
  rect(x, y, pixelDrawSize, pixelDrawSize);
}

function _sumMatrix (m1, m2) {
  var length = Math.max(m1.length, m2.length);
  _padMatrix(m1, length);
  _padMatrix(m2, length);
  return m1.map((v, i) => v + m2[i]);
}

function _padMatrix (matrix, length) {
  let originLength = matrix.length;
  if (originLength !== length) {
    matrix.length = length;
    matrix.fill(0, originLength, length);
  }
  return matrix;
}
