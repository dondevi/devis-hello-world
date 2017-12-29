var nodes = [];
var maxDistance = 65;
var dx = 30;
var dy = 30;
var maxNeighbors = 10;

var drawMode = true;

function setup() {
  var rate = document.getElementById("sketch");
  setInterval(e => rate.innerText = frameRate().toFixed(1), 300);
  createCanvas(800,600);
  background(220);
}

function draw() {

  background(220);

  if(drawMode)
  {
    if(mouseIsPressed){
      addNewNode(mouseX,mouseY,random(-dx,dx),random(-dx,dx));
    }
  } else
  {
    addNewNode(random(width),random(height),0,0);
  }

  for(var i=0; i<nodes.length; i++)
  {
    var currentNode = nodes[i];
    currentNode.setNumNeighbors( countNumNeighbors(currentNode,maxDistance) );
  }

  for(var i=0; i<nodes.length; i++)
  {
    var currentNode = nodes[i];
    if(currentNode.x > width || currentNode.x < 0 || currentNode.y > height || currentNode.y < 0)
    {
      nodes.splice(i, 1);
    }
  }

  for(var i = 0; i < nodes.length; i++){
    var currentNode = nodes[i];
    for(var j=0; j<currentNode.neighbors.length; j++)
    {
      var neighborNode = currentNode.neighbors[j];
      var lineColor = currentNode.calculateLineColor(neighborNode,maxDistance);
      stroke(lineColor, lineColor, lineColor);
      line(currentNode.x,currentNode.y,neighborNode.x,neighborNode.y);
    }
    currentNode.display();
  }



}

function addNewNode(xPos, yPos, dx, dy) {
  //println("add new node");
  //generates a random location within a 50x50px box around the mouse
  //var xPos = mouseX + random(-50,50);
  //var yPos = mouseY + random(-50,50);
  //adds a node at this location
  var node = new MovingNode(xPos+dx,yPos+dy);

  node.setNumNeighbors( countNumNeighbors(node,maxDistance) );

  //println("newly added node has " + node.numNeighbors + " neighbors");
  //println("and neighbors.size() = " + node.neighbors.size());


  if(node.numNeighbors < maxNeighbors){
    nodes.push(node);
    /*for(var i=0; i<nodes.size(); i++)
    {
      MovingNode currentNode = nodes[i];
      currentNode.setNumNeighbors( countNumNeighbors(currentNode,maxDistance) );
    }*/
  }

}

function countNumNeighbors(nodeA, maxNeighborDistance)
{
  var numNeighbors = 0;
  nodeA.clearNeighbors();

  for(var i = 0; i < nodes.length; i++)
  {
    var nodeB = nodes[i];
    var distance = sqrt((nodeA.x-nodeB.x)*(nodeA.x-nodeB.x) + (nodeA.y-nodeB.y)*(nodeA.y-nodeB.y));
    if(distance < maxNeighborDistance)
    {
      numNeighbors++;
      nodeA.addNeighbor(nodeB);
    }
  }
  return numNeighbors;
}

function keyPressed() {
  drawMode = !drawMode;
  nodes = [];
}
function MovingNode(xPos, yPos)
{
  var x;
  var y;
  var numNeighbors;
  var neighbors;
  var lineColor;
  var nodeWidth = 3;
  var nodeHeight = 3;
  var fillColor = 50;
  var lineColorRange = 180;

  var xVel=0;
  var yVel=0;
  var xAccel=0;
  var yAccel=0;

  var accelValue = 0.5;

  // this.MovingNode = function ()
  // {
    this.x = xPos;
    this.y = yPos;
    this.numNeighbors = 0;
    this.neighbors = [];
  // }

  this.display = function () {
    this.move();

    noStroke();
    fill(fillColor);
    ellipse(this.x,this.y,nodeWidth,nodeHeight);
  }

  this.move = function () {
    xAccel = random(-accelValue,accelValue);
    yAccel = random(-accelValue,accelValue);

    xVel += xAccel;
    yVel += yAccel;

    this.x += xVel;
    this.y += yVel;
  }

  this.addNeighbor = function (node) {
    this.neighbors.push(node);
  }

  this.setNumNeighbors = function (num) {
    this.numNeighbors = num;
  }

  this.clearNeighbors = function () {
    this.neighbors = [];
  }

  this.calculateLineColor = function (neighborNode, maxDistance)
  {
    var distance = sqrt((this.x-neighborNode.x)*(this.x-neighborNode.x) + (this.y-neighborNode.y)*(this.y-neighborNode.y));
    lineColor = (distance/maxDistance)*lineColorRange;
    return lineColor;
  }

}

function Node(xPos, yPos)
{
  var x;
  var y;
  var numNeighbors;
  var neighbors;
  var lineColor;
  var nodeWidth = 3;
  var nodeHeight = 3;
  var fillColor = 50;
  var lineColorRange = 160;

  // this.Node = function ()
  // {
    this.x = xPos;
    this.y = yPos;
    this.numNeighbors = 0;
    this.neighbors = [];
  // }

  this.display = function () {
    noStroke();
    fill(fillColor);
    ellipse(this.x,this.y,nodeWidth,nodeHeight);
  }

  this.addNeighbor = function (node) {
    this.neighbors.push(node);
  }

  this.setNumNeighbors = function (num) {
    this.numNeighbors = num;
  }

  this.clearNeighbors = function () {
    this.neighbors = [];
  }

  this.calculateLineColor = function (neighborNode, maxDistance)
  {
    var distance = sqrt((this.x-neighborNode.x)*(this.x-neighborNode.x) + (this.y-neighborNode.y)*(this.y-neighborNode.y));
    lineColor = (distance/maxDistance)*lineColorRange;
    return lineColor;
  }

}
