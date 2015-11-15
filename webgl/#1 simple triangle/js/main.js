var canvas;
var vertexShader;
var fragmentShader;
var gl;
var program;

var vertices = [
     0.0,  1.0,  0.0,
     1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
];

function init() {

    initCanvas();
    setupShaders();

    // VBOの生成、バインド
    var vbo = createVbo(vertices);

    // attribute
    var dataStride = 3;
    var attLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(attLocation);
    gl.vertexAttribPointer(attLocation, dataStride, gl.FLOAT, false, 0, 0);

    // 描画
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / dataStride);
    gl.flush();
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
  program = createProgram(vertexShader, fragmentShader);
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

function createVbo(data){
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return vbo;
}
