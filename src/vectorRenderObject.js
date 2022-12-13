import {Vector3} from "three";
import * as THREE from "three";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import MathHelpers from './mathHelpers'

export default class VectorRenderObject
{
    assets = {}

    RenderMode = {
        vector: "vector",
        waypoint: "waypoint",
        line: "line",
        dashedLine: "dashedLine",
        man: "man",
        dog: "dog",
        spaceship: "spaceship",
        triangle: "triangle",
        box: "box",
        torus: "torus",
        plane: "plane",
        angle: "angle"
    }



    constructor(name, color, startPoint, endPoint, scene, opts) {
        this.name = name;
        this.color = color;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.magnitude = this.computeMagnitude();
        this.scene = scene;
        this.fontAsset = null;
        this.textMesh = null;
        this.renderMode = this.RenderMode.vector;
        this.renderText = false;
        this.visible = true;
        this.textToRender = this.name;
        this.scaleVector = new THREE.Vector3(1,1,1);
        this.basisVectorA = null;
        this.basisVectorB = null;

        if(this.color == null)
        {
            this.color = MathHelpers.getRandomColor();
        }

        if(opts != null) {
            if (opts['renderMode'] != null)
                this.renderMode = opts['renderMode'];

            if (opts['renderText'] != null)
                this.renderText = opts['renderText'];

            if (opts['visible'] != null) {
                this.visible = opts['visible'];
            }

            if (opts['fontAsset'] != null)
                this.fontAsset = opts['fontAsset'];

            if (opts['textToRender'] != null && opts['textToRender'] != "")
                this.textToRender = opts['textToRender'];

            if (opts['scaleVector'] != null)
                this.scaleVector = opts['scaleVector'];

            if (opts['basisVectorA'] != null)
                this.basisVectorA = opts['basisVectorA'];

            if (opts['basisVectorB'] != null)
                this.basisVectorB = opts['basisVectorB'];
        }

        this.sceneObj = this.createRenderObject(this.color, this.renderMode, this.startPoint, this.endPoint, this.scaleVector, this.basisVectorA, this.basisVectorB);
        this.sceneObj.visible = this.visible;

        if(this.scene != null)
            this.scene.add(this.sceneObj);
    }

    set(startPoint, endPoint, opts)
    {
        this.visible = true;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.magnitude = this.computeMagnitude();

        if(opts != null)
        {
            if(opts['color'])
                this.color = opts['color'];

            if(opts['renderMode'] != null)
                this.renderMode = opts['renderMode'];

            if (opts['renderText'])
                this.renderText = opts['renderText'];

            if (opts['visible'])
                this.visible = opts['visible'];

            if (opts['fontAsset'])
                this.fontAsset = opts['fontAsset'];

            if (opts['textToRender'] != null && opts['textToRender'] != "")
                this.textToRender = opts['textToRender'];

            if (opts['scaleVector'] != null)
                this.scaleVector = opts['scaleVector'];

            if (opts['basisVectorA'] != null)
                this.basisVectorA = opts['basisVectorA'];

            if (opts['basisVectorB'] != null)
                this.basisVectorB = opts['basisVectorB'];
        }


        if(this.sceneObj != null)
        {
            this.sceneObj.clear();
            if(this.scene != null)
                this.scene.remove(this.sceneObj);
            this.sceneObj = null;
        }

        this.sceneObj = this.createRenderObject(this.color, this.renderMode, this.startPoint, this.endPoint, this.scaleVector, this.basisVectorA, this.basisVectorB);
        this.sceneObj.visible = this.visible;

        if(this.scene != null)
            this.scene.add(this.sceneObj);
    }

    destroy()
    {
        if(this.sceneObj != null)
        {
            this.sceneObj.clear();
            if(this.scene != null)
                this.scene.remove(this.sceneObj);
        }
        this.sceneObj = null;
        this.name = "";
    }

