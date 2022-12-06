import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import Arrow from './vectorRenderObject.js'
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import MathHelpers from './mathHelpers'

export default class VectorOperationCommandProcessor {

    constructor(cmdMap, context)
    {
        this.cmdMap = cmdMap;
        this.context = context;

        this.registerCommands();
    }


    registerCommands()
    {
        this.registerNormalizeVector();
        this.registerAddVectors();
        this.registerSubtractVectors();
        this.registerScaleVector();
        this.registerCrossVectors();
        this.registerProjectVector();
        this.registerReflectVector();
        this.registerNegateVector();
        this.registerTranslateVector();
        this.registerTranslateVectorToPoint();
        this.registerMoveVector();
        this.registerLinearInterpolationBetweenVectorsVector();
        this.registerCreateAxisFromVector();
        this.registerMultiplyVectorByMatrix();
        this.registerDistanceBetweenVectors();
        this.registerAngleBetweenVectors();
    }

    registerNormalizeVector()
    {
        const instance = this;

        const cmdName = "normalizeVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Forces the input vector's length to be 1 uniit in length.",
            "exampleUsage": cmdName + "(\"vectorName\")",
            "function": (context, cmdArgs) =>
            {
                const vector = context.vectorListManager.get(cmdArgs["vector"]);
                vector.normalize();
            }
        }

