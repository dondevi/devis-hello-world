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
   *  Main Logic
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

  var canvas = document.getElementById("canvas");
  var gl     = canvas.getContext("webgl");

  var program = createShaderProgram(gl, vsSource, fsSource);
  var programInfo = getShaderProgramInfo(gl, program);

  programInfo.buffers = {
    "position": createBuffer(gl, squarePositions),
    "color": createBuffer(gl, squareColors),
  };

  resetScene(gl);
  drawScene(gl, programInfo);


  /**
   * ---------------------------------------------------------------------------
   *  Business Function
   * ---------------------------------------------------------------------------
   */

  /**
   * Get ShaderProgram Info
   * @param  {Object} gl            - WebGLRenderingContext
   * @param  {Object} program - WebGLProgram
   * @return {Object}
   */
  function getShaderProgramInfo (gl, program) {
    var getAttribLocation = getAttribLocationSigleton(gl, program);
    var getUniformLocation = getUniformLocationSigleton(gl, program);

    var programInfo = {
      program: program,
      attribLocations: {
        "aVertexPosition":   getAttribLocation("aVertexPosition"),
        "aVertexColor":   getAttribLocation("aVertexColor"),
      },
      uniformLocations: {
        "uProjectionMatrix": getUniformLocation("uProjectionMatrix"),
        "uModelViewMatrix":  getUniformLocation("uModelViewMatrix"),
      },
    };

    return programInfo;
  }

  /**
   * Draw Scene
   * @param  {Object} gl          - WebGLRenderingContext
   * @param  {Object} programInfo - Shader Program Info
   * @requires gl-matrix.js
   */
  function drawScene (gl, programInfo) {
    var pMatrix = mat4.create();
    var mvMatrix = mat4.create();
    mat4.perspective(pMatrix, 45, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0);
    mat4.translate(mvMatrix, mvMatrix, [-0.0, 0.0, -6.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, programInfo.buffers["position"]);
    gl.vertexAttribPointer(programInfo.attribLocations["aVertexPosition"], 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, programInfo.buffers["color"]);
    gl.vertexAttribPointer(programInfo.attribLocations["aVertexColor"], 4, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(programInfo.uniformLocations["uProjectionMatrix"], false, pMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations["uModelViewMatrix"], false, mvMatrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }


  /**
   * ---------------------------------------------------------------------------
   *  Common Function
   * ---------------------------------------------------------------------------
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
   * Get AttribLocation Function
   * @param  {Object} gl      - WebGLShadingContext
   * @param  {Object} program - WebGLProgram
   * @return {Function}
   */
  function getAttribLocationSigleton (gl, program) {
    var sigletons = {};
    return function (name) {
      var location = sigletons[name];
      if (!location) {
        location = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(location);
        sigletons[name] = location;
      }
      return location;
    };
  }

  /**
   * Get UniformLocation Function
   * @param  {Object} gl      - WebGLShadingContext
   * @param  {Object} program - WebGLProgram
   * @return {Function}
   */
  function getUniformLocationSigleton (gl, program) {
    var sigletons = {};
    return function (name) {
      var location = sigletons[name];
      if (!location) {
        location = gl.getUniformLocation(program, name);
        sigletons[name] = location;
      }
      return location;
    };
  }

  /**
   * Reset Scene
   * @param  {Object} gl - WebGLRenderingContect
   */
  function resetScene (gl) {
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

})(window, document);
