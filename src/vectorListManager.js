import {Vector3} from "three";
import * as THREE from "three";
import VectorRenderObject from "./vectorRenderObject.js";

export default class VectorListManager
{
    constructor(scene, codeEditor) {

        this.scene = scene;
        this.vectorObjectList = {};
        this.vectorNameArray = [];
        this.codeEditor = codeEditor;
    }

    get(name)
    {
        let finalName = name;
        if(name.startsWith("$")) {
            finalName = this.getVectorNameViaShortcut(name);
        }

        return this.vectorObjectList[finalName];
    }

    set(name, vectorObj)
    {
        this.vectorObjectList[name] = vectorObj;
    }

    getList()
    {
        return this.vectorObjectList;
    }

    safeDestroy(name)
    {
        let finalName = name;
        if(name.startsWith("$")) {
            finalName = this.getVectorNameViaShortcut(name);
        }

        let vectorObj = this.vectorObjectList[finalName];
        if(vectorObj != null) {
            this.codeEditor.removeVectorFromAutoCompletionList(vectorObj);
            vectorObj.destroy();
        }
        
        delete this.vectorObjectList[finalName];

        for(let index in this.vectorNameArray)
        {
            const currentName = this.vectorNameArray[index];
            if(currentName == finalName)
            {
                this.vectorNameArray.splice(index,1);
                break;
            }
        }
    }

    getVectorNameViaShortcut(shortcut)
    {
        const lastValidIndex = this.vectorNameArray.length-1;
        let t = shortcut.replaceAll(" ","");
        t = shortcut.replaceAll("\t","");

        if(t == "$")
            return this.vectorNameArray[lastValidIndex];

        if(t[1]!='-')
            return "";

        try {
            const offsetString = t.substring(2);
            const offset = parseInt(offsetString, 10);

            const index = lastValidIndex - offset;
            return this.vectorNameArray[index];
        }
        catch (error)
        {
            return "";
        }

        return "";
    }

    create1(name, color, originX, originY, originZ, endX, endY, endZ, opts)
    {
        const vectorObject = new VectorRenderObject(
            name,
            color,
            new THREE.Vector3(originX, originY, originZ),
            new THREE.Vector3(endX, endY, endZ),
            this.scene,
            opts);
        this.set(name, vectorObject);

        this.vectorNameArray.push(name);
        this.codeEditor.insertVectorIntoAutoCompletionList(vectorObject);
    }

    create2(name, color, startPosition, endPosition, opts)
    {
        const vectorObject = new VectorRenderObject(
            name,
            color,
            new THREE.Vector3(startPosition.x, startPosition.y, startPosition.z),
            new THREE.Vector3(endPosition.x, endPosition.y, endPosition.z),
            this.scene,
            opts);
        this.set(name, vectorObject);

        this.vectorNameArray.push(name);
        this.codeEditor.insertVectorIntoAutoCompletionList(vectorObject);
    }

    createFromDirectionAndMagnitude(name, color, direction, magnitude, opts)
    {
        const finalVector = direction.clone().normalize();
        finalVector.x *= magnitude;
        finalVector.y *= magnitude;
        finalVector.z *= magnitude;

        const vectorObject = new VectorRenderObject(
            name,
            color,
            new THREE.Vector3(0,0,0),
            finalVector,
            this.scene,
            opts);
        this.set(name, vectorObject);

        this.vectorNameArray.push(name);
        this.codeEditor.insertVectorIntoAutoCompletionList(vectorObject);
    }
}