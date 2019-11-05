// API infos
var API_KEY = config.MYAPI_KEY;
var newyork = "5128638";
var NYweather;
// images
let happy;
let sad;
let sunset;
let drops = [];

function preload() {
  font = loadFont("./LLPIXEL3.ttf");
  happy = loadImage("./charmander.png");
  sad = loadImage("./charmander-sad.png");
  sunset = loadImage("./sunset.jpg");
  rain = loadImage("./night.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadJSON(
    "http://api.openweathermap.org/data/2.5/weather?id=" +
      newyork +
      "&units=metric&APPID=" +
      API_KEY,
    gotData
  );
  textFont(font);
  textSize(48);
  textAlign(CENTER, CENTER);
  // Rain drop
  for (var i = 0; i < 500; i++) {
    drops[i] = new Drop();
  }
}

function gotData(data) {
  NYweather = data;
}

function draw() {
  background("black");
  if (NYweather) {
    // var humidity = NYweather.main.humidity;
    var description = NYweather.weather[0].main.toUpperCase();
    var temp = Math.ceil(NYweather.main.temp);

    // ======== FOR TESTING HUMIDITY STATEMENTS ========
    var humidity = 60;
    // var humidity = 40;
    // var humidity = 50;
    fill(255);
    noStroke();
    text("(" + temp + " CELSIUS)", windowWidth / 3, windowHeight / 1.5);
    text(
      "IT'S " + humidity + "% " + "HUMIDITY WITH " + description + " OUTSIDE",
      windowWidth / 2,
      windowHeight / 4
    );

    // If humidity is LOW, enable stars
    if (humidity < 50) {
      text(tempReport);
      text(humidityReport);
      image(sunset, 0, 0, windowWidth, windowHeight);
      fill(35, 235, random(255));
      text("WHAT A NICE DAY, LET'S GO OUT!", windowWidth / 2, windowHeight / 3);
      image(happy, windowWidth / 2, windowHeight / 2, 200, 200);

      push();
      translate(random(width), random(height));
      rotate(frameCount / -100.0);
      star(0, 0, random(15), 3, 5);
      pop();

      // If humidity is HIGH, enable rain
    } else if (humidity > 50) {
      image(rain, 0, 0, windowWidth, windowHeight);
      fill(255, random(200), 255);
      noStroke();
      text("THIS IS TOO HUMID FOR ME! :(", windowWidth / 2, windowHeight / 3);
      text(
        "IT'S " + humidity + "% " + "HUMIDITY WITH " + description + " OUTSIDE",
        windowWidth / 2,
        windowHeight / 4
      );
      image(sad, windowWidth / 2, windowHeight / 2, 200, 200);
      for (var i = 0; i < drops.length; i++) {
        drops[i].fall();
        drops[i].show();
      }
      // If humidity is 50%
    } else if ((humidity = 50)) {
      fill(random(93), 30, 255);
      text(
        "PERHAPS I COULD SURVIVE THIS...",
        windowWidth / 2,
        windowHeight / 3
      );
      image(happy, windowWidth / 2, windowHeight / 2, 200, 200);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Based on Purple Rain tutorial by Daniel Shiffman
// https://github.com/CodingTrain/website/tree/master/CodingChallenges/CC_004_PurpleRain/P5
function Drop() {
  this.x = random(width);
  this.y = random(-500, -50);
  this.z = random(0, 20);
  this.len = map(this.z, 0, 20, 10, 20);
  this.yspeed = map(this.z, 0, 20, 1, 20);

  this.fall = function() {
    this.y = this.y + this.yspeed;
    var grav = map(this.z, 0, 20, 0, 0.2);
    this.yspeed = this.yspeed + grav;

    if (this.y > height) {
      this.y = random(-200, -100);
      this.yspeed = map(this.z, 0, 20, 4, 10);
    }
  };

  this.show = function() {
    var thick = map(this.z, 0, 20, 1, 3);
    strokeWeight(thick);
    stroke(random(238), 153, 226);
    line(this.x, this.y, this.x, this.y + this.len);
  };
}

// Stars
// modified from p5.js website's Star example
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
