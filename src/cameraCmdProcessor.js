import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import MathHelpers from './mathHelpers'

export default class CameraCommandProcessor {

    constructor(cmdMap, context)
    {
        this.cmdMap = cmdMap;
        this.context = context;

        this.registerCommands();
    }


    registerCommands()
    {
        this.registerSetFOVCommand();
        this.registerCameraLookAtVectorCommand();
        this.registerCameraAutoRotateCommand();
    }

    registerSetFOVCommand()
    {
        const instance = this;

        const cmdName = "cameraSetFOV";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Sets the camera's vertical field of view to the input angle in degrees.",
            "exampleUsage": cmdName + "(verticalFOVAngleInDegrees)",
            "function": (context, cmdArgs) =>
            {
                const verticalFOVAngleInDegrees = cmdArgs["angleInDegrees"];
                context.camera.fov = verticalFOVAngleInDegrees;
                context.camera.updateProjectionMatrix();
            }
        }

        this.context.mathParser.set(cmdName, function (angleInDegrees) {
            const cmdArgs={"angleInDegrees":angleInDegrees};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCameraLookAtVectorCommand()
    {
        const instance = this;

        const cmdName = "cameraLookAtVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Forces the camera to look at a specific vector in the scene.",
            "exampleUsage": cmdName + "(vectorName)",
            "function": (context, cmdArgs) =>
            {
                const vector = context.vectorListManager.get(cmdArgs["vector"]);
                if(vector == null)
                    return;

                context.orbitControls.target = vector.getStartPoint();
                context.orbitControls.update(0);
            }
        }

        this.context.mathParser.set(cmdName, function (vector) {
            const cmdArgs={"vector":vector};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerCameraAutoRotateCommand()
    {
        const instance = this;

        const cmdName = "cameraAutoRotate";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Controls whether or not the camera rotates automatically. autoRotateEnabled should be either \"true\" or \"false\".",
            "exampleUsage": cmdName + "(autoRotateEnabled)",
            "function": (context, cmdArgs) =>
            {
                const autoRotateEnabled = cmdArgs["autoRotateEnabled"];

                context.orbitControls.autoRotate = autoRotateEnabled;
                context.orbitControls.autoRotateSpeed = -2.0;
                context.orbitControls.update(0);
            }
        }

        this.context.mathParser.set(cmdName, function (vector) {
            const cmdArgs={"vector":vector};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }
}