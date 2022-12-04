import {Vector3} from "three";
import * as THREE from 'three'
import * as XTerm from 'xterm'
import SimpleLightbox from "simple-lightbox";
import {string} from "mathjs";

// https://xtermjs.org/docs/api/vtfeatures/
// ANSI Colors
// https://ss64.com/nt/syntax-ansi.html

export default class CommandTerminal {

    constructor(context)
    {
        this.context = context;
        this.openForDisplay = false;
        this.terminal = null;
        this.blockTildaKey = false;
        this.commandHistory = [];
        this.commandHistoryOffset = 1;

        this.clearCommandBuffer();
        this.create();
        this.close();
    }

    create()
    {
        const instance = this;

        if(this.terminal != null)
            return;

        const terminalDIV = document.getElementById('terminal');

        const theme = {
            foreground: '#C6DED6',
            background: '#303841'
        };

        this.terminal = new XTerm.Terminal({
            cursorStyle: "underline",
            cursorBlink: true,
            rows: 15,
            cols: 90,
            theme: theme
        });
        this.terminal.open(terminalDIV);

        this.terminal.write('Welcome to \x1b[1;31mVector\x1b[1;36mMath\x1b[1;35mPlayground\x1b[1;34m.com!\r\nType \"help\" for more information.\r\n\x1b[033;0m');
        this.terminal.prompt = () => {
            this.onPrompt(instance)
        };
        this.terminal.onKey(event => {
            this.onKey(instance, event);
        });

        this.terminal.prompt(instance);
        this.openForDisplay = true;
    }

    open()
    {
        const instance = this;
        this.blockTildaKey = true;
        this.clearCommandBuffer();

        if(this.isOpen() == true)
            return;

        const terminalDIV = document.getElementById('terminal');
        terminalDIV.style.display = "block";
        this.openForDisplay = true;
    }

    close()
    {
        if(this.isOpen() == false)
            return;

        this.openForDisplay = false;
        const terminalDIV = document.getElementById('terminal');
        terminalDIV.style.display = "none";
    }

    toggle()
    {
        if(!this.isOpen()) {
            this.open();
            this.terminal.focus();
        }
        else
            this.close();
    }

    isOpen()
    {
        return this.openForDisplay;
    }

    prompt()
    {
        this.onPrompt(this);
    }

    onPrompt(instance)
    {
        const terminal = instance.terminal;
        if(terminal == null)
            return;

        terminal.write("\r\x1b[033;0m>\x1b[033;94m\x1b[1m ");
    }

    onKey(instance, event)
    {
        // https://notes.burke.libbey.me/ansi-escape-codes/
        let terminal = instance.terminal;
        if(terminal == null)
            return;

        const key = event.key;

        if(key == "\t")
        {
            const commands = instance.context.cmdProcessor.getCommandList();

            for(let currentCmdName in commands)
            {
                let cmdToLookUp = this.cmdBuffer;
                let prependHelpCommand = false;
                if(cmdToLookUp.startsWith("help "))
                {
                    cmdToLookUp = cmdToLookUp.replace("help ", "");
                    cmdToLookUp = cmdToLookUp.trimStart();
                    prependHelpCommand = true;
                }

                if(currentCmdName.startsWith(cmdToLookUp))
                {
                    let clearString = "";
                    for(let i = cmdToLookUp.length-1; i >= 0; --i)
                        clearString = clearString + "\b \b";
                    terminal.write(clearString);

                    terminal.write(currentCmdName);
                    this.cmdBuffer = currentCmdName;
                    if(prependHelpCommand)
                        this.cmdBuffer = "help " + this.cmdBuffer;
                    return;
                }
            }
            return;
        }

        if(key == "\x1b[A")
        {
            --this.commandHistoryOffset;
            if(this.commandHistoryOffset <= 0)
                this.commandHistoryOffset = 0;
            if(this.commandHistoryOffset >= this.commandHistory.length)
                this.commandHistoryOffset = this.commandHistory.length-1;

            const prevCmd = this.commandHistory[this.commandHistoryOffset];
            let clearString = "";
            for(let i = this.cmdBuffer.length-1; i >= 0; --i)
                clearString = clearString + "\b \b";
            terminal.write(clearString);

            terminal.write(prevCmd);
            this.cmdBuffer = prevCmd;
            return;
        }
        else if(key == "\x1b[B")
        {
            ++this.commandHistoryOffset;
            if(this.commandHistoryOffset <= 0)
                this.commandHistoryOffset = 0;
            if(this.commandHistoryOffset >= this.commandHistory.length)
                this.commandHistoryOffset = this.commandHistory.length-1;

            const prevCmd = this.commandHistory[this.commandHistoryOffset];
            let clearString = "";
            for(let i = this.cmdBuffer.length-1; i >= 0; --i)
                clearString = clearString + "\b \b";
            terminal.write(clearString);

            terminal.write(prevCmd);
            this.cmdBuffer = prevCmd;
            return;
        }

        if(key == "\x1b[A" || key == "\x1b[B" || key == "\x1b[C" || key == "\x1b[D")
            return;

        if(key == "`") {
            if (!instance.blockTildaKey) {
                instance.toggle();
            }

            instance.blockTildaKey = false;
            return;
        }

        if(key == '\x7F') {
            if(instance.cmdBuffer != null && instance.cmdBuffer.length > 0) {
                terminal.write("\b \b");
                instance.cmdBuffer = instance.cmdBuffer.substring(0, instance.cmdBuffer.length - 1);
            }
        }
        else if(key == '\r') {
            instance.executeCommand(instance.cmdBuffer);
            instance.clearCommandBuffer();
            terminal.prompt();
        }
        else {
            terminal.write(key);
            instance.cmdBuffer = instance.cmdBuffer + key;
        }
    }

