import {GUI} from "lil-gui";
import VectorMenu from './vectorMenu'
import VectorOperationsMenu from './vectorOperationMenu'
import VectorOperationMenu from "./vectorOperationMenu";
import ScalarOperationMenu from "./scalarOperationMenu";
import SceneMenu from "./sceneMenu";
import CameraMenu from "./cameraMenu";
import CommandMenu from "./commandMenu";
import SettingsMenu from "./settingsMenu";
import * as THREE from "three";
import CommandProcessor from "./commandProcessor";
import * as MathJS from 'mathjs'
import * as XTerm from 'xterm'
import CommandTerminal from "./commandTerminal";
import VectorListManager from "./vectorListManager";
import MatrixListManager from "./matrixListManager";
import MatrixOperationMenu from "./matrixOperationMenu";
import MatrixMenu from "./matrixMenu";
import CodeEditor from "./codeEditor";

export default class MenuController
{
    context = {
        vectorListManager: null,
        matrixListManager: null,
        scene: null,
        cmdProcessor: null,
        renderer: null,
        camera: null,
        orbitControls:null,
        assets: null,

        vectorOperationCount: 0,
        matrixOperationCount: 0,
        randomVectorCount: 0,
        backgroundColor: 0xffffff,
        showGrid: true,
        centerLineGridColor: 0x444444,
        gridColor: 0x888888,
        showAxisRings: true,
        xAxisRingColor: 0xFF0000,
        yAxisRingColor: 0x00FF00,
        zAxisRingColor: 0x0000FF,
        needsFullMenuRefresh: false,
        showPerformanceStats: false,
        stats: null,
        mathParser:null,
        commandTerminal:null,
        codeEditor:null
    }

    constructor(params)
    {
        this.context.scene = params.scene;
        this.context.renderer = params.renderer;
        this.context.camera = params.camera;
        this.context.orbitControls = params.orbitControls;
        this.context.assets = params.assets;

        // https://mathjs.org/docs/expressions/syntax.html
        this.context.mathParser = MathJS.parser();
/*
        this.context.xterm = new XTerm.Terminal();
        this.context.xterm.open(document.getElementById('terminal'));
        this.context.xterm.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
*/

        this.context.cmdProcessor = new CommandProcessor(this.context);
        this.context.commandTerminal = new CommandTerminal(this.context);
        this.context.codeEditor = new CodeEditor(this.context);

        this.context.vectorListManager = new VectorListManager(this.context.scene, this.context.codeEditor);
        this.context.matrixListManager = new MatrixListManager(this.context.scene, this.context.codeEditor);

        this.menuIsOpen = false;

        this.initScene();
        //this.testCmdProcessor();
    }

    testCmdProcessor()
    {
        const cmdList = [
            {
                "cmdName": "lerpVector",
                "cmdArgs": {"vectorA": "forward", "vectorB": "left", "t":0.1}
            },
            {
                "cmdName": "normalizeVector",
                "cmdArgs": {"vector": "Result0"}
            },
            {
                "cmdName": "lerpVector",
                "cmdArgs": {"vectorA": "forward", "vectorB": "left", "t":0.2}
            },
            {
                "cmdName": "normalizeVector",
                "cmdArgs": {"vector": "Result1"}
            },
            {
                "cmdName": "translateVectorToPoint",
                "cmdArgs": {"from": "Result0", "to": "up"}
            },
            {
                "cmdName": "translateVector",
                "cmdArgs": {"vector": "Result0", "startX": 1, "startY": 2, "startZ": 3}
            },
            {
                "cmdName": "negateVector",
                "cmdArgs": {"vector": "up"}
            }
        ];

        this.context.cmdProcessor.executeCmdList(cmdList);
    }

    getContext()
    {
        return this.context;
    }

    initScene()
    {
        this.createAllMenus();
        this.context.cmdProcessor.executeCmd("resetScene", {});
        this.initializeAllMenus();
        this.context.needsFullMenuRefresh = false;
    }

    update()
    {
        for(let vectorName in this.context.vectorListManager.getList()) {

            const vectorObj = this.context.vectorListManager.get(vectorName);
            if (vectorObj == null)
                continue;

            vectorObj.onUpdate(this.context.camera);
        }

        for(let matrixName in this.context.matrixListManager.getList()) {

            const matrixObj = this.context.matrixListManager.get(matrixName);
            if (matrixObj == null)
                continue;

            matrixObj.onUpdate(this.context.camera);
        }

        if(this.context.needsFullMenuRefresh) {
            this.rebuildAllMenus();
            this.context.needsFullMenuRefresh = false;
        }

        if(this.settingsMenu != null)
            this.settingsMenu.onUpdate();
    }

