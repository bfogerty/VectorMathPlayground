import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import MathHelpers from './mathHelpers'

export default class MatrixOperationMenu
{
    constructor(parentGUI, context)
    {
        this.parentGUI = parentGUI;
        this.context = context;
        this.menuIsOpen = false;
    }

    rebuildMenu()
    {
        this.gui = this.parentGUI.addFolder("Matrix Operations");
        this.gui.close();
        this.menuIsOpen = false;

        this.createOperationsSubMenu();

        this.needsFullRefresh = false;
    }

    open()
    {
        if(this.gui == null)
            return;

        this.parentGUI.open();
        this.gui.open();
        this.menuIsOpen = true;
    }

    close()
    {
        if(this.gui == null)
            return;

        this.gui.close();
        this.menuIsOpen = false;
    }

    toggle()
    {
        if(this.menuIsOpen == false)
            this.open();
        else
            this.close();
    }

    createOperationsSubMenu()
    {
        const menuInstance = this;

        this.createMultiplyMatricesSubMenu();
        this.createRotateMatrixAboutLeftAxisSubMenu();
        this.createRotateMatrixAboutUpAxisSubMenu();
        this.createRotateMatrixAboutForwardAxisSubMenu();
        this.createTranslateMatrixSubMenu();
        this.createScaleMatrixSubMenu();
        this.createInvertMatrixSubMenu();
        this.createTransposeMatrixSubMenu();
        this.createExtractPositionVectorFromMatrixSubMenu();
    }

    createMultiplyMatricesSubMenu()
    {
        const menuInstance = this;

        const params = {
            matrixA: null,
            matrixB: null,
            multiply: function () {
                const cmdArgs = {"matrixA": params.matrixA.name, "matrixB": params.matrixB.name};
                menuInstance.context.cmdProcessor.executeCmd("multiplyMatrices", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Matrix Multiply");
        folder.add(params, 'matrixA', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'matrixB', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'multiply');
        folder.close();
    }

    createRotateMatrixAboutLeftAxisSubMenu()
    {
        const menuInstance = this;

        const params = {
            matrix: null,
            angleIsInDegrees: true,
            angle: 90,
            rotate: function () {
                const cmdArgs = {"matrix": params.matrix.name, "angleIsInDegrees": params.angleIsInDegrees, "angle": params.angle};
                menuInstance.context.cmdProcessor.executeCmd("rotateMatrixAboutLeftAxis", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Rotate About Left Axis");
        folder.add(params, 'matrix', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'angleIsInDegrees').listen();
        folder.add(params, 'angle').listen();
        folder.add(params, 'rotate');
        folder.close();
    }

    createRotateMatrixAboutUpAxisSubMenu()
    {
        const menuInstance = this;

        const params = {
            matrix: null,
            angleIsInDegrees: true,
            angle: 90,
            rotate: function () {
                const cmdArgs = {"matrix": params.matrix.name, "angleIsInDegrees": params.angleIsInDegrees, "angle": params.angle};
                menuInstance.context.cmdProcessor.executeCmd("rotateMatrixAboutUpAxis", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Rotate About Up Axis");
        folder.add(params, 'matrix', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'angleIsInDegrees').listen();
        folder.add(params, 'angle').listen();
        folder.add(params, 'rotate');
        folder.close();
    }

    createRotateMatrixAboutForwardAxisSubMenu()
    {
        const menuInstance = this;

        const params = {
            matrix: null,
            angleIsInDegrees: true,
            angle: 90,
            rotate: function () {
                const cmdArgs = {"matrix": params.matrix.name, "angleIsInDegrees": params.angleIsInDegrees, "angle": params.angle};
                menuInstance.context.cmdProcessor.executeCmd("rotateMatrixAboutForwardAxis", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Rotate About Forward Axis");
        folder.add(params, 'matrix', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'angleIsInDegrees').listen();
        folder.add(params, 'angle').listen();
        folder.add(params, 'rotate');
        folder.close();
    }

    createTranslateMatrixSubMenu()
    {
        const menuInstance = this;

        const params = {
            matrix: null,
            x: 0,
            y: 0,
            z: 0,
            translate: function () {
                const displacementVector = [params.x, params.y, params.z]
                const cmdArgs = {"matrix": params.matrix.name, "displacementVector": displacementVector};
                menuInstance.context.cmdProcessor.executeCmd("translateMatrix", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Translate");
        folder.add(params, 'matrix', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'x').listen();
        folder.add(params, 'y').listen();
        folder.add(params, 'z').listen();
        folder.add(params, 'translate');
        folder.close();
    }

    createScaleMatrixSubMenu()
    {
        const menuInstance = this;

        const params = {
            matrix: null,
            x: 0,
            y: 0,
            z: 0,
            scale: function () {
                const displacementVector = [params.x, params.y, params.z];
                const cmdArgs = {"matrix": params.matrix.name, "scaleVector": displacementVector};
                menuInstance.context.cmdProcessor.executeCmd("scaleMatrix", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Scale");
        folder.add(params, 'matrix', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'x').listen();
        folder.add(params, 'y').listen();
        folder.add(params, 'z').listen();
        folder.add(params, 'scale');
        folder.close();
    }

    createInvertMatrixSubMenu()
    {
        const menuInstance = this;

        const params = {
            matrix: null,
            invert: function () {
                const cmdArgs = {"matrix": params.matrix.name};
                menuInstance.context.cmdProcessor.executeCmd("invertMatrix", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Invert");
        folder.add(params, 'matrix', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'invert');
        folder.close();
    }

    createTransposeMatrixSubMenu()
    {
        const menuInstance = this;

        const params = {
            matrix: null,
            transpose: function () {
                const cmdArgs = {"matrix": params.matrix.name};
                menuInstance.context.cmdProcessor.executeCmd("transposeMatrix", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Transpose");
        folder.add(params, 'matrix', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'transpose');
        folder.close();
    }

    createExtractPositionVectorFromMatrixSubMenu()
    {
        const menuInstance = this;

        const params = {
            matrix: null,
            extract: function () {
                const cmdArgs = {"matrix": params.matrix.name};
                menuInstance.context.cmdProcessor.executeCmd("extractPositionVectorFromMatrix", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Extract Position");
        folder.add(params, 'matrix', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'extract');
        folder.close();
    }

}