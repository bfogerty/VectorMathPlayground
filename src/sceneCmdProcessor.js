import {Vector3} from "three";
import {Matrix4} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import MathHelpers from './mathHelpers'
import MatrixListManager from "./matrixListManager";

export default class SceneCommandProcessor {

    constructor(cmdMap, context)
    {
        this.cmdMap = cmdMap;
        this.context = context;

        this.registerCommands();
    }


    registerCommands()
    {
        this.registerListVectorsCommand();
        this.registerDumpVectorCommand();
        this.registerComputeVectorMagnitudeCommand();
        this.registerCreateVector();
        this.registerCreateVectorAtOrigin();
        this.registerCreateVectorFromDirectionAndMagnitude();
        this.registerDuplicateVector();
        this.registerCreateRandomVector();
        this.registerDestroyVector();
        this.registerShowVector();

        this.registerListMatricesCommand();
        this.registerDumpMatrixCommand();
        this.registerCreateMatrix();
        this.registerCreateMatrixFromForwardVector();
        this.registerCreateIdentityMatrix();
        this.registerCreateLeftRotationMatrix();
        this.registerCreateUpRotationMatrix();
        this.registerCreateForwardRotationMatrix();
        this.registerCreateScaleMatrix();
        this.registerCreateTranslationMatrix();
        this.registerDestroyMatrix();
        this.registerShowMatrix();

        this.registerClearScene();
        this.registerResetScene();
    }

    registerListVectorsCommand()
    {
        const instance = this;

        const cmdName = "listVectors";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Returns the list of vectors within the scene.",
            "exampleUsage": cmdName + "()",
            "function": (context, cmdArgs) =>
            {
                let vectors = [];
                for(let vectorName in instance.context.vectorListManager.getList()) {
                    vectors.push(vectorName);
                }

                const resultString = vectors.toString().replaceAll(',',"\r\n");

                return resultString;
            }
        }

