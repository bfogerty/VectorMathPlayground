import {Vector3} from "three";
import * as THREE from "three";
import MatrixRenderObject from "./matrixRenderObject";

export default class MatrixListManager
{
    constructor(scene) {

        this.scene = scene;
        this.matrixObjectList = {};
        this.matrixNameArray = [];
    }

    get(name)
    {
        let finalName = name;
        if(name.startsWith("$")) {
            finalName = this.getNameViaShortcut(name);
        }

        return this.matrixObjectList[finalName];
    }

    set(name, matrixObj)
    {
        this.matrixObjectList[name] = matrixObj;
    }

    getList()
    {
        return this.matrixObjectList;
    }

    safeDestroy(name)
    {
        let finalName = name;
        if(name.startsWith("$")) {
            finalName = this.getNameViaShortcut(name);
        }

        let matrixObj = this.matrixObjectList[finalName];
        if(matrixObj != null) {
            matrixObj.destroy();
        }

        delete this.matrixObjectList[finalName];

        for(let index in this.matrixNameArray)
        {
            const currentName = this.matrixNameArray[index];
            if(currentName == finalName)
            {
                this.matrixNameArray.splice(index,1);
                break;
            }
        }
    }

    getNameViaShortcut(shortcut)
    {
        const lastValidIndex = this.matrixNameArray.length-1;
        let t = shortcut.replaceAll(" ","");
        t = shortcut.replaceAll("\t","");

        if(t == "$")
            return this.matrixNameArray[lastValidIndex];

        if(t[1]!='-')
            return "";

        try {
            const offsetString = t.substring(2);
            const offset = parseInt(offsetString, 10);

            const index = lastValidIndex - offset;
            return this.matrixNameArray[index];
        }
        catch (error)
        {
            return "";
        }

        return "";
    }

    create1(name, matrix, opts)
    {
        const renderObject = new MatrixRenderObject(
            name,
            matrix,
            this.scene,
            opts);
        this.set(name, renderObject);

        this.matrixNameArray.push(name);

        //renderObject.show(false);
    }
}