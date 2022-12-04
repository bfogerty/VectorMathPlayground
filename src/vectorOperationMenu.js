import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import MathHelpers from './mathHelpers'

export default class VectorOperationMenu
{
    constructor(parentGUI, context)
    {
        this.parentGUI = parentGUI;
        this.context = context;
        this.menuIsOpen = false;
    }

    rebuildMenu()
    {
        this.gui = this.parentGUI.addFolder("Vector Operations");
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

        this.createNormalizeSubMenu();
        this.createAddVectorSubMenu();
        this.createSubVectorSubMenu();
        this.createScaleVectorSubMenu();
        this.createCrossVectorSubMenu();
        this.createProjectVectorSubMenu();
        this.createReflectVectorSubMenu();
        this.createNegateVectorSubMenu();
        this.createTranslateVectorSubMenu();
        this.createTranslateVectorToPointSubMenu();
        this.createMoveVectorSubMenu();
        this.createLinearInterpolationBetweenVectorsSubMenu();
        this.createCreateAxisFromVectorSubMenu();
        this.createMultiplyVectorByMatrixSubMenu();
        this.createDistanceBetweenVectorsSubMenu();
        this.createAngleBetweenVectorsSubMenu();
    }

    createNormalizeSubMenu()
    {
        const menuInstance = this;

        const params = {
            vector: null,
            normalize: function () {
                const cmdArgs = {"vector": params.vector.name};
                return menuInstance.context.cmdProcessor.executeCmd("normalizeVector", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Normalize");
        folder.add(params, 'vector', this.context.vectorListManager.getList());
        folder.add(params, 'normalize');
        folder.close();
    }

    createAddVectorSubMenu()
    {
        const menuInstance = this;

        const params = {
            vectorA: null,
            vectorB: null,
            add: function () {
                const cmdArgs = {"vectorA": params.vectorA.name, "vectorB": params.vectorB.name};
                menuInstance.context.cmdProcessor.executeCmd("addVectors", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Add Vectors");
        folder.add(params, 'vectorA', this.context.vectorListManager.getList());
        folder.add(params, 'vectorB', this.context.vectorListManager.getList());
        folder.add(params, 'add');
        folder.close();
    }

    createSubVectorSubMenu()
    {
        const menuInstance = this;

        const params = {
            vectorA: null,
            vectorB: null,
            subtract: function () {
                const cmdArgs = {"vectorA": params.vectorA.name, "vectorB": params.vectorB.name};
                menuInstance.context.cmdProcessor.executeCmd("subtractVectors", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Subtract Vectors");
        folder.add(params, 'vectorA', this.context.vectorListManager.getList());
        folder.add(params, 'vectorB', this.context.vectorListManager.getList());
        folder.add(params, 'subtract');
        folder.close();
    }

    createScaleVectorSubMenu()
    {
        const menuInstance = this;

        const params = {
            vector: null,
            scalar: 1.0,
            scale: function () {
                const cmdArgs = {"vector": params.vector.name, "scalar": params.scalar};
                menuInstance.context.cmdProcessor.executeCmd("scaleVector", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Scale");
        folder.add(params, 'vector', this.context.vectorListManager.getList());
        folder.add(params, 'scalar');
        folder.add(params, 'scale');
        folder.close();
    }

    createCrossVectorSubMenu()
    {
        const menuInstance = this;

        const params = {
            vectorA: null,
            vectorB: null,
            cross: function () {
                const cmdArgs = {"vectorA": params.vectorA.name, "vectorB": params.vectorB.name};
                menuInstance.context.cmdProcessor.executeCmd("crossVectors", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Cross Vectors");
        folder.add(params, 'vectorA', this.context.vectorListManager.getList());
        folder.add(params, 'vectorB', this.context.vectorListManager.getList());
        folder.add(params, 'cross');
        folder.close();
    }

    createProjectVectorSubMenu()
    {
        const menuInstance = this;

        const params = {
            vectorA: null,
            vectorB: null,
            project: function () {
                const cmdArgs = {"vectorA": params.vectorA.name, "vectorB": params.vectorB.name};
                menuInstance.context.cmdProcessor.executeCmd("projectVector", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Project Vectors");
        folder.add(params, 'vectorA', this.context.vectorListManager.getList());
        folder.add(params, 'vectorB', this.context.vectorListManager.getList());
        folder.add(params, 'project');
        folder.close();
    }

    createReflectVectorSubMenu()
    {
        const menuInstance = this;

        const params = {
            vector: null,
            normal: null,
            reflect: function () {
                const cmdArgs = {"vector": params.vector.name, "normal": params.normal.name};
                menuInstance.context.cmdProcessor.executeCmd("reflectVector", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Reflect Vectors");
        folder.add(params, 'vector', this.context.vectorListManager.getList());
        folder.add(params, 'normal', this.context.vectorListManager.getList());
        folder.add(params, 'reflect');
        folder.close();
    }

    createNegateVectorSubMenu()
    {
        const menuInstance = this;

        const params = {
            vector: null,
            negate: function () {
                const cmdArgs = {"vector": params.vector.name};
                menuInstance.context.cmdProcessor.executeCmd("negateVector", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Negate Vector");
        folder.add(params, 'vector', this.context.vectorListManager.getList());
        folder.add(params, 'negate');
        folder.close();
    }

    createTranslateVectorSubMenu()
    {
        const menuInstance = this;

        const params = {
            vector: null,
            startX: 0,
            startY: 0,
            startZ: 0,
            translate: function () {
                const cmdArgs = {"vector": params.vector.name, "startX": params.startX, "startY": params.startY, "startZ": params.startZ};
                menuInstance.context.cmdProcessor.executeCmd("translateVector", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Translate (X,Y,Z)");
        folder.add(params, 'vector', this.context.vectorListManager.getList());
        folder.add(params, 'startX');
        folder.add(params, 'startY');
        folder.add(params, 'startZ');
        folder.add(params, 'translate');
        folder.close();
    }

    createTranslateVectorToPointSubMenu()
    {
        const menuInstance = this;

        const params = {
            from: null,
            to: null,
            translate: function () {
                const cmdArgs = {"from": params.from.name, "to": params.to.name};
                menuInstance.context.cmdProcessor.executeCmd("translateVectorToPoint", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Translate To Point");
        folder.add(params, 'from', this.context.vectorListManager.getList());
        folder.add(params, 'to', this.context.vectorListManager.getList());
        folder.add(params, 'translate');
        folder.close();
    }

    createMoveVectorSubMenu()
    {
        const menuInstance = this;

        const params = {
            vector: null,
            units: 0,
            move: function () {
                const cmdArgs = {"vector": params.vector.name, "units": params.units};
                menuInstance.context.cmdProcessor.executeCmd("moveVector", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Move Along Vector");
        folder.add(params, 'vector', this.context.vectorListManager.getList());
        folder.add(params, 'units');
        folder.add(params, 'move');
        folder.close();
    }

    createLinearInterpolationBetweenVectorsSubMenu()
    {
        const menuInstance = this;

        const params = {
            vectorA: null,
            vectorB: null,
            t: 0.5,
            apply: function () {
                const cmdArgs = {"vectorA": params.vectorA.name, "vectorB": params.vectorB.name, "t": params.t};
                menuInstance.context.cmdProcessor.executeCmd("lerpVector", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("LERP Between Points");
        folder.add(params, 'vectorA', this.context.vectorListManager.getList());
        folder.add(params, 'vectorB', this.context.vectorListManager.getList());
        folder.add(params, 't');
        folder.add(params, 'apply');
        folder.close();
    }

    createCreateAxisFromVectorSubMenu()
    {
        const menuInstance = this;

        const params = {
            vector: null,
            create: function () {
                const cmdArgs = {"vector": params.vector.name,};
                menuInstance.context.cmdProcessor.executeCmd("createAxisFromVector", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Create Axis From Vector");
        folder.add(params, 'vector', this.context.vectorListManager.getList()).name("Forward Vector");
        folder.add(params, 'create');
        folder.close();
    }

    createMultiplyVectorByMatrixSubMenu()
    {
        const menuInstance = this;

        const params = {
            vector: null,
            matrix: null,
            execute: function () {
                const cmdArgs = {"vector": params.vector.name, "matrix": params.matrix.name};
                menuInstance.context.cmdProcessor.executeCmd("multiplyVectorByMatrix", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Multiply Vector By Matrix");
        folder.add(params, 'vector', this.context.vectorListManager.getList());
        folder.add(params, 'matrix', this.context.matrixListManager.getList());
        folder.add(params, 'execute');
        folder.close();
    }

    createDistanceBetweenVectorsSubMenu()
    {
        const menuInstance = this;

        const params = {
            vectorA: null,
            vectorB: null,
            execute: function () {
                const cmdArgs = {"vectorA": params.vectorA.name, "vectorB": params.vectorB.name};
                menuInstance.context.cmdProcessor.executeCmd("distanceBetweenVectors", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Render Distance Between Vectors");
        folder.add(params, 'vectorA', this.context.vectorListManager.getList());
        folder.add(params, 'vectorB', this.context.vectorListManager.getList());
        folder.add(params, 'execute');
        folder.close();
    }

    createAngleBetweenVectorsSubMenu()
    {
        const menuInstance = this;

        const params = {
            vectorA: null,
            vectorB: null,
            angleInDegrees: true,
            execute: function () {
                const cmdArgs = {"vectorA": params.vectorA.name, "vectorB": params.vectorB.name, "angleInDegrees":params.angleInDegrees};
                menuInstance.context.cmdProcessor.executeCmd("angleBetweenVectors", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Render Angle Between Vectors");
        folder.add(params, 'vectorA', this.context.vectorListManager.getList());
        folder.add(params, 'vectorB', this.context.vectorListManager.getList());
        folder.add(params, 'angleInDegrees').name("Angle In Degrees");
        folder.add(params, 'execute');
        folder.close();
    }
}