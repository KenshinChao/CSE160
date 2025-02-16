class Camera {
    constructor(){
        this.eye = new Vector3([0,0,3]); //almost like location
        this.at = new Vector3([0,0,-100]);
        this.up = new Vector3([0,1,0]);
        this.speed = 1;
        }

forward() {
    let f = new Vector3(this.at.elements).sub(this.eye);
    f.div(f.magnitude());
    f.mul(this.speed);       
    this.at.add(f);              
    this.eye.add(f);       
    console.log("New coords: " + "x: " + Math.floor(this.eye.elements[0] * 1) + " y: " + Math.floor(this.eye.elements[1] * 1) + " z :" + Math.floor(this.eye.elements[2] * 1));           
}

back() {
    let f = new Vector3(this.eye.elements).sub(this.at);  
    f.div(f.magnitude());   
    f.mul(this.speed);       
    this.at.add(f);             
    this.eye.add(f);      
    console.log("New coords: " + "x: " + Math.floor(this.eye.elements[0] * 1) + " y: " + Math.floor(this.eye.elements[1] * 1) + " z :" + Math.floor(this.eye.elements[2] * 1));         
}

left() {
    let f = new Vector3(this.eye.elements).sub(this.at);  
    f.div(f.magnitude());        
    let s = Vector3.cross(f, this.up); 
    s.div(s.magnitude());      
    this.at.add(s);             
    this.eye.add(s);             
    console.log("New coords: " + "x: " + Math.floor(this.eye.elements[0] * 1) + " y: " + Math.floor(this.eye.elements[1] * 1) + " z :" + Math.floor(this.eye.elements[2] * 1));         
}

right() {
    let f = new Vector3(this.eye.elements).sub(this.at);  
    f.div(f.magnitude());      
    let s = Vector3.cross(f, this.up); 
    s.div(s.magnitude());      
    s.mul(-1);                   
    this.at.add(s);             
    this.eye.add(s);       
    console.log("New coords: " + "x: " + Math.floor(this.eye.elements[0] * 1) + " y: " + Math.floor(this.eye.elements[1] * 1) + " z :" + Math.floor(this.eye.elements[2] * 1));         
}

rotateLeft() {
    //OLD
    // let atp = new Vector3(this.at.elements); //atp = dir = at-eye
    // atp.sub(this.eye);
    // console.log("ATP: " + atp.elements)
    // let r = Math.sqrt((atp[0]*atp[0]) + (atp[1]*atp[1]))
    // let theta = Math.atan(atp[1],atp[0]);
    // console.log("thetaq: " + theta)
    // theta = theta +(5 * (Math.PI / 180));
    // let newx = r * Math.cos(theta);
    // let newy = r * Math.sin(theta);
    // let d = new Vector3([newx,newy,0]);
    // let eyec = new Vector3(this.eye.elements);
    // this.at = eyec.add(d);
    // Step 1: Compute Direction Vector (d = at - eye)
    let d = new Vector3(g_camera.at.elements).sub(g_camera.eye);

    
    let r = Math.sqrt(d.elements[0] ** 2 + d.elements[2] ** 2);


    let theta = Math.atan2(d.elements[2], d.elements[0]); 

  
    theta += (5 * Math.PI) / 180; 

  
    let newX = r * Math.cos(theta);
    let newZ = r * Math.sin(theta);

    g_camera.at.elements[0] = g_camera.eye.elements[0] + newX;
    g_camera.at.elements[2] = g_camera.eye.elements[2] + newZ;
}

rotateRight() {
  
    let d = new Vector3(g_camera.at.elements).sub(g_camera.eye);

    
    let r = Math.sqrt(d.elements[0] ** 2 + d.elements[2] ** 2);


    let theta = Math.atan2(d.elements[2], d.elements[0]); 

  
    theta -= (5 * Math.PI) / 180; 

  
    let newX = r * Math.cos(theta);
    let newZ = r * Math.sin(theta);

    g_camera.at.elements[0] = g_camera.eye.elements[0] + newX;
    g_camera.at.elements[2] = g_camera.eye.elements[2] + newZ;
}
}