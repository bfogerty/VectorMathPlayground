import {Vector3} from "three";
import * as THREE from "three";
import * as dat from "lil-gui"
import {GUI} from "lil-gui";

export default class MatrixMenu
{
    constructor(parentGUI, context)
    {
        this.parentGUI = parentGUI;
        this.context = context;
        this.menuIsOpen = false;
    }

    rebuildMenu()
    {
        this.gui = this.parentGUI.addFolder("Matrix Properties");
        this.gui.close();
        this.menuIsOpen = false;

        this.createMatrixPropertySubMenu();
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

    updateMatrix(params)
    {
        let vector = this.context.vectorListManager.get(params.name);
        const startPoint = vector.getStartPoint();
        const endPoint = vector.getEndPoint();
        const color = vector.color;
        const originalName = params.name;
        const renderMode = vector.renderMode;
        const renderText = vector.renderText;

        this.context.vectorListManager.safeDestroy(originalName);

        this.context.vectorListManager.create2(
            params.mutableName,
            color,
            startPoint,
            endPoint,
            {
                renderText: renderText,
                fontAsset:this.context.assets["fonts"]["defaultFont"],
                renderMode: renderMode
            });

        this.context.needsFullMenuRefresh = true;
    }

    createMatrixPropertySubMenu()
    {
        const menuInstance = this;

        for(let matrixName in menuInstance.context.matrixListManager.getList()) {

            if(menuInstance.context.matrixListManager.get(matrixName) == null)
                continue;

            const matrix = menuInstance.context.matrixListManager.get(matrixName);

            const matrixParams = {
                mutableName:matrix.name,
                visible: matrix.visible
            };

            const ma = [];
            matrix.matrix.toArray(ma)

            const column0Params = {
                m00:ma[0].toString(),
                m10:ma[1].toString(),
                m20:ma[2].toString(),
                m30:ma[3].toString()
            };

            const column1Params = {
                m01:ma[4].toString(),
                m11:ma[5].toString(),
                m21:ma[6].toString(),
                m31:ma[7].toString()
            };

            const column2Params = {
                m02:ma[8].toString(),
                m12:ma[9].toString(),
                m22:ma[10].toString(),
                m32:ma[11].toString()
            };

            const column3Params = {
                m03:ma[12].toString(),
                m13:ma[13].toString(),
                m23:ma[14].toString(),
                m33:ma[15].toString()
            };

            let columnParams = [
                column0Params,
                column1Params,
                column2Params,
                column3Params
            ];

            const createParams = {
                name: matrix.name,
                textToRender: "",
                update: function () {

                    const matrixRenderObj = menuInstance.context.matrixListManager.get(createParams.name);
                    const matrix = matrixRenderObj.matrix;
                    const visible = matrixRenderObj.visible;

                    const mp = menuInstance.context.mathParser;
                    const ma = [];
                    ma[0] = mp.evaluate(column0Params.m00);
                    ma[1] = mp.evaluate(column0Params.m10);
                    ma[2] = mp.evaluate(column0Params.m20);
                    ma[3] = mp.evaluate(column0Params.m30);

                    ma[4] = mp.evaluate(column1Params.m01);
                    ma[5] = mp.evaluate(column1Params.m11);
                    ma[6] = mp.evaluate(column1Params.m21);
                    ma[7] = mp.evaluate(column1Params.m31);

                    ma[8] = mp.evaluate(column2Params.m02);
                    ma[9] = mp.evaluate(column2Params.m12);
                    ma[10] = mp.evaluate(column2Params.m22);
                    ma[11] = mp.evaluate(column2Params.m32);

                    ma[12] = mp.evaluate(column3Params.m03);
                    ma[13] = mp.evaluate(column3Params.m13);
                    ma[14] = mp.evaluate(column3Params.m23);
                    ma[15] = mp.evaluate(column3Params.m33);

                    const newMatrix = new THREE.Matrix4();
                    newMatrix.fromArray(ma);

                    const cmdArgs = {
                        "oldMatrixName": createParams.name,
                        "newMatrixName": matrixParams.mutableName,
                        "matrix": newMatrix,
                        "visible": matrixParams.visible,
                        "renderText": matrixRenderObj.renderText,
                        "textToRender": matrixRenderObj.textToRender
                    };
                    menuInstance.context.cmdProcessor.executeCmd("updateMatrix", cmdArgs);
                }
            };

            const folder = this.gui.addFolder(matrixName);
            folder.add(matrixParams, 'mutableName');
            let menuColumns = [
                folder.addFolder("Column 0"),
                folder.addFolder("Column 1"),
                folder.addFolder("Column 2"),
                folder.addFolder("Column 3")
            ];
            folder.add(matrixParams, 'visible').listen();

            for( let i = 0; i < menuColumns.length; ++i)
            {
                menuColumns[i].close();
            }

            let currentColumnIndex = 0;
            for(let x = 0; x < 4; ++x)
            {
                for(let y = 0; y < 4; ++y)
                {
                    const menuColumn = menuColumns[currentColumnIndex];
                    const columnParam = columnParams[currentColumnIndex];
                    const mIndex = "m" + y.toString() + x.toString();
                    menuColumn.add(columnParam, mIndex);
                }
                ++currentColumnIndex;
            }

            folder.add(matrix, 'renderText', [true, false]).name("Render Text").listen();
            folder.add(matrix, 'textToRender').name("Text to Render");
            folder.add(createParams, 'update')
            folder.close();
        }
    }
}