    clearCommandBuffer()
    {
        this.cmdBuffer = "";
    }

    printInput(text)
    {
        if(text == null)
            return;

        const terminal = this.terminal;

        terminal.write("\r\x1b[033;0m>\x1b[033;94m\x1b[1m ");
        terminal.write(text);
    }

    printOutput(text)
    {
        if(text == null)
            return;

        const terminal = this.terminal;

        let displayString = null;
        if(isNaN(text) && !Array.isArray(text))
            displayString = text;
        else
            displayString = text.toString();

        terminal.write("\r\n\x1b[1;32m");
        terminal.write(displayString);
        terminal.write("\r\n\x1b[1;34m");
    }

    onUnrecognizedCommand()
    {
        this.printOutput("\x1b[1;31mUnrecognized Command\x1b[1;34m");
    }

    executeCommand(cmd)
    {
        const terminal = this.terminal;
        this.commandHistory.push(cmd);
        this.commandHistoryOffset = this.commandHistory.length;

        if(cmd == "cls" || cmd == "clear") {
            // https://stackoverflow.com/questions/56828930/how-to-remove-the-last-line-in-xterm-js
            terminal.clear();
            terminal.write('\x1b[2K');
        }
        else if(cmd == "about") {
            this.printOutput("VectorPlaygroundMath.com was created by: Brandon Fogerty\r\nType \"listCommands()\" to see the available command list.\r\nType \"help <command name>\" to learn more about the command.");
        }
        else if(cmd == "quit" || cmd == "close")
        {
            this.close();
        }
        else if(cmd.startsWith("help"))
        {

            const args = cmd.split(" ");

            if(args[0] != "help")
            {
                this.onUnrecognizedCommand();
                return;
            }

            const commandName = args[1];
            if(commandName == null || commandName == "") {
                this.printOutput("Which command do you need help with?\r\nExample usage \"help addVectors\"\r\nType \"listCommands()\" to see the available commands.");
                return;
            }

            const cmdArgs={"commandName":commandName};
            this.printOutput(this.context.cmdProcessor.executeCmd("help", cmdArgs));
        }
        //else if(cmd == "lightbox")
        //{
            /*
            SimpleLightbox.open({
                content: '<div class="contentInPopup"><h3 class="attireTitleType3">This is a lightbox!</h3>...',
                elementClass: 'slbContentEl'
            });
            */
/*
            // https://forum.freecodecamp.org/t/youtube-refused-to-connect/245262
            SimpleLightbox.open({
                items: ["https://www.youtube.com/embed/d-6hk07XOdg"],
            });
*/
        //}
        else
        {
            try {
                const result = this.context.mathParser.evaluate(this.cmdBuffer);
                this.printOutput(result);

                if(result == null)
                    this.terminal.write("\n");
            }
            catch(error)
            {
                this.onUnrecognizedCommand();
            }
        }
    }

}