import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import MathHelpers from './mathHelpers'

export default class MatrixPropertyCommandProcessor {

    constructor(cmdMap, context)
    {
        this.cmdMap = cmdMap;
        this.context = context;

        this.registerCommands();
    }


    registerCommands()
    {
        this.registerUpdateMatrix();
        this.registerRenameMatrix();
    }

    registerUpdateMatrix()
    {
        const cmdName = "updateMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "function": (context, cmdArgs) =>
            {
                const oldMatrixName = cmdArgs["oldMatrixName"];
                let newMatrixName = cmdArgs["newMatrixName"];
                let matrix = cmdArgs["matrix"];
                let newVisible = cmdArgs["visible"];
                let newRenderText = cmdArgs["renderText"];
                let newTextToRender = cmdArgs["textToRender"];

                if(oldMatrixName == null)
                    return;

                let matrixRenderObj = context.matrixListManager.get(oldMatrixName);
                if(matrixRenderObj == null)
                    return;

                if(newMatrixName == null)
                    newMatrixName = matrixRenderObj.name;

                if(newRenderText == null)
                    newRenderText = matrixRenderObj.renderText;

                if(newTextToRender == null)
                    newTextToRender = matrixRenderObj.textToRender;

                if(newVisible == null)
                    newVisible = matrixRenderObj.visible;

                let newMatrix = null;
                if(matrix == null)
                    newMatrix = matrixRenderObj.matrix.clone();
                else {
                    if(matrix.elements != null)
                    {
                        newMatrix = new THREE.Matrix4();
                        newMatrix.fromArray(matrix.elements);
                    }
                    else {
                        newMatrix = matrix.clone();
                    }
                }

                if(newTextToRender == null)
                    newTextToRender = matrix.textToRender;

                if(newTextToRender == oldMatrixName)
                    newTextToRender = newMatrixName;

                const opts = {
                    "renderText":newRenderText,
                    "textToRender":newTextToRender,
                }

                context.matrixListManager.safeDestroy(oldMatrixName);

                this.context.matrixListManager.create1(
                    newMatrixName,
                    newMatrix,
                    opts);

                context.matrixListManager.get(newMatrixName).show(newVisible);

                this.context.needsFullMenuRefresh = true;
            }
        }

        this.cmdMap[cmdName] = cmd;
    }

    registerRenameMatrix() {
        const instance = this;

        const cmdName = "renameMatrix";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Renames a matrix.  The input name will be used to reference the matrix.",
            "exampleUsage": cmdName + "(oldMatrixName, newMatrixName)",
            "function": (context, cmdArgs) =>
            {
                const oldMatrixName = cmdArgs["oldMatrixName"];
                const newMatrixName = cmdArgs["newMatrixName"];

                const updateCmdArgs={"oldMatrixName":oldMatrixName, "newMatrixName":newMatrixName};
                instance.context.cmdProcessor.executeCmd("updateMatrix", updateCmdArgs);

                this.context.needsFullMenuRefresh = true;
            }
        }

        this.context.mathParser.set(cmdName, function (oldMatrixName, newMatrixName) {
            const cmdArgs={"oldMatrixName":oldMatrixName, "newMatrixName":newMatrixName};
            instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }
}