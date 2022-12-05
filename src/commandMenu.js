import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import VectorMenu from './vectorMenu'
import VectorOperationsMenu from './vectorOperationMenu'
import MathHelpers from './mathHelpers'
import CommandTerminal from "./commandTerminal";


export default class CommandMenu
{
    constructor(parentGUI, context, scene)
    {
        this.parentGUI = parentGUI;
        this.context = context;
        this.menuIsOpen = false;
    }

    rebuildMenu()
    {
        this.gui = this.parentGUI.addFolder("Commands");
        this.gui.close();
        this.menuIsOpen = false;

        this.createShowCommandHistorySubMenu();
        this.createExecuteCommandListSubMenu();
        this.createClearCommandHistorySubMenu();
        this.createCommandConsoleSubMenu();
        this.createCodeEditorSubMenu();
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

    createShowCommandHistorySubMenu()
    {
        const menuInstance = this;

        const params = {
            commandHistory: "",
            show: function() {
                const commandHistoryObject = menuInstance.context.cmdProcessor.getCommandHistory();
                const commandHistoryAsJSONString = JSON.stringify(commandHistoryObject)
                params.commandHistory = commandHistoryAsJSONString;
            }
        };

        const folder = this.gui.addFolder("Show Command History");
        folder.add(params, 'show');
        folder.add(params, 'commandHistory').name("History").listen();
        folder.close();
    }

    createExecuteCommandListSubMenu()
    {
        const menuInstance = this;

        const params = {
            commands: "",
            execute: function() {
                menuInstance.context.cmdProcessor.executeJsonCmdList(params.commands);
            }
        };

        const folder = this.gui.addFolder("Execute Commands");
        folder.add(params, 'commands').name("Commands");
        folder.add(params, 'execute').name("Execute");
        folder.close();
    }

    createClearCommandHistorySubMenu()
    {
        const menuInstance = this;

        const params = {
            commandHistory: "",
            clear: function() {
                menuInstance.context.cmdProcessor.clearCommandHistory();
            }
        };

        const folder = this.gui.addFolder("Clear Command History");
        folder.add(params, 'clear');
        folder.close();
    }

    createCommandConsoleSubMenu()
    {
        const menuInstance = this;

        const params = {
            open: function() {
                menuInstance.context.commandTerminal.open();
            },
            close: function() {
                menuInstance.context.commandTerminal.close();
            }
        };

        const folder = this.gui.addFolder("Console");
        folder.add(params, 'open');
        folder.add(params, 'close');
        folder.close();
    }

    createCodeEditorSubMenu()
    {
        const menuInstance = this;

        const params = {
            open: function() {
                menuInstance.context.codeEditor.open();
            },
            close: function() {
                menuInstance.context.codeEditor.close();
            }
        };

        const folder = this.gui.addFolder("Code Editor");
        folder.add(params, 'open');
        folder.add(params, 'close');
        folder.close();
    }
}