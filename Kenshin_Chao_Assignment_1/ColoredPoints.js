// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program


//https://kenshinchao.github.io/CSE160/Kenshin_Chao_Assignment_1/ColoredPoints.html

var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;

  void main() {
   gl_Position = a_Position;
    //gl_PointSize = 20.0;
    gl_PointSize = u_Size;
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

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }
}

function resetPreviewShape() {
  if (g_selectedType === POINT) {
    g_previewShape = new Point();
  } else if (g_selectedType === TRIANGLE) {
    g_previewShape = new Triangle();
    if (g_flippedX == true){
      g_previewShape.flippedH = true;
    }
    else {
      g_previewShape.flippedH = false;
    }
    if (g_flippedY == true){
      g_previewShape.flippedV = true;
    }
    else {
      g_previewShape.flippedV = false;
    }
  } else if (g_selectedType === CIRCLE) {
    g_previewShape = new Circle();
  }

  // Apply the current color and size to the preview shape
  if (g_previewShape) {
    g_previewShape.color = g_selectedColor.slice();
    g_previewShape.size = g_selectedSize;
    g_previewShape.position = [0, 0]; // Default to center of canvas initially
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let g_selectedColor =   [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_flippedX = false;
let g_flippedY = false;
function addActionsForHtmlUI(){
  document.getElementById('green').onclick = function() {
    g_selectedColor = [0.0,1.0,0.0,1.0]; 
    resetPreviewShape();};
  document.getElementById('red').onclick = function() {
    g_selectedColor = [1.0,0.0,0.0,1.0]; 
    resetPreviewShape();};
    document.getElementById('clearButton').onclick = function() {
      g_shapesList = []; renderALLShapes();
    };
  document.getElementById('pointButton').onclick = function() {g_selectedType = POINT;
    resetPreviewShape();
  }
  document.getElementById('triangleButton').onclick = function() {g_selectedType = TRIANGLE;
    resetPreviewShape();
  }
  document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE;
    resetPreviewShape();
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
  //size slider
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; 
    resetPreviewShape();
  });
  

}

  

let g_previewShape = null;
function main() {
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();


  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //canvas.onmousemove = click;
  canvas.onmousemove = function(ev) {
     [x, y] = convertCoordinatesEventToGL(ev);

  if (!g_previewShape) {
    if (g_selectedType == POINT) {
      g_previewShape = new Point();
    } else if (g_selectedType == TRIANGLE) {
      g_previewShape = new Triangle();
    } else if (g_selectedType == CIRCLE) {
      g_previewShape = new Circle();
    }

    g_previewShape.color = g_selectedColor.slice();
    g_previewShape.size = g_selectedSize;
  }
  renderALLShapes();
  // Update the position of the preview shape
  g_previewShape.position = [x, y];
    if (ev.buttons == 1){ //left click
      click(ev);
    }
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];
// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];


function click(ev) {
  [x,y] = convertCoordinatesEventToGL(ev);
   console.log()
  let point;
  if (g_selectedType == POINT){
    point = new Point();

  }else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
    if (g_flippedX) {
      point.flippedH = g_flippedX; // Flip the triangle 
    }
    if (g_flippedY) {
      point.flippedV = g_flippedY; // Flip the triangle 
    }
  
  
  }else {
    point = new Circle();
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);
  
  // Store the coordinates to g_points array
  // g_points.push([x, y]);
  
  // g_colors.push(g_selectedColor.slice());
  // g_sizes.push(g_selectedSize);
  
  // Store the coordinates to g_points array
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }
  renderALLShapes();
}
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

  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //var len = g_points.length
  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    
    g_shapesList[i].render();

  }
  if (g_previewShape) {
    
    g_previewShape.render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }

  htmlElm.innerHTML = text;
}
