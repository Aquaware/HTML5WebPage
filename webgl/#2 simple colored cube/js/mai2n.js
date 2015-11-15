var canvas;
var vertexShader;
var fragmentShader;
var gl;
var program;
var VBO;
var IBO;
var CBO;
var modelViewMatrix;
var projectionMatrix;
var rotationAxis;
var shaderParameters = {};

// cube data
var dataStride = 3;
var vertices = [
  0.0, 1.0, 0.0,   -1.0, 0.0, 0.0,     0.0, 0.0, 1.0,
  0.0, 1.0, 0.0,    0.0, 0.0, 1.0,     1.0, 0.0, 0.0,
  0.0, 1.0, 0.0,    1.0, 0.0, 0.0,     0.0, 0.0, -1.0,
  0.0, 1.0, 0.0,    0.0, 0.0, -1.0,   -1.0, 0.0, 0.0
];

var colors = [
  [0.0, 0.0, 1.0, 1.0], // front (blue)
  [1.0, 1.0, 0.0, 1.0], // right (yellow)
  [0.0, 1.0, 0.0, 1.0], // back  (green)
  [1.0, 0.0, 0.0, 1.0], // left  (red)
];

var vertexIndices = [
    0, 1, 2,      0, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
];

function init() {
    initCanvas();
    setupShaders();

    // VBOの生成、バインド
    VBO = createVBO(vertices);
    CBO = createCBO(colors);
    IBO = createIBO(vertexIndices);

    // 視点変換マトリクス
    modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3]);
    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);

    // 回転軸
    rotationAxis = vec3.create();
    vec3.normalize(rotationAxis, [0, 1, 0]);

    draw();
}

function draw() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);

  // 頂点位置情報の設定
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.vertexAttribPointer(shaderParameters.aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, CBO);
  gl.vertexAttribPointer(shaderParameters.aColor, 4, gl.FLOAT, false, 0, 0);

 // 変換マトリックス設定
  gl.uniformMatrix4fv(shaderParameters.uProjection, false, projectionMatrix);
  gl.uniformMatrix4fv(shaderParameters.uModelView, false, modelViewMatrix);

  requestAnimationFrame(update);
}

function initCanvas(){
    canvas = document.getElementById("myCanvas");
    // Canvasサイズを変更
  	canvas.width = 512;
  	canvas.height = 512;

  	// WebGLコンテキストが取得できたかどうか調べる
  	gl = canvas.getContext('webgl');
  	if(!gl){
  		alert('webgl not supported!');
  		return;
  	}

    gl.viewport(0, 0, canvas.width, canvas.height);
}

function setupShaders(){
  var vertexShaderSource = document.getElementById('vertexShaderSourceText').textContent;
  vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER);
  var fragmentShaderSource = document.getElementById('fragmentShaderSourceText').textContent;
  fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
  program = createProgram(vertexShader, fragmentShader);

  // attribute
  shaderParameters.aPosition = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(shaderParameters.aPosition);
  shaderParameters.aColor = gl.getAttribLocation(program, "aColor");
  gl.enableVertexAttribArray(shaderParameters.aColor);

  shaderParameters.uModelView = gl.getUniformLocation(program, "uModelView");
  shaderParameters.uProjection = gl.getUniformLocation(program, "uProjection");
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

function createProgram(vertexShader, fragmentShader){
    var prog = gl.createProgram();
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    if(gl.getProgramParameter(prog, gl.LINK_STATUS)){
        return prog;
    }else{
        alert(gl.getProgramInfoLog(prog));
        return null;
    }
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
   data.forEach(function(color) {
     [0, 1].forEach(function() {
       unpackedColors = unpackedColors.concat(color);
     });
     unpackedColors = unpackedColors.concat([1.0, 1.0, 1.0, 1.0]);
   });
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
   return cbo;
}

function createIBO(data){
  var ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
}

var lastTime = null;
function update(time) {
  requestAnimationFrame(update);

  var elapsedTime = lastTime ? time - lastTime : 0;
  lastTime = time;

  // 回転
  var angle = Math.PI * elapsedTime / 10000;
  mat4.rotate(modelViewMatrix, modelViewMatrix, angle, rotationAxis);

  draw();
}
