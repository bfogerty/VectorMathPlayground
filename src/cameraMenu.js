import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import VectorMenu from './vectorMenu'
import VectorOperationsMenu from './vectorOperationMenu'
import MathHelpers from './mathHelpers'

export default class CameraMenu
{
    constructor(parentGUI, context, scene)
    {
        this.parentGUI = parentGUI;
        this.context = context;

        this.menuIsOpen = false;
    }

    rebuildMenu()
    {
        this.gui = this.parentGUI.addFolder("Camera");
        this.gui.close();
        this.menuIsOpen = false;

        this.createSetFOVSubMenu();
        this.createOrbitCameraPropertiesSubMenu();
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

    createSetFOVSubMenu()
    {
        const menuInstance = this;

        const params = {
            angleInDegrees: 90.0,
            apply: function() {
                const cmdArgs = {"angleInDegrees": params.angleInDegrees};
                menuInstance.context.cmdProcessor.executeCmd("cameraSetFOV", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Set FOV");
        folder.add(params, 'angleInDegrees').name("Vertical FOV in Degrees").listen();
        folder.add(params, 'apply');
        folder.close();
    }

    createOrbitCameraPropertiesSubMenu()
    {
        const menuInstance = this;

        const params = {
            "vector": null,
            "autoRotateEnabled": false,
            apply: function() {
                let cmdArgs = {};

                if(params.vector != null) {
                    cmdArgs = {"vector": params.vector.name};
                    menuInstance.context.cmdProcessor.executeCmd("cameraLookAtVector", cmdArgs);
                }

                cmdArgs = {"autoRotateEnabled": params.autoRotateEnabled};
                menuInstance.context.cmdProcessor.executeCmd("cameraAutoRotate", cmdArgs);
            }
        };

        const folder = this.gui.addFolder("Orbit Camera");
        folder.add(params, 'vector', this.context.vectorListManager.getList()).name("Vector to Look At");
        folder.add(params, 'autoRotateEnabled').name("Enable Auto Rotate");
        folder.add(params, 'apply');
        folder.close();
    }
}