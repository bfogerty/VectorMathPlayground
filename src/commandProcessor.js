import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import MathHelpers from './mathHelpers'
import SceneCommandProcessor from "./sceneCmdProcessor";
import VectorOperationCommandProcessor from './vectorOperationCmdProcessor'
import VectorPropertyCommandProcessor from './vectorPropertyCmdProcessor'
import ScalarOperationCommandProcessor from './scalarOperationCmdProcessor'
import MatrixOperationCommandProcessor from "./matrixOperationCmdProcessor";
import MatrixPropertyCommandProcessor from './matrixPropertyCmdProcessor'
import CameraCommandProcessor from "./cameraCmdProcessor";

export default class CommandProcessor {

    constructor(context)
    {
        this.cmdMap = {};
        this.context = context;
        this.cmdHistory = [];

        this.registerCommands();
    }

    getCommandList()
    {
        return this.cmdMap;
    }

    registerCommands()
    {
        this.sceneCommandProcessor = new SceneCommandProcessor(this.cmdMap, this.context);
        this.vectorOperationCommandProcessor = new VectorOperationCommandProcessor(this.cmdMap, this.context);
        this.vectorPropertyCommandProcessor = new VectorPropertyCommandProcessor(this.cmdMap, this.context);
        this.scalarOperationCommandProcessor = new ScalarOperationCommandProcessor(this.cmdMap, this.context);
        this.matrixOperationCommandProcessor = new MatrixOperationCommandProcessor(this.cmdMap, this.context);
        this.matrixPropertyCommandProcessor = new MatrixPropertyCommandProcessor(this.cmdMap, this.context);

        this.cameraCommandProcessor = new CameraCommandProcessor(this.cmdMap, this.context);

        this.registerListCommandsCommand();
        this.registerGetCommandHistoryCommand();
        this.registerClearCommandHistoryCommand();
        this.registerHelpCommand();
        //this.registerrunJsonCommandListCommand();
    }

    registerListCommandsCommand()
    {
        const instance = this;

        const cmdName = "listCommands";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Lists all commands available within the terminal.",
            "exampleUsage": cmdName + "()",
            "function": (context, cmdArgs) =>
            {
                let commands = [];
                for(let commandName in instance.cmdMap) {
                    const cmdProps = instance.cmdMap[commandName]["properties"];
                    if(cmdProps != null && cmdProps["availableInTerminal"] != null && cmdProps["availableInTerminal"] == true )
                        commands.push(commandName);
                }

                const resultString = commands.sort().toString().replaceAll(',',"\r\n");

                return resultString;
            }
        }

        this.context.mathParser.set(cmdName, function () {
            const cmdArgs={};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerGetCommandHistoryCommand()
    {
        const instance = this;

        const cmdName = "getCommandHistory";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Returns the recorded commands history in JSON format.  The returned JSON can be used to replay the sequence of commands by pasting the JSON into the Execute Commands menu.",
            "exampleUsage": cmdName + "()",
            "function": (context, cmdArgs) =>
            {
                return JSON.stringify(instance.getCommandHistory());
            }
        }

        this.context.mathParser.set(cmdName, function () {
            const cmdArgs={};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerClearCommandHistoryCommand()
    {
        const instance = this;

        const cmdName = "clearCommandHistory";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "properties": {"availableInTerminal":true},
            "description": "Clears the recorded command history.",
            "exampleUsage": cmdName + "()",
            "function": (context, cmdArgs) =>
            {
                instance.clearCommandHistory();
                return "The command history has been cleared.";
            }
        }

        this.context.mathParser.set(cmdName, function () {
            const cmdArgs={};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerrunJsonCommandListCommand()
    {
        const instance = this;

        const cmdName = "runJsonCommandList";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "function": (context, cmdArgs) =>
            {
                const commandList = cmdArgs["commandList"];
                instance.executeJsonCmdList(commandList);
            }
        }

        this.context.mathParser.set(cmdName, function (commandList) {
            const cmdArgs={"commandList":commandList};
            return instance.context.cmdProcessor.executeCmd(cmdName, cmdArgs);
        });

        this.cmdMap[cmdName] = cmd;
    }

    registerHelpCommand()
    {
        const instance = this;

        const cmdName = "help";
        const cmdArgs = [
        ];

        const cmd = {
            "args": cmdArgs,
            "function": (context, cmdArgs) =>
            {
                const commandName = cmdArgs["commandName"];
                if(instance.cmdMap[commandName] == null)
                    return commandName + " is not a valid command.";

                const cmd = instance.cmdMap[commandName];

                if(cmd["description"] == null && cmd["exampleUsage"] == null)
                    return "Additional details about the command, \"" + commandName + "\", have not yet been specified.";

                let addNewLine = false;
                let information = "";
                if(cmd["description"] != null) {
                    information = cmd["description"];
                    addNewLine = true;
                }

                if(cmd["exampleUsage"] != null) {

                    if(addNewLine)
                        information = information + "\r\n";

                    information = information + "Example Usage: " + cmd["exampleUsage"];
                    addNewLine = true;
                }

                return information;
            }
        }

        this.cmdMap[cmdName] = cmd;
    }

    clearCommandHistory()
    {
        this.cmdHistory = [];
    }

    getCommandHistory()
    {
        return this.cmdHistory;
    }

    executeJsonCmdList(jsonString)
    {
        if(jsonString == null)
            return;

        const commands = JSON.parse(jsonString);
        for(let i = 0; i < commands.length; ++i)
        {
            const cmdName = commands[i].cmdName;
            const cmdArgs = commands[i].cmdArgs;

            this.executeCmd(cmdName, cmdArgs, true);
        }
    }

    executeCmdList(cmdList)
    {
        for(let cmdIndex = 0; cmdIndex < cmdList.length; ++cmdIndex)
        {
            const cmdData = cmdList[cmdIndex];
            const cmdName = cmdData["cmdName"];
            const cmdArgs = cmdData["cmdArgs"];

            this.executeCmd(cmdName, cmdArgs);
        }
    }

    executeCmd(cmdName, cmdArgs, fromExecuteCommandsMenu)
    {
        const cmd = this.cmdMap[cmdName];
        if(cmd == null)
            return cmdName + " is an invalid command.";

        const result = cmd["function"](this.context, cmdArgs);
        this.cmdHistory.push({"cmdName": cmdName, "cmdArgs":cmdArgs});

        const cmdProps = cmd["properties"];
        if(fromExecuteCommandsMenu && cmdProps != null && cmdProps["outputResultToConsole"])
        {
            const args = [];
            for(let argName in cmdArgs) {
                const arg = cmdArgs[argName];
                args.push(arg);
            }

            let input = cmdName + "(";
            for(let i = 0; i < args.length; ++i)
            {
                let argValue = args[i];
                if(isNaN(argValue) && !Array.isArray(argValue))
                {
                    argValue = "\"" + argValue + "\"";
                }

                if(i == args.length - 1)
                {
                    input = input + argValue;
                }
                else
                {
                    input = input + argValue + ", ";
                }
            }
            input = input + ")";

            this.context.commandTerminal.printInput(input);
            this.context.commandTerminal.printOutput(result);
            this.context.commandTerminal.prompt();
        }

        return result;
    }
}