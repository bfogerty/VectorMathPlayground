import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import Stats from 'three/examples/jsm/libs/stats.module'

export default class SettingsMenu
{
    constructor(parentGUI, context)
    {
        this.parentGUI = parentGUI;
        this.context = context;
        this.grid = null;
        this.axisRings = null;
        this.menuIsOpen = false;
    }

    rebuildMenu()
    {
        this.gui = this.parentGUI.addFolder("Settings");
        this.gui.close();
        this.menuIsOpen = false;

        this.createGraphicsSubMenu();
        this.createGridSubMenu();
        this.createAxisRingSubMenu();
        this.createShowPerformanceStatsSubMenu();

        this.initScene();
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

    initScene()
    {
        this.updateGrid();
        this.updateAxisRings();
    }

    updateGrid()
    {
        if(this.grid != null) {
            this.context.scene.remove(this.grid);
            delete this.grid;
            this.grid = null;
        }

        if(this.context.showGrid == false)
            return;

        this.grid = new THREE.GridHelper(50,50, this.context.centerLineGridColor, this.context.gridColor);
        this.context.scene.add(this.grid);
    }

    updateGraphicsSettings(params)
    {
        this.context.backgroundColor = params.backgroundColor;
        this.context.scene.background = new THREE.Color( this.context.backgroundColor );
    }

    updateGridSettings(params)
    {
        this.context.showGrid = params.show;
        this.context.centerLineGridColor = params.centerLineGridColor;
        this.context.gridColor = params.gridColor;
        this.updateGrid();
    }

    createGraphicsSubMenu()
    {
        const menuInstance = this;

        const params = {
            backgroundColor: this.context.backgroundColor,
            apply: function () {
                menuInstance.updateGraphicsSettings(params);
            }
        };

        const folder = this.gui.addFolder("Graphics");
        folder.addColor(params, 'backgroundColor').name("Background Color");
        folder.add(params, 'apply');
        folder.close();
    }

    createGridSubMenu()
    {
        const menuInstance = this;

        const params = {
            show: this.context.showGrid,
            centerLineGridColor: this.context.centerLineGridColor,
            gridColor: this.context.gridColor,
            apply: function () {
                menuInstance.updateGridSettings(params);
            }
        };

        const folder = this.gui.addFolder("Grid");
        folder.add(params, 'show').name("Show Grid");
        folder.addColor(params, 'centerLineGridColor').name("Grid Center Line Color");
        folder.addColor(params, 'gridColor').name("Grid Color");
        folder.add(params, 'apply');
        folder.close();
    }

    updateAxisRings()
    {
        if(this.axisRings != null) {
            this.context.scene.remove(this.axisRings);
            delete this.axisRings;
            this.axisRings = null;
        }

        if(!this.context.showAxisRings)
            return;

        this.axisRings = new THREE.Group();
        //let geometry = new THREE.RingGeometry(0.99,1, 32);
        let geometry = new THREE.TorusGeometry(1.0,0.01, 16, 100);
        let material = new THREE.MeshPhongMaterial({color: this.context.xAxisRingColor, side: THREE.DoubleSide});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0,0,0);
        this.axisRings.add(mesh);

        material = new THREE.MeshPhongMaterial({color: this.context.yAxisRingColor, side: THREE.DoubleSide});
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0,0,0);
        mesh.rotation.set(0,Math.PI*0.5,0);
        this.axisRings.add(mesh);

        material = new THREE.MeshPhongMaterial({color: this.context.zAxisRingColor, side: THREE.DoubleSide});
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0,0,0);
        mesh.rotation.set(Math.PI*0.5,0,0);
        this.axisRings.add(mesh);

        this.axisRings.position.set(0,0,0);
        this.context.scene.add(this.axisRings);

    }

    updateAxisRingSettings(params)
    {
        this.context.showAxisRings = params.show;
        this.context.xAxisRingColor = params.xAxisRingColor;
        this.context.yAxisRingColor = params.yAxisRingColor;
        this.context.zAxisRingColor = params.zAxisRingColor;
        this.updateAxisRings();
    }

    createAxisRingSubMenu()
    {
        const menuInstance = this;

        const params = {
            show: this.context.showAxisRings,
            xAxisRingColor: this.context.xAxisRingColor,
            yAxisRingColor: this.context.yAxisRingColor,
            zAxisRingColor: this.context.zAxisRingColor,
            apply: function () {
                menuInstance.updateAxisRingSettings(params);
            }
        };

        const folder = this.gui.addFolder("Axis Rings");
        folder.add(params, 'show').name("Show Axis Rings");
        folder.addColor(params, 'xAxisRingColor').name("X Axis Color");
        folder.addColor(params, 'yAxisRingColor').name("Y Axis Color");
        folder.addColor(params, 'zAxisRingColor').name("Z Axis Color");
        folder.add(params, 'apply');
        folder.close();
    }

    createShowPerformanceStatsSubMenu()
    {
        const menuInstance = this;

        const params = {
            show: this.context.showPerformanceStats,
            apply: function () {
                if(params.show)
                    menuInstance.showPerformanceStats();
                else
                    menuInstance.hidePerformanceStats();
            }
        };

        const folder = this.gui.addFolder("Performance Stats");
        folder.add(params, 'show').name("Display");
        folder.add(params, 'apply');
        folder.close();
    }

    showPerformanceStats()
    {
        if(this.context.stats != null)
            return;

        this.context.stats = Stats()
        document.body.appendChild(this.context.stats.dom);
    }

    hidePerformanceStats()
    {
        if(this.context.stats == null)
            return;
        document.body.removeChild(this.context.stats.dom);
        delete this.context.stats;
        this.context.stats = null;
    }

    onUpdate()
    {
        if(this.context.stats != null)
            this.context.stats.update();
    }

    destroy()
    {
        this.context.scene.remove(this.axisRings);
        delete this.axisRings;
        this.axisRings = null;

        this.context.scene.remove(this.grid);
        delete this.grid;
        this.grid = null;
    }
}