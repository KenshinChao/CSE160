// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program


//https://kenshinchao.github.io/CSE160/Kenshin_Chao_Assignment_4/src/World.html

var VSHADER_SOURCE =`
  precision mediump float;  
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotateMatrix; 
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
   gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
   v_UV = a_UV;
   
   v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal,1)));
   //v_Normal = a_Normal;
   v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform vec3 u_LightColor; 
  varying vec4 v_VertPos;
  uniform int u_whichTexture;
  uniform bool u_lightOn;  
  uniform vec3 u_spotlightDir;  
  uniform float u_spotlightCutoff; 
  uniform float u_texColorWeight; // New uniform to control blending
  void main() {

    if (u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); 
  } else if (u_whichTexture == -2){
      gl_FragColor = u_FragColor;
    }else if(u_whichTexture == -1){
      gl_FragColor = vec4(v_UV,1.0,1.0);
  } else if (u_whichTexture == 0){
    
      gl_FragColor = texture2D(u_Sampler0, v_UV);
  } else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
  }else if(u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV);
  }else if(u_whichTexture == 3){
      gl_FragColor = texture2D(u_Sampler3, v_UV);
  }
      else{
    gl_FragColor = vec4(1,.2,.2,1);
  }
  // vec3 lightVector = u_lightPos -  vec3(v_VertPos);
  // float r = length(lightVector);
  // // if (r < 1.0){
  // // gl_FragColor = vec4(1,0,0,1);

  // } else if (r < 2.0){
  // gl_FragColor = vec4(0,1,0,1); 
  // }
  // gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);
  // vec3 L = normalize(lightVector);
  // vec3 N = normalize(v_Normal);
  // float nDotL = max(dot(N,L), 0.0);

  // vec3 R = reflect(-L,N);

  // vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

  // float specular = pow(max(dot(E,R), 0.0), 64.0) * 0.8;
  // vec3 diffuse = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL * 0.7;
  // vec3 ambient = vec3(gl_FragColor) * 0.3;
  // if (u_lightOn == true){
  //   gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
  //   }
  // else {
  //     gl_FragColor = vec4(diffuse+ambient,1.0);
   
  //}
  vec3 lightVector = normalize(u_lightPos - vec3(v_VertPos)); // Direction to fragment
  vec3 normal = normalize(v_Normal);

  // Compute spotlight effect
  float spotEffect = dot(lightVector, normalize(-u_spotlightDir));
  if (u_lightOn == true){
    if (spotEffect > u_spotlightCutoff) {  // Inside the spotlight cone
        float intensity = pow(spotEffect, 10.0); // Smooth falloff
        vec3 diffuse = u_LightColor * vec3(gl_FragColor) * max(dot(normal, lightVector), 0.0) * intensity * 0.7;
        vec3 ambient = u_LightColor * vec3(gl_FragColor) * 0.2;

        gl_FragColor = vec4(diffuse + ambient, 1.0);
    } else { 
        gl_FragColor = vec4(vec3(gl_FragColor) * 0.2, 1.0); 
    }
  }
  else {
  gl_FragColor = vec4(vec3(gl_FragColor) * 0.2, 1.0); 
  }
}`

//Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_whichTexture; 
let g_normalON = false;
let u_lightPos;
let u_lightOn;
let u_cameraPos;
let u_NormalMatrix;
let u_spotlightCutoff;
let u_spotlightDir;
let u_spotlightPos;
let u_LightColor;
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
  
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (!a_UV) {
      console.log('Failed to get the storage location of a_UV');
      return;
    }


    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0){
      console.log('Failed to get the storage location of a_Normal');
      return;
    }

    u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (u_NormalMatrix < 0){
      console.log('Failed to get the storage location of u_NormalMatrix');
      return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
      console.log('Failed to get the storage location of u_whichTexture');
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

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
      console.log('Failed to get the storage location of u_ViewMatrix');
      return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
      console.log('Failed to get the storage location of u_ProjectionMatrix');
      return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return;
    }
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
      return;
    }
    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
      console.log('Failed to get the storage location of u_Sampler2');
      return;
    }

    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if (!u_Sampler3) {
      console.log('Failed to get the storage location of u_Sampler3');
      return;
    }

    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
      console.log('Failed to get the storage location of u_lightPos');
      return;
    }

    u_spotlightCutoff = gl.getUniformLocation(gl.program, 'u_spotlightCutoff');
    if (!u_spotlightCutoff) {
      console.log('Failed to get the storage location of u_spotlightCutoff');
      return;
    }
    u_spotlightDir = gl.getUniformLocation(gl.program, 'u_spotlightDir');
    if (!u_spotlightDir) {
      console.log('Failed to get the storage location of u_spotlightDir');
      return;
    }

    u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
