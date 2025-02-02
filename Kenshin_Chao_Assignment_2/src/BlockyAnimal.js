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

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let g_selectedColor =   [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_flippedX = false;
let g_flippedY = false;
let g_globalAngle = 0;
function addActionsForHtmlUI(){
  document.getElementById('green').onclick = function() {
    g_selectedColor = [0.0,1.0,0.0,1.0]; 
    // resetPreviewShape();
    };
  document.getElementById('red').onclick = function() {
    g_selectedColor = [1.0,0.0,0.0,1.0]; 
    // resetPreviewShape();
    };
    document.getElementById('clearButton').onclick = function() {
       renderALLShapes();
    };
  document.getElementById('pointButton').onclick = function() {g_selectedType = POINT;
    // resetPreviewShape();
  }
  document.getElementById('triangleButton').onclick = function() {g_selectedType = TRIANGLE;
    // resetPreviewShape();
  }
  document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE;
    // resetPreviewShape();
  }


  document.getElementById('flipHorizontalButton').onclick = function() {
    g_flippedX = !g_flippedX;
    resetPreviewShape();

  }
  document.getElementById('flipVerticalButton').onclick = function() {
    g_flippedY = !g_flippedY;
    resetPreviewShape();

  }
  
  //slider events
  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100;
    resetPreviewShape();
   });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; 
    resetPreviewShape();
  });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; 
    resetPreviewShape();
  });

  // document.getElementById('angleSlide').addEventListener('mouseup', function() {
  //   g_globalAngle = this.value; 
  //   renderALLShapes();
  // });
  document.getElementById('angleSlide').addEventListener('mousemove', function() {
    g_globalAngle = this.value; 
    renderALLShapes();
  });


  

}

  

// let g_previewShape = null;
function main() {
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
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
  renderALLShapes();


}

function click(ev) {
  [x,y] = convertCoordinatesEventToGL(ev);
  renderALLShapes();
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
  function renderALLShapes(){
    var startTime = performance.now();

    var globalRotMat= new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);  

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //var len = g_points.length
  

   
    var body = new Cube();
    body.color = [1, 0.6, 1, 1];
    body.matrix.translate(-.25, -.5, 0);
    body.matrix.scale(1, 1, 1);
    body.render();

    var leftArm = new Cube();
    leftArm.color = [1,1,0,1];
    leftArm.matrix.setTranslate(.7, 0, 0);
    leftArm.matrix.rotate(45, 0, 0, 1);
    // leftArm.matrix.rotate(45, 0, 0, 1);
    leftArm.matrix.scale(0.25, .7, .5);
    leftArm.render();
    
    var hand = new Cube();
    hand.color = [1,0,1,1];
    hand.matrix.translate(.6, -.2,-.3, 0);
    hand.matrix.rotate(-30, 1, 0, 0);
    hand.matrix.scale(0.3, .1, .5);
    hand.render();






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
