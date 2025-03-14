// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program


//https://kenshinchao.github.io/CSE160/Kenshin_Chao_Assignment_1/src/ColoredPoints.html

var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix; 

  void main() {
   gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor; 
  }`
//Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
function setupWebGL(){
 // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

 // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
 gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
 
  if (!gl) {
   console.log('Failed to get the rendering context for WebGL');
   return;
 }

 gl.enable(gl.DEPTH_TEST);

}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }
  
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }

  
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
      console.log('Failed to get the storage location of u_GlobalRotateMatrix');
      return;
    }
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// function resetPreviewShape() {
//   if (g_selectedType === POINT) {
//     g_previewShape = new Point();
//   } else if (g_selectedType === TRIANGLE) {
//     g_previewShape = new Triangle();
//     if (g_flippedX == true){
//       g_previewShape.flippedH = true;
//     }
//     else {
//       g_previewShape.flippedH = false;
//     }
//     if (g_flippedY == true){
//       g_previewShape.flippedV = true;
//     }
//     else {
//       g_previewShape.flippedV = false;
//     }
//   } else if (g_selectedType === CIRCLE) {
//     g_previewShape = new Circle();
//   }

//   // Apply the current color and size to the preview shape
//   if (g_previewShape) {
//     g_previewShape.color = g_selectedColor.slice();
//     g_previewShape.size = g_selectedSize;
//     g_previewShape.position = [0, 0]; // Default to center of canvas initially
//   }
// }


//there are 2 arms, 2 hands, and 2 eyes, and 2 legs. 8 body parts.
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let g_selectedColor =   [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_flippedX = false;
let g_flippedY = false;
let g_globalAngle = 0;
let g_armAngle = 0;
let g_handAngle = 0;
let g_Aanimation = false;
let g_legAngle = 0;
let mouthMove = false;
function addActionsForHtmlUI(){
  // document.getElementById('green').onclick = function() {
  //   g_selectedColor = [0.0,1.0,0.0,1.0]; 
  //   // resetPreviewShape();
  //   };
  // document.getElementById('red').onclick = function() {
  //   g_selectedColor = [1.0,0.0,0.0,1.0]; 
  //   // resetPreviewShape();
  //   };
  //   document.getElementById('clearButton').onclick = function() {
  //      renderALLShapes();
  //   };
  // document.getElementById('pointButton').onclick = function() {g_selectedType = POINT;
  //   // resetPreviewShape();
  // }
  // document.getElementById('triangleButton').onclick = function() {g_selectedType = TRIANGLE;
  //   // resetPreviewShape();
  // }
  // document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE;
  //   // resetPreviewShape();
  // }
  document.getElementById('animationOn').onclick = function() {g_Aanimation = true;
    // resetPreviewShape();
  }
  document.getElementById('animationOff').onclick = function() {g_Aanimation = false;
    // resetPreviewShape();
  }


  // document.getElementById('flipHorizontalButton').onclick = function() {
  //   g_flippedX = !g_flippedX;
  //   resetPreviewShape();

  // }
  // document.getElementById('flipVerticalButton').onclick = function() {
  //   g_flippedY = !g_flippedY;
  //   resetPreviewShape();

  // }
  
  // //slider events
  // document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100;
  //   resetPreviewShape();
  //  });
  // document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; 
  //   resetPreviewShape();
  // });
  // document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; 
  //   resetPreviewShape();
  // });

  // document.getElementById('angleSlide').addEventListener('mouseup', function() {
  //   g_globalAngle = this.value; 
  //   renderALLShapes();
  // });
  document.getElementById('angleSlide').addEventListener('mousemove', function() {
    g_globalAngle = this.value; 
    renderScene();
  });
  document.getElementById('armSlide').addEventListener('mousemove', function() {
    g_armAngle = this.value; 
    renderScene();
  });

  document.getElementById('handSlide').addEventListener('mousemove', function() {
    g_handAngle = this.value; 
    renderScene();
  });



  

}


// let g_previewShape = null;
function main() {
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();


  //canvas.onmousemove = click;
  canvas.onmousemove = function(ev) {
 
    if (ev.buttons == 1){ //left click
      click(ev);
    } 
    
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT); 
  //renderALLShapes();

  requestAnimationFrame(tick);

  renderScene();

}
let log = document.querySelector("#log");
document.addEventListener("click", click);

function click(ev){
  [x,y] = convertCoordinatesEventToGL(ev);
  if (y < .9 && ev.shiftKey == false){
  g_globalAngle = x*180;
  }
  log.textContent = ``;
  if (ev.shiftKey == true ){
    log.textContent = `:( ): `
    if (mouthMove){
      mouthMove = false;
    }
    else {
    mouthMove = true;
    }
  }
  
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;
  //console.log(g_seconds);

  updateAnimationAngles();

  renderScene();

  requestAnimationFrame(tick);

}

var g_mouthAngle = 0;
function updateAnimationAngles() {
  if (g_Aanimation){
    g_armAngle = (15*Math.sin(g_seconds));
    g_legAngle = (5*Math.sin(g_seconds));
  }
  if (mouthMove){
    g_mouthAngle = 45*Math.sin(g_seconds);
    
  }
}


 //var g_shapesList = [];
// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);


}
  function renderScene(){
    var startTime = performance.now();

    var globalRotMat= new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);  

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);
  //var len = g_points.length
  


  if (g_Aanimation){
  var K = 8;
for (var i = 1; i < K; i++){
  var c = new Cube();
  c.matrix.translate(-.9,Math.random()+i/K-1,.8);
  c.matrix.scale(.02,.05,.02)
  c.render();
}
var K = 8;
for (var i = 1; i < K; i++){
  var c = new Cube();
  c.matrix.translate(.9,Math.random()+i/K-.2,.5);
  c.matrix.scale(.02,.05,.02)
  c.render();
}
for (var i = 1; i < K; i++){
  var c = new Cube();
  c.matrix.translate(.2,Math.random()+i/K-.5,.4);
  c.matrix.scale(.02,.05,.02)
  c.render();
}
var K = 4;
for (var i = 1; i < K; i++){
  var c = new Cube();
  c.matrix.translate(-.2,Math.random()+i/K-1.4,-.2);
  c.matrix.scale(.02,.05,.02)
  c.render();
}
  }
   
    var body = new Cube();
    body.color = [1, 0.6, 1, 1];
    body.matrix.translate(-.25, -.5, 0);
    body.matrix.scale(.6, .6, .6);
    body.render();

    // var leftArm = new Cube();
    // leftArm.color = [1,1,0,1];
    // leftArm.matrix.setTranslate(.7, 0, 0);
    // leftArm.matrix.rotate(45, 0, 0, 1);
    // // leftArm.matrix.rotate(45, 0, 0, 1);
    // leftArm.matrix.scale(0.25, .7, .5);
    // leftArm.render();
    
    var leftarm = new Cube();
    leftarm.color = [1, 0.6, 1, 1];
    leftarm.matrix.setTranslate(-.15,-.3,.4);
    leftarm.matrix.rotate(180, 0, 90,1);
    leftarm.matrix.rotate(g_armAngle, 0, 0,1);
    // if (g_Aanimation){
    //     leftarm.matrix.rotate(25*Math.sin(g_seconds), 0, 0,1);
    // }
    // else {
    //   leftarm.matrix.rotate(g_armAngle, 0, 0, 1);
    // }
  
    var lArmCoord = new Matrix4(leftarm.matrix);
    leftarm.matrix.scale(0.3, .23, .3);
    leftarm.render();

    var lefthand = new Cube();
    lefthand.color = [1, 0.6, 1, 1];
    lefthand.matrix = lArmCoord;
    lefthand.matrix.translate(.3, 0,0);
    lefthand.matrix.rotate(10, 0, 0,1);
    lefthand.matrix.rotate(g_handAngle, 0, 0, 1);
    lefthand.matrix.scale(0.3, .23, .3);
    lefthand.render();


    var rightarm = new Cube();
    rightarm.color = [1, 0.6, 1, 1];
    rightarm.matrix.setTranslate(.2, -.3,.2);
    rightarm.matrix.rotate(-15, 0, 0,1);
    rightarm.matrix.rotate(g_armAngle, 0, 0,1);
  //   if (g_Aanimation){
  //     rightarm.matrix.rotate(15*Math.sin(g_seconds), 0, 0,1);
  // }
  // else {
  //   rightarm.matrix.rotate(g_armSlider, 0, 0,1);
  // }
   
    var rArmCoord = new Matrix4(rightarm.matrix);
    rightarm.matrix.scale(0.3, .23, .3);
    rightarm.render();
    
    
    var righthand = new Cube();
    righthand.color = [1, 0.6, 1, 1];
    righthand.matrix = rArmCoord;
    righthand.matrix.translate(.3, 0,0);
     righthand.matrix.rotate(10, 0, 0,1);
    righthand.matrix.rotate(g_handAngle, 0, 0,1);
     righthand.matrix.scale(0.3, .23, .3);
     righthand.render();


    var righteye = new Cube();
    righteye.color = [0,0,0,1];
    righteye.matrix.setTranslate(0.12, -.25,-.05);
    righteye.matrix.rotate(0, 0, 0,1);
  
    righteye.matrix.scale(0.12, .25, .3);
    righteye.render();
    

    var rightlight = new Cube();
    rightlight.color = [1,1,1,1];
    rightlight.matrix.setTranslate(0.115, -.1,-.06);
    rightlight.matrix.rotate(0, 0, 0,1);
  
    rightlight.matrix.scale(0.055, .045, .3);
    rightlight.render();



    var lefteye = new Cube();
    lefteye.color = [0,0,0,1];
    lefteye.matrix.setTranslate(-0.15, -.25,-.05);
    lefteye.matrix.rotate(0, 0, 0,1);
  
    lefteye.matrix.scale(0.12, .25, .3);
    lefteye.render();

    var leftlight = new Cube();
    lefteye.color = [1,1,1,1];
    lefteye.matrix.setTranslate(-0.156, -.1,-.06);
    lefteye.matrix.rotate(0, 0, 0,1);
  
    lefteye.matrix.scale(0.055, .045, .3);
    lefteye.render();

    var lmouth = new Cube();
    lmouth.color = [0,0,0,1];
    lmouth.matrix.setTranslate(0.05, -.32,-.05);
    lmouth.matrix.rotate(180+g_mouthAngle, 0, 0,1);
  
    lmouth.matrix.scale(0.06, .02, .3);
    lmouth.render();

    var rmouth = new Cube();
    rmouth.color = [0,0,0,1];
    rmouth.matrix.setTranslate(0.05, -.34,-.05);
    rmouth.matrix.rotate(0-g_mouthAngle, 0, 0,1);
  
    rmouth.matrix.scale(0.06, .02, .3);
    rmouth.render();
    
    
    var lblush = new Cube();
    lblush.color = [1,0,0,1];
    lblush.matrix.setTranslate(0.2, -.32,-.05);
    lblush.matrix.rotate(0, 0, 0,1);
  
    lblush.matrix.scale(0.09, .05, .3);
    lblush.render();

    var rblush = new Cube();
    rblush.color = [1,0,0,1];
    rblush.matrix.setTranslate(-0.2, -.32,-.05);
    rblush.matrix.rotate(0, 0, 0,1);
  
    rblush.matrix.scale(0.09, .05, .3);
    rblush.render();
    

        
    var lLeg = new Cube();
    lLeg.color = [.9,.34,1,1];
    lLeg.matrix.setTranslate(-.2,-.45,.2);
    lLeg.matrix.rotate(270+g_legAngle, 0, 0,1);
    var lLegCoords = new Matrix4(lLeg.matrix);
    lLeg.matrix.scale(0.35, .2, .3);
    lLeg.render();

    var rLeg = new Cube();
    rLeg.color = [.9,.34,1,1];
    rLeg.matrix.setTranslate(.1, -.45,.2);
    rLeg.matrix.rotate(270-g_legAngle, 0, 0,1);
    var rLegCoords = new Matrix4(rLeg.matrix);
    rLeg.matrix.scale(0.35, .2, .3);
    rLeg.render();

    var lFoot = new Cube();
    lFoot.color = [1,0,1,1];
    lFoot.matrix = lLegCoords;
    lFoot.matrix.translate(0.35, .2,0);
    lFoot.matrix.rotate(270, 0, 0,1);
    lFoot.matrix.scale(0.3, .1, .3);
    lFoot.render();

    
    var rFoot = new Cube();
    rFoot.color = [1,0,1,1];
    rFoot.matrix = rLegCoords;
    rFoot.matrix.translate(.35, .3,0);
    rFoot.matrix.rotate(270, 0, 0,1);
    rFoot.matrix.scale(0.3, .1, .3);
    rFoot.render();







  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}



function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }

  htmlElm.innerHTML = text;
}
