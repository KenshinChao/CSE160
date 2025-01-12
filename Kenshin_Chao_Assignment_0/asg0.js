// DrawTriangle.js (c) 2012 matsuda
function drawVector(v, color){
  
  const canvas = document.getElementById('example');
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = color;

  // Draw the vector
  ctx.beginPath();
  ctx.moveTo(200, 200);
 
  ctx.lineTo(v.elements[0]*20+200, -v.elements[1]*20+200); // Draw to scaled vector end point
  ctx.stroke();

}

function angleBetween(v1, v2){
  x_id =  document.getElementById('x-coordinate'); 
  x_value = parseInt(x_id.value);
  v1.elements[0] = x_value;
  y_id =  document.getElementById('y-coordinate'); 
  y_value = parseInt(y_id.value);
  v1.elements[1] = y_value;
  //console.log(v1.elements)
 
  x2_id =  document.getElementById('x2-coordinate'); 
  x2_value = parseInt(x2_id.value);
  v2.elements[0] = x2_value;
  y2_id =  document.getElementById('y2-coordinate'); 
  y2_value = parseInt(y2_id.value);
  v2.elements[1] = y2_value;
  //console.log(Vector3.dot(v1,v2));
  let dotpr = Vector3.dot(v1,v2);
  let magnitudes = v1.magnitude() * v2.magnitude();


  return Math.acos(dotpr/magnitudes) * (180 / Math.PI)
}

function areaTriangle(v1,v2){
  
  let cp = Vector3.cross(v1,v2);

  let mag = cp.magnitude();
  const area = mag/2;

  return area;



}


function handleDrawEvent(){
  v1 = new Vector3([0,0,0])
  v2 = new Vector3([0,0,0])
  
  const canvas = document.getElementById('example');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0,canvas.width, canvas.height);
  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
  ctx.fillRect(0, 0, 400, 400); 
  
  x_id =  document.getElementById('x-coordinate'); 
  x_value = parseInt(x_id.value);
  v1.elements[0] = x_value;
  y_id =  document.getElementById('y-coordinate'); 
  y_value = parseInt(y_id.value);
  v1.elements[1] = y_value;
  //console.log(v1.elements)
 
  x2_id =  document.getElementById('x2-coordinate'); 
  x2_value = parseInt(x2_id.value);
  v2.elements[0] = x2_value;
  y2_id =  document.getElementById('y2-coordinate'); 
  y2_value = parseInt(y2_id.value);
  v2.elements[1] = y2_value;
  //console.log(v2.elements)
  drawVector(v1,"red")
  drawVector(v2,"blue")

}

function handleDrawOperationEvent(){
  v1 = new Vector3([0,0,0])
  v2 = new Vector3([0,0,0])
  v3 = new Vector3([0,0,0])
  v4 = new Vector3([0,0,0])
  x_value = 0;
  y_value = 0;
  x2_value = 0;
  y2_value = 0;
  const canvas = document.getElementById('example');
  const ctx = canvas.getContext('2d');
  s = document.getElementById('Scalar').value;
  x_id =  document.getElementById('x-coordinate'); 
  x_value = parseInt(x_id.value);
  
  v1.elements[0] = x_value;
  y_id =  document.getElementById('y-coordinate'); 
  y_value = parseInt(y_id.value);
  v1.elements[1] = y_value;
  
  x2_id =  document.getElementById('x2-coordinate'); 
  x2_value = parseInt(x2_id.value);
  v2.elements[0] = x2_value;
  y2_id =  document.getElementById('y2-coordinate'); 
  y2_value = parseInt(y2_id.value);
  v2.elements[1] = y2_value;

  option = document.getElementById('Operation').value;
  //console.log(option);
  if (option == "Add"){
    v3.set(v1.add(v2));
    //console.log(v3.elements);
  } 
  else if (option == "Subtract"){
    v3.set(v1.sub(v2));
  }
  else if (option == "Multiply"){
    v3.set(v1.mul(s));
    v4.set(v2.mul(s));
  }
  else if (option == "Divide"){
    v3.set(v1.div(s));
    v4.set(v2.div(s));

  }
  else if (option == "Angle Between"){
    console.log(angleBetween(v1,v2));

  }
  else if (option == "Area"){
    console.log("Area of triangle: " + areaTriangle(v1,v2));

  }
  else if (option == "Magnitude"){
    console.log("Magnitude v1: " + v1.magnitude());
    console.log("Magnitude v2: " + v2.magnitude());

  }

  else if (option == "Normalize"){
    v3.set(v1.normalize());
    v4.set(v2.normalize());
  }
  ctx.clearRect(0, 0,canvas.width, canvas.height);
  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
  ctx.fillRect(0, 0, 400, 400); 
  x_id =  document.getElementById('x-coordinate'); 
  x_value = parseInt(x_id.value);
  v1.elements[0] = x_value;
  y_id =  document.getElementById('y-coordinate'); 
  y_value = parseInt(y_id.value);
  v1.elements[1] = y_value;
  
  x2_id =  document.getElementById('x2-coordinate'); 
  x2_value = parseInt(x2_id.value);
  v2.elements[0] = x2_value;
  y2_id =  document.getElementById('y2-coordinate'); 
  y2_value = parseInt(y2_id.value);
  v2.elements[1] = y2_value;

  drawVector(v1,"red")
  drawVector(v2,"blue")
  drawVector(v3,"green")
  drawVector(v4,"green")  
}


function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');


  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
  ctx.fillRect(0, 0, 400, 400);        // Fill a rectangle with the color  
   

 
}