if (!u_LightColor) {
  console.log('Failed to get the storage location of u_LightColor');
  return;
}


    // u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    // if (!u_cameraPos) {
    //   console.log('Failed to get the storage location of u_cameraPos');
    //   return;
    // }

    u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
    if (!u_lightOn) {
      console.log('Failed to get the storage location of u_lightOn');
      return;
    }


    var identityM = new Matrix4();
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

    // gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
    // gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
    // gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);

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
let g_globalAnglex = 0;
let g_globalAngley = 0;
let g_armAngle = 0;
let g_handAngle = 0;
let g_Aanimation = true;
let g_legAngle = 0;
let mouthMove = false;
let g_lightPos = [-.5,3,-1];
let g_camera = new Camera();
let g_lightOn = true;
let lightAnim = true;
let lightColor = [1.0, 1.0, 1.0]; // Default white light
function addActionsForHtmlUI(){
  // document.getElementById('green').onclick = function() {
  document.getElementById('normalOn').onclick = function() {g_normalON = true;
    // resetPreviewShape();
  }
  document.getElementById('normalOff').onclick = function() {g_normalON = false;
    // resetPreviewShape();
  }

  document.getElementById('lightOff').onclick = function() {g_lightOn = false;
    // resetPreviewShape();
  }

  document.getElementById('lightOn').onclick = function() {g_lightOn = true;
    // resetPreviewShape();
  }
  document.getElementById('lightAnimOn').onclick = function() {lightAnim = true;
    // resetPreviewShape();
  }

  document.getElementById('lightAnimOff').onclick = function() {lightAnim = false;
    // resetPreviewShape();
  }
  document.getElementById('animationOn').onclick = function() {g_Aanimation = true;
    // resetPreviewShape();
  }
  document.getElementById('animationOff').onclick = function() {g_Aanimation = false;
    // resetPreviewShape();
  }

  document.getElementById("lightR").addEventListener('mousemove', function(ev) {if(ev.buttons == 1){
    lightColor[0] = this.value/255; 
    renderScene();
  }
  });
  
  document.getElementById("lightG").addEventListener('mousemove', function(ev) {if(ev.buttons == 1){
    lightColor[1] = this.value/255; 
    renderScene();
  }
  });
  
  document.getElementById("lightB").addEventListener('mousemove', function(ev) {if(ev.buttons == 1){
    lightColor[2] = this.value/255; 
    renderScene();
  }
  });



  document.getElementById('angleSlide').addEventListener('mousemove', function() {
    g_globalAnglex = this.value; 
    renderScene();
  });
  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) { if(ev.buttons == 1){
    g_lightPos[0] = this.value/100; 
    renderScene();
  }
  
    
  });

  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) { if(ev.buttons == 1){
    g_lightPos[1] = this.value/100; 
    renderScene();
  }
  
    
  });
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) { if(ev.buttons == 1){
    g_lightPos[2] = this.value/100; 
    renderScene();
  }

  

    
  });
  // document.getElementById('armSlide').addEventListener('mousemove', function() {
  //   g_armAngle = this.value; 
  //   renderScene();
  // });

  // document.getElementById('handSlide').addEventListener('mousemove', function() {
  //   g_handAngle = this.value; 
  //   renderScene();
  // });



  

}

