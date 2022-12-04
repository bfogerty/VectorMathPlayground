import * as THREE from 'three'
import {MathUtils, Vector3} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls.js'
import {TransformControls} from 'three/examples/jsm/controls/TransformControls.js'
import {ArcballControls} from 'three/examples/jsm/controls/ArcballControls.js'
import {FlyControls} from 'three/examples/jsm/controls/FlyControls.js'
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls.js'
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js'
import * as dat from "lil-gui"
import MenuController from './menuController'
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import VectorRenderObject from './vectorRenderObject.js'
import MatrixRenderObject from './matrixRenderObject.js'

export default class Application {

    context = {
        canvas: null,
        renderer: null,
        scene: null,
        camera: null,
        windowWidth: 0,
        windowHeight: 0,
        controls: null,
        menuController: null,
        assets: null,
        clock: null
    };

    constructor(params)
    {
        this.context.canvas = params.canvas;
        this.context.renderer = params.renderer;
        this.context.scene = params.scene;
        this.context.camera = params.camera;
        this.context.assets = params.assets;

        this.context.windowWidth = window.innerWidth;
        this.context.windowHeight = window.innerHeight;
        this.keyWasPreviouslyDown = false;

        this.context.clock = new THREE.Clock();

        VectorRenderObject.assets = this.context.assets;
        MatrixRenderObject.assets = this.context.assets;

        this.setupScene();
    }

    setupMenus()
    {
        const menuControllerParams = {
                scene: this.context.scene,
                renderer: this.context.renderer,
                camera: this.context.camera,
                orbitControls: this.context.controls,
                assets: this.context.assets
            };

        this.context.menuController = new MenuController(menuControllerParams);
    }

    setupCamera() {
        this.context.camera.position.x = -1;
        this.context.camera.position.y = 1.3;
        this.context.camera.position.z = 3;
    }

    setupLights()
    {
        const ambientLight = new THREE.AmbientLight();
        ambientLight.color = new THREE.Color(0xffffff);
        ambientLight.intensity = 0.1;
        this.context.scene.add(ambientLight);

        const pointLightIntensity = 0.8;
        const pointLights = [
            new THREE.PointLight(0xffffff, pointLightIntensity),
            new THREE.PointLight(0xffffff, pointLightIntensity),
            new THREE.PointLight(0xffffff, pointLightIntensity),
            new THREE.PointLight(0xffffff, pointLightIntensity)
        ];

        const uniformPos = 10;
        pointLights[0].position.x = uniformPos;
        pointLights[0].position.y = uniformPos;
        pointLights[0].position.z = uniformPos;
        this.context.scene.add(pointLights[0]);

        pointLights[1].position.x = -uniformPos;
        pointLights[1].position.y = uniformPos;
        pointLights[1].position.z = uniformPos;
        this.context.scene.add(pointLights[1]);

        pointLights[2].position.x = -uniformPos;
        pointLights[2].position.y = uniformPos;
        pointLights[2].position.z = -uniformPos;
        this.context.scene.add(pointLights[2]);

        pointLights[3].position.x = uniformPos;
        pointLights[3].position.y = uniformPos;
        pointLights[3].position.z = -uniformPos;
        this.context.scene.add(pointLights[3]);
    }

    setupControls() {
        this.context.controls = new OrbitControls(this.context.camera, this.context.canvas);
        this.context.controls.enableDamping = true;
        this.context.controls.target.x = this.context.controls.target.y = this.context.controls.target.z = 0;
        this.context.controls.update();

        //this.context.controls = new TransformControls( this.context.camera, this.context.canvas );

        //this.context.controls = new TrackballControls( this.context.camera, this.context.canvas );

        //this.context.controls = new ArcballControls( this.context.camera, this.context.canvas, this.context.scene );

        /*
        this.context.controls = new FlyControls(this.context.camera, this.context.canvas);
        this.context.controls.dragToLook = true;
        this.context.controls.autoForward = true;
        this.context.controls.movementSpeed = 1;
        this.context.controls.rollSpeed = 0;
         */

        //this.context.controls = new FirstPersonControls(this.context.camera, this.context.canvas);
        //this.context.controls.activeLook = false;

        //this.context.controls = new PointerLockControls(this.context.camera, this.context.canvas);
    }

    setupRenderer() {
        this.context.windowWidth = window.innerWidth;
        this.context.windowHeight = window.innerHeight;

        this.context.camera.aspect = this.context.windowWidth / this.context.windowHeight;
        this.context.camera.updateProjectionMatrix();

        this.context.renderer.setSize(this.context.windowWidth, this.context.windowHeight);
        this.context.scene.background = new THREE.Color(this.context.menuController.getContext().backgroundColor);
    }

    setupScene() {
        this.setupCamera();
        this.setupControls();
        this.setupLights();
        this.setupMenus();
        this.setupRenderer();
    }

    onResize()
    {
        this.setupRenderer();
    }

    onKeyDown(event)
    {
        if(this.keyWasPreviouslyDown)
            return;

        this.context.menuController.processShortcut(event);

        this.keyWasPreviouslyDown = true;
    }

    onKeyUp(event)
    {
        this.keyWasPreviouslyDown = false;
    }

    onUpdate() {
        this.context.controls.update(this.context.clock.getDelta());
        this.context.menuController.update();
        this.context.renderer.render(this.context.scene, this.context.camera);
    }
}

