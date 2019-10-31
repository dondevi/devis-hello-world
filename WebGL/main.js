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
    attribute vec2 aTextureCoord;
    attribute vec3 aVertexNormal;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uNormalMatrix;

    varying lowp vec4 vColor;
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main () {
      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

      vColor = aVertexColor;
      vTextureCoord = aTextureCoord;
      vLighting = ambientLight + directionalLightColor * directional;
    }
  `;

  var fsSource = `
    varying lowp vec4 vColor;
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main () {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      // gl_FragColor = vColor;
      // gl_FragColor = texture2D(uSampler, vTextureCoord);
      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);  // Vector Modulation
    }
  `;

  /**
   * ---------------------------------------------------------------------------
   *  Data
   * ---------------------------------------------------------------------------
   */
  var squarePositions = [
    -1.0,  1.0, 0.0,
     1.0,  1.0, 0.0,
    -1.0, -1.0, 0.0,
     1.0, -1.0, 0.0,
  ];
  var squareColors = [
    1.0, 1.0, 1.0, 1.0,  // White
    1.0, 0.0, 0.0, 1.0,  // Red
    0.0, 1.0, 0.0, 1.0,  // Green
    0.0, 0.0, 1.0, 1.0,  // Blue
  ];
  var squareRotation = 0.0;

  var cubePositions = [
    // Front
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    // Back
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    // Top
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    // Bottom
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    // Right
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    // Left
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];
  var cubeIndices = [
     0,  1,  2,    0,   2,  3,  // Front
     4,  5,  6,    4,   6,  7,  // Back
     8,  9, 10,    8,  10, 11,  // Top
    12, 13, 14,    12, 14, 15,  // Bottom
    16, 17, 18,    16, 18, 19,  // Right
    20, 21, 22,    20, 22, 23,  // Left
  ];
  var cubeColors = [
    // Front: White
    1.0, 1.0 , 1.0, 1.0,
    1.0, 1.0 , 1.0, 1.0,
    1.0, 1.0 , 1.0, 1.0,
    1.0, 1.0 , 1.0, 1.0,
    // Back: Red
    1.0, 0.0 , 0.0, 1.0,
    1.0, 0.0 , 0.0, 1.0,
    1.0, 0.0 , 0.0, 1.0,
    1.0, 0.0 , 0.0, 1.0,
    // Top: Green
    0.0, 1.0 , 0.0, 1.0,
    0.0, 1.0 , 0.0, 1.0,
    0.0, 1.0 , 0.0, 1.0,
    0.0, 1.0 , 0.0, 1.0,
    // Bottom: Blue
    0.0, 0.0 , 1.0, 1.0,
    0.0, 0.0 , 1.0, 1.0,
    0.0, 0.0 , 1.0, 1.0,
    0.0, 0.0 , 1.0, 1.0,
    // Right: Yellow
    1.0, 1.0 , 0.0, 1.0,
    1.0, 1.0 , 0.0, 1.0,
    1.0, 1.0 , 0.0, 1.0,
    1.0, 1.0 , 0.0, 1.0,
    // Right: Purple
    1.0, 0.0 , 1.0, 1.0,
    1.0, 0.0 , 1.0, 1.0,
    1.0, 0.0 , 1.0, 1.0,
    1.0, 0.0 , 1.0, 1.0,
  ];
  var cubeTextureCoords = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0
  ];
  var cubeNormals = [
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
  ];

  /**
   * ---------------------------------------------------------------------------
   *  Main Logic
   * ---------------------------------------------------------------------------
   */
  var canvas = document.getElementById("canvas");
  var gl     = canvas.getContext("webgl");

  var program = createShaderProgram(gl, vsSource, fsSource);
  var programInfo = getShaderProgramInfo(gl, program);
  gl.useProgram(program);

  // var bufferInfo = {
  //   "aVertexPosition": createBuffer(gl, squarePositions),
  //   "aVertexColor": createBuffer(gl, squareColors),
  // };

  var bufferInfo = {
    "aVertexPosition": createBuffer(gl, cubePositions),
    "aVertexColor": createBuffer(gl, cubeColors),
    "aTextureCoord": createBuffer(gl, cubeTextureCoords),
    "aVertexIndice": createElementBuffer(gl, cubeIndices),
    "aVertexNormal": createBuffer(gl, cubeNormals),
  };

  var texture = createTexture(gl);

  // var image = new Image();
  // image.onload = function (event) {
  //   updateTexture(gl, texture, image);
  //   if (!isPowerOf2(image.width) || !isPowerOf2(image.height)) {
  //     console.error("Image size must be power of 2.");
  //   }
  // };
  // image.crossOrigin = "anonymous";
  // image.src = "./tex_4.jpg";

  var video  = document.getElementById("video");
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.src = "./video.mp4";

  initScene(gl);
  drawScene(gl, programInfo, bufferInfo, texture);

  var rotateAnimation = createRotateAnimation(function (deltaRotation) {
    if (!video.paused) {
      updateTexture(gl, texture, video);
    }
    drawScene(gl, programInfo, bufferInfo, texture, squareRotation += deltaRotation);
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
    if (rotateAnimation.isStop) {
      video.play();
      rotateAnimation.run();
    } else {
      video.pause();
      rotateAnimation.stop();
    }
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
      var deltaRotation = deltaTime * 0.0008;
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
    return { isStop: isStop, run: run, stop: stop, toggle: toggle };
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
    var aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
    var aVertexNormal = gl.getAttribLocation(program, "aVertexNormal");
    gl.enableVertexAttribArray(aVertexPosition);
    gl.enableVertexAttribArray(aVertexColor);
    gl.enableVertexAttribArray(aTextureCoord);
    gl.enableVertexAttribArray(aVertexNormal);
    return {
      program: program,
      attribLocations: {
        "aVertexPosition": aVertexPosition,
        "aVertexColor": aVertexColor,
        "aTextureCoord": aTextureCoord,
        "aVertexNormal": aVertexNormal,
      },
      uniformLocations: {
        "uProjectionMatrix": gl.getUniformLocation(program, "uProjectionMatrix"),
        "uModelViewMatrix": gl.getUniformLocation(program, "uModelViewMatrix"),
        "uNormalMatrix": gl.getUniformLocation(program, "uNormalMatrix"),
        "uSampler": gl.getUniformLocation(program, "uSampler"),
      },
    };
  }

  /**
   * Draw Scene
   * @param  {Object} gl          - WebGLRenderingContext
   * @param  {Object} programInfo - Shader Program Info
   * @param  {Object} bufferInfo  - Buffer Info
   * @param  {Object} texture     - Object Texture
   * @param  {Number} rotation    - Object Rotation
   * @requires gl-matrix.js
   */
  function drawScene (gl, programInfo, bufferInfo, texture, rotation) {
    resetScene(gl);

    var pMatrix = mat4.create();
    var mvMatrix = mat4.create();
    mat4.perspective(pMatrix, 45, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0);
    mat4.translate(mvMatrix, mvMatrix, [-0.0, 0.0, -6.0]);
    mat4.rotate(mvMatrix, mvMatrix, rotation * 0.5, [1, 0, 1]);
    mat4.rotate(mvMatrix, mvMatrix, rotation * 0.7, [0, 1, 0]);
    mat4.rotate(mvMatrix, mvMatrix, rotation, [0, 0, 1]);

    var nmMatrix = mat4.create();
    mat4.invert(nmMatrix, mvMatrix);
    mat4.transpose(nmMatrix, nmMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo["aVertexPosition"]);
    gl.vertexAttribPointer(programInfo.attribLocations["aVertexPosition"], 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo["aVertexColor"]);
    gl.vertexAttribPointer(programInfo.attribLocations["aVertexColor"], 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo["aTextureCoord"]);
    gl.vertexAttribPointer(programInfo.attribLocations["aTextureCoord"], 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo["aVertexNormal"]);
    gl.vertexAttribPointer(programInfo.attribLocations["aVertexNormal"], 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo["aVertexIndice"]);

    gl.uniformMatrix4fv(programInfo.uniformLocations["uProjectionMatrix"], false, pMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations["uModelViewMatrix"], false, mvMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations["uNormalMatrix"], false, nmMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocations["uSampler"], 0);

    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
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
   * Create Element Buffer
   * @param  {Object} gl   - WebGLShadingContext
   * @param  {Array}  data
   * @return {Object}
   */
  function createElementBuffer (gl, data) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
    return buffer;
  }

  /**
   * Create Texture
   * @param  {Object} gl  - WebGLRenderingContext
   * @return {Object}
   */
  function createTexture (gl) {
    var texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    return texture;
  }

  /**
   * Update Texture
   * @param {Object} gl      - WebGLRenderingContext
   * @param {Object} texture - WebGLTexture
   * @param {Object} element - Image or Video
   */
  function updateTexture (gl, texture, element) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element);
  }

  // function isPowerOf2 (value) {
  //   return 0 === (value & (value - 1));
  // }

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