function initTextures(){
 
  var image = new Image();
  if (!image){
    console.log("Failed to create the image object");
    return false;
  }

  image.onload = function() {
    sendImageToTEXTURE0(image);
  } 
    image.src = 'sky.jpg';


    //add more texture loading
  var dirtimg = new Image();
  if (!dirtimg){
    console.log("Failed to create the image object");
    return false;
  }

  dirtimg.onload = function() {
    sendImageToTEXTURE1(dirtimg);
  }


  dirtimg.src = 'dirt.jpg';
    
  var grassimg = new Image();
  if (!grassimg){
    console.log("Failed to create the image object");
    return false;
  }

  grassimg.onload = function() {
    sendImageToTEXTURE2(grassimg);
  }

  grassimg.src = 'grassplane.jpg';
    

  var stoneimg = new Image();
  if (!stoneimg){
    console.log("Failed to create the image object");
    return false;
  }

  stoneimg.onload = function() {
    sendImageToTEXTURE3(stoneimg);
  }

  stoneimg.src = 'stone.jpg';
    

  // console.log(grassimg)
  return true;


}

function sendImageToTEXTURE0(image){
  var texture = gl.createTexture();
  if (!texture){
    console.log("Failed to creeate the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler0,0);

  console.log("finished loadTexture");
}

function sendImageToTEXTURE1(image){
  var texture = gl.createTexture();
  if (!texture){
    console.log("Failed to creeate the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE1);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler1,1);

  console.log("finished loadTexture");
}

function sendImageToTEXTURE2(image){
  var texture = gl.createTexture();
  if (!texture){
    console.log("Failed to creeate the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE2);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler2,2);

  console.log("finished loadTexture");
}

function sendImageToTEXTURE3(image){
  var texture = gl.createTexture();
  if (!texture){
    console.log("Failed to creeate the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE3);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler3,3);

  console.log("finished loadTexture");
}

function updateCameraDirection() {
  let direction = new Vector3([
      Math.cos(pitch) * Math.sin(yaw),
      Math.sin(pitch),
      Math.cos(pitch) * Math.cos(yaw)
  ]);

  // Update 'at' based on the new direction
  console.log(" before: " + g_camera.at.elements);
  g_camera.at = new Vector3(g_camera.eye.elements).add(direction);
  console.log(" after: " + g_camera.at.elements);
}
let yaw = 0;   // Horizontal rotation
let pitch = 0; // Vertical rotation
const sensitivity = 0.005; // Adjust for smoother movement
// let g_previewShape = null;
function main() {
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  document.onkeydown = keydown;

  initTextures();
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


function printCoords(cameraobj){
    console.log("New coords: " + "x: " + Math.floor(cameraobj.eye.elements[0] * 1) + " y: " + Math.floor(cameraobj.eye.elements[1] * 1) + " z :" + Math.floor(cameraobj.eye.elements[2] * 1));  
    return [Math.floor(cameraobj.eye.elements[0] * 1), Math.floor(cameraobj.eye.elements[2] * 1)]       
}
        
let log = document.querySelector("#log");
document.addEventListener("click", click);

function click(ev){


  
  [x,y] = convertCoordinatesEventToGL(ev);
  // Function to Update Camera Direction Based on Yaw/Pitch
let deltaX = ev.movementX || 0;
let deltaY = ev.movementY || 0;
if (y < .9 && ev.shiftKey == false){
  g_globalAnglex = x*180;
  }
// // Update yaw (left/right rotation)
// yaw += deltaX * sensitivity;

// // Update pitch (up/down rotation) and clamp to prevent flipping
// pitch += deltaY * sensitivity;
// pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch));

// updateCameraDirection();

//   // if (y < .9 && ev.shiftKey == false){
//   // g_globalAnglex = x*180;
//   // g_globalAngley = y*180;
//   // console.log(g_globalAngley)

//   // }
//   log.textContent = ``;
//   if (ev.shiftKey == true ){
//     log.textContent = `:( ): `
//     if (mouthMove){
//       mouthMove = false;
//     }
//     else {
//     mouthMove = true;
//     }
//   }
    
// }
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
  if (lightAnim == true){
  g_lightPos[0] = Math.cos(g_seconds);
  }
}


function keydown(ev){
  if (ev.key == 'c'){
    console.log("place")
    let coordofCam =  printCoords(g_camera);
   
    console.log("coordinate print: " + printCoords(g_camera));
    let dirV = getCameraDirection();
// Example usage:
    console.log("Camera is facing: " + getCameraDirection());
    console.log("word array: " + worldArray[coordofCam[0]+8,coordofCam[1]+8])
    if (dirV == "+X"){
      
      if (worldArray[coordofCam[0]+16+2][coordofCam[1]+16] < 5){
        worldArray[coordofCam[0]+16+2][coordofCam[1]+16]++;
        console.log("PLACE BLOCK");
      }
      
    }else if(dirV == "-X"){
      
      if (worldArray[coordofCam[0]+16-2][coordofCam[1]+16] < 5){
        worldArray[coordofCam[0]+16-2][coordofCam[1]+16]++;
        console.log("PLACE BLOCK");
      }
    }
      else if(dirV == "-Z"){
      
        if (worldArray[coordofCam[0]+16][coordofCam[1]+16-2] < 5){
          worldArray[coordofCam[0]+16][coordofCam[1]+16-2]++;
          console.log("PLACE BLOCK");
        }
        
      }
      else if(dirV == "+Z"){
      
        if (worldArray[coordofCam[0]+16][coordofCam[1]+16+2] < 5){
          worldArray[coordofCam[0]+16][coordofCam[1]+16+2]++;
          console.log("PLACE BLOCK");
        }
        
      }
  }
  else if(ev.key == 'v'){
    let coordofCam =  printCoords(g_camera);
   
    console.log("coordinate print: " + printCoords(g_camera));
    let dirV = getCameraDirection();
// Example usage:
    console.log("Camera is facing: " + getCameraDirection());
    console.log("word array: " + worldArray[coordofCam[0]+8,coordofCam[1]+8])
    if (dirV == "+X"){
      
      if (worldArray[coordofCam[0]+16+2][coordofCam[1]+16] > 0){
        worldArray[coordofCam[0]+16+2][coordofCam[1]+16]--;
        console.log("delete BLOCK");
      }
      
    }
    else if(dirV == "-X"){
      
      if (worldArray[coordofCam[0]+16-2][coordofCam[1]+16] > 0){
        worldArray[coordofCam[0]+16-2][coordofCam[1]+16]--;
        console.log("delete BLOCK");
      }
    }
      else if(dirV == "-Z"){
      
        if (worldArray[coordofCam[0]+16][coordofCam[1]+16-2] > 0){
          worldArray[coordofCam[0]+16][coordofCam[1]+16-2]--;
          console.log("delete BLOCK");
        }
        
      }
      else if(dirV == "+Z"){
      
        if (worldArray[coordofCam[0]+16][coordofCam[1]+16+2] > 0){
          worldArray[coordofCam[0]+16][coordofCam[1]+16+2]--;
          console.log("delete BLOCK");
        }
        
      }
  }
  else if (ev.key === 'd'){
    g_camera.right();
  }else if (ev.key === 'a'){
    g_camera.left();
  } else if (ev.key === 'w'){ //up arrow
    g_camera.forward();
  }else if (ev.key === 's'){ //down arrow
    g_camera.back();
  }else if (ev.key === 'q'){
    //rotate camera left
    g_camera.rotateRight();

  }
  else if (ev.key === 'e'){
    //rotate camera right
    g_camera.rotateLeft();
  }
  
  
  renderScene();
  console.log(ev.keyCode);
  
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

  // var g_eye = [0,0,3];
  // var g_at = [0,0,-100];
  // var g_up = [0,1,0];

 
  var worldArray = [ //how tall cubes are made/
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,2,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,1,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,3,3,3,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,1,4,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,4,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,4],
  [4,0,0,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,4],
  [4,0,0,4,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3,3,3,3,3,3,2,0,0,0,0,0,0,0,0,0,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  ];
  
  

  function drawMap(){
    var block = new Cube();
    for (x = 0 ; x < 32 ; x++){
      for (z = 0; z < 32; z++){
        if (worldArray[x][z] > 0){
          for (n = 0; n < worldArray[x][z]; n++){
          //let key = `${x-16},${1+n},${z-16}`; // Unique key based on position
           // Check if this position is already occupied
            let block = new Cube();
            block.color = [1,1,1,1];
            if (1+n == 2 || 1+n == 1){
              block.textureNum = 3;
            }
            else {
            block.textureNum = 1;
            }
            block.matrix.setTranslate(0, -2, 0);
            block.matrix.scale(1,1,1);
            block.matrix.translate(x-16, 1+n, z-16);
            if (g_normalON){
              block.textureNum = -3;
            }
            block.renderWithNorms();
          }
        }
      }
    }
  }

  function renderScene(){
    var startTime = performance.now();

    var projMat = new Matrix4();

    projMat.setPerspective(60, 1*canvas.width/canvas.height, .1, 10000);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    

    var viewMat = new Matrix4();
    viewMat.setLookAt(
      g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
    //viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]); //eye, at, up
    //viewMat.setLookAt(0,0,3, 0,0,-100,  0,1,0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);


    var globalRotMat = new Matrix4().rotate(g_globalAnglex, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // var globalRotMat= new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    // gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);  

    // var u_ProjectionMatrix = new Matrix4();
    // gl.uniformMatrix4fv(u_ProjectionMatrix, false, u_ProjectionMatrix.elements);

    // var u_ViewMatrix = new Matrix();
    // gl.uniformMatrix4fv(u_ViewMatrix, false, u_ViewMatrix.elements);


    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

    gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
 
    gl.uniform1i(u_lightOn, g_lightOn);
    //gl.uniform3f(u_spotlightPos, 0.0, 5.0, 0.0);  
    gl.uniform3f(u_spotlightDir, 0.0, -1.0, 0.0); 
    gl.uniform1f(u_spotlightCutoff, Math.cos(30.0 * Math.PI / 180.0)); // 20-degree cutoff

    gl.uniform3f(u_LightColor, lightColor[0], lightColor[1], lightColor[2]);
  //var len = g_points.length

  //drawMap();
  


//   if (g_Aanimation){
// //   var K = 8;
// // for (var i = 1; i < K; i++){
// //   var c = new Cube();
// //   c.matrix.translate(-.9,Math.random()+i/K-1,.8);
// //   c.matrix.scale(.02,.05,.02)
// //   c.renderfast();
// // }
// // var K = 8;
// // for (var i = 1; i < K; i++){
// //   var c = new Cube();
// //   c.matrix.translate(.9,Math.random()+i/K-.2,.5);
// //   c.matrix.scale(.02,.05,.02)
// //   c.renderfast();
// // }
// // for (var i = 1; i < K; i++){
// //   var c = new Cube();
// //   c.matrix.translate(.2,Math.random()+i/K-.5,.4);
// //   c.matrix.scale(.02,.05,.02)
// //   c.renderfast();
// // }
// // var K = 4;
// // for (var i = 1; i < K; i++){
// //   var c = new Cube();
// //   c.matrix.translate(-.2,Math.random()+i/K-1.4,-.2);
// //   c.matrix.scale(.02,.05,.02)
// //   c.renderfast();
// // }
//   }
   
  let rotateAnimal = new Matrix4();
  rotateAnimal.rotate(180, 0, 1, 0); // Rotate 180 degrees around Y-axis

  var skybox = new Cube();
  skybox.color = [117/255, 149/255, 255/255, 1.0];
  if (g_normalON){
    skybox.textureNum = -3;
  }
  else {
    //skybox.textureNum = 0;
  }
  skybox.matrix.scale(-20,-20,-20);
  skybox.matrix.translate(-.5,-0.5,-.5);
  skybox.renderWithNorms();    

    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  var light = new Cube();
  light.color = [1,1,0,1];
  if (g_normalON){
    light.textureNum = -2;
  
  }else {
  light.textureNum = -2;
  }

  light.matrix.translate(g_lightPos[0],g_lightPos[1],g_lightPos[2]);
  light.matrix.scale(-.5,-.5,-.5);
  light.matrix.translate(-.5,2,3);
  light.render();

  var groundPlane = new Cube();
  if (g_normalON){
    groundPlane.textureNum = -3;
  }
  else {
  groundPlane.textureNum = 2;
  }
  groundPlane.matrix.translate(-16,-2,-16);
  groundPlane.matrix.scale(32, 1, 32);
  groundPlane.normalMatrix.setInverseOf(groundPlane.matrix).transpose();
  groundPlane.renderWithNorms();
  
  var sphere = new Sphere();
  // sphere.matrix.scale(20,20,20);
  if (g_normalON){
    sphere.textureNum = -3;
  }
  else {
    sphere.textureNum = 1;
  }
  sphere.matrix.translate(1,0,-2)
  
  sphere.render();
  

    
  var body = new Cube();
  body.color = [1, 0.6, 1, 1];
  body.textureNum = -2;
  body.matrix.translate(-.25, -.5, 0);
  body.matrix.scale(.6, .6, .6);
  if (g_normalON){
    body.textureNum = -3;
  }
  else {
    body.textureNum = -2;
  }

  body.normalMatrix.setInverseOf(body.matrix).transpose();
  body.renderWithNorms();

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
  if (g_Aanimation){
      leftarm.matrix.rotate(25*Math.sin(g_seconds), 0, 0,1);
  }
  else {
    leftarm.matrix.rotate(g_armAngle, 0, 0, 1);
  }

  var lArmCoord = new Matrix4(leftarm.matrix);
  leftarm.matrix.scale(0.3, .23, .3);
  if (g_normalON){
    leftarm.textureNum = -3;
  }
  else {
    leftarm.textureNum = -2;
  }
  leftarm.normalMatrix.setInverseOf(leftarm.matrix).transpose();
  leftarm.renderWithNorms();

  var lefthand = new Cube();
  lefthand.color = [1, 0.6, 1, 1];
  if (g_normalON){
    lefthand.textureNum = -3;
  }
  else {
    lefthand.textureNum = -2;
  }
  lefthand.matrix = lArmCoord;
  lefthand.matrix.translate(.3, 0,0);
  lefthand.matrix.rotate(10, 0, 0,1);
  lefthand.matrix.rotate(g_handAngle, 0, 0, 1);
  lefthand.matrix.scale(0.3, .23, .3);
  
  lefthand.renderWithNorms();


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
  if (g_normalON){
    rightarm.textureNum = -3;
  }
  else {
    rightarm.textureNum = -2;
  }
  rightarm.renderWithNorms();
  
  
  var righthand = new Cube();
  righthand.color = [1, 0.6, 1, 1];
  righthand.matrix = rArmCoord;
  righthand.matrix.translate(.3, 0,0);
   righthand.matrix.rotate(10, 0, 0,1);
  righthand.matrix.rotate(g_handAngle, 0, 0,1);
   righthand.matrix.scale(0.3, .23, .3);
   if (g_normalON){
    righthand.textureNum = -3;
  }
   righthand.renderWithNorms();


  var righteye = new Cube();
  righteye.color = [0,0,0,1];
  righteye.matrix.setTranslate(0.12, -.25,.35);
  righteye.matrix.rotate(0, 0, 0,1);

  righteye.matrix.scale(0.12, .25, .3);
  if (g_normalON){
    righteye.textureNum = -3;
  }
  else {
    righteye.textureNum = -2;
  }
  righteye.renderWithNorms();
  

  var rightlight = new Cube();
  rightlight.color = [1,1,1,1];
  rightlight.matrix.setTranslate(0.115, -.1,.36);
  rightlight.matrix.rotate(0, 0, 0,1);

  rightlight.matrix.scale(0.055, .045, .3);
  if (g_normalON){
    rightlight.textureNum = -3;
  }
  else {
    rightlight.textureNum = -2;
  }
  rightlight.renderWithNorms();



  var lefteye = new Cube();
  lefteye.color = [0,0,0,1];
  lefteye.matrix.setTranslate(-0.15, -.25,.35);
  lefteye.matrix.rotate(0, 0, 0,1);

  lefteye.matrix.scale(0.12, .25, .3);
  if (g_normalON){
    lefteye.textureNum = -3;
  }
  else {
    lefteye.textureNum = -2;
  }
  lefteye.renderWithNorms();

  var leftlight = new Cube();
  leftlight.color = [1,1,1,1];
  leftlight.matrix.setTranslate(-0.156, -.1,.36);
  leftlight.matrix.rotate(0, 0, 0,1);

  leftlight.matrix.scale(0.055, .045, .3);
  if (g_normalON){
    leftlight.textureNum = -3;
  }
  else {
    leftlight.textureNum = -2;
  }
  leftlight.renderWithNorms();

  var lmouth = new Cube();
  lmouth.color = [0,0,0,1];
  lmouth.matrix.setTranslate(0.05, -.32,.35);
  lmouth.matrix.rotate(180+g_mouthAngle, 0, 0,1);

  lmouth.matrix.scale(0.06, .02, .3);
  if (g_normalON){
    lmouth.textureNum = -3;
  }
  else {
    lmouth.textureNum = -2;
  }
  lmouth.renderWithNorms();

  var rmouth = new Cube();
  rmouth.color = [0,0,0,1];
  rmouth.matrix.setTranslate(0.05, -.34,.35);
  rmouth.matrix.rotate(0-g_mouthAngle, 0, 0,1);

  rmouth.matrix.scale(0.06, .02, .3);
  if (g_normalON){
    rmouth.textureNum = -3;
  }
  else {
    rmouth.textureNum = -2;
  }
  rmouth.renderWithNorms();
  
  
  var lblush = new Cube();
  lblush.color = [1,0,0,1];
  lblush.matrix.setTranslate(0.2, -.32,.35);
  lblush.matrix.rotate(0, 0, 0,1);

  lblush.matrix.scale(0.09, .05, .3);
  if (g_normalON){
    lblush.textureNum = -3;
  }
  else {
    lblush.textureNum = -2;
  }
  lblush.renderWithNorms();

  var rblush = new Cube();
  rblush.color = [1,0,0,1];
  rblush.matrix.setTranslate(-0.2, -.32,.35);
  rblush.matrix.rotate(0, 0, 0,1);

  rblush.matrix.scale(0.09, .05, .3);
  if (g_normalON){
    rblush.textureNum = -3;
  }
  else {
    rblush.textureNum = -2;
  }
  rblush.renderWithNorms();
  

      
  var lLeg = new Cube();
  lLeg.color = [.9,.34,1,1];
  lLeg.matrix.setTranslate(-.2,-.45,.2);
  lLeg.matrix.rotate(270+g_legAngle, 0, 0,1);
  
  var lLegCoords = new Matrix4(lLeg.matrix);
  lLeg.matrix.scale(0.35, .2, .3);
  if (g_normalON){
    lLeg.textureNum = -3;
  }
  else {
    lLeg.textureNum = -2;
  }
  lLeg.renderWithNorms();

  var rLeg = new Cube();
  rLeg.color = [.9,.34,1,1];
  rLeg.matrix.setTranslate(.1, -.45,.2);
  rLeg.matrix.rotate(270-g_legAngle, 0, 0,1);
  var rLegCoords = new Matrix4(rLeg.matrix);
  rLeg.matrix.scale(0.35, .2, .3);
  if (g_normalON){
    rLeg.textureNum = -3;
  }
  else {
    rLeg.textureNum = -2;
  }
  rLeg.renderWithNorms();

  var lFoot = new Cube();
  lFoot.color = [1,0,1,1];
  lFoot.matrix = lLegCoords;
  lFoot.matrix.translate(0.35, .2,0);
  lFoot.matrix.rotate(270, 0, 0,1);
  lFoot.matrix.scale(0.3, .1, .3);
  if (g_normalON){
    lFoot.textureNum = -3;
  }
  else {
    lFoot.textureNum = -2;
  }
  lFoot.renderWithNorms();

  
  var rFoot = new Cube();
  rFoot.color = [1,0,1,1];
  rFoot.matrix = rLegCoords;
  rFoot.matrix.translate(.35, .3,0);
  rFoot.matrix.rotate(270, 0, 0,1);
  rFoot.matrix.scale(0.3, .1, .3);
  if (g_normalON){
    rFoot.textureNum = -3;
  }
  else {
    rFoot.textureNum = -2;
  }
  rFoot.renderWithNorms();


   




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