        this.context.mathParser.set(cmdName, function () {
            const cmdArgs={};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerDumpVectorCommand()
    {
        const instance = this;

        const cmdName = "dumpVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Displays the properties of an input vector.",
            "exampleUsage": cmdName + "(\"vector\")",
            "function": (context, cmdArgs) =>
            {
                const inputVectorRenderObject = context.vectorListManager.get(cmdArgs["vector"]);

                const sp = inputVectorRenderObject.getStartPoint();
                const ep = inputVectorRenderObject.getEndPoint();
                const n = inputVectorRenderObject.computeNormal();
                const magnitude = inputVectorRenderObject.computeMagnitude();

                const nameString = "name: " + inputVectorRenderObject.name;
                const renderModeString = "render mode: " + inputVectorRenderObject.renderMode;

                const startPointString = "start point = [" +
                sp.x + ", " +
                sp.y + ", " +
                sp.z + "]";

                const endPointString = "end point = [" +
                    ep.x + ", " +
                    ep.y + ", " +
                    ep.z + "]";

                const magnitudeString = "magnitude = " + magnitude.toFixed(2).toString();

                const normalizedString = "normalized = [" +
                    n.x + ", " +
                    n.y + ", " +
                    n.z + "]";

                const nl = "\r\n";

                const resultString = nameString + nl +
                    renderModeString + nl +
                    startPointString + nl +
                    endPointString + nl +
                    magnitudeString + nl +
                    normalizedString;

                return resultString;
            }
        }

        this.context.mathParser.set(cmdName, function (vector) {
            const cmdArgs={"vector": vector};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerComputeVectorMagnitudeCommand()
    {
        const instance = this;

        const cmdName = "computeVectorMagnitude";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Returns the magnitude or length of a vector.",
            "exampleUsage": cmdName + "(\"vector\")",
            "function": (context, cmdArgs) =>
            {
                const inputVectorRenderObject = context.vectorListManager.get(cmdArgs["vector"]);
                const magnitude = inputVectorRenderObject.computeMagnitude();

                return magnitude;
            }
        }

        this.context.mathParser.set(cmdName, function (vector) {
            const cmdArgs={"vector": vector};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerDumpMatrixCommand()
    {
        const instance = this;

        const cmdName = "dumpMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Displays the properties of an input matrix.",
            "exampleUsage": cmdName + "(\"vector\")",
            "function": (context, cmdArgs) =>
            {
                const inputMatrixRenderObject = context.matrixListManager.get(cmdArgs["matrix"]);
                const m = inputMatrixRenderObject.matrix;
                let v = [];
                m.toArray(v);

                const nl = "\r\n";

                const nameString = "name: " + inputMatrixRenderObject.name;

                const p = 4;
                const matrixString =
                "[" + v[0].toFixed(p).toString() + ", " +  v[4].toFixed(p).toString() + ", " +  v[8].toFixed(p).toString() + ", " + v[12].toFixed(p).toString() + "]" + nl +
                "[" + v[1].toFixed(p).toString() + ", " +  v[5].toFixed(p).toString() + ", " +  v[9].toFixed(p).toString() + ", " + v[13].toFixed(p).toString() + "]" + nl +
                "[" + v[2].toFixed(p).toString() + ", " +  v[6].toFixed(p).toString() + ", " +  v[10].toFixed(p).toString() + ", " + v[14].toFixed(p).toString() + "]" + nl +
                "[" + v[3].toFixed(p).toString() + ", " +  v[7].toFixed(p).toString() + ", " +  v[11].toFixed(p).toString() + ", " + v[15].toFixed(p).toString() + "]";

                const resultString = nameString + nl +
                    matrixString;

                return resultString;
            }
        }

        this.context.mathParser.set(cmdName, function (matrix) {
            const cmdArgs={"matrix": matrix};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerListMatricesCommand()
    {
        const instance = this;

        const cmdName = "listMatrices";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Returns the list of matrices within the scene.",
            "exampleUsage": cmdName + "()",
            "function": (context, cmdArgs) =>
            {
                let matrices = [];
                for(let matrixName in instance.context.matrixListManager.getList()) {
                    matrices.push(matrixName);
                }

                const resultString = matrices.toString().replaceAll(',',"\r\n");

                return resultString;
            }
        }

        this.context.mathParser.set(cmdName, function () {
            const cmdArgs={};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateVector()
    {
        const instance = this;

        const cmdName = "createVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector within the scene.  startPosition and endPosition should be arrays of length 3.  For example [0,1,0].",
            "exampleUsage": cmdName + "(vectorName, [startPosition], [endPosition])",
            "function": (context, cmdArgs) =>
            {
                const originX = cmdArgs["originX"];
                const originY = cmdArgs["originY"];
                const originZ = cmdArgs["originZ"];
                const endX = cmdArgs["endX"];
                const endY = cmdArgs["endY"];
                const endZ = cmdArgs["endZ"];
                const name = cmdArgs["name"];
                const color = cmdArgs["color"];
                const renderMode = cmdArgs["renderMode"];
                const renderText = cmdArgs["renderText"];
                const textToRender = cmdArgs["textToRender"];
                const visible = cmdArgs["visible"];
                const scaleVector = cmdArgs["scaleVector"];

                let vectorObject = context.vectorListManager.get(name);
                if(vectorObject != null) {
                    alert("A vector with the name \"" + name + "\" already exists.  Please use a new name.");
                    return;
                }

                context.vectorListManager.create2(
                    name,
                    color,
                    new THREE.Vector3(originX, originY, originZ),
                    new THREE.Vector3(endX, endY, endZ),
                    {
                        renderText: renderText,
                        textToRender: textToRender,
                        fontAsset:this.context.assets["fonts"]["defaultFont"],
                        renderMode: renderMode,
                        visible: visible,
                        scaleVector: scaleVector
                    });
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (name, startPosition, endPosition) {

            if(instance.context.vectorListManager.get(name) != null)
                return "Invalid Argument: A vector named \"" + name + "\" already exists within the scene.  Please choose a new name.";

            if(startPosition == null || startPosition._size[0] != 3)
                return "Invalid Argument: startPosition must be an array of size 3."

            if(endPosition == null || endPosition._size[0] != 3)
                return "Invalid Argument: endPosition must be an array of size 3."

            const originX = startPosition._data[0];
            const originY = startPosition._data[1];
            const originZ = startPosition._data[2];
            const endX = endPosition._data[0];
            const endY = endPosition._data[1];
            const endZ = endPosition._data[2];
            const newName = name;
            const color = MathHelpers.getRandomColor();
            const renderMode = "vector";
            const renderText = false;

            const cmdArgs={
                "originX":originX, "originY":originY, "originZ":originZ,
                "endX":endX, "endY":endY, "endZ":endZ,
                "name":newName, "color":color, "renderMode":renderMode, "renderText":renderText
            };
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateVectorAtOrigin()
    {
        const instance = this;

        const cmdName = "createVector2";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector within the scene that starts from the origin [0,0,0].  The input endPosition should be and array of length 3.  For example [0,1,0].",
            "exampleUsage": cmdName + "(vectorName, [endPosition])",
            "function": (context, cmdArgs) =>
            {
                const originX = 0;
                const originY = 0;
                const originZ = 0;
                const endX = cmdArgs["endX"];
                const endY = cmdArgs["endY"];
                const endZ = cmdArgs["endZ"];
                const name = cmdArgs["name"];
                const color = cmdArgs["color"];
                const renderMode = cmdArgs["renderMode"];
                const renderText = cmdArgs["renderText"];

                if(context.vectorListManager.get(name) != null) {
                    alert("A vector with the name \"" + name + "\" already exists.  Please use a new name.");
                    return;
                }

                context.vectorListManager.create2(
                    name,
                    color,
                    new THREE.Vector3(originX, originY, originZ),
                    new THREE.Vector3(endX, endY, endZ),
                    {
                        renderText: renderText,
                        fontAsset:this.context.assets["fonts"]["defaultFont"],
                        renderMode: renderMode
                    });

                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (name, endPosition) {

            if(instance.context.vectorListManager.get(name) != null)
                return "Invalid Argument: A vector named \"" + name + "\" already exists within the scene.  Please choose a new name.";

            if(endPosition == null || endPosition._size[0] != 3)
                return "Invalid Argument: endPosition must be an array of size 3."

            const originX = 0;
            const originY = 0;
            const originZ = 0;
            const endX = endPosition._data[0];
            const endY = endPosition._data[1];
            const endZ = endPosition._data[2];
            const newName = name;
            const color = MathHelpers.getRandomColor();
            const renderMode = "vector";
            const renderText = false;

            const cmdArgs={
                "originX":originX, "originY":originY, "originZ":originZ,
                "endX":endX, "endY":endY, "endZ":endZ,
                "name":newName, "color":color, "renderMode":renderMode, "renderText":renderText
            };
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateVectorFromDirectionAndMagnitude()
    {
        const instance = this;

        const cmdName = "createVector3";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector within the scene that starts from the origin [0,0,0].  The input vector should be and array of length 3 and will be normalized.  For example [0,1,0].  The input magnitude of the vector represents the desired length of the vector.",
            "exampleUsage": cmdName + "(vectorName, [directionVector], magnitude)",
            "function": (context, cmdArgs) =>
            {
                const x = cmdArgs["x"];
                const y = cmdArgs["y"];
                const z = cmdArgs["z"];
                const magnitude = cmdArgs["magnitude"];
                const name = cmdArgs["name"];
                const color = cmdArgs["color"];
                const renderMode = cmdArgs["renderMode"];
                const renderText = cmdArgs["renderText"];

                if(context.vectorListManager.get(name) != null) {
                    alert("A vector with the name \"" + name + "\" already exists.  Please use a new name.");
                    return;
                }

                const directionVector = new THREE.Vector3(x,y,z);

                context.vectorListManager.createFromDirectionAndMagnitude(
                    name,
                    color,
                    directionVector,
                    magnitude,
                    {
                        renderText: renderText,
                        fontAsset:this.context.assets["fonts"]["defaultFont"],
                        renderMode: renderMode
                    });

                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (name, directionVector, magnitude) {

            if(instance.context.vectorListManager.get(name) != null)
                return "Invalid Argument: A vector named \"" + name + "\" already exists within the scene.  Please choose a new name.";

            if(directionVector == null || directionVector._size[0] != 3)
                return "Invalid Argument: directionVector must be an array of size 3."

            const x = directionVector._data[0];
            const y = directionVector._data[1];
            const z = directionVector._data[2];
            const newName = name;
            const color = MathHelpers.getRandomColor();
            const renderMode = "vector";
            const renderText = false;

            const cmdArgs={
                "x":x, "y":y, "z":z, "magnitude": magnitude,
                "name":newName, "color":color, "renderMode":renderMode, "renderText":renderText
            };
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerDuplicateVector()
    {
        const instance = this;

        const cmdName = "duplicateVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Given the name of an existing vector in the scene, duplicate creates a new instance of that vector.",
            "exampleUsage": cmdName + "(vectorName)",
            "function": (context, cmdArgs) =>
            {
                const newName = cmdArgs["name"];
                const vectorToDuplicateName = cmdArgs["vector"];
                const vector = context.vectorListManager.get(vectorToDuplicateName);

                const startPoint = vector.getStartPoint();
                const endPoint = vector.getEndPoint();
                const color = vector.color;
                const renderMode = vector.renderMode;
                const renderText = vector.renderText;
                const textToRender = vector.textToRender;
                const visible = vector.visible;
                const fontAsset = vector.fontAsset;
                const scaleVector = vector.scaleVector;


                const createCmdArgs = {
                    "name":newName,
                    "originX":startPoint.x,
                    "originY":startPoint.y,
                    "originZ":startPoint.z,
                    "endX":endPoint.x,
                    "endY":endPoint.y,
                    "endZ":endPoint.z,
                    "color":color,
                    "renderMode":renderMode,
                    "renderText":renderText,
                    "visible": visible,
                    "textToRender": textToRender,
                    "fontAsset": fontAsset,
                    "scaleVector": scaleVector
                };

                const createVectorCmd = this.cmdMap["createVector"];
                createVectorCmd["function"](context, createCmdArgs);
            }
        }

        this.context.mathParser.set(cmdName, function (newVectorName, vectorToDuplicateName) {
            const cmdArgs={"name":newVectorName, "vector":vectorToDuplicateName};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateRandomVector()
    {
        const instance = this;

        const cmdName = "createRandomVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a random vector.\r\nInput Argument Information:\r\n\"count\" represents how many vectors will be created.\r\n\"maxLength\" is the maximum length of the vectors.\r\n\"normalize\" represents whether or not the vectors should be normalize (i.e. unit length of 1).\r\n\"renderMode\" represents how the vector should be rendered.\r\nThe options are \"vector\", \"waypoint\", \"line\", \"dashedLine\", \"man\", \"dog\", and \"box\".",
            "exampleUsage": cmdName + "(count, maxLength, normalize, renderMode)",
            "function": (context, cmdArgs) =>
            {
                const count = cmdArgs["count"];
                const maxLength = cmdArgs["maxLength"];
                const normalize = cmdArgs["normalize"];
                const renderMode = cmdArgs["renderMode"];

                if(count <= 0)
                    return;

                for(let i = 0; i < count; ++i)
                {
                    const name = "Random Vector" + context.randomVectorCount++;

                    const renderText = false;
                    const originX = 0;
                    const originY = 0;
                    const originZ = 0;

                    // https://mathinsight.org/spherical_coordinates
                    const radius = maxLength * 0.5;
                    const theta = MathHelpers.lerp(0, 2*Math.PI, Math.random());
                    const phi = MathHelpers.lerp(0, 2*Math.PI, Math.random());
                    const distance = Math.sqrt(MathHelpers.lerp(0, radius, Math.random()));

                    let endX = distance * Math.sin(phi) * Math.cos(theta);
                    let endY = distance * Math.sin(phi) * Math.sin(theta);
                    let endZ = distance * Math.cos(phi);

                    const v = new THREE.Vector3(endX, endY, endZ);
                    v.normalize();

                    if(!normalize)
                        v.multiplyScalar(Math.random()*maxLength);

                    endX = v.x;
                    endY = v.y;
                    endZ = v.z;

                    const color = MathHelpers.getRandomColor();

                    context.vectorListManager.create2(
                        name,
                        color,
                        new THREE.Vector3(originX, originY, originZ),
                        new THREE.Vector3(endX, endY, endZ),
                        {
                            renderText: renderText,
                            fontAsset:this.context.assets["fonts"]["defaultFont"],
                            renderMode: renderMode
                        });

                    context.needsFullMenuRefresh = true;
                }
            }
        }

        this.context.mathParser.set(cmdName, function (count, maxLength, normalize, renderMode) {
            const cmdArgs={"count":count, "maxLength":maxLength, "normalize":normalize, "renderMode":renderMode};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerDestroyVector()
    {
        const instance = this;

        const cmdName = "destroyVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Destroys the input vector and removes it from the scene.",
            "exampleUsage": cmdName + "(vectorName)",
            "function": (context, cmdArgs) =>
            {
                if(cmdArgs["vector"] == null)
                    return;

                let vector = context.vectorListManager.get(cmdArgs["vector"]);
                if(vector == null)
                    return;

                // TODO: Remove in safeDestroy
                vector.sceneObj.clear();
                context.scene.remove(vector.sceneObj);
                context.vectorListManager.safeDestroy(vector.name);

                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (vectorName) {
            const cmdArgs={"vector":vectorName};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerShowVector()
    {
        const instance = this;

        const cmdName = "showVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Controls whether or not a vector is visible in the scene.",
            "exampleUsage": cmdName + "(visible)",
            "function": (context, cmdArgs) =>
            {
                if(cmdArgs["vector"] == null)
                    return;

                const visible = cmdArgs["visible"]

                let vector = context.vectorListManager.get(cmdArgs["vector"]);
                if(vector == null)
                    return;

                vector.show(visible)
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (vectorName, visible) {
            const cmdArgs={"vector":vectorName, "visible":visible};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerShowMatrix()
    {
        const instance = this;

        const cmdName = "showMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Controls whether or not a matrix is visible in the scene.",
            "exampleUsage": cmdName + "(visible)",
            "function": (context, cmdArgs) =>
            {
                if(cmdArgs["matrix"] == null)
                    return;

                const visible = cmdArgs["visible"]

                let matrix = context.matrixListManager.get(cmdArgs["matrix"]);
                if(matrix == null)
                    return;

                matrix.show(visible)
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (matrixName, visible) {
            const cmdArgs={"matrix":matrixName, "visible":visible};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateMatrix()
    {
        const instance = this;

        const cmdName = "createMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new 4x4 matrix within the scene.  The input matrix should be an array of 4 vectors.",
            "exampleUsage": cmdName + "(matrixName, [matrix])",
            "function": (context, cmdArgs) =>
            {
                const name = cmdArgs["name"];
                const matrix = cmdArgs["matrix"];

                let matrixObject = context.matrixListManager.get(name);
                if(matrixObject != null) {
                    alert("A matrix with the name \"" + name + "\" already exists.  Please use a new name.");
                    return;
                }

                const matrixCopy = new THREE.Matrix4();
                matrixCopy.copy(matrix);

                context.matrixListManager.create1(
                    name,
                    matrixCopy);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (name, inputMatrix) {

            if(instance.context.matrixListManager.get(name) != null)
                return "Invalid Argument: A matrix named \"" + name + "\" already exists within the scene.  Please choose a new name.";

            const matrix = new THREE.Matrix4();
            matrix.set(
                inputMatrix._data[0][0], inputMatrix._data[0][1], inputMatrix._data[0][2], inputMatrix._data[0][3],
                inputMatrix._data[1][0], inputMatrix._data[1][1], inputMatrix._data[1][2], inputMatrix._data[1][3],
                inputMatrix._data[2][0], inputMatrix._data[2][1], inputMatrix._data[2][2], inputMatrix._data[2][3],
                inputMatrix._data[3][0], inputMatrix._data[3][1], inputMatrix._data[3][2], inputMatrix._data[3][3],
                );

            const cmdArgs={"name":name, "matrix":matrix};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateIdentityMatrix()
    {
        const instance = this;

        const cmdName = "createIdentityMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new 4x4 identity matrix within the scene.",
            "exampleUsage": cmdName + "(matrixName)",
            "function": (context, cmdArgs) =>
            {
                const name = cmdArgs["name"];

                let matrixObject = context.matrixListManager.get(name);
                if(matrixObject != null) {
                    alert("A matrix with the name \"" + name + "\" already exists.  Please use a new name.");
                    return;
                }

                const matrix = new THREE.Matrix4();
                matrix.set(
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                );

                context.matrixListManager.create1(
                    name,
                    matrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (name) {

            if(instance.context.matrixListManager.get(name) != null)
                return "Invalid Argument: A matrix named \"" + name + "\" already exists within the scene.  Please choose a new name.";

            const cmdArgs={"name":name};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateLeftRotationMatrix()
    {
        const instance = this;

        const cmdName = "createLeftRotationMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix within the scene representing a rotation about the Left Axis.  The input angle should be in radians.",
            "exampleUsage": cmdName + "(matrixName, angleIsInDegrees, angle)",
            "function": (context, cmdArgs) =>
            {
                const name = cmdArgs["name"];
                let angleIsInDegrees = cmdArgs["angleIsInDegrees"];
                let angle = cmdArgs["angle"];

                if(angleIsInDegrees)
                    angle = angle * (Math.PI/180.0);

                let matrixObject = context.matrixListManager.get(name);
                if(matrixObject != null) {
                    context.matrixListManager.safeDestroy(name);
                }

                const matrix = MathHelpers.createXRotationMatrix(angle);

                context.matrixListManager.create1(
                    name,
                    matrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (name, angleIsInDegrees, angle) {
            const cmdArgs={"name":name, "angleIsInDegrees": angleIsInDegrees, "angle": angle};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateUpRotationMatrix()
    {
        const instance = this;

        const cmdName = "createUpRotationMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix within the scene representing a rotation about the Up Axis.  The input angle should be in radians.",
            "exampleUsage": cmdName + "(matrixName, angleIsInDegrees, angle)",
            "function": (context, cmdArgs) =>
            {
                const name = cmdArgs["name"];
                let angleIsInDegrees = cmdArgs["angleIsInDegrees"];
                let angle = cmdArgs["angle"];

                if(angleIsInDegrees)
                    angle = angle * (Math.PI/180.0);

                let matrixObject = context.matrixListManager.get(name);
                if(matrixObject != null) {
                    context.matrixListManager.safeDestroy(name);
                }

                const matrix = MathHelpers.createYRotationMatrix(angle);

                context.matrixListManager.create1(
                    name,
                    matrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (name, angleIsInDegrees, angle) {
            const cmdArgs={"name":name, "angleIsInDegrees": angleIsInDegrees, "angle": angle};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateForwardRotationMatrix()
    {
        const instance = this;

        const cmdName = "createForwardRotationMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix within the scene representing a rotation about the Forward Axis.  The input angle should be in radians.",
            "exampleUsage": cmdName + "(matrixName, angleIsInDegrees, angle)",
            "function": (context, cmdArgs) =>
            {
                const name = cmdArgs["name"];
                let angleIsInDegrees = cmdArgs["angleIsInDegrees"];
                let angle = cmdArgs["angle"];

                if(angleIsInDegrees)
                    angle = angle * (Math.PI/180.0);

                let matrixObject = context.matrixListManager.get(name);
                if(matrixObject != null) {
                    context.matrixListManager.safeDestroy(name);
                }

                const matrix = MathHelpers.createZRotationMatrix(angle);

                context.matrixListManager.create1(
                    name,
                    matrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (name, angleIsInDegrees, angle) {
            const cmdArgs={"name":name, "angleIsInDegrees": angleIsInDegrees, "angle": angle};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateScaleMatrix()
    {
        const instance = this;

        const cmdName = "createScaleMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix within the scene representing a scaled identity matrix.",
            "exampleUsage": cmdName + "(matrixName, [scaleX, scaleY, scaleZ]])",
            "function": (context, cmdArgs) =>
            {
                const name = cmdArgs["name"];
                const scaleVector = cmdArgs["scaleVector"];

                const matrix = MathHelpers.createScaleMatrix(scaleVector._data[0], scaleVector._data[1], scaleVector._data[2]);

                context.matrixListManager.create1(
                    name,
                    matrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (name, scaleVector) {
            const cmdArgs={"name":name, "scaleVector": scaleVector};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateTranslationMatrix()
    {
        const instance = this;

        const cmdName = "createTranslationMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix within the scene representing a translation from the origin.",
            "exampleUsage": cmdName + "(matrixName, [x, y, z]])",
            "function": (context, cmdArgs) =>
            {
                const name = cmdArgs["name"];
                const translationVector = cmdArgs["translationVector"];

                const matrix = MathHelpers.createTranslationMatrix(translationVector._data[0], translationVector._data[1], translationVector._data[2]);

                context.matrixListManager.create1(
                    name,
                    matrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (name, translationVector) {
            const cmdArgs={"name":name, "translationVector": translationVector};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerDestroyMatrix()
    {
        const instance = this;

        const cmdName = "destroyMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Destroys the input matrix and removes it from the scene.",
            "exampleUsage": cmdName + "(matrixName)",
            "function": (context, cmdArgs) =>
            {
                if(cmdArgs["matrix"] == null)
                    return;

                let matrix = context.matrixListManager.get(cmdArgs["matrix"]);
                if(matrix == null)
                    return;

                // TODO: Remove in safeDestroy
                context.matrixListManager.safeDestroy(matrix.name);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (matrixName) {
            const cmdArgs={"matrix":matrixName};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerClearScene()
    {
        const instance = this;

        const cmdName = "clearScene";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Destroys all vectors in the scene.  Does not reset command history.",
            "exampleUsage": cmdName + "()",
            "function": (context, cmdArgs) =>
            {
                for(let vectorName in context.vectorListManager.getList()) {
                    const vector = context.vectorListManager.get(vectorName);
                    context.vectorListManager.safeDestroy(vectorName);
                }

                for(let matrixName in context.matrixListManager.getList()) {
                    const matrix = context.matrixListManager.get(matrixName);
                    context.matrixListManager.safeDestroy(matrixName);
                }

                context.vectorOperationCount = 0;
                context.matrixOperationCount = 0;
                context.randomVectorCount = 0;
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function () {
            const cmdArgs={};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerResetScene()
    {
        const instance = this;

        const cmdName = "resetScene";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Restores the scene to its default layout.  The input argument \"resetCommandHistory\" is a boolean that determines whether or not the command history should be cleared.",
            "exampleUsage": cmdName + "(resetCommandHistory)",
            "function": (context, cmdArgs) =>
            {
                const clearSceneCmd = this.cmdMap["clearScene"];
                clearSceneCmd["function"](context, {});

                const resetCommandHistory = cmdArgs["resetCommandHistory"];
                if(resetCommandHistory)
                    context.cmdProcessor.clearCommandHistory();

                context.vectorListManager.create2("left", 0xff0000, new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0),{renderMode:"vector", renderText: true, fontAsset:context.assets["fonts"]["defaultFont"]});
                context.vectorListManager.create2("up", 0x00ff00, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0),{renderMode:"vector", renderText: true, fontAsset:context.assets["fonts"]["defaultFont"]});
                context.vectorListManager.create2("forward", 0x0000AA, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,1),{renderMode:"vector", renderText: true, fontAsset:context.assets["fonts"]["defaultFont"]});
                context.vectorListManager.create2("origin", 0x333333, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0),{renderMode:"waypoint", renderText: true, fontAsset:context.assets["fonts"]["defaultFont"]});

                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (resetCommandHistory) {
            const cmdArgs={"resetCommandHistory":resetCommandHistory};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCreateMatrixFromForwardVector()
    {
        const instance = this;

        const cmdName = "createMatrixFromForwardVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix within the scene whose up and left vectors are orthogonal to the input forward vector.",
            "exampleUsage": cmdName + "(matrixName, vectorName)",
            "function": (context, cmdArgs) =>
            {
                const name = cmdArgs["name"];
                let forwardVectorRenderObject = context.vectorListManager.get(cmdArgs["vector"]);

                let matrixObject = context.matrixListManager.get(name);
                if(matrixObject != null) {
                    context.matrixListManager.safeDestroy(name);
                }

                const matrix = MathHelpers.createAxisFromVector(forwardVectorRenderObject.getEndPoint(), forwardVectorRenderObject.getStartPoint());

                context.matrixListManager.create1(
                    name,
                    matrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (name, vectorName) {
            const cmdArgs={"name":name, "vector": vectorName};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }
}