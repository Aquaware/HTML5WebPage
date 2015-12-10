var canvas;
var vertexShader;
var fragmentShader;
var gl;
var shaderProgram;
var shaderParameters = {};
var VBO;
var IBO;
var TBO;
var TEX;

var vertices = [
     -0.5,  0.5,  0.0,
     0.5,  0.5,  0.0,
    0.5,  -0.5,  0.0,
     -0.5,  -0.5,  0.0,
];

var vertexIndices = [
    0, 1, 2,
    3, 0, 2,
];

function init() {
    initGL();
    setupShaders();

    // VBOの生成、バインド
    VBO = createVBO(vertices);
    IBO = createIBO(vertexIndices);

    //TEX = createTEX();
    //TBO = createTBO();

    draw();
}

function draw() {
  var dataStride = 3;
  gl.enableVertexAttribArray(shaderParameters.aPosition );
  gl.vertexAttribPointer(shaderParameters.aPosition, dataStride, gl.FLOAT, false, 0, 0);

  // 描画
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
  gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_SHORT, 0);
}


function initGL(){
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

  	// クリア色
  	gl.clearColor(0.0, 0.0, 0.0, 1.0);
  	// Canvasをクリア
  	gl.clear(gl.COLOR_BUFFER_BIT);
}

function setupShaders(){
  var vertexShaderSource = document.getElementById('vertexShader').textContent;
  vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER);
  var fragmentShaderSource = document.getElementById('fragmentShader').textContent;
  fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
  shaderProgram = createProgram(vertexShader, fragmentShader);

  shaderParameters.aPosition  = gl.getAttribLocation(shaderProgram, 'aPosition');

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

// Vertex Buffer Object
function createVBO(data){
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vbo;
}

// Color Buffer Object
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

// Vertex Index Buffer Object
function createIBO(data){
  var ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  return ibo;
}

// Texture Index Buffer Object
function createTBO(data){
  var texCoord = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoord);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  return texCoord;
}

// Texture Object
function createTEX(image) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
}
