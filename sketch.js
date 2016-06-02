var w; //hold the flying spaghetti monster(FSM)
var c; //hold the soup
var s; //hold the background ellipses

var angleAccFSM; //Angular acceleration for the FSM
var angleAccSOUP; //Angular acceleration for the Soup

var xoff = 0; //initialize position of variable to control step for noise()
var soupX = 0; //global variable for soup x position
var soupY = 0; //global variable for soup Y position
var newY; //the next y position that the Soup will travel to

var fsmx; //global variable for fsm x position
var fsmy; //global variable for fsm y position

var distance; //determine distance from FSM to background spheres

var sphereGap = 40; //density of background ellipses

function setup() {
  createCanvas(800,600); //declare canvas size
  w = new flyingSpaghettiMonster(); //create a flying spaghetti monster that chases soup with some noise() adding variability
  c = new Soup(); //create a can of soup that moves with noise() and random()
  s = new Spheres(); //create background spheres that change diameter based on distance from FSM
  fsmImg = loadImage("assets/FSM3d.gif"); // load FSM image
  soupImg = loadImage("assets/soup.png"); // load soup image
}

function draw() {
//  background(100,50,55);
  background(255); //set background color to white
  s.draw(); //draw the background ellipses
  c.update(); //update Soup position
  c.display(); //draw new Soup position
  w.update(); //update FSM position
  w.display(); //draw new FSM position
}

function Soup(){
   soupY = height/2; //declare starting height for soup
    newY = 75; //initialize the next y position

  this.update = function(){
    soupX=noise(xoff) * width; //soup x position is controlled by perlin noise()
    xoff += 0.005; //increase the perlin noise() position
    
    if (soupY < newY){
      soupY+=1; //if current soup Y position is less than the new Y position move down 1
    }
    else if (soupY > newY){
      soupY-=1;//if current soup Y position is less than the new Y position move up 1
    }
    else{
      newY = ceil(random(0+soupImg.height/2,height-soupImg.width/2)); //use of ceil() ensure's random is an int and that value is constrained to canvas height
    }

  }
  
  this.display = function(){
    fill(255);
    image(soupImg, soupX , soupY, soupImg.width/4, soupImg.height/4); // draw the soup at 25% scale
  }
}

function flyingSpaghettiMonster(){
  this.posFSM = createVector(width/2, height/2); //initialize FSM position to middle of canvas
  this.velFSM = createVector(0,0); //create velocity vector

  this.update = function(){
    var soupPosition = createVector(soupX, soupY); //create a vector representing the soup position
    
    this.accFSM = p5.Vector.sub(soupPosition, this.posFSM); //calculate the FSM acceleration using FSM position and soup position
    this.accFSM.normalize(); //normalize the acceleration
    this.accFSM.mult(.05); //scale the acceleration
    
    //the follwoing if else statements ensure the FSM doesn't get too far outside of canvas
    if(this.posFSM.x < 10){
      this.accFSM.x = this.accFSM.x + .5;
    }
    else if(this.posFSM.x > width-10){
      this.accFSM.x = this.accFSM.x - .5;
    }
    else if(this.posFSM.y < 10 ){
      this.accFSM.y = this.accFSM.y + .5;
    }
    else if(this.posFSM.y > height-10){
      this.accFSM.y = this.accFSM.y - .5;
    }
    
    this.velFSM.add(this.accFSM); //calculate the velocity of FSM
    this.velFSM.mult(.98);//scale the velocity
    this.posFSM.add(this.velFSM);//calculate FSM new position
    fsmx = this.posFSM.x; //update global FSM x position
    fsmy = this.posFSM.y; //update globabl FSM y position
    }
  this.display = function(){
    fill(255);
    image(fsmImg,this.posFSM.x - fsmImg.width/8, this.posFSM.y - fsmImg.height/8, fsmImg.width/4, fsmImg.height/4); //update FSM position at 25% scale
  }
}

function Spheres() {
  this.draw = function() {
  var wideCount = width / sphereGap+1; //ellipses cover width
  var highCount = height / sphereGap+1; //ellipses cover height
  //the following lines create ellipses across the whole canvas
  for (var y = 0; y < highCount; y++) {
    for (var x = 0; x < wideCount; x++) {
      distance = int(dist(x*sphereGap, y*sphereGap, fsmx, fsmy)/2); //ellipse width is proportional to distance from ellipse to FSM
    
      //remove all ellipses less than 50 pixels from the flying spaghetti 
      if(distance<50){ 
        distance = 0; 
      }
      
      //display the outline for the ellipses if the FSM is close enough to soup
      if(abs(fsmx-soupX-soupImg.width/8)<soupImg.width/8 && abs(fsmy-soupY-soupImg.height/8)<soupImg.height/8){
        stroke(255);
      } 
      
      //remove ellipses outlines if FSM is not close to soup
      else{
        noStroke(); //remove outline around ellipses
      }
      fill(255,204,0); //set ellipse color
      ellipse(x*sphereGap, y*sphereGap, distance, distance); //draw each ellipse with a diamter proportional to the distance from the FSM
      }
    }
  }
}