    destroyAllMenus()
    {
        if(this.gui != null) {
            this.gui.destroy();
            this.gui = null;
        }

        if(this.sceneMenu != null)
        {
            delete this.sceneMenu;
            this.sceneMenu = null;
        }

        if(this.vectorOperationsMenu != null)
        {
            delete this.vectorOperationsMenu;
            this.vectorOperationsMenu = null;
        }

        if(this.matrixOperationsMenu != null)
        {
            delete this.matrixOperationsMenu;
            this.matrixOperationsMenu = null;
        }

        if(this.scalarOperationsMenu != null)
        {
            delete this.scalarOperationsMenu;
            this.scalarOperationsMenu = null;
        }

        if(this.vectorMenu != null)
        {
            delete this.vectorMenu;
            this.vectorMenu = null;
        }

        if(this.matrixMenu != null)
        {
            delete this.matrixMenu;
            this.matrixMenu = null;
        }

        if(this.commandMenu != null)
        {
            delete this.commandMenu;
            this.commandMenu = null;
        }

        if(this.cameraMenu != null)
        {
            delete this.cameraMenu;
            this.cameraMenu = null;
        }

        if(this.settingsMenu != null)
        {
            this.settingsMenu.destroy();
            delete this.settingsMenu;
            this.settingsMenu = null;
        }
    }

    createAllMenus()
    {
        this.gui = new GUI();
        this.gui.title("Menu");
        this.gui.close();

        this.sceneMenu = new SceneMenu(this.gui, this.context);
        this.vectorOperationsMenu = new VectorOperationMenu(this.gui, this.context);
        this.matrixOperationsMenu = new MatrixOperationMenu(this.gui, this.context);
        this.scalarOperationsMenu = new ScalarOperationMenu(this.gui, this.context);
        this.vectorMenu = new VectorMenu(this.gui, this.context);
        this.matrixMenu = new MatrixMenu(this.gui, this.context);
        this.commandMenu = new CommandMenu(this.gui, this.context);
        this.cameraMenu = new CameraMenu(this.gui, this.context);
        this.settingsMenu = new SettingsMenu(this.gui, this.context);
    }

    initializeAllMenus()
    {
        if(this.sceneMenu != null)
        {
            this.sceneMenu.rebuildMenu();
        }

        if(this.vectorOperationsMenu != null)
        {
            this.vectorOperationsMenu.rebuildMenu();
        }

        if(this.matrixOperationsMenu != null)
        {
            this.matrixOperationsMenu.rebuildMenu();
        }

        if(this.scalarOperationsMenu != null)
        {
            this.scalarOperationsMenu.rebuildMenu();
        }

        if(this.vectorMenu != null)
        {
            this.vectorMenu.rebuildMenu();
        }

        if(this.matrixMenu != null)
        {
            this.matrixMenu.rebuildMenu();
        }

        if(this.commandMenu != null)
        {
            this.commandMenu.rebuildMenu();
        }

        if(this.cameraMenu != null)
        {
            this.cameraMenu.rebuildMenu();
        }

        if(this.settingsMenu != null)
        {
            this.settingsMenu.rebuildMenu();
        }

        const youtubeParams =  {
            gotoYoutubeChannel: function() {
                window.open(
                    "https://www.youtube.com/channel/UCzeV52zIWLoIOwIYGsoa4TA", "_blank");
            }
        };
        this.gui.add(youtubeParams, "gotoYoutubeChannel").name("Youtube Channel");

        const aboutParams =  {
            about: function() {
                alert("Vector Math Playground was developed by Brandon Fogerty\nto help visualize vector opertaions.\nbfogerty at gmail dot com");
            }
        };
        this.gui.add(aboutParams, "about").name("About");
    }

    rebuildAllMenus()
    {
        this.destroyAllMenus();
        this.createAllMenus();
        this.initializeAllMenus();
        this.menuIsOpen = false;
    }

    open()
    {
        if(this.gui == null)
            return;

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

    processShortcut(event)
    {
        if(event.key == "`") {
            this.context.commandTerminal.toggle();
        }

        if(event.key == "!") {
            this.context.codeEditor.open();
        }

        /*
        else if(event.key == "a") {
            const cmdArgs = {"resetCommandHistory": true};
            this.context.cmdProcessor.executeCmd("resetScene", cmdArgs);
        }
        else if(event.key == "s") {
            const cmdArgs = {};
            this.context.cmdProcessor.executeCmd("clearScene", cmdArgs);
        }

        if(event.key == "q") {
                this.toggle();
        }
        else if(event.key == "w") {
            if(this.sceneMenu != null) {
                this.sceneMenu.toggle();
            }
        }
        else if(event.key == "e") {

            if(this.vectorOperationsMenu != null) {
                this.vectorOperationsMenu.toggle();
            }
        }
        else if(event.key == "r") {

            if(this.scalarOperationsMenu != null) {
                this.scalarOperationsMenu.toggle();
            }
        }
        else if(event.key == "t") {

            if(this.vectorMenu != null) {
                this.vectorMenu.toggle();
            }
        }
        else if(event.key == "y") {

            if(this.commandMenu != null) {
                this.commandMenu.toggle();
            }
        }
        else if(event.key == "u") {

            if(this.settingsMenu != null) {
                this.settingsMenu.toggle();
            }
        }
        */
    }
}