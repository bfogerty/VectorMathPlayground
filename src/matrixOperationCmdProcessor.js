import {Vector3} from "three";
import {Matrix4} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import VectorRenderObject from './vectorRenderObject.js'
import MatrixRenderObject from "./matrixRenderObject";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import MathHelpers from './mathHelpers'

export default class MatrixOperationCommandProcessor {

    constructor(cmdMap, context)
    {
        this.cmdMap = cmdMap;
        this.context = context;

        this.registerCommands();
    }


    registerCommands()
    {
        this.registerMultiplyMatrices();
        this.registerRotateMatrixAboutLeftAxis();
        this.registerRotateMatrixAboutUpAxis();
        this.registerRotateMatrixAboutForwardAxis();
        this.registerTranslateMatrix();
        this.registerScaleMatrix();
        this.registerInvertMatrix();
        this.registerTransposeMatrix();
        this.registerExtractPositionVectorFromMatrix();
        this.registerExtractVectorsFromMatrix();
    }

    registerMultiplyMatrices()
    {
        const instance = this;

        const cmdName = "multiplyMatrices";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix which represents the product of the two input matrices.",
            "exampleUsage": cmdName + "(\"matrixNameA\", \"matrixNameB\")",
            "function": (context, cmdArgs) =>
            {
                const matrixA = context.matrixListManager.get(cmdArgs["matrixA"]);
                const matrixB = context.matrixListManager.get(cmdArgs["matrixB"]);

                let resultMatrix = matrixA.matrix.clone();
                resultMatrix.multiply(matrixB.matrix);

                const name = "Result" + context.vectorOperationCount++;
                context.matrixListManager.create1(name, resultMatrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b) {
            const cmdArgs={"matrixA":a, "matrixB":b};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerRotateMatrixAboutLeftAxis()
    {
        const instance = this;

        const cmdName = "rotateMatrixAboutLeftAxis";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix which represents the rotation of the input matrix about the Left axis by some angle.",
            "exampleUsage": cmdName + "(\"matrix\", \"angleIsInDegrees\", \"angle\")",
            "function": (context, cmdArgs) =>
            {
                const inputMatrixRenderObject = context.matrixListManager.get(cmdArgs["matrix"]);
                const angleIsInDegrees = cmdArgs["angleIsInDegrees"];
                const angle = cmdArgs["angle"];

                const resultMatrix = inputMatrixRenderObject.matrix.clone();

                let angleInRadians = angle;
                if(angleIsInDegrees)
                    angleInRadians = MathHelpers.degreesToRadians(angle);

                const rotationMatrix = MathHelpers.createXRotationMatrix(angleInRadians)
                resultMatrix.multiply(rotationMatrix);

                const name = "Result" + context.vectorOperationCount++;
                context.matrixListManager.create1(name, resultMatrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (matrix, angleIsInDegrees, angle) {
            const cmdArgs={"matrix":matrix, "angleIsInDegrees":angleIsInDegrees, "angle":angle};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerRotateMatrixAboutUpAxis()
    {
        const instance = this;

        const cmdName = "rotateMatrixAboutUpAxis";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix which represents the rotation of the input matrix about the Up axis by some angle.",
            "exampleUsage": cmdName + "(\"matrix\", \"angleIsInDegrees\", \"angle\")",
            "function": (context, cmdArgs) =>
            {
                const inputMatrixRenderObject = context.matrixListManager.get(cmdArgs["matrix"]);
                const angleIsInDegrees = cmdArgs["angleIsInDegrees"];
                const angle = cmdArgs["angle"];

                const resultMatrix = inputMatrixRenderObject.matrix.clone();

                let angleInRadians = angle;
                if(angleIsInDegrees)
                    angleInRadians = MathHelpers.degreesToRadians(angle);

                const rotationMatrix = MathHelpers.createYRotationMatrix(angleInRadians)
                resultMatrix.multiply(rotationMatrix);

                const name = "Result" + context.vectorOperationCount++;
                context.matrixListManager.create1(name, resultMatrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (matrix, angleIsInDegrees, angle) {
            const cmdArgs={"matrix":matrix, "angleIsInDegrees":angleIsInDegrees, "angle":angle};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerRotateMatrixAboutForwardAxis()
    {
        const instance = this;

        const cmdName = "rotateMatrixAboutForwardAxis";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix which represents the rotation of the input matrix about the Forward axis by some angle.",
            "exampleUsage": cmdName + "(\"matrix\", \"angleIsInDegrees\", \"angle\")",
            "function": (context, cmdArgs) =>
            {
                const inputMatrixRenderObject = context.matrixListManager.get(cmdArgs["matrix"]);
                const angleIsInDegrees = cmdArgs["angleIsInDegrees"];
                const angle = cmdArgs["angle"];

                const resultMatrix = inputMatrixRenderObject.matrix.clone();

                let angleInRadians = angle;
                if(angleIsInDegrees)
                    angleInRadians = MathHelpers.degreesToRadians(angle);

                const rotationMatrix = MathHelpers.createZRotationMatrix(angleInRadians)
                resultMatrix.multiply(rotationMatrix);

                const name = "Result" + context.vectorOperationCount++;
                context.matrixListManager.create1(name, resultMatrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (matrix, angleIsInDegrees, angle) {
            const cmdArgs={"matrix":matrix, "angleIsInDegrees":angleIsInDegrees, "angle":angle};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerTranslateMatrix()
    {
        const instance = this;

        const cmdName = "translateMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix which represents the translation of the input matrix by some input 3d vector.",
            "exampleUsage": cmdName + "(\"matrix\", [x,y,z])",
            "function": (context, cmdArgs) =>
            {
                const inputMatrixRenderObject = context.matrixListManager.get(cmdArgs["matrix"]);
                const displacementVector = cmdArgs["displacementVector"];

                const resultMatrix = inputMatrixRenderObject.matrix.clone();

                const rotationMatrix = MathHelpers.createTranslationMatrix(displacementVector[0], displacementVector[1], displacementVector[2])
                resultMatrix.multiply(rotationMatrix);

                const name = "Result" + context.vectorOperationCount++;
                context.matrixListManager.create1(name, resultMatrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (matrix, displacementVector) {
            const cmdArgs={"matrix":matrix, "displacementVector":displacementVector._data};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerScaleMatrix()
    {
        const instance = this;

        const cmdName = "scaleMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix which represents the scaling of the input matrix by some input 3d vector.",
            "exampleUsage": cmdName + "(\"matrix\", [x,y,z])",
            "function": (context, cmdArgs) =>
            {
                const inputMatrixRenderObject = context.matrixListManager.get(cmdArgs["matrix"]);
                const scaleVector = cmdArgs["scaleVector"];

                const resultMatrix = inputMatrixRenderObject.matrix.clone();

                const rotationMatrix = MathHelpers.createScaleMatrix(scaleVector[0], scaleVector[1], scaleVector[2])
                resultMatrix.multiply(rotationMatrix);

                const name = "Result" + context.vectorOperationCount++;
                context.matrixListManager.create1(name, resultMatrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (matrix, scaleVector) {
            const cmdArgs={"matrix":matrix, "scaleVector":scaleVector._data};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerInvertMatrix()
    {
        const instance = this;

        const cmdName = "invertMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix which represents the inverse of the input matrix.",
            "exampleUsage": cmdName + "(\"matrix\")",
            "function": (context, cmdArgs) =>
            {
                const inputMatrixRenderObject = context.matrixListManager.get(cmdArgs["matrix"]);

                const resultMatrix = inputMatrixRenderObject.matrix.clone();
                resultMatrix.invert();

                const name = "Result" + context.vectorOperationCount++;
                context.matrixListManager.create1(name, resultMatrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (matrix) {
            const cmdArgs={"matrix":matrix};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerTransposeMatrix()
    {
        const instance = this;

        const cmdName = "transposeMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a new matrix which represents the transpose of the input matrix.",
            "exampleUsage": cmdName + "(\"matrix\")",
            "function": (context, cmdArgs) =>
            {
                const inputMatrixRenderObject = context.matrixListManager.get(cmdArgs["matrix"]);

                const resultMatrix = inputMatrixRenderObject.matrix.clone();
                resultMatrix.transpose();

                const name = "Result" + context.vectorOperationCount++;
                context.matrixListManager.create1(name, resultMatrix);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (matrix) {
            const cmdArgs={"matrix":matrix};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerExtractPositionVectorFromMatrix()
    {
        const instance = this;

        const cmdName = "extractPositionVectorFromMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates a vector at the position encoded within the input matrix.",
            "exampleUsage": cmdName + "(\"matrix\")",
            "function": (context, cmdArgs) =>
            {
                const inputMatrixRenderObject = context.matrixListManager.get(cmdArgs["matrix"]);

                const startPosition = new THREE.Vector3();
                startPosition.setFromMatrixColumn(inputMatrixRenderObject.matrix, 3);

                const lookDirection = new THREE.Vector3();
                lookDirection.setFromMatrixColumn(inputMatrixRenderObject.matrix, 2);
                lookDirection.normalize();

                const endPosition = startPosition.clone();
                endPosition.add(lookDirection);

                const opts = {
                    renderMode:"waypoint"
                }

                const name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, MathHelpers.getRandomColor(), startPosition, endPosition, opts);
                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (matrix) {
            const cmdArgs={"matrix":matrix};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerExtractVectorsFromMatrix()
    {
        const instance = this;

        const cmdName = "extractVectorsFromMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Creates 3 vectors representing the input matrix's up, left, and forward vectors.  The resulting vectors will be positioned based on the position encoded within the input matrix.",
            "exampleUsage": cmdName + "(\"matrix\")",
            "function": (context, cmdArgs) =>
            {
                const inputMatrixRenderObject = context.matrixListManager.get(cmdArgs["matrix"]);

                const startPosition = new THREE.Vector3();
                startPosition.setFromMatrixColumn(inputMatrixRenderObject.matrix, 3);

                let vectorRenderObject = inputMatrixRenderObject.getVectorRenderObject(0);
                let e = vectorRenderObject.getEndPoint();
                e.sub(vectorRenderObject.getStartPoint());
                let endPosition = startPosition.clone();
                endPosition.add(e);
                const upProps = [startPosition, endPosition]

                vectorRenderObject = inputMatrixRenderObject.getVectorRenderObject(1);
                e = vectorRenderObject.getEndPoint();
                e.sub(vectorRenderObject.getStartPoint());
                endPosition = startPosition.clone();
                endPosition.add(e);
                const leftProps = [startPosition, endPosition]

                vectorRenderObject = inputMatrixRenderObject.getVectorRenderObject(2);
                e = vectorRenderObject.getEndPoint();
                e.sub(vectorRenderObject.getStartPoint());
                endPosition = startPosition.clone();
                endPosition.add(e);
                const forwardProps = [startPosition, endPosition]


                let name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, 0xff0000, upProps[0], upProps[1]);

                name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, 0x00ff00, leftProps[0], leftProps[1]);

                name = "Result" + context.vectorOperationCount++;
                context.vectorListManager.create2(name, 0x0000ff, forwardProps[0], forwardProps[1]);

                context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (matrix) {
            const cmdArgs={"matrix":matrix};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }
}