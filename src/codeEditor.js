import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import MathHelpers from './mathHelpers'
import XTerm from "xterm";
import {basicSetup, EditorView} from "codemirror"
import {autocompletion} from "@codemirror/autocomplete"

const completionKeywords = [];
function myCompletions(context) {
    let before = context.matchBefore(/\w+/)
    // If completion wasn't explicitly started and there
    // is no word before the cursor, don't open completions.
    if (!context.explicit && !before) return null
    return {
        from: before ? before.from : context.pos,
        options: completionKeywords,
        validFor: /^\w*$/
    }
}

let CodeEditorInstance = null;
function executeCommandsFromCodeEditor()
{
    if(CodeEditorInstance == null)
        return;

    const code = CodeEditorInstance.editorView.state.doc.toString();

    CodeEditorInstance.context.cmdProcessor.showCommandsInConsole(true);
    CodeEditorInstance.context.mathParser.evaluate(code);
    CodeEditorInstance.context.cmdProcessor.showCommandsInConsole(false);

}

export default class CodeEditor {

    completionKeywords = [];

    constructor(context)
    {
        CodeEditorInstance = this;

        this.context = context;
        this.openForDisplay = false;
        this.completionKeywords = [];
        this.editorView = null;

        this.create();
        this.close();

        const runButton = document.getElementById("editor-run-button");
        if(runButton != null)
            runButton.onclick = executeCommandsFromCodeEditor;
    }

    buildCommandAutoCompletion(completionsArray)
    {
        const cmdMap = this.context.cmdProcessor.getCommandList();

        for(let commandName in cmdMap) {
            //const cmdProps = cmdMap[commandName]["properties"];
            const description = cmdMap[commandName]["description"];
            const exampleUsage = cmdMap[commandName]["exampleUsage"];

            const info = description + "\r\nExample Usage: " + exampleUsage;
            const completionEntry = {label: commandName, type: "keyword", info:info};
            completionsArray.push(completionEntry);
        }
    }

    insertVectorIntoAutoCompletionList(vectorRenderObject)
    {
        if(vectorRenderObject == null)
            return;

        const variableName = vectorRenderObject.name;
        for(let i = 0; i < completionKeywords.length; ++i)
        {
            const entry = completionKeywords[i];
            if(entry["label"] == variableName)
                return;
        }

        const newEntry = {label:variableName, type:"variable", info:"vector"};
        completionKeywords.push(newEntry);
    }

    removeVectorFromAutoCompletionList(vectorRenderObject)
    {
        if(vectorRenderObject == null)
            return;

        const variableName = vectorRenderObject.name;
        let index = -1;
        for(let i = 0; i < completionKeywords.length; ++i)
        {
            const entry = completionKeywords[i];
            if(entry["label"] == variableName)
            {
                index = i;
                break;
            }
        }

        completionKeywords.splice(index,1);
    }

    insertMatrixIntoAutoCompletionList(matrixRenderObject)
    {
        if(matrixRenderObject == null)
            return;

        const variableName = matrixRenderObject.name;
        for(let i = 0; i < completionKeywords.length; ++i)
        {
            const entry = completionKeywords[i];
            if(entry["label"] == variableName)
                return;
        }

        const newEntry = {label:variableName, type:"variable", info:"matrix"};
        completionKeywords.push(newEntry);
    }

    removeMatrixFromAutoCompletionList(matrixRenderObject)
    {
        if(matrixRenderObject == null)
            return;

        const variableName = matrixRenderObject.name;
        let index = -1;
        for(let i = 0; i < completionKeywords.length; ++i)
        {
            const entry = completionKeywords[i];
            if(entry["label"] == variableName)
            {
                index = i;
                break;
            }
        }

        completionKeywords.splice(index,1);
    }

    getDefaultSourceCode()
    {
        return "# Reset the scene and remove the default vectors\n" +
            "resetScene(true);\n# Create a vector in the middle of the forward and up vectors\naddVectors(\"forward\",\"up\");\n# Normalize the last vector created\nnormalizeVector(\"$\");\n";
    }

    create()
    {
        const instance = this;

        // Our list of completions (can be static, since the editor
        /// will do filtering based on context).
        /*
        const completions = [
            {label: "panic", type: "keyword"},
            {label: "park", type: "constant", info: "Test completion"},
            {label: "password", type: "variable"},
        ]
        */

        this.buildCommandAutoCompletion(completionKeywords);

        this.editorView = new EditorView({
            doc: this.getDefaultSourceCode(),
            extensions: [basicSetup, autocompletion({override: [myCompletions]})],
            extraKeys: {"Ctrl-Space": "autocomplete"},
            lineNumbers: true,
            lineWrapping: true,
            parent: document.getElementById("editor"),
        });

        this.openForDisplay = true;
    }

    setText(text)
    {
        if(this.editorView == null)
            return;

        this.editorView.dispatch({
            changes: {from: 0, to: this.editorView.state.doc.length, insert: text}
        })
    }

    open()
    {
        const instance = this;


        if(this.isOpen() == true)
            return;

        const terminalDIV = document.getElementById('code-editor');
        terminalDIV.style.display = "block";
        this.openForDisplay = true;
    }

    close()
    {
        if(this.isOpen() == false)
            return;

        this.openForDisplay = false;
        const terminalDIV = document.getElementById('code-editor');
        terminalDIV.style.display = "none";
    }

    toggle()
    {
        if(!this.isOpen()) {
            this.open();
        }
        else
            this.close();
    }

    isOpen()
    {
        return this.openForDisplay;
    }
}