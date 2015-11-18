var gl = null;
var shaderProgram;
var shaderParameters = {};
var VBO;
var IBO;
var CBO;

var modelViewMatrix;
var projectionMatrix;
var rotationAxis;

var angle = 10;
var vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
];

var vertexIndices = [
    0, 1, 2,      0, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
];

var colors = [
    [1.0, 0.0, 0.0, 1.0], // Front face
    [1.0, 1.0, 0.0, 1.0], // Back face
    [0.0, 1.0, 0.0, 1.0], // Top face
    [1.0, 0.5, 0.5, 1.0], // Bottom face
    [1.0, 0.0, 1.0, 1.0], // Right face
    [0.0, 0.0, 1.0, 1.0]  // Left face
];

function init() {
  initGL();
  initShaders();
  initMatrix();

  VBO = createVBO(vertices);
  CBO = createCBO(colors);
  IBO = createIBO(vertexIndices);

  var angle = 5;
  mat4.rotate(modelViewMatrix, degToRad(angle), [1, 1, 1]);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  tick();
}

function initGL(){
  canvas = document.getElementById("myCanvas");

  // WebGLコンテキストが取得できたかどうか調べる
  gl = canvas.getContext('webgl');
  if(!gl){
  	alert('webgl not supported!');
  	return;
  }
  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
}

function initShaders() {
  var vertexShaderSource = document.getElementById('vertexShaderSourceText').textContent;
  vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER);
  var fragmentShaderSource = document.getElementById('fragmentShaderSourceText').textContent;
  fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

  shaderProgram = createProgram(vertexShader, fragmentShader);
  shaderParameters.aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
  gl.enableVertexAttribArray(shaderParameters.aPosition);

  shaderParameters.aColor = gl.getAttribLocation(shaderProgram, "aColor");
  gl.enableVertexAttribArray(shaderParameters.aColor);

  shaderParameters.uProjection = gl.getUniformLocation(shaderProgram, "uProjection");
  shaderParameters.uModelView = gl.getUniformLocation(shaderProgram, "uModelView");
}

function initMatrix() {
  // マトリクス
  modelViewMatrix = mat4.create();
  projectionMatrix = mat4.create();
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, projectionMatrix);
  mat4.identity(modelViewMatrix);
  mat4.translate(modelViewMatrix, [-1.5, 0.0, -8.0]);
  mat4.translate(modelViewMatrix, [3.0, 0.0, 0.0]);
}

function createProgram(vertexShader, fragmentShader){
  var prog = gl.createProgram();
  gl.attachShader(prog, vertexShader);
  gl.attachShader(prog, fragmentShader);
  gl.linkProgram(prog);
  if(gl.getProgramParameter(prog, gl.LINK_STATUS)){
    gl.useProgram(prog);
    return prog;
  }else{
    alert(gl.getProgramInfoLog(prog));
    return null;
  }
}

function createShader(source, type){
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
      return shader;
  }else{
      alert(gl.getShaderInfoLog(shader));
      return null;
  }
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.vertexAttribPointer(shaderParameters.aPosition, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, CBO);
  gl.vertexAttribPointer(shaderParameters.aColor, 4, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
  gl.uniformMatrix4fv(shaderParameters.uProjection, false, projectionMatrix);
  gl.uniformMatrix4fv(shaderParameters.uModelView, false, modelViewMatrix);
  gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_SHORT, 0);
}

// 頂点バッファ
function createVBO(data){
  var vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return vbo;
}

// カラーバッファ
function createCBO(data){
   var cbo = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, cbo);
   var unpackedColors = [];
   for (var i in data) {
       var color = data[i];
       for (var j=0; j < 4; j++) {
           unpackedColors = unpackedColors.concat(color);
       }
   }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
   return cbo;
}

function createIBO(data){
  var ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  return ibo;
}

var lastTime = 0;
function update() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        angle -=  elapsed/ 1000000000.0;
        mat4.rotate(modelViewMatrix, degToRad(angle), [1, 1, 1]);
    }
    lastTime = timeNow;
}

function tick() {
    requestAnimFrame(tick);
    draw();
    update();
}
