import {Vector3} from "three";
import * as THREE from "three";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import MathHelpers from './mathHelpers'
import VectorRenderObject from "./vectorRenderObject";

export default class MatrixRenderObject
{
    assets = {}

    RenderMode = {
        vector: "vector",
    }

    constructor(name, matrix, scene, opts) {
        this.name = name;
        this.matrix = matrix;
        this.scene = scene;
        this.fontAsset = null;
        this.textMesh = null;
        this.renderMode = this.RenderMode.vector;
        this.renderText = false;
        this.visible = true;
        this.textToRender = this.name;

        this.vectorsInMatrix = [null, null, null];

        if(opts != null) {
            if (opts['renderMode'] != null)
                this.renderMode = opts['renderMode'];

            if (opts['renderText'] != null)
                this.renderText = opts['renderText'];

            if (opts['textToRender'] != null && opts['textToRender'] != "")
                this.textToRender = opts['textToRender'];

            if (opts['visible'] != null) {
                this.visible = opts['visible'];
            }

            if (opts['fontAsset'] != null)
                this.fontAsset = opts['fontAsset'];
        }

        this.sceneObj = this.createRenderObject(this.renderMode, this.vectorsInMatrix, this.matrix);
        this.show(this.visible);
        if(this.scene != null)
            this.scene.add(this.sceneObj);
    }

    set(matrix, opts)
    {
        this.visible = true;
        this.matrix = matrix;

        if(opts != null)
        {
            if(opts['color'])
                this.color = opts['color'];

            if(opts['renderMode'] != null)
                this.renderMode = opts['renderMode'];

            if (opts['renderText'])
                this.renderText = opts['renderText'];

            if (opts['textToRender'] != null && opts['textToRender'] != "")
                this.textToRender = opts['textToRender'];

            if (opts['visible'])
                this.visible = opts['visible'];

            if (opts['fontAsset'])
                this.fontAsset = opts['fontAsset'];
        }


        for(let i = 0; i < 3; ++i)
        {
            if(this.vectorsInMatrix[i] == null)
                continue;

            this.vectorsInMatrix[i].destroy();
            this.vectorsInMatrix[i] = null
        }

        this.sceneObj = this.createRenderObject(this.renderMode, this.vectorsInMatrix, this.matrix);
        this.show(this.visible);
    }

    destroy()
    {
        if(this.scene != null  && this.sceneObj != null) {
            this.scene.remove(this.sceneObj);
        }

        for(let i = 0; i < 3; ++i)
        {
            if(this.vectorsInMatrix[i] == null)
                continue;

            this.vectorsInMatrix[i].destroy();
            this.vectorsInMatrix[i] = null
        }
        this.name = "";
    }

    show(visible)
    {
        this.visible = visible;
        
        for(let i = 0; i < 3; ++i) {
            if (this.vectorsInMatrix[i] == null)
                continue;
            this.vectorsInMatrix[i].show(this.visible);
        }
    }

    createRenderObject(renderMode, vectorsInMatrix, matrix)
    {
        if(renderMode == this.RenderMode.vector)
        {
            return this.createArrowRenderObject(vectorsInMatrix, matrix);
        }
    }

    createArrowRenderObject(vectorsInMatrix, matrix)
    {
        const group = new THREE.Group();

        let xAxis = new THREE.Vector3();
        let yAxis = new THREE.Vector3();
        let zAxis = new THREE.Vector3();
        matrix.extractBasis(xAxis, yAxis, zAxis);
        const position = new THREE.Vector3();
        position.setFromMatrixPosition(matrix);
        xAxis.add(position);
        yAxis.add(position);
        zAxis.add(position);

        vectorsInMatrix[0] = new VectorRenderObject("left", 0xFF0000, position, xAxis, null);
        vectorsInMatrix[1] = new VectorRenderObject("up", 0x00FF00, position, yAxis, null);
        vectorsInMatrix[2] = new VectorRenderObject("forward", 0x0000FF, position, zAxis, null);

        group.add(vectorsInMatrix[0].sceneObj);
        group.add(vectorsInMatrix[1].sceneObj);
        group.add(vectorsInMatrix[2].sceneObj);

        let textPosition = vectorsInMatrix[1].getStartPoint();
        textPosition.add(new THREE.Vector3(0.5,0.1, 0));
        this.textMesh = this.createTextRenderObject(group, MathHelpers.getRandomColor(), textPosition);

        return group;
    }


    createTextRenderObject(group, color, position)
    {
        const fontAsset = MatrixRenderObject.assets["fonts"]["defaultFont"];
        if(fontAsset == null)
            return null;

        if(this.renderText == false)
            return null;

        const textGeometry = new TextGeometry(
            this.textToRender,
            {
                font: fontAsset,
                size: 0.08,
                height: 0.01,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 0.0001,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5,
                depth: 0.01
            }
        )
        const textMaterial = new THREE.MeshBasicMaterial({color: color})
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(position.x, position.y, position.z);
        group.add(textMesh);

        return textMesh;
    }

    onUpdate(camera)
    {
        if(this.textMesh != null)
        {
            this.onUpdateTextMesh(camera);
        }
    }

    onUpdateTextMesh(camera)
    {
        if(this.textMesh == null)
            return;

        const look = new THREE.Vector3();
        look.subVectors(camera.position, this.textMesh.position);

        this.textMesh.lookAt(look);
    }
}