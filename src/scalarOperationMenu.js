import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";
import {vector} from "three/examples/jsm/nodes/core/NodeBuilder";
import * as MathJS from 'mathjs'
import MathHelpers from "./mathHelpers";

export default class ScalarOperationMenu
{
    constructor(parentGUI, context)
    {
        this.parentGUI = parentGUI;
        this.context = context;
        this.resultIndex = 0;
        this.menuIsOpen = false;
    }

    rebuildMenu()
    {
        this.gui = this.parentGUI.addFolder("Scalar Operations");
        this.gui.close();
        this.menuIsOpen = false;

        this.createOperationsSubMenu();

        this.needsFullRefresh = false;
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

    createOperationsSubMenu()
    {
        const menuInstance = this;

        this.createSimpleArithmeticSubMenu();
        this.createDistanceSubMenu();
        this.createDotProductSubMenu();
        this.createAngleBetweenVectorsSubMenu();
        this.createRadiansToDegreesSubMenu();
        this.createDegreesToRadiansSubMenu();
        this.createMatrixDeterminantSubMenu();
        this.createTrigFunctionsSubMenu();
        this.createExpressionSubMenu();
        //this.createCalculateAngleOfLeftAngleSubMenu();
        //this.createCalculateHypotenuseSubMenu();
    }

    createSimpleArithmeticSubMenu()
    {
        const menuInstance = this;

        const params = {
            a: 0,
            b: 0,
            compute: function () {

                const a = params.a;
                const b = params.b;

                params.additionResult = a + b;
                params.subtractionResult = a - b;
                params.multiplicationResult = a * b;
                params.divisionResult = a / b;
                params.inverseResultOfA = 1.0 / (a);
                params.inverseResultOfB = 1.0 / (b);
                params.aRaisedToB = Math.pow(a,b);

            },

            additionResult: 0,
            subtractionResult: 0,
            multiplicationResult: 0,
            divisionResult: 0,
            inverseResultOfA:0,
            inverseResultOfB:0,
            aRaisedToB:0
        };

        const folder = this.gui.addFolder("Simple Arithmetic");
        folder.add(params, 'a');
        folder.add(params, 'b');
        folder.add(params, 'compute');
        folder.add(params, 'additionResult').name("a+b=").listen();
        folder.add(params, 'subtractionResult').name("a-b=").listen();
        folder.add(params, 'multiplicationResult').name("a*b=").listen();
        folder.add(params, 'divisionResult').name("a/b=").listen();
        folder.add(params, 'inverseResultOfA').name("1/a=").listen();
        folder.add(params, 'inverseResultOfB').name("1/b=").listen();
        folder.add(params, 'aRaisedToB').name("a^b=").listen();
        folder.close();
    }

    createDistanceSubMenu()
    {
        const menuInstance = this;

        const params = {
            vectorA: null,
            vectorB: null,
            distance: function () {
                const cmdArgs = {"vectorA": params.vectorA.name, "vectorB": params.vectorB.name};
                params.distanceResult = menuInstance.context.cmdProcessor.executeCmd("computeDistanceBetweenVectors", cmdArgs);
            },

            distanceResult:0
        };

        const folder = this.gui.addFolder("Distance Between Vectors");
        folder.add(params, 'vectorA', this.context.vectorListManager.getList());
        folder.add(params, 'vectorB', this.context.vectorListManager.getList());
        folder.add(params, 'distance').name("Compute Distance");
        folder.add(params, 'distanceResult').name("Distance").listen();
        folder.close();
    }

    createDotProductSubMenu()
    {
        const menuInstance = this;

        const params = {
            vectorA: null,
            vectorB: null,
            dotProduct: function () {
                const cmdArgs = {"vectorA": params.vectorA.name, "vectorB": params.vectorB.name};
                params.dotResult = menuInstance.context.cmdProcessor.executeCmd("dotProduct", cmdArgs);
            },

            dotResult:0
        };

        const folder = this.gui.addFolder("Dot Product");
        folder.add(params, 'vectorA', this.context.vectorListManager.getList());
        folder.add(params, 'vectorB', this.context.vectorListManager.getList());
        folder.add(params, 'dotProduct').name("Compute Dot Product");
        folder.add(params, 'dotResult').name("Dot Product").listen();
        folder.close();
    }

    createAngleBetweenVectorsSubMenu()
    {
        const menuInstance = this;

        const params = {
            vectorA: null,
            vectorB: null,
            compute: function () {
                let cmdArgs = {"vectorA": params.vectorA.name, "vectorB": params.vectorB.name, "angleInDegrees": false};
                params.angleInRadians = menuInstance.context.cmdProcessor.executeCmd("computeAngleBetweenVectors", cmdArgs);

                cmdArgs = {"vectorA": params.vectorA.name, "vectorB": params.vectorB.name, "angleInDegrees": true};
                params.angleInDegrees = menuInstance.context.cmdProcessor.executeCmd("computeAngleBetweenVectors", cmdArgs);

            },

            angleInRadians:0,
            angleInDegrees:0
        };

        const folder = this.gui.addFolder("Angle Between Vectors");
        folder.add(params, 'vectorA', this.context.vectorListManager.getList());
        folder.add(params, 'vectorB', this.context.vectorListManager.getList());
        folder.add(params, 'compute').name("Compute Angle");
        folder.add(params, 'angleInRadians').name("Angle In Radians").listen();
        folder.add(params, 'angleInDegrees').name("Angle In Degrees").listen();
        folder.close();
    }

    createDegreesToRadiansSubMenu()
    {
        const menuInstance = this;

        const params = {
            degrees: 0,
            convert: function () {
                let cmdArgs = {"angle": params.degrees};
                params.radians = menuInstance.context.cmdProcessor.executeCmd("convertDegreesToRadians", cmdArgs);
            },

            radians:0
        };

        const folder = this.gui.addFolder("Degrees To Radians");
        folder.add(params, 'degrees');
        folder.add(params, 'convert');
        folder.add(params, 'radians').listen();
        folder.close();
    }

    createRadiansToDegreesSubMenu()
    {
        const menuInstance = this;

        const params = {
            radians: 0,
            convert: function () {
                let cmdArgs = {"angle": params.radians};
                params.degrees = menuInstance.context.cmdProcessor.executeCmd("convertRadiansToDegrees", cmdArgs);
            },

            degrees:0
        };

        const folder = this.gui.addFolder("Radians To Degrees");
        folder.add(params, 'radians');
        folder.add(params, 'convert');
        folder.add(params, 'degrees').listen();
        folder.close();
    }

    createMatrixDeterminantSubMenu()
    {
        const menuInstance = this;

        const params = {
            matrix: null,
            compute: function () {
                const cmdArgs = {"matrix": params.matrix.name};
                params.determinant = menuInstance.context.cmdProcessor.executeCmd("computeMatrixDeterminant", cmdArgs);
            },

            determinant:0,
        };

        const folder = this.gui.addFolder("Matrix Determinant");
        folder.add(params, 'matrix', this.context.matrixListManager.getList()).listen();
        folder.add(params, 'compute');
        folder.add(params, 'determinant').listen();
        folder.close();
    }

    createTrigFunctionsSubMenu()
    {
        const menuInstance = this;

        const params = {
            radians: 0,
            compute: function () {
                params.cos = Math.cos(params.radians);
                params.sin = Math.sin(params.radians);
                params.tan = Math.tan(params.radians);
            },

            cos:0,
            sin:0,
            tan:0
        };

        const folder = this.gui.addFolder("Trig Functions");
        folder.add(params, 'radians');
        folder.add(params, 'compute');
        folder.add(params, 'cos').listen();
        folder.add(params, 'sin').listen();
        folder.add(params, 'tan').listen();
        folder.close();
    }

    createCalculateAngleOfLeftAngleSubMenu()
    {
        const menuInstance = this;

        const params = {
            adjacent: 0,
            hypotenuse: 0,
            compute: function () {
                params.angleInRadians = Math.acos(params.adjacent/params.hypotenuse);
                params.angleInDegrees = params.angleInRadians * (180/Math.PI);
            },
            angleInRadians:0,
            angleInDegrees:0
        };

        const folder = this.gui.addFolder("Right Angle");
        folder.add(params, 'adjacent');
        folder.add(params, 'hypotenuse');
        folder.add(params, 'compute');
        folder.add(params, 'angleInRadians').name("Angle In Radians").listen();
        folder.add(params, 'angleInDegrees').name("Angle In Degrees").listen();
        folder.close();
    }

    createCalculateHypotenuseSubMenu()
    {
        const menuInstance = this;

        const params = {
            adjacent: 0,
            opposite: 0,
            compute: function () {
                params.hypotenuse = Math.sqrt((params.adjacent*params.adjacent) + (params.opposite*params.opposite));
            },
            hypotenuse:0
        };

        const folder = this.gui.addFolder("Hypotenuse");
        folder.add(params, 'adjacent');
        folder.add(params, 'opposite');
        folder.add(params, 'compute');
        folder.add(params, 'hypotenuse').listen();
        folder.close();
    }

    createExpressionSubMenu()
    {
        const menuInstance = this;

        const params = {
            expression: "cos(pi)",
            evaluate: function () {
                const result = menuInstance.context.mathParser.evaluate(params.expression);
                if(result != null)
                    params.result = result;
            },

            result:""
        };

        const folder = this.gui.addFolder("Expression");
        folder.add(params, 'expression');
        folder.add(params, 'evaluate');
        folder.add(params, 'result').listen();
        folder.close();
    }
}