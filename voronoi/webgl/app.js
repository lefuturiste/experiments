let gl = null;
let glCanvas = null;

let aVertexPosition;

let uDiagPoints;
let uDiagPointsColors;

let vertexCount;
const vertexNumComponents = 2;
let numberOfPoints = 4;

const startup = (nb = null) => {
    if (nb !== null) {
        numberOfPoints = nb
    }
    glCanvas = document.getElementById("glcanvas");
    gl = glCanvas.getContext("webgl");

    const shaderSet = [
        { type: gl.VERTEX_SHADER, id: "vertex-shader" },
        { type: gl.FRAGMENT_SHADER, id: "fragment-shader" }
    ];

    shaderProgram = buildShaderProgram(shaderSet);
    if (shaderProgram == -1) {
        return
    }
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let vertexArray = new Float32Array([ -1,1,  -1,-1,  1,-1,  1,1 ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

    vertexCount = vertexArray.length / vertexNumComponents;
    
    let baseColor = [0x39/255, 0x47/255, 0x20/255]

    let pointsRaw = []
    let colorsRaw = []
    for (let i = 0; i < numberOfPoints; i++) {
        pointsRaw.push((Math.random() > 0.5 ? 1 : -1)*Math.random())
        pointsRaw.push((Math.random() > 0.5 ? 1 : -1)*Math.random())
        pointsRaw.push(0)
        pointsRaw.push(0)
        colorsRaw.push(0.2+i*(0.8/numberOfPoints))
        colorsRaw.push(0)
        colorsRaw.push(0)
        colorsRaw.push(0.1+i*((1-0.1)/numberOfPoints))
    }
    console.log(pointsRaw, colorsRaw)
    gl.getExtension('OES_texture_float');

    let initTexture = (textureId, rawData, count) => {
        // 3x1 pixel 1d texture
        gl.activeTexture(textureId);
        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);

        let data = new Float32Array(rawData)

        gl.texImage2D(
            gl.TEXTURE_2D,
            0, gl.RGBA,
            count, 1,
            0, gl.RGBA,
            gl.FLOAT,
            data
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    initTexture(gl.TEXTURE0, pointsRaw, numberOfPoints)
    initTexture(gl.TEXTURE1, colorsRaw, numberOfPoints)
    
    animateScene();
}

const buildShaderProgram = (shaderInfo) => {
    let program = gl.createProgram();

    shaderInfo.forEach((desc) => {
        let shader = compileShader(desc.id, desc.type);
        if (shader == -1) {
            return -1;
        }

        if (shader) {
            gl.attachShader(program, shader);
        }
    });

    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking shader program:", gl.getProgramInfoLog(program));
        return -1;
    }

    return program;
}
  
const compileShader = (id, type) => {
    let code = document.getElementById(id).firstChild.nodeValue;
    let shader = gl.createShader(type);

    if (id == 'fragment-shader') {
        code = code.replace('%POINTS_COUNT%', numberOfPoints)
    }

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
            `Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`,
            gl.getShaderInfoLog(shader)
        );
        return -1;
    }
    return shader;
}

const animateScene = () => {
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0.8, 0.9, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    // gl.uniform1f(uScalingFactor, currentScale);
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "numberOfPoints"), numberOfPoints);
    // gl.uniform2fv(uRotationVector, currentRotation);
    //gl.uniform4fv(uGlobalColor, [0.1, 0.7, 0.2, 1.0]);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "diagPointsTex"), 0);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "diagColorsTex"), 1);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");

    gl.vertexAttribPointer(aVertexPosition, vertexNumComponents, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPosition);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexCount);

}

window.addEventListener("load", () => {
    startup()
}, false);

