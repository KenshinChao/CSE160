
class Cube{ 
    constructor(){
      this.type = 'cube';
      // this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      // this.size = 5.0;
      // this.segments = 10;
      this.matrix = new Matrix4();
      this.textureNum = -2;
    }
    render(){
      
      // var xy = this.position;
      var rgba = this.color;
      // var size = this.size;
  
      
      gl.uniform1i(u_whichTexture, this.textureNum);
      
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //front face
    drawTriangle3DUV([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [1,0,0,1,-1,1]);
    // drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], );
    drawTriangle3DUV([0.0,0.0,0.0, 0.0,1.0,0.0, 1,1.0,0.0], [1,0,0,1,-1,1]);
    
    //draw other sides. 
    //top
    drawTriangle3DUV([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,0.0],[1,0,0,1,-1,1]);
    drawTriangle3D([1.0,1.0,0.0, 1.0,1.0,1, 0.0,1.0,1.0]);
    //right side 
    gl.uniform4f(u_FragColor, rgba[0]*.9,rgba[1]*.9,rgba[2]*.9, rgba[3]);
    drawTriangle3DUV([1.0,1.0,0.0, 1.0,1.0,1.0, 1,0.0,1.0], [1,0,0,1,-1,1]);
    drawTriangle3D([1.0,0.0,0.0, 1.0,1.0,0.0, 1,0,1.0]);

    //bottom 
    drawTriangle3DUV([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0], [1,0,0,1,-1,1]);
    drawTriangle3DUV([1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0], [1,0,0,1,-1,1]);
   
    //left
    drawTriangle3DUV([0.0,0.0,0.0, 0.0,0.0,1.0, 0,1.0,0.0], [1,0,0,1,-1,1]);
    drawTriangle3DUV([0.0,1.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0], [1,0,0,1,-1,1]);

    //back 
    drawTriangle3DUV([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0], [1,0,0,1,-1,1]);
    drawTriangle3DUV([0.0,0.0,1.0, 1.0,0.0,1.0, 1,1.0,1.0], [1,0,0,1,-1,1]);
   
    }
  
  }

  


function drawTriangle3D(vertices) {

  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);


 gl.drawArrays(gl.TRIANGLES, 0, n);
  //return n;
}

  