var gl = null;
var shaderProgram;
var shaderParameters = {};
var VBO;
var IBO;
var CBO;
var modelViewMatrix;
var projectionMatrix;
var rotationAxis;

var vertices = [
  0.0, 1.0, 0.0,  -1.0, 0.0, 0.0,   0.0, 0.0, 1.0,
  0.0, 1.0, 0.0,   0.0, 0.0, 1.0,   1.0, 0.0, 0.0,
  0.0, 1.0, 0.0,   1.0, 0.0, 0.0,   0.0, 0.0, -1.0,
  0.0, 1.0, 0.0,   0.0, 0.0, -1.0, -1.0, 0.0, 0.0
];

var colors = [
  [0.0, 0.0, 1.0, 1.0], // front (blue)
  [1.0, 1.0, 0.0, 1.0], // right (yellow)
  [0.0, 1.0, 0.0, 1.0], // back  (green)
  [1.0, 0.0, 0.0, 1.0], // left  (red)
];


function init() {
  initCanvas();
  setupShaders();

  // 頂点バッファの作成
  VBO = createVBO(vertices);

  // カラーバッファの作成
  CBO = createCBO(colors);

  // マトリクス
  modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3]);
  projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);

  // 回転軸
  rotationAxis = vec3.create();
  mat4.rotate(modelViewMatrix, modelViewMatrix, 0.3, rotationAxis);
  vec3.normalize(rotationAxis, [0, 1, 0]);

  requestAnimationFrame(update);
}

function initCanvas(){
    canvas = document.getElementById("myCanvas");

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
  shaderProgram = createProgram(vertexShader, fragmentShader);

  // attribute
  shaderParameters.aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
  gl.enableVertexAttribArray(shaderParameters.aPosition);
  shaderParameters.aColor = gl.getAttribLocation(shaderProgram, "aColor");
  gl.enableVertexAttribArray(shaderParameters.aColor);

  shaderParameters.uModelView = gl.getUniformLocation(shaderProgram, "uModelView");
  shaderParameters.uProjection = gl.getUniformLocation(shaderProgram, "uProjection");
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
        gl.useProgram(prog);
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

function draw() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 頂点属性の位置情報の設定
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.vertexAttribPointer(shaderParameters.aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, CBO);
  gl.vertexAttribPointer(shaderParameters.aColor, 4, gl.FLOAT, false, 0, 0);

  // 行列の設定
  gl.uniformMatrix4fv(shaderParameters.uProjection, false, projectionMatrix);
  gl.uniformMatrix4fv(shaderParameters.uModelView , false, modelViewMatrix);

  // 描画
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
  //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
  //gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

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
