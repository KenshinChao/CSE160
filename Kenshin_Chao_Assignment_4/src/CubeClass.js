
class Cube{ 
    constructor(){
      this.type = 'cube';
      // this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      // this.size = 5.0;
      // this.segments = 10;
      this.matrix = new Matrix4();
      this.normalMatrix = new Matrix4();
      this.textureNum = -2;
      this.cubeVerts32 = new Float32Array([
        0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0,
        0.0,0.0,0.0, 0.0,1.0,0.0, 1,1.0,0.0,
        0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,0.0,
        1.0,1.0,0.0, 1.0,1.0,1, 0.0,1.0,1.0,
        1.0,1.0,0.0, 1.0,1.0,1.0, 1,0.0,1.0,
        1.0,0.0,0.0, 1.0,1.0,0.0, 1,0,1.0,
        0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0,
        1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0,
        0.0,0.0,0.0, 0.0,0.0,1.0, 0,1.0,0.0,
        0.0,1.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0,
        0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0,
        0.0,0.0,1.0, 1.0,0.0,1.0, 1,1.0,1.0

      ]);
      this.cubeVerts = 
      [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0,
        0.0,0.0,0.0, 0.0,1.0,0.0, 1,1.0,0.0,
        0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,0.0,
        1.0,1.0,0.0, 1.0,1.0,1, 0.0,1.0,1.0,
        1.0,1.0,0.0, 1.0,1.0,1.0, 1,0.0,1.0,
        1.0,0.0,0.0, 1.0,1.0,0.0, 1,0,1.0,
        0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0,
        1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0,
        0.0,0.0,0.0, 0.0,0.0,1.0, 0,1.0,0.0,
        0.0,1.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0,
        0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0,
        0.0,0.0,1.0, 1.0,0.0,1.0, 1,1.0,1.0
        
      
      ]
      this.cubeUVs32 = new Float32Array(

    [0,0, 1,1, 1,0,
     0,0, 0,1, 1,1,

     0,1, 0,0, 1,1,
      1,1, 1,0, 0,0,

     1,1, 0,1, 0,0,
    1,0, 1,1, 0,0,

    0,0, 0,1, 1,0,
      1,0, 1,1, 0,1,

      1,0, 0,0, 1,1,
      1,1, 0,1, 0,0,
      
      0,0, 0,1, 1,1,
      0,0, 1,0, 1,1]);

  
      this.coords = [0,0,0];
    }

  
    render(){
      
      // var xy = this.position;
      var rgba = this.color;
      // var size = this.size;
  
      
      gl.uniform1i(u_whichTexture, this.textureNum);
      
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

    //front face
    drawTriangle3DUV([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [0,0, 1,1, 1,0]);
    // drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], );
    drawTriangle3DUV([0.0,0.0,0.0, 0.0,1.0,0.0, 1,1.0,0.0], [0,0, 0,1, 1,1]);
    
    //draw other sides. 
    //top
    drawTriangle3DUV([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,0.0],[0,1, 0,0, 1,1]);
    drawTriangle3DUV([1.0,1.0,0.0, 1.0,1.0,1, 0.0,1.0,1.0], [1,1, 1,0, 0,0]);
    //right side 
    //gl.uniform4f(u_FragColor, rgba[0]*.9,rgba[1]*.9,rgba[2]*.9, rgba[3]);
    drawTriangle3DUV([1.0,1.0,0.0, 1.0,1.0,1.0, 1,0.0,1.0], [1,1, 0,1, 0,0]);
    drawTriangle3DUV([1.0,0.0,0.0, 1.0,1.0,0.0, 1,0,1.0], [1,0, 1,1, 0,0]);

    //bottom 
    drawTriangle3DUV([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0],[0,0, 0,1, 1,0]);
    drawTriangle3DUV([1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0], [1,0, 1,1, 0,1]);
   
    //left
    drawTriangle3DUV([0.0,0.0,0.0, 0.0,0.0,1.0, 0,1.0,0.0], [1,0, 0,0, 1,1]);
    drawTriangle3DUV([0.0,1.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0], [1,1, 0,1, 0,0]);

    //back 
    drawTriangle3DUV([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0], [0,0, 0,1, 1,1]);
    drawTriangle3DUV([0.0,0.0,1.0, 1.0,0.0,1.0, 1,1.0,1.0], [0,0, 1,0, 1,1]);
   
    }


    
    renderfast(){
      //console.log("u_ModelMatrix " + u_ModelMatrix.elements)
      var rgba = this.color;
      gl.uniform1i(u_whichTexture, this.textureNum);  
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      var allverts = [];
        //front
      allverts = allverts.concat([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
      allverts = allverts.concat([0.0,0.0,0.0, 0.0,1.0,0.0, 1,1.0,0.0]);

      //top
      allverts = allverts.concat([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,0.0]);
      allverts = allverts.concat([1.0,1.0,0.0, 1.0,1.0,1, 0.0,1.0,1.0]);

      //right
      allverts = allverts.concat([1.0,1.0,0.0, 1.0,1.0,1.0, 1,0.0,1.0]);
      allverts = allverts.concat([1.0,0.0,0.0, 1.0,1.0,0.0, 1,0,1.0]);

      //bottom
      allverts = allverts.concat([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0]);
      allverts = allverts.concat([1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0]);
      //left
      allverts = allverts.concat([0.0,0.0,0.0, 0.0,0.0,1.0, 0,1.0,0.0]);
      allverts = allverts.concat([0.0,1.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0]);
      //back
      allverts = allverts.concat([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
      allverts = allverts.concat([0.0,0.0,1.0, 1.0,0.0,1.0, 1,1.0,1.0]);

      

      var alluvs = [];

      alluvs = alluvs.concat([0,0, 1,1, 1,0])
      alluvs = alluvs.concat([0,0, 0,1, 1,1])

      alluvs = alluvs.concat([0,1, 0,0, 1,1])
      alluvs = alluvs.concat( [1,1, 1,0, 0,0])

      alluvs = alluvs.concat([1,1, 0,1, 0,0]);
      alluvs = alluvs.concat([1,0, 1,1, 0,0]);

      alluvs = alluvs.concat([0,0, 0,1, 1,0]);
      alluvs = alluvs.concat( [1,0, 1,1, 0,1]);

      alluvs = alluvs.concat([1,0, 0,0, 1,1]);
      alluvs = alluvs.concat([1,1, 0,1, 0,0]);
      
      alluvs = alluvs.concat([0,0, 0,1, 1,1]);
      alluvs = alluvs.concat([0,0, 1,0, 1,1]);

      drawTriangle3DUVALL(allverts,alluvs);

    }

    
renderWithNorms(){
      
  // var xy = this.position;
  var rgba = this.color;
  // var size = this.size;

  
  gl.uniform1i(u_whichTexture, this.textureNum);
  
  gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
  gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

//front face
drawTriangle3DUVNormal([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [0,0, 1,1, 1,0], [0,0,-1,0,0,-1,0,0,-1]);
// drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], );
drawTriangle3DUVNormal([0.0,0.0,0.0, 0.0,1.0,0.0, 1,1.0,0.0], [0,0, 0,1, 1,1],[0,0,-1,0,0,-1,0,0,-1]);

//draw other sides. 
//top
drawTriangle3DUVNormal([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,0.0],[0,1, 0,0, 1,1],[0,1,0,0,1,0,0,1,0]);
drawTriangle3DUVNormal([1.0,1.0,0.0, 1.0,1.0,1, 0.0,1.0,1.0], [1,1, 1,0, 0,0],[0,1,0,0,1,0,0,1,0]);
//right side 
gl.uniform4f(u_FragColor, rgba[0]*.9,rgba[1]*.9,rgba[2]*.9, rgba[3]);
drawTriangle3DUVNormal([1.0,1.0,0.0, 1.0,1.0,1.0, 1,0.0,1.0], [1,1, 0,1, 0,0],[1,0,0, 1,0,0, 1,0,0]);
drawTriangle3DUVNormal([1.0,0.0,0.0, 1.0,1.0,0.0, 1,0,1.0], [1,0, 1,1, 0,0],[1,0,0, 1,0,0, 1,0,0]);

//bottom 
drawTriangle3DUVNormal([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0],[0,0, 0,1, 1,0],[0,-1,0,0,-1,0,0,-1,0]);
drawTriangle3DUVNormal([1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0], [1,0, 1,1, 0,1],[0,-1,0,0,-1,0,0,-1,0]);

//left
drawTriangle3DUVNormal([0.0,0.0,0.0, 0.0,0.0,1.0, 0,1.0,0.0], [1,0, 0,0, 1,1],[-1,0,0, -1,0,0, -1,0,0]);
drawTriangle3DUVNormal([0.0,1.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0], [1,1, 0,1, 0,0],[-1,0,0, -1,0,0, -1,0,0]);

//back 
drawTriangle3DUVNormal([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0], [0,0, 0,1, 1,1],[0,0,1, 0,0,1, 0,0,1]);
drawTriangle3DUVNormal([0.0,0.0,1.0, 1.0,0.0,1.0, 1,1.0,1.0], [0,0, 1,0, 1,1],[0,0,1, 0,0,1, 0,0,1]);

}


   renderfaster(){
  var rgba = this.color;

  gl.uniform1i(u_whichTexture, this.textureNum);

  //console.log("u_whichTexture is: ", u_whichTexture);
  
  gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

  gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

  if (g_vertexBuffer == null){
    initTriangle3D();
  }

  gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts32, gl.DYNAMIC_DRAW);


 
  var g_UVbuffer = gl.createBuffer();
     if (g_UVbuffer == null){
      initUVBuffer();
     }
gl.bufferData(gl.ARRAY_BUFFER, this.cubeUVs32, gl.DYNAMIC_DRAW);


  gl.drawArrays(gl.TRIANGLES, 0, 36)


}
  }




function drawTriangle3D(vertices) {

  var n = vertices.length/3; // The number of vertices
  //console.log("n " + n)
  // Create a buffer object
  
  if (g_vertexBuffer == null){
    initTriangle3D();
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

  
