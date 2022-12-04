import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import VectorMenu from './vectorMenu'
import VectorOperationsMenu from './vectorOperationMenu'
import MathHelpers from './mathHelpers'
import MatrixRenderObject from "./matrixRenderObject";

export default class SceneMenu
{
    constructor(parentGUI, context, scene)
    {
        this.parentGUI = parentGUI;
        this.context = context;

        this.menuIsOpen = false;
    }

    rebuildMenu()
    {
        this.gui = this.parentGUI.addFolder("Scene");
        this.gui.close();
        this.menuIsOpen = false;

        this.vectorMenu = this.gui.addFolder("Vectors");
        this.vectorMenu.close();

        this.matrixMenu = this.gui.addFolder("Matrices");
        this.matrixMenu.close();

        this.createVectorFromDirectionAndMagnitudeSubMenu(this.vectorMenu);
        this.createVectorAdvancedSubMenu(this.vectorMenu);
        this.duplicateVectorSubMenu(this.vectorMenu);
        this.createRandomVectorSubMenu(this.vectorMenu);
        this.destroyVectorSubMenu(this.vectorMenu);

        this.createMatrixSubMenu(this.matrixMenu);
        this.createMatrixFromForwardVectorSubMenu(this.matrixMenu);
        this.destroyMatrixSubMenu(this.matrixMenu);

        this.clearSceneSubMenu();
        this.resetSceneSubMenu();
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

    createVectorAdvancedSubMenu(parentMenu)
    {
        const menuInstance = this;

        const params = {
            name: "New Vector",
            originX: 0,
            originY: 0,
            originZ: 0,
            endX: 0,
            endY: 0,
            endZ: 1,
            color: 0xff0000,
            renderMode: "vector",
            renderText: false,
            textToRender: "",
            create: function() {
                const cmdArgs = {
                    "name": params.name,
                    "originX": params.originX,
                    "originY": params.originY,
                    "originZ": params.originZ,
                    "endX": params.endX,
                    "endY": params.endY,
                    "endZ": params.endZ,
                    "color": params.color,
                    "renderMode": params.renderMode,
                    "renderText": params.renderText,
                    "textToRender": params.textToRender
                };
                menuInstance.context.cmdProcessor.executeCmd("createVector", cmdArgs);
            }
        };

        const folder = parentMenu.addFolder("Create (Advanced)");
        folder.add(params, 'name');
        folder.add(params, 'originX');
        folder.add(params, 'originY');
        folder.add(params, 'originZ');
        folder.add(params, 'endX');
        folder.add(params, 'endY');
        folder.add(params, 'endZ');
        folder.addColor(params, 'color');
        folder.add(params, 'renderMode', ["vector", "waypoint", "line", "dashedLine", "man", "dog", "spaceship", "triangle", "box", "torus", "plane"]).name("Render Mode");
        folder.add(params, 'renderText', [true, false]).name("Render Text");
        folder.add(params, 'textToRender').name("Text to Render");
        folder.add(params, 'create');
        folder.close();
    }

    createVectorFromDirectionAndMagnitudeSubMenu(parentMenu)
    {
        const menuInstance = this;

        const params = {
            name: "New Vector",
            x: 0,
            y: 0,
            z: 1,
            magnitude: 1,
            color: 0xff0000,
            renderMode: "vector",
            renderText: false,
            textToRender: "",
            create: function() {
                const cmdArgs = {
                    "name": params.name,
                    "x": params.x,
                    "y": params.y,
                    "z": params.z,
                    "magnitude": params.magnitude,
                    "color": params.color,
                    "renderMode": params.renderMode,
                    "renderText": params.renderText,
                    "textToRender": params.textToRender
                };
                menuInstance.context.cmdProcessor.executeCmd("createVector3", cmdArgs);
            }
        };

        const folder = parentMenu.addFolder("Create");
        folder.add(params, 'name');
        folder.add(params, 'x', -1, 1);
        folder.add(params, 'y', -1, 1);
        folder.add(params, 'z', -1, 1);
        folder.add(params, 'magnitude');
        folder.addColor(params, 'color');
        folder.add(params, 'renderMode', ["vector", "waypoint", "line", "dashedLine", "man", "spaceship", "dog", "triangle", "box", "torus", "plane"]).name("Render Mode");
        folder.add(params, 'renderText', [true, false]).name("Render Text");
        folder.add(params, 'textToRender').name("Text to Render");
        folder.add(params, 'create');
        folder.close();
    }

    duplicateVectorSubMenu(parentMenu)
    {
        const menuInstance = this;

        const params = {
            name: "Duplicated Vector",
            vector: null,
            duplicate: function() {
                const cmdArgs = {
                    "name": params.name,
                    "vector": params.vector.name,
                };
                menuInstance.context.cmdProcessor.executeCmd("duplicateVector", cmdArgs);
            }
        };

        const folder = parentMenu.addFolder("Duplicate");
        folder.add(params, 'name');
        folder.add(params, 'vector', this.context.vectorListManager.getList()).listen();
        folder.add(params, 'duplicate');
        folder.close();
    }

    createRandomVectorSubMenu(parentMenu)
    {
        const menuInstance = this;

        const params = {
            name: "Random Vector",
            originX: 0,
            originY: 0,
            originZ: 0,
            endX: 0,
            endY: 1,
            endZ: 0,
            color: 0xff0000,
            count: 1,
            maxLength: 1,
            normalize: true,
            renderMode: "vector",
            create: function() {
                const cmdArgs = {
                    "count": params.count,
                    "maxLength": params.maxLength,
                    "normalize": params.normalize,
                    "renderMode": params.renderMode
                };
                menuInstance.context.cmdProcessor.executeCmd("createRandomVector", cmdArgs);
            }
        };

        const folder = parentMenu.addFolder("Create Random");
        folder.add(params, 'count');
        folder.add(params, 'maxLength');
        folder.add(params, 'normalize');
        folder.add(params, 'renderMode', ["vector", "waypoint", "line", "dashedLine", "man", "dog", "spaceship", "triangle", "box", "torus", "plane"]);
        folder.add(params, 'create');
        folder.close();
    }

    destroyVectorSubMenu(parentMenu)
    {
        const menuInstance = this;

        const params = {
            vector: null,
            destroy: function()
            {
                const cmdArgs = {"vector": params.vector.name};
                menuInstance.context.cmdProcessor.executeCmd("destroyVector", cmdArgs);
            }
        };

        const folder = parentMenu.addFolder("Destroy");
        folder.add(params, 'vector', this.context.vectorListManager.getList()).listen();
        folder.add(params, 'destroy');
        folder.close();
    }

    clearSceneSubMenu()
    {
        const menuInstance = this;

        const params = {
            clear: function()
            {
                const cmdArgs = {};
                menuInstance.context.cmdProcessor.executeCmd("clearScene", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Clear Scene");
        folder.add(params, 'clear');
        folder.close();
    }

    resetSceneSubMenu()
    {
        const menuInstance = this;

        const params = {
            reset: function()
            {
                const cmdArgs = {"resetCommandHistory": false};
                menuInstance.context.cmdProcessor.executeCmd("resetScene", cmdArgs);
            },
            resetSceneAndCommandHistory: function()
            {
                const cmdArgs = {"resetCommandHistory": true};
                menuInstance.context.cmdProcessor.executeCmd("resetScene", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Reset Scene");
        folder.add(params, 'reset').name("Reset Scene Only");
        folder.add(params, 'resetSceneAndCommandHistory').name("Reset Scene and Command History");
        folder.close();
    }

    createMatrixSubMenu(parentMenu)
    {
        const menuInstance = this;

        const matrixParams = {
                name:"New Matrix"
        };

        const column0Params = {
            m00:"1",
            m10:"0",
            m20:"0",
            m30:"0"
        };

        const column1Params = {
            m01:"0",
            m11:"1",
            m21:"0",
            m31:"0"
        };

        const column2Params = {
            m02:"0",
            m12:"0",
            m22:"1",
            m32:"0"
        };

        const column3Params = {
            m03:"0",
            m13:"0",
            m23:"0",
            m33:"1"
        };

        let columnParams = [
            column0Params,
            column1Params,
            column2Params,
            column3Params
        ];

        let createParams =
            {
                create: function()
                {
                    const mp = menuInstance.context.mathParser;

                    let m = new THREE.Matrix4();
                    let xAxis = new THREE.Vector3(mp.evaluate(columnParams[0].m00), mp.evaluate(columnParams[0].m10), mp.evaluate(columnParams[0].m20));
                    let yAxis = new THREE.Vector3(mp.evaluate(columnParams[1].m01), mp.evaluate(columnParams[1].m11), mp.evaluate(columnParams[1].m21));
                    let zAxis = new THREE.Vector3(mp.evaluate(columnParams[2].m02), mp.evaluate(columnParams[2].m12), mp.evaluate(columnParams[2].m22));
                    let pos = new THREE.Vector3(mp.evaluate(columnParams[3].m03), mp.evaluate(columnParams[3].m13), mp.evaluate(columnParams[3].m23));

                    m.makeBasis(xAxis, yAxis, zAxis);
                    m.setPosition(pos.x, pos.y, pos.z);
                    const cmdArgs={"name":matrixParams.name, "matrix":m};
                    return menuInstance.context.cmdProcessor.executeCmd("createMatrix", cmdArgs);
                    //this.context.mathParser.evaluate(this.cmdBuffer);

                }
            }

        const folder = parentMenu.addFolder("Create");
        folder.add(matrixParams, 'name');

        let menuColumns = [
            folder.addFolder("Column 0"),
            folder.addFolder("Column 1"),
            folder.addFolder("Column 2"),
            folder.addFolder("Column 3")
        ];

        for( let i = 0; i < menuColumns.length; ++i)
        {
            menuColumns[i].close();
        }

        let currentColumnIndex = 0;
        for(let x = 0; x < 4; ++x)
        {
            for(let y = 0; y < 4; ++y)
            {
                const menuColumn = menuColumns[currentColumnIndex];
                const columnParam = columnParams[currentColumnIndex];
                const mIndex = "m" + y.toString() + x.toString();
                menuColumn.add(columnParam, mIndex);
            }
            ++currentColumnIndex;
        }

        folder.add(createParams, 'create')
        folder.close();
    }

    createMatrixFromForwardVectorSubMenu(parentMenu)
    {
        const menuInstance = this;

        const params = {
            name: "New Matrix",
            vector: null,
            create: function()
            {
                const cmdArgs = {"name": params.name, "vector": params.vector.name};
                menuInstance.context.cmdProcessor.executeCmd("createMatrixFromForwardVector", cmdArgs);
            }
        };

        const folder = parentMenu.addFolder("Create From Forward Vector");
        folder.add(params, 'vector', this.context.vectorListManager.getList()).listen();
        folder.add(params, 'create');
        folder.close();
    }

    destroyMatrixSubMenu(parentMenu)
    {
        const menuInstance = this;

        const params = {
            matrix: null,
            destroy: function()
            {
                const cmdArgs = {"matrix": params.matrix.name};
                menuInstance.context.cmdProcessor.executeCmd("destroyMatrix", cmdArgs);
            }
        };

        const folder = parentMenu.addFolder("Destroy");
        folder.add(params, 'matrix', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'destroy');
        folder.close();
    }
}