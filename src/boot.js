import './style.css'
//import 'simple-lightbox/dist/simpleLightbox.min.css'
import * as THREE from 'three'
import {MathUtils, Vector3} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from "lil-gui"
import MenuController from './menuController'
import Application from './application'

import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { LoadingManager } from 'three'

import * as XTerm from 'xterm'
var SimpleLightbox = require('simple-lightbox');

const assets = {
    fonts:{},
    models:{}
}

const resourceList = {
        "/fonts/helvetiker_regular.typeface.json":
        {
            type:"font",
            name:"defaultFont",
            onLoadCallback: setupLoadingScene
        },
        "./models/man.obj":
        {
            type:"model",
            name:"man",
            onLoadCallback:null
        },
        "./models/dog.obj":
        {
                type:"model",
                name:"dog",
                onLoadCallback:null
        },
        "./models/spaceship.obj":
        {
            type:"model",
            name:"spaceship",
            onLoadCallback:null
        },
        "./models/triangle.obj":
        {
            type:"model",
            name:"triangle",
            onLoadCallback:null
        },
        "./models/box.obj":
        {
            type:"model",
            name:"box",
            onLoadCallback:null
        },
        "./models/torus.obj":
        {
            type:"model",
            name:"torus",
            onLoadCallback:null
        },
        "./models/plane.obj":
        {
            type:"model",
            name:"plane",
            onLoadCallback:null
        },
};
const loadingManager = new LoadingManager();
loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

    console.log("onProgress");
    if(itemsLoaded == itemsTotal)
    {
        onLoadingAllAssetsComplete();
        return;
    }

};

const fontLoader = new FontLoader(loadingManager);
const objLoader = new OBJLoader(loadingManager);
for(let resourceURL in resourceList)
{
    const resource = resourceList[resourceURL];
    if(resource["type"] == "font")
    {
        //fontLoader.load('/fonts/helvetiker_regular.typeface.json');
        fontLoader.load(resourceURL, (font) =>
        {
            console.log("Loaded " + resourceURL);
            let resourceCategory = assets["fonts"];
            resourceCategory[resource["name"]] = font;
            if(resource["onLoadCallback"] != null)
                resource["onLoadCallback"]();
        });
    }
    else if(resource["type"] == "model")
    {
        objLoader.load(resourceURL,
            function ( object ) {
                console.log("Loaded " + resourceURL);
                let resourceCategory = assets["models"];
                resourceCategory[resource["name"]] = object;
                if(resource["onLoadCallback"] != null)
                    resource["onLoadCallback"]();
            });
    }
}

const sizes = {
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio
};

let application = null;
let loadingGemoetry = null;
let loadingComplete = false;
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height);


const renderer = new THREE.WebGL1Renderer({
    canvas: canvas,
    antialias: true,
    alpha: false
});

function setupCamera()
{
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 3;
}

function setupRenderer()
{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    scene.background = new THREE.Color( 0xffffff );
}

function setupBootScene()
{
    setupCamera();
    setupRenderer();
    window.addEventListener('resize', onBootResizeEventListener);
    scene.add(camera);
}

function shutdownBootLoader()
{
    window.removeEventListener('resize', onBootResizeEventListener);
    shutdownLoadingScene();
}

function updateBootLoop()
{
    renderer.render(scene, camera);
    if(loadingComplete)
        window.requestAnimationFrame(updateApplicationLoop);
    else
        window.requestAnimationFrame(updateBootLoop);
}

function onBootResizeEventListener()
{
    setupRenderer();
}

function setupLoadingScene()
{
    const textGeometry = new TextGeometry(
        'Loading...',
        {
            font: assets["fonts"]["defaultFont"],
            size: 0.1,
            height: 0.001,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0.0001,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
            depth: 0.01
        }
    )
    const textMaterial = new THREE.MeshBasicMaterial({color:0x000000})
    loadingGemoetry = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(loadingGemoetry);
}

function shutdownLoadingScene()
{
    scene.remove(loadingGemoetry);
    loadingGemoetry = null;
}

function onLoadingAllAssetsComplete()
{
    loadingComplete = true;
    shutdownBootLoader();
    initializeApplication();
}

function initializeApplication()
{
    const params = {
        canvas: canvas,
        renderer: renderer,
        scene: scene,
        camera: camera,
        assets: assets
    };

    application = new Application(params);

    window.addEventListener('resize', onApplicationResizeEventListener);
    window.addEventListener("keydown", onApplicationKeyDownEventListener);
    window.addEventListener("keyup", onApplicationKeyUpEventListener);
}

function updateApplicationLoop()
{
    if(application != null)
        application.onUpdate();
    window.requestAnimationFrame(updateApplicationLoop);
}

function onApplicationResizeEventListener()
{
    if(application != null)
        application.onResize();
}

function onApplicationKeyDownEventListener(event)
{
    if(application != null)
        application.onKeyDown(event);
}

function onApplicationKeyUpEventListener(event)
{
    if(application != null)
        application.onKeyUp(event);
}

setupBootScene();
updateBootLoop();

