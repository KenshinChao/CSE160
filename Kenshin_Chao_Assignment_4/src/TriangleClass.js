
class Triangle{ 
    constructor(){
      this.type = 'triangle';
      this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      this.size = 5.0;
      this.flippedH = false;
      this.flippedV = false;
      
    }

    render(){
      
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;
  
     
      // var xy = g_points[i];
      // var rgba = g_colors[i];
      // var size = g_sizes[i];
      // Pass the position of a point to a_Position variable
    //   gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      
      //pass the size
      gl.uniform1f(u_Size, size);
     
      

    // // If flipped, invert the Y coordinates
    // if (this.flipped) {
    //   vertices = [
    //     xy[0], xy[1],
    //     xy[0] + d, xy[1],
    //     xy[0], xy[1] - d,
    //   ];
    // }
      // Draw
      var d = this.size/200.0;
      let vertices = [
      xy[0], xy[1],
      xy[0] + d, xy[1],
      xy[0], xy[1] + d,
    ];

    if (this.flippedH && this.flippedV) {
        vertices = [
          xy[0], xy[1],
          xy[0] - d, xy[1],
          xy[0], xy[1] - d,
        ];
      }
    else if (this.flippedH) {
        vertices = [
          xy[0], xy[1],
          xy[0] - d, xy[1],
          xy[0], xy[1] + d,
        ];
      }
      else if (this.flippedV) {
        vertices = [
          xy[0], xy[1],
          xy[0] + d, xy[1],
          xy[0], xy[1] - d,
        ];
      }
      
  
      drawTriangle(vertices)
    
 
    }
  
  }
  
  
function drawTriangle(vertices) {
    // var vertices = new Float32Array([
    //   0, 0.5,   -0.5, -0.5,   0.5, -0.5
    // ]);
    var n = 3; // The number of vertices
  
    // Create a buffer object
    if (g_vertexBuffer == null){
      initTriangle3D();
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
   gl.drawArrays(gl.TRIANGLES, 0, n);
    //return n;
  }
  
  function drawTriangle3DUV(vertices, uv){
    var n = 3;

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
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
      var uvBuffer = gl.createBuffer();
      if (!uvBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

      gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(a_UV);

      gl.drawArrays(gl.TRIANGLES, 0, n);



  }
 var g_vertexBuffer = null;
 var g_UVbuffer = null;
  function initTriangle3D(){
    g_vertexBuffer = gl.createBuffer();
    if (!g_vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
   
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);
    // Write date into the buffer object
   

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

  }

  function initUVBuffer(){
    
    g_UVbuffer = gl.createBuffer();
      if (!g_UVbuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    gl.bindBuffer(gl.ARRAY_BUFFER, g_UVbuffer);

    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);
  }

  function drawTriangle3DUVALL(vertices, uv){
    var n = vertices.length/3;
    if (g_vertexBuffer == null) {
      initTriangle3D();
    }
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //   // Write date into the buffer object
    //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    //   // Assign the buffer object to a_Position variable
    //   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    
    //   // Enable the assignment to a_Position variable
    //   gl.enableVertexAttribArray(a_Position);


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
      var uvBuffer = gl.createBuffer();
      if (!uvBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

      gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(a_UV);

      gl.drawArrays(gl.TRIANGLES, 0, n);



  }

  function drawTriangle3DUVNormal(vertices, uv, normals) {
    var n = vertices.length / 3;

    // 1. Create and bind the vertex buffer
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the vertex buffer');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // 2. Create and bind the UV buffer
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
        console.log('Failed to create the UV buffer');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    // 3. Create and bind the normal buffer
    var normalBuffer = gl.createBuffer();
    if (!normalBuffer) {
        console.log('Failed to create the normal buffer');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);

    // 4. Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, n);

    g_vertexBuffer = null;
}
