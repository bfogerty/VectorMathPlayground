import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";

export default class VectorMenu
{
    constructor(parentGUI, context)
    {
        this.parentGUI = parentGUI;
        this.context = context;
        this.menuIsOpen = false;
    }

    rebuildMenu()
    {
        this.gui = this.parentGUI.addFolder("Vector Properties");
        this.gui.close();
        this.menuIsOpen = false;

        this.createVectorPropertySubMenu();
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

    updateVector(params)
    {
        let vector = this.context.vectorListManager.get(params.name);
        const startPoint = vector.getStartPoint();
        const endPoint = vector.getEndPoint();
        const color = vector.color;
        const originalName = params.name;
        const renderMode = vector.renderMode;
        const renderText = vector.renderText;

        this.context.vectorListManager.safeDestroy(originalName);

        this.context.vectorListManager.create2(
            params.mutableName,
            color,
            startPoint,
            endPoint,
            {
                renderText: renderText,
                fontAsset:this.context.assets["fonts"]["defaultFont"],
                renderMode: renderMode
            });

        this.context.needsFullMenuRefresh = true;
    }

    createVectorPropertySubMenu()
    {
        const menuInstance = this;

        for(let vectorName in menuInstance.context.vectorListManager.getList()) {

            if(menuInstance.context.vectorListManager.get(vectorName) == null)
                continue;

            const vector = menuInstance.context.vectorListManager.get(vectorName);

            const params = {
                name: vector.name,
                mutableName: vector.name,
                textToRender: vector.textToRender,
                update: function () {

                    const vector = menuInstance.context.vectorListManager.get(params.name);
                    const startPoint = vector.getStartPoint();
                    const endPoint = vector.getEndPoint();
                    const color = vector.color;
                    const visible = vector.visible;

                    const cmdArgs = {
                        "vector": params.name,
                        "newVectorName": params.mutableName,
                        "textToRender": params.textToRender,
                        "originX": startPoint.x,
                        "originY": startPoint.y,
                        "originZ": startPoint.z,
                        "endX": endPoint.x,
                        "endY": endPoint.y,
                        "endZ": endPoint.z,
                        "color": color,
                        "renderMode": vector.renderMode,
                        "renderText": vector.renderText,
                        "visible": visible
                    };
                    menuInstance.context.cmdProcessor.executeCmd("updateVector", cmdArgs);
                }
            };

            const folder = this.gui.addFolder(vectorName);
            folder.add(params, 'mutableName').name("name");
            folder.add(vector.startPoint, 'x').listen().name("Start X");
            folder.add(vector.startPoint, 'y').listen().name("Start Y");
            folder.add(vector.startPoint, 'z').listen().name("Start Z");
            folder.add(vector.endPoint, 'x').listen().name("End X");
            folder.add(vector.endPoint, 'y').listen().name("End Y");
            folder.add(vector.endPoint, 'z').listen().name("End Z");
            folder.add(vector, 'magnitude').listen();
            folder.addColor(vector, 'color').listen();
            folder.add(vector, 'renderMode', ["vector", "waypoint", "line", "dashedLine", "man", "dog", "spaceship", "triangle", "box", "torus", "plane"]).name("Render Mode").listen();
            folder.add(vector, 'renderText', [true, false]).name("Render Text").listen();
            folder.add(params, 'textToRender').name("Text to Render");
            folder.add(vector, 'visible').listen();
            folder.add(params, 'update');
            folder.close();
        }
    }
}