        this.context.mathParser.set(cmdName, function (a) {
            const cmdArgs={"vector":a};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerAddVectors()
    {
        const instance = this;

        const cmdName = "addVectors";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector which represents the sum of the two input vectors.",
            "exampleUsage": cmdName + "(\"vectorNameA\", \"vectorNameB\")",
            "function": (context, cmdArgs) =>
            {
                const vectorA = context.vectorListManager.get(cmdArgs["vectorA"]);
                const vectorB = context.vectorListManager.get(cmdArgs["vectorB"]);

                const resultStartPoint = new THREE.Vector3(vectorA.startPoint.x, vectorA.startPoint.y, vectorA.startPoint.z);
                const resultEndPoint = new THREE.Vector3(vectorA.endPoint.x, vectorA.endPoint.y, vectorA.endPoint.z);

                resultStartPoint.add(vectorB.startPoint);
                resultEndPoint.add(vectorB.endPoint);

                const opts = {
                    "renderMode":vectorA.renderMode,
                    "scaleVector":vectorA.scaleVector,
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, resultStartPoint, resultEndPoint, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b) {
            const cmdArgs={"vectorA":a, "vectorB":b};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerSubtractVectors()
    {
        const instance = this;

        const cmdName = "subtractVectors";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector which represents the difference of the two input vectors.",
            "exampleUsage": cmdName + "(\"vectorNameA\", \"vectorNameB\")",
            "function": (context, cmdArgs) =>
            {
                const vectorA = context.vectorListManager.get(cmdArgs["vectorA"]);
                const vectorB = context.vectorListManager.get(cmdArgs["vectorB"]);

                const resultStartPoint = new THREE.Vector3(vectorA.startPoint.x, vectorA.startPoint.y, vectorA.startPoint.z);
                const resultEndPoint = new THREE.Vector3(vectorA.endPoint.x, vectorA.endPoint.y, vectorA.endPoint.z);

                resultStartPoint.sub(vectorB.startPoint);
                resultEndPoint.sub(vectorB.endPoint);

                const opts = {
                    "renderMode":vectorA.renderMode,
                    "scaleVector":vectorA.scaleVector,
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, resultStartPoint, resultEndPoint, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b) {
            const cmdArgs={"vectorA":a, "vectorB":b};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerScaleVector()
    {
        const instance = this;

        const cmdName = "scaleVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector which represents the input vector scaled by the scaleFactor.",
            "exampleUsage": cmdName + "(\"vectorName\", scaleFactor)",
            "function": (context, cmdArgs) =>
            {
                const vector = context.vectorListManager.get(cmdArgs["vector"]);
                const scalar = cmdArgs["scalar"];

                const resultStartPoint = new THREE.Vector3(vector.startPoint.x, vector.startPoint.y, vector.startPoint.z);

                const originalMagnitude = vector.computeMagnitude();
                const newScale = originalMagnitude * scalar;
                const normal = vector.computeNormal();

                const resultEndPoint = new THREE.Vector3(normal.x, normal.y, normal.z);
                resultEndPoint.x *= newScale;
                resultEndPoint.y *= newScale;
                resultEndPoint.z *= newScale;

                resultEndPoint.add(resultStartPoint);

                const opts = {
                    "renderMode":vector.renderMode,
                    "scaleVector":vector.scaleVector,
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, resultStartPoint, resultEndPoint, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b) {
            const cmdArgs={"vector":a, "scalar":b};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCrossVectors()
    {
        const instance = this;

        const cmdName = "crossProduct";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector which represents the cross product of the two input vectors.",
            "exampleUsage": cmdName + "(\"vectorNameA\", \"vectorNameB\")",
            "function": (context, cmdArgs) =>
            {
                const vectorA = context.vectorListManager.get(cmdArgs["vectorA"]);
                const vectorB = context.vectorListManager.get(cmdArgs["vectorB"]);

                const vecTempA = vectorA.computeNormal();
                const magnitudeA = vectorA.computeMagnitude();
                vecTempA.x *= magnitudeA;
                vecTempA.y *= magnitudeA;
                vecTempA.z *= magnitudeA;

                const vecTempB = vectorB.computeNormal();
                const magnitudeB = vectorB.computeMagnitude();
                vecTempB.x *= magnitudeB;
                vecTempB.y *= magnitudeB;
                vecTempB.z *= magnitudeB;

                vecTempA.cross(vecTempB);

                const opts = {
                    "renderMode":vectorA.renderMode,
                    "scaleVector":vectorA.scaleVector,
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, new THREE.Vector3(0,0,0), vecTempA, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b) {
            const cmdArgs={"vectorA":a, "vectorB":b};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerProjectVector()
    {
        const instance = this;

        const cmdName = "projectVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector which represents the projection of the first input vector onto the second input vector.",
            "exampleUsage": cmdName + "(\"vectorNameA\", \"vectorNameB\")",
            "function": (context, cmdArgs) =>
            {
                const vectorA = context.vectorListManager.get(cmdArgs["vectorA"]);
                const vectorB = context.vectorListManager.get(cmdArgs["vectorB"]);

                const vecTempA = vectorA.computeNormal();
                const magnitudeA = vectorA.computeMagnitude();
                vecTempA.x *= magnitudeA;
                vecTempA.y *= magnitudeA;
                vecTempA.z *= magnitudeA;

                const vecTempB = vectorB.computeNormal();
                const magnitudeB = vectorB.computeMagnitude();
                vecTempB.x *= magnitudeB;
                vecTempB.y *= magnitudeB;
                vecTempB.z *= magnitudeB;

                vecTempA.projectOnVector(vecTempB);

                const opts = {
                    "renderMode":vectorA.renderMode,
                    "scaleVector":vectorA.scaleVector,
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, new THREE.Vector3(0,0,0), vecTempA, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b) {
            const cmdArgs={"vectorA":a, "vectorB":b};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerReflectVector()
    {
        const instance = this;

        const cmdName = "reflectVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector which represents the first input vector being reflected along the second input vector.",
            "exampleUsage": cmdName + "(\"vectorNameA\", \"vectorNameB\")",
            "function": (context, cmdArgs) =>
            {
                const vector = context.vectorListManager.get(cmdArgs["vector"]);
                const normalVector = context.vectorListManager.get(cmdArgs["normal"]);

                const vecTemp = vector.computeNormal();
                const magnitude = vector.computeMagnitude();
                vecTemp.x *= magnitude;
                vecTemp.y *= magnitude;
                vecTemp.z *= magnitude;

                const normal = normalVector.computeNormal();
                vecTemp.reflect(normal);

                const opts = {
                    "renderMode":vector.renderMode,
                    "scaleVector":vector.scaleVector,
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, vector.getStartPoint(), vecTemp, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (vector, normal) {
            const cmdArgs={"vector":vector, "normal":normal};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerNegateVector()
    {
        const instance = this;

        const cmdName = "negateVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector which represents the negation of the input vector.",
            "exampleUsage": cmdName + "(vectorName)",
            "function": (context, cmdArgs) =>
            {
                const vector = context.vectorListManager.get(cmdArgs["vector"]);

                const vecTemp = vector.computeNormal();
                const magnitude = vector.computeMagnitude();
                vecTemp.x *= -magnitude;
                vecTemp.y *= -magnitude;
                vecTemp.z *= -magnitude;

                const opts = {
                    "renderMode":vector.renderMode,
                    "scaleVector":vector.scaleVector,
                }

                const name = "Result" + this.context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, vector.getStartPoint(), vecTemp, opts);
                this.context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a) {
            const cmdArgs={"vector":a};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerTranslateVector()
    {
        const instance = this;

        const cmdName = "translateVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector which represents the translation of the input vector to the input (x,y,z) position.",
            "exampleUsage": cmdName + "(vectorName, x, y, z)",
            "function": (context, cmdArgs) =>
            {
                const vector = context.vectorListManager.get(cmdArgs["vector"]);
                const startX = cmdArgs["startX"];
                const startY = cmdArgs["startY"];
                const startZ = cmdArgs["startZ"];

                const resultStartPoint = new THREE.Vector3(startX, startY, startZ);

                const originalMagnitude = vector.computeMagnitude();
                const normal = vector.computeNormal();

                const resultEndPoint = new THREE.Vector3(normal.x, normal.y, normal.z);
                resultEndPoint.x *= originalMagnitude;
                resultEndPoint.y *= originalMagnitude;
                resultEndPoint.z *= originalMagnitude;

                resultEndPoint.add(resultStartPoint);

                const opts = {
                    "renderMode":vector.renderMode,
                    "scaleVector":vector.scaleVector,
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, resultStartPoint, resultEndPoint, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,x,y,z) {
            const cmdArgs={"vector":a, "startX":x, "starty":y, "startZ":z};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerTranslateVectorToPoint()
    {
        const instance = this;

        const cmdName = "translateVectorToPoint";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector which represents the translation from input vectorNameFrom to input vectorNameFrom.",
            "exampleUsage": cmdName + "(vectorName, vectorName)",
            "function": (context, cmdArgs) =>
            {
                const from = context.vectorListManager.get(cmdArgs["from"]);
                const to = context.vectorListManager.get(cmdArgs["to"]);

                const resultStartPoint = MathHelpers.lerpVectors(from.getStartPoint(), to.getStartPoint(), 1.0);

                const lookDir = from.getEndPoint();
                lookDir.sub(from.getStartPoint());

                const resultEndPoint = to.getStartPoint();
                resultEndPoint.add(lookDir);

                const opts = {
                    "renderMode":from.renderMode,
                    "scaleVector":from.scaleVector,
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, resultStartPoint, resultEndPoint, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b) {
            const cmdArgs={"from":a, "to":b};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerMoveVector(cmdMap)
    {
        const instance = this;

        const cmdName = "moveVector";
        const cmdArgs = [
            {"type": "Arrow", "name": "vector", "value": null},
            {"type": "float", "name": "units", "value": 0.0}
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector which represents the translation along the input vector by the number of input units.",
            "exampleUsage": cmdName + "(vectorName, amountToMoveInUnits)",
            "function": (context, cmdArgs) =>
            {
                const vector = context.vectorListManager.get(cmdArgs["vector"]);
                const units = cmdArgs["units"];

                const start = vector.getStartPoint();
                const end = vector.getEndPoint();

                const resultStartPoint = MathHelpers.lerpVectors(start, end, units);
                const resultEndPoint = MathHelpers.lerpVectors(start, end, units+1.0);

                const opts = {
                    "renderMode":vector.renderMode,
                    "scaleVector":vector.scaleVector,
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, resultStartPoint, resultEndPoint, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b) {
            const cmdArgs={"vector":a, "units":b};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerLinearInterpolationBetweenVectorsVector()
    {
        const instance = this;

        const cmdName = "lerpVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector which represents the linear interpolation between the two input vectors.  Generally the input t value will range between 0 and 1.",
            "exampleUsage": cmdName + "(vectorName, vectorName, t)",
            "function": (context, cmdArgs) =>
            {
                const vectorA = context.vectorListManager.get(cmdArgs["vectorA"]);
                const vectorB = context.vectorListManager.get(cmdArgs["vectorB"]);
                const t = cmdArgs["t"];

                let newStartPoint = MathHelpers.lerpVectors(vectorA.getStartPoint(), vectorB.getStartPoint(), t);
                let newEndPoint = MathHelpers.lerpVectors(vectorA.getEndPoint(), vectorB.getEndPoint(), t);

                const opts = {
                    "renderMode":vectorA.renderMode,
                    "scaleVector":vectorA.scaleVector,
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, newStartPoint, newEndPoint, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b,t) {
            const cmdArgs={"vectorA":a, "vectorB":b, "t":t};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    // The new axis is relative to the given forward vector
    registerCreateAxisFromVector()
    {
        const instance = this;

        const cmdName = "createAxisFromVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a two new vectors relative to the input forward vector that represent a new orthonormal axis.",
            "exampleUsage": cmdName + "(vectorName)",
            "function": (context, cmdArgs) =>
            {
                const forwardVectorRenderObject = context.vectorListManager.get(cmdArgs["vector"]);
                const matrix = MathHelpers.createAxisFromVector(forwardVectorRenderObject.getEndPoint());

                const resultStartPosition = forwardVectorRenderObject.getStartPoint();
                const forward = forwardVectorRenderObject.getEndPoint();
                const left = new THREE.Vector3();
                const up = new THREE.Vector3();
                matrix.extractBasis(left, up, forward);

                const opts = {
                    "renderMode":forwardVectorRenderObject.renderMode,
                }

                const leftName = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(leftName, null, resultStartPosition, left, opts);

                const upName = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(upName, null, resultStartPosition, up, opts);

                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a) {
            const cmdArgs={"vector":a};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerMultiplyVectorByMatrix(cmdMap)
    {
        const instance = this;

        const cmdName = "multiplyVectorByMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new vector that is the result of multiplying and input vector by an input matrix.",
            "exampleUsage": cmdName + "(vectorName, matrixName)",
            "function": (context, cmdArgs) =>
            {
                const vectorRenderObj = context.vectorListManager.get(cmdArgs["vector"]);
                const matrixRenderObj = context.matrixListManager.get(cmdArgs["matrix"]);

                const renderMode = vectorRenderObj.renderMode;

                const startVector = vectorRenderObj.getStartPoint();
                const endVector = vectorRenderObj.getEndPoint();

                startVector.applyMatrix4(matrixRenderObj.matrix);
                endVector.applyMatrix4(matrixRenderObj.matrix);

                // Extract the scale from the matrix.
                const xAxis = new THREE.Vector3();
                const yAxis = new THREE.Vector3();
                const zAxis = new THREE.Vector3();
                matrixRenderObj.matrix.extractBasis(xAxis, yAxis, zAxis);
                const xScale = xAxis.length();
                const yScale = yAxis.length();
                const zScale = zAxis.length();

                const opts = {
                    "renderMode":renderMode,
                    "scaleVector": new THREE.Vector3(xScale, yScale, zScale)
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, startVector, endVector, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (vectorName, matrixName) {
            const cmdArgs={"vector": vectorName, "matrix": matrixName};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerDistanceBetweenVectors()
    {
        const instance = this;

        const cmdName = "distanceBetweenVectors";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a vector that represents and displays the distance between the two input vectors.",
            "exampleUsage": cmdName + "(vectorName, vectorName)",
            "function": (context, cmdArgs) =>
            {
                const vectorA = context.vectorListManager.get(cmdArgs["vectorA"]);
                const vectorB = context.vectorListManager.get(cmdArgs["vectorB"]);

                let vecA = vectorA.getEndPoint();
                if(vectorA.isModel())
                    vecA = vectorA.getStartPoint();

                let vecB = vectorB.getEndPoint();
                if(vectorB.isModel())
                    vecB = vectorB.getStartPoint();

                const vecDistance = new THREE.Vector3();
                vecDistance.subVectors(vecA, vecB);
                const distanceBetweenVectors = vecDistance.length();
                const displayText = "distance = " + distanceBetweenVectors.toFixed(2).toString();


                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, vecA, vecB,
                    {
                        fontAsset:context.assets["fonts"]["defaultFont"],
                        renderMode: "dashedLine",
                        renderText: true,
                        textToRender: displayText
                    });
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b,t) {
            const cmdArgs={"vectorA":a, "vectorB":b, "t":t};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerAngleBetweenVectors()
    {
        const instance = this;

        const cmdName = "angleBetweenVectors";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates an object in the scene that represents the angle between the two input vectors.",
            "exampleUsage": cmdName + "(vectorName, vectorName)",
            "function": (context, cmdArgs) =>
            {
                const vectorA = context.vectorListManager.get(cmdArgs["vectorA"]);
                const vectorB = context.vectorListManager.get(cmdArgs["vectorB"]);
                const displayAngleInDegrees = cmdArgs["angleInDegrees"];

                //let v = new THREE.Vector3();
                //v.multiplyScalar()

                let startA = vectorA.getStartPoint();
                let normA = vectorA.computeNormal();
                normA.multiplyScalar(0.3);
                let posA = startA.add(normA);

                let startB = vectorB.getStartPoint();
                let normB = vectorB.computeNormal();
                normB.multiplyScalar(0.3);
                let posB = startB.add(normB);

                const angleInRadians = MathHelpers.computeAngleBetweenVectors(vectorA.computeNormal(), vectorB.computeNormal());
                let angle = angleInRadians;
                let unitText = "rad";
                if(displayAngleInDegrees == true) {
                    angle = MathHelpers.radiansToDegrees(angle);
                    unitText = "deg";
                }

                const displayText = "angle = " + angle.toFixed(2).toString() + " " + unitText;

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, null, posA, posB,
                    {
                        fontAsset:context.assets["fonts"]["defaultFont"],
                        renderMode: "angle",
                        renderText: true,
                        textToRender: displayText,
                        basisVectorA: vectorA,
                        basisVectorB: vectorB
                    });
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b,t) {
            const cmdArgs={"vectorA":a, "vectorB":b, "t":t};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }
}