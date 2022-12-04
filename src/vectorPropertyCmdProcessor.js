import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import MathHelpers from './mathHelpers'

export default class VectorPropertyCommandProcessor {

    constructor(cmdMap, context)
    {
        this.cmdMap = cmdMap;
        this.context = context;

        this.registerCommands();
    }


    registerCommands()
    {
        this.registerUpdateVector();
        this.registerRenameVector();
        this.registerSetVectorRenderMode();
    }

    registerUpdateVector()
    {
        const cmdName = "updateVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "function": (context, cmdArgs) =>
            {
                const oldVectorName = cmdArgs["vector"];
                let newVectorName = cmdArgs["newVectorName"];
                let newTextToRender = cmdArgs["textToRender"];
                let newOriginX = cmdArgs["originX"];
                let newOriginY = cmdArgs["originY"];
                let newOriginZ = cmdArgs["originZ"];
                let newEndX = cmdArgs["endX"];
                let newEndY = cmdArgs["endY"];
                let newEndZ = cmdArgs["endZ"];
                let newColor = cmdArgs["color"];
                let newRenderMode = cmdArgs["renderMode"];
                let newRenderText = cmdArgs["renderText"];
                let newVisible = cmdArgs["visible"];

                if(oldVectorName == null)
                    return;

                let vector = context.vectorListManager.get(oldVectorName);
                if(vector == null)
                    return;

                if(newVectorName == null)
                    newVectorName = vector.name;

                const oldStartPoint = vector.getStartPoint();
                const oldEndPoint = vector.getEndPoint();

                // Special case for rendering angles.
                const newBasisVectorA = vector.basisVectorA;
                const newBasisVectorB = vector.basisVectorB;

                if(newOriginX == null)
                    newOriginX = oldStartPoint.x;

                if(newOriginY == null)
                    newOriginY = oldStartPoint.y;

                if(newOriginZ == null)
                    newOriginZ = oldStartPoint.z;

                if(newEndX == null)
                    newEndX = oldEndPoint.x;

                if(newEndY == null)
                    newEndY = oldEndPoint.y;

                if(newEndZ == null)
                    newEndZ = oldEndPoint.z;

                if(newColor == null)
                    newColor = vector.color;

                if(newRenderMode == null)
                    newRenderMode = vector.renderMode;

                if(newRenderText == null)
                    newRenderText = vector.renderText;

                if(newVisible == null)
                    newVisible = vector.visible;

                if(newTextToRender == null)
                    newTextToRender = vector.textToRender;

                if(newTextToRender == oldVectorName)
                    newTextToRender = newVectorName;

                context.vectorListManager.safeDestroy(oldVectorName);

                let newStartPoint = new THREE.Vector3(newOriginX,newOriginY,newOriginZ);
                let newEndPoint = new THREE.Vector3(newEndX,newEndY,newEndZ);

                this.context.vectorListManager.create2(
                    newVectorName,
                    newColor,
                    newStartPoint,
                    newEndPoint,
                    {
                        renderText: newRenderText,
                        fontAsset:context.assets["fonts"]["defaultFont"],
                        renderMode: newRenderMode,
                        visible:newVisible,
                        textToRender:newTextToRender,
                        basisVectorA:newBasisVectorA,
                        basisVectorB:newBasisVectorB
                    });

                this.context.needsFullMenuRefresh = true;
            }
        }

        this.cmdMap[cmdName] = cmd;
    }

    registerRenameVector() {
        const instance = this;

        const cmdName = "renameVector";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Renames a vector.  The input name will be used to reference the vector.",
            "exampleUsage": cmdName + "(oldVectorName, newVectorName)",
            "function": (context, cmdArgs) =>
            {
                const oldVectorName = cmdArgs["oldVectorName"];
                const newVectorName = cmdArgs["newVectorName"];

                const updateCmdArgs={"vector":oldVectorName, "newVectorName":newVectorName};
                instance.context.cmdProcessor.executeCmd("updateVector", updateCmdArgs);

                this.context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (oldVectorName, newVectorName) {
            const cmdArgs={"oldVectorName":oldVectorName, "newVectorName":newVectorName};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerSetVectorRenderMode() {
        const instance = this;

        const cmdName = "setVectorRenderMode";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Sets a vector's render mode.  Valid input render modes are \"vector\", \"waypoint\", \"line\", \"dashedLine\", \"man\", \"dog\", \"spaceship\", \"triangle\", \"box\", \"torus\", and \"plane\".",
            "exampleUsage": cmdName + "(vector, renderMode)",
            "function": (context, cmdArgs) =>
            {
                const vectorName = cmdArgs["vector"];
                const renderMode = cmdArgs["renderMode"];

                const updateCmdArgs={"vector":vectorName, "renderMode":renderMode};
                instance.context.cmdProcessor.executeCmd("updateVector", updateCmdArgs);

                this.context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (vector, renderMode) {
            const cmdArgs={"vector":vector, "renderMode":renderMode};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }
}