    show(visible)
    {
        this.visible = visible;

        if(this.sceneObj == null)
            return;

        this.sceneObj.visible = this.visible;
    }

    getStartPoint()
    {
        const vector = new THREE.Vector3(this.startPoint.x, this.startPoint.y, this.startPoint.z);
        return vector;
    }

    getEndPoint()
    {
        const vector = new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z);
        return vector;
    }

    computeNormal()
    {
        const normal = new Vector3();
        normal.subVectors(this.endPoint, this.startPoint);
        normal.normalize();

        return normal;
    }

    getScale()
    {
        return this.scaleVector.clone();
    }

    computeMagnitude()
    {
        const look = new Vector3();
        look.subVectors(this.endPoint, this.startPoint);

        return look.length();
    }

    normalize()
    {
        const normal = new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z);
        normal.sub(this.startPoint);
        normal.normalize();

        this.endPoint.addVectors(this.startPoint, normal);

        this.set(this.startPoint, this.endPoint);
    }

    createRenderObject(color, renderMode, startPoint, endPoint, scaleVector, basisVectorA, basisVectorB)
    {
        if(renderMode == this.RenderMode.vector)
        {
            return this.createArrowRenderObject(color, startPoint, endPoint);
        }
        else if(renderMode == this.RenderMode.line)
        {
            return this.createLineRenderObject(color, startPoint, endPoint);
        }
        else if(renderMode == this.RenderMode.dashedLine)
        {
            return this.createDashedLineRenderObject(color, startPoint, endPoint);
        }
        else if(renderMode == this.RenderMode.angle)
        {
            return this.createAngleRenderObject(color, startPoint, endPoint, basisVectorA, basisVectorB);
        }
        else if(renderMode == this.RenderMode.waypoint)
        {
            return this.createWaypointRenderObject(color, startPoint, scaleVector);
        }
        else if(renderMode == this.RenderMode.man ||
                renderMode == this.RenderMode.dog ||
                renderMode == this.RenderMode.spaceship ||
                renderMode == this.RenderMode.triangle ||
                renderMode == this.RenderMode.box ||
                renderMode == this.RenderMode.torus ||
                renderMode == this.RenderMode.plane)
        {
            return this.createModelRenderObject(renderMode, color, startPoint, endPoint, scaleVector);
        }
    }

    isModel()
    {
        if( this.renderMode == this.RenderMode.man ||
            this.renderMode == this.RenderMode.dog ||
            this.renderMode == this.RenderMode.spaceship ||
            this.renderMode == this.RenderMode.triangle ||
            this.renderMode == this.RenderMode.box ||
            this.renderMode == this.RenderMode.torus ||
            this.renderMode == this.RenderMode.plane ||
            this.renderMode == this.RenderMode.waypoint )
            return true;

        return false;
    }

    createArrowRenderObject(color, startPoint, endPoint)
    {
        const lookVec = new THREE.Vector3();
        lookVec.subVectors(endPoint, startPoint);

        const fudgeFactor = 0.97;
        const vecMagnitude = lookVec.length() * fudgeFactor;
        const halfVecMagnitude = vecMagnitude * 0.5;
        const lookVecNormal = new THREE.Vector3(lookVec.x, lookVec.y, lookVec.z);
        lookVecNormal.normalize();

        const group = new THREE.Group();
        const material = new THREE.MeshPhongMaterial({color:color});

        const cylinderGeom = new THREE.CylinderGeometry(0.01,0.01,vecMagnitude,32);
        const cylinder = new THREE.Mesh(cylinderGeom, material);
        cylinder.name = "cylinder"
        cylinder.position.set(0,0, halfVecMagnitude);
        cylinder.rotation.set(Math.PI*0.5,0,0);
        group.add(cylinder);

        const material1 = new THREE.MeshPhongMaterial({color:0x0000FF});
        const coneGeom = new THREE.ConeGeometry(0.05,0.1,32);
        const cone = new THREE.Mesh(coneGeom, material1);
        cone.name = "cone";
        cone.position.set(0, 0, vecMagnitude - 0.02);
        cone.rotation.set(Math.PI*0.5,0,0);
        group.add(cone);

        const basePos = new THREE.Vector3(cone.position.x, cone.position.y, cone.position.z);
        const wp = cone.localToWorld(basePos);
        wp.add(new Vector3(0,0.05, 0));
        this.textMesh = this.createTextRenderObject(group, color, wp);

        group.lookAt(lookVecNormal);
        group.position.set(startPoint.x, startPoint.y, startPoint.z);

        return group;
    }

    createLineRenderObject(color, startPoint, endPoint)
    {
        const lookVec = new THREE.Vector3();
        lookVec.subVectors(endPoint, startPoint);

        const fudgeFactor = 1.0;
        const vecMagnitude = lookVec.length() * fudgeFactor;
        const halfVecMagnitude = vecMagnitude * 0.5;
        const lookVecNormal = new THREE.Vector3(lookVec.x, lookVec.y, lookVec.z);
        lookVecNormal.normalize();

        const group = new THREE.Group();
        const material = new THREE.MeshPhongMaterial({color:color});

        const cylinderGeom = new THREE.CylinderGeometry(0.01,0.01,vecMagnitude,32);
        const cylinder = new THREE.Mesh(cylinderGeom, material);
        cylinder.name = "cylinder"
        cylinder.position.set(0,0, halfVecMagnitude);
        cylinder.rotation.set(Math.PI*0.5,0,0);
        group.add(cylinder);

        group.lookAt(lookVecNormal);
        group.position.set(startPoint.x, startPoint.y, startPoint.z);

        const basePos = new THREE.Vector3(0, 0, 1);
        basePos.add(new Vector3(0.05,0.05, 0));
        const wp = group.worldToLocal(basePos);
        this.textMesh = this.createTextRenderObject(group, color, wp);

        return group;
    }

    createDashedLineRenderObject(color, startPoint, endPoint)
    {
        const tempEndPoint = new Vector3(endPoint.x,endPoint.y,endPoint.z);
        const lookVec = new THREE.Vector3();
        lookVec.subVectors(endPoint, startPoint);

        const vecMagnitude = lookVec.length();
        const halfVecMagnitude = vecMagnitude * 0.5;
        const lookVecNormal = new THREE.Vector3(lookVec.x, lookVec.y, lookVec.z);
        lookVecNormal.normalize();

        const group = new THREE.Group();
        const material = new THREE.MeshPhongMaterial({color:color});

        const lengthOfSingleDash = 0.1;
        const halfMagnitudeOfSingleDash = lengthOfSingleDash * 0.5;
        const numberOfDashes =  vecMagnitude / lengthOfSingleDash;
        const cylinderGeom = new THREE.CylinderGeometry(0.01, 0.01, halfMagnitudeOfSingleDash, 32);

        for(let currentDashCount = 0; currentDashCount < numberOfDashes; ++currentDashCount) {

            // Ensure that our dashed line doesn't overshoot the length of the magnitude of the vector.
            const currentDashPosition = new THREE.Vector3(0, 0, halfMagnitudeOfSingleDash + (currentDashCount*lengthOfSingleDash));
            if(currentDashPosition.length() >= vecMagnitude)
                break;

            const cylinder = new THREE.Mesh(cylinderGeom, material);
            cylinder.name = "cylinder"
            cylinder.position.set(currentDashPosition.x, currentDashPosition.y, currentDashPosition.z);
            cylinder.rotation.set(Math.PI * 0.5, 0, 0);
            group.add(cylinder);
        }

        group.lookAt(lookVecNormal);
        group.position.set(startPoint.x, startPoint.y, startPoint.z);

        const startPos = new THREE.Vector3(0, 0, 0);
        const endPos = new THREE.Vector3(0, 0, 1);
        const basePos = MathHelpers.lerpVectors(startPos, endPos, 0.75);
        basePos.add(new Vector3(0.05,0.05, 0));
        const wp = group.worldToLocal(basePos);
        this.textMesh = this.createTextRenderObject(group, color, wp);

        return group;
    }

    createAngleRenderObject(color, startPoint, endPoint, basisVectorA, basisVectorB)
    {
        let controlPointA = MathHelpers.lerpVectors(startPoint, endPoint, 0.4);
        controlPointA = MathHelpers.lerpVectors(basisVectorA.getStartPoint(), controlPointA, 1.4);

        let controlPointB = MathHelpers.lerpVectors(startPoint, endPoint, 0.6);
        controlPointB = MathHelpers.lerpVectors(basisVectorB.getStartPoint(), controlPointB, 1.4);

        const group = new THREE.Group();
        const curve = new THREE.CubicBezierCurve3(
            startPoint,
            controlPointA,
            controlPointB,
            endPoint
        );

        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial({color:color});

        // Create the final object to add to the scene
        const curveObject = new THREE.Line( geometry, material );
        group.add(curveObject);

        let wp = MathHelpers.lerpVectors(startPoint, endPoint, 0.5);
        wp = MathHelpers.lerpVectors(basisVectorB.getStartPoint(), wp, 1.5);
        this.textMesh = this.createTextRenderObject(group, color, wp);

        return group;
    }

    createWaypointRenderObject(color, position, scaleVector)
    {
        const group = new THREE.Group();
        const material = new THREE.MeshPhongMaterial({color:color});

        const sphereGeom = new THREE.SphereGeometry(0.05, 32, 16);
        const sphere = new THREE.Mesh(sphereGeom, material);
        sphere.name = "sphere"
        sphere.position.set(0,0,0);
        group.add(sphere);

        const basePos = new THREE.Vector3(sphere.position.x, sphere.position.y, sphere.position.z);
        const wp = sphere.localToWorld(basePos);
        wp.add(new Vector3(0,0.05, 0));
        this.textMesh = this.createTextRenderObject(group, color, wp);

        group.position.set(position.x, position.y, position.z);
        group.scale.set(scaleVector.x, scaleVector.y, scaleVector.z);

        return group;
    }

    createModelRenderObject(assetName, color, startPosition, endPosition, scaleVector)
    {
        let model = VectorRenderObject.assets["models"][assetName].clone();
        let mesh = null;

        const group = new THREE.Group();
        let material = new THREE.MeshPhongMaterial({
            color:color,
            wireframe:false
        });
        model.traverse(
            function ( child ) {
                if ( child.isMesh ) {
                    child.material = material;
                    mesh = child.geometry;
                }
            }
        );
        model.position.set(0,0,0);
        group.add(model);

        let wireframe = new THREE.WireframeGeometry( mesh );
        let line = new THREE.LineSegments( wireframe );
        line.material.color.setHex(0x000000);
        group.add(line);

        const basePos = new THREE.Vector3(0, 1.1, 0);
        const wp = model.localToWorld(basePos);
        this.textMesh = this.createTextRenderObject(group, color, wp);

        const lookVectorNormal = endPosition.clone();
        lookVectorNormal.sub(startPosition);
        lookVectorNormal.normalize();
        group.lookAt(lookVectorNormal.x, lookVectorNormal.y, lookVectorNormal.z);
        group.position.set(startPosition.x, startPosition.y, startPosition.z);
        group.scale.set(scaleVector.x, scaleVector.y, scaleVector.z);

        return group;
    }

    createTextRenderObject(group, color, position)
    {
        if(this.fontAsset == null)
            return null;

        if(this.renderText == false)
            return null;

        const textGeometry = new TextGeometry(
            this.textToRender,
            {
                font: this.fontAsset,
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