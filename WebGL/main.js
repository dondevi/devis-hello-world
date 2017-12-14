/**
 * WebGL hello world
 *
 * @author dondevi
 * @create 2017-12-13
 */

(function (window, document) {

  /**
   * ---------------------------------------------------------------------------
   *  Shader GLSL Source
   * ---------------------------------------------------------------------------
   */
  var vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;

    varying lowp vec4 vColor;

    void main () {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  var fsSource = `
    varying lowp vec4 vColor;

    void main () {
      // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      gl_FragColor = vColor;
    }
  `;

  /**
   * ---------------------------------------------------------------------------
   *  Data
   * ---------------------------------------------------------------------------
   */
  var squarePositions = [
     1.0,  1.0, 0.0,
    -1.0,  1.0, 0.0,
     1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0,
  ];
  var squareColors = [
    1.0, 1.0, 1.0, 1.0,  // White
    1.0, 0.0, 0.0, 1.0,  // Red
    0.0, 1.0, 0.0, 1.0,  // Green
    0.0, 0.0, 1.0, 1.0,  // Blue
  ];
  var squareRotation = 0.0;

  /**
   * ---------------------------------------------------------------------------
   *  Main Logic
   * ---------------------------------------------------------------------------
   */
  var canvas = document.getElementById("canvas");
  var gl     = canvas.getContext("webgl");

  var program = createShaderProgram(gl, vsSource, fsSource);
  var programInfo = getShaderProgramInfo(gl, program);
  var bufferInfo = {
    "position": createBuffer(gl, squarePositions),
    "color": createBuffer(gl, squareColors),
  };

  initScene(gl);

  var rotateAnimation = createRotateAnimation(function (deltaRotation) {
    drawScene(gl, programInfo, bufferInfo, squareRotation += deltaRotation);
  });

  rotateAnimation.run();

  /**
   * ---------------------------------------------------------------------------
   *  Event Binding
   * ---------------------------------------------------------------------------
   */
  canvas.addEventListener("click", HANLDER_clickCanvas);

  /**
   * ---------------------------------------------------------------------------
   *  Event Handler
   * ---------------------------------------------------------------------------
   */
  function HANLDER_clickCanvas (event) {
    rotateAnimation.toggle();
  };

  /**
   * ---------------------------------------------------------------------------
   *  Business Function
   * ---------------------------------------------------------------------------
   */

  /**
   * Create Rotate Animation
   * @param  {Function} callback
   * @return {Object}
   */
  function createRotateAnimation (callback) {
    var preTime = 0;
    var isStop = !!callback;
    var rotate = function (nowTime) {
      var deltaTime = nowTime - preTime;
      var deltaRotation = deltaTime * 0.001;
      preTime = nowTime;
      callback && callback(deltaRotation);
      if (isStop) { return; }
      window.requestAnimationFrame(rotate);
    };
    var run = function () {
      isStop = false;
      window.requestAnimationFrame(function (nowTime) {
        rotate(preTime = nowTime);
      });
    };
    var stop = function () {
      isStop = true;
    };
    var toggle = function () {
      isStop ? run() : stop();
    };
    return { run: run, stop: stop, toggle: toggle };
  }

  /**
   * Get ShaderProgram Info
   * @param  {Object} gl      - WebGLRenderingContext
   * @param  {Object} program - WebGLProgram
   * @return {Object}
   */
  function getShaderProgramInfo (gl, program) {
    var aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    var aVertexColor = gl.getAttribLocation(program, "aVertexColor");
    var uProjectionMatrix = gl.getUniformLocation(program, "uProjectionMatrix");
    var uModelViewMatrix =  gl.getUniformLocation(program, "uModelViewMatrix");
    gl.enableVertexAttribArray(aVertexPosition);
    gl.enableVertexAttribArray(aVertexColor);
    return {
      program: program,
      attribLocations: {
        "aVertexPosition": aVertexPosition,
        "aVertexColor":  aVertexColor,
      },
      uniformLocations: {
        "uProjectionMatrix": uProjectionMatrix,
        "uModelViewMatrix":  uModelViewMatrix,
      },
    };
  }

  /**
   * Draw Scene
   * @param  {Object} gl          - WebGLRenderingContext
   * @param  {Object} programInfo - Shader Program Info
   * @param  {Object} bufferInfo  - Buffer Info
   * @param  {Number} rotation    - Object Rotation
   * @requires gl-matrix.js
   */
  function drawScene (gl, programInfo, bufferInfo, rotation) {
    var pMatrix = mat4.create();
    var mvMatrix = mat4.create();
    resetScene(gl);
    mat4.perspective(pMatrix, 45, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0);
    mat4.translate(mvMatrix, mvMatrix, [-0.0, 0.0, -6.0]);
    mat4.rotate(mvMatrix, mvMatrix, rotation, [0, 0, 1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo["position"]);
    gl.vertexAttribPointer(programInfo.attribLocations["aVertexPosition"], 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo["color"]);
    gl.vertexAttribPointer(programInfo.attribLocations["aVertexColor"], 4, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(programInfo.uniformLocations["uProjectionMatrix"], false, pMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations["uModelViewMatrix"], false, mvMatrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }


  /**
   * ===========================================================================
   *  Common Function
   * ===========================================================================
   */

  /**
   * Create Shader Program
   * @param  {Object} gl      - WebGLShadingContext
   * @param  {Array}  shaders - shader list
   * @return {Object}
   */
  function createShaderProgram (gl, vsSource, fsSource) {
    var vertexShader   = createShader(gl, gl.VERTEX_SHADER, vsSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    var program  = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    return program;
  }

  /**
   * Get a Shader
   * @param  {Object} gl     - WebGLShadingContext
   * @param  {Enum}   type   - shader type, [gl.VERTEX_SHADER| gl.FRAGMENT_SHADER]
   *   @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Shaders
   * @param  {String} source - shader code
   * @return {Object}
   */
  function createShader (gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  /**
   * Create Buffer
   * @param  {Object} gl   - WebGLShadingContext
   * @param  {Array}  data
   * @return {Object}
   */
  function createBuffer (gl, data) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
  }

  /**
   * Init Scene
   * @param  {Object} gl - WebGLRenderingContect
   */
  function initScene (gl) {
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    resetScene(gl);
  }

  /**
   * Reset Scene
   * @param  {Object} gl - WebGLRenderingContect
   */
  function resetScene (gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

})(window, document);
