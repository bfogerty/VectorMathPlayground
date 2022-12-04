import {Vector3} from "three";
import {Matrix4} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import VectorRenderObject from './vectorRenderObject.js'
import MatrixRenderObject from "./matrixRenderObject";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import MathHelpers from './mathHelpers'

export default class ScalarOperationCommandProcessor {

    constructor(cmdMap, context)
    {
        this.cmdMap = cmdMap;
        this.context = context;

        this.registerCommands();
    }


    registerCommands()
    {
        this.registerComputeDistanceBetweenVectors();
        this.registerDotProduct();
        this.registerComputeAngleBetweenVectors();
        this.registerConvertRadiansToDegrees();
        this.registerConvertDegreesToRadians();

    }

    registerComputeDistanceBetweenVectors()
    {
        const instance = this;

        const cmdName = "computeDistanceBetweenVectors";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true, "outputResultToConsole":true},
            "description": "Returns the distance between two input vectors.",
            "exampleUsage": cmdName + "(\"vectorA\", \"vectorB\")",
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

                vecA.sub(vecB);

                return vecA.length();
            }
        }

        this.context.mathParser.set(cmdName, function (a,b) {
            const cmdArgs={"vectorA":a, "vectorB":b};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerDotProduct()
    {
        const instance = this;

        const cmdName = "dotProduct";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true, "outputResultToConsole":true},
            "description": "Returns the dot product of the two input vectors.",
            "exampleUsage": cmdName + "(\"vectorA\", \"vectorB\")",
            "function": (context, cmdArgs) =>
            {
                const vectorA = context.vectorListManager.get(cmdArgs["vectorA"]);
                const vectorB = context.vectorListManager.get(cmdArgs["vectorB"]);

                const vecA = vectorA.getEndPoint();
                const vecB = vectorB.getEndPoint();

                return vecA.dot(vecB);
            }
        }

        this.context.mathParser.set(cmdName, function (a,b) {
            const cmdArgs={"vectorA":a, "vectorB":b};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerComputeAngleBetweenVectors()
    {
        const instance = this;

        const cmdName = "computeAngleBetweenVectors";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true, "outputResultToConsole":true},
            "description": "Returns the angle between two input vectors.  If input parameter, angleInDegrees, is true, the result will be in degrees.  Otherwise the result will be in radians.",
            "exampleUsage": cmdName + "(\"vectorA\", \"vectorB\", angleInDegrees)",
            "function": (context, cmdArgs) =>
            {
                const vectorA = context.vectorListManager.get(cmdArgs["vectorA"]);
                const vectorB = context.vectorListManager.get(cmdArgs["vectorB"]);
                const angleInDegrees = cmdArgs["angleInDegrees"];

                const vecA = vectorA.computeNormal();
                const vecB = vectorB.computeNormal();

                let radians = MathHelpers.computeAngleBetweenVectors(vecA, vecB);
                if(angleInDegrees)
                    return MathHelpers.radiansToDegrees(radians);

                return radians;
            }
        }

        this.context.mathParser.set(cmdName, function (a,b, angleInDegrees) {
            const cmdArgs={"vectorA":a, "vectorB":b, "angleInDegrees":angleInDegrees};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerConvertRadiansToDegrees()
    {
        const instance = this;

        const cmdName = "convertRadiansToDegrees";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true, "outputResultToConsole":true},
            "description": "Converts an angle in radians to an angle in degrees.",
            "exampleUsage": cmdName + "(angle)",
            "function": (context, cmdArgs) =>
            {
                const angle = cmdArgs["angle"];
                return MathHelpers.radiansToDegrees(angle);
            }
        }

        this.context.mathParser.set(cmdName, function (angle) {
            const cmdArgs={"angle":angle};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerConvertDegreesToRadians()
    {
        const instance = this;

        const cmdName = "convertDegreesToRadians";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true, "outputResultToConsole":true},
            "description": "Converts an angle in degrees to an angle in radians.",
            "exampleUsage": cmdName + "(angle)",
            "function": (context, cmdArgs) =>
            {
                const angle = cmdArgs["angle"];
                return MathHelpers.degreesToRadians(angle);
            }
        }

        this.context.mathParser.set(cmdName, function (angle) {
            const cmdArgs={"angle":angle};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }
}