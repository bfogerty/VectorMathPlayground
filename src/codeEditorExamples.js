export default class CodeEditorExamples {

    static GetRotateAroundOriginExample()
    {
        return "# Reset the scene and remove the default vectors\n" +
            "resetScene(true);\n" +
            "clearScene();\n" +
            "\n" +
            "# Create a rotation and translation matrix.\n" +
            "# These will be used to rotate the man about the origin.\n" +
            "createUpRotationMatrix(\"rMat\", true, -90);\n" +
            "showMatrix(\"$\",false)\n" +
            "createTranslationMatrix(\"tMat\", [0,0,2]);\n" +
            "showMatrix(\"$\",false)\n" +
            "\n" +
            "# Create a man at the origin\n" +
            "createVector2(\"man\", [0,0,1])\n" +
            "setVectorRenderMode(\"$\",\"man\")\n" +
            "\n" +
            "# Left\n" +
            "# Combine the rotation and translation matrices.\n" +
            "multiplyMatrices(\"rMat\", \"tMat\");\n" +
            "multiplyVectorByMatrix(\"man\",\"$\");\n" +
            "\n" +
            "# Rear\n" +
            "multiplyMatrices(\"rMat\", \"$\");\n" +
            "multiplyVectorByMatrix(\"man\",\"$\");\n" +
            "\n" +
            "# Right\n" +
            "multiplyMatrices(\"rMat\", \"$\");\n" +
            "multiplyVectorByMatrix(\"man\",\"$\");\n" +
            "\n" +
            "# Front\n" +
            "multiplyMatrices(\"rMat\", \"$\");\n" +
            "multiplyVectorByMatrix(\"man\",\"$\");"
    }

    static GetManuallyReflectedVector()
    {
        return "# Reset the scene and remove the default vectors\n" +
            "resetScene(true);\n" +
            "destroyVector(\"left\");\n" +
            "\n" +
            "# Create Vector to reflect 'v'\n" +
            "addVectors(\"forward\", \"up\");\n" +
            "renameVector(\"$\",\"v\");\n" +
            "normalizeVector(\"v\");\n" +
            "setVectorDisplayText(\"v\",\"v\")\n" +
            "\n" +
            "# Compute Offset\n" +
            "projectVector(\"v\",\"up\");\n" +
            "renameVector(\"$\", \"vProj\");\n" +
            "scaleVector(\"$\", 2.0);\n" +
            "renameVector(\"$\", \"vProjTimes2\");\n" +
            "setVectorDisplayText(\"$\",\"vProjTimes2\")\n" +
            "subtractVectors(\"v\", \"vProjTimes2\")\n" +
            "renameVector(\"$\", \"vReflected\")\n" +
            "setVectorDisplayText(\"$\",\"vReflected\")\n" +
            "\n" +
            "# Create some metric visualizers\n" +
            "drawDistanceBetweenVectors(\"v\", \"vProjTimes2\")\n" +
            "drawAngleBetweenVectors(\"v\",\"up\", true)\n" +
            "negateVector(\"up\")\n" +
            "renameVector(\"$\",\"negUp\")\n" +
            "drawAngleBetweenVectors(\"vReflected\",\"negUp\", true)\n" +
            "drawAngleBetweenVectors(\"v\",\"vReflected\", true)\n" +
            "\n" +
            "# Example Description\n" +
            "createVector(\"description\", [0,2,0], [0,2,0]);\n" +
            "setVectorRenderMode(\"$\", \"waypoint\")\n" +
            "setVectorDisplayText(\"$\",\"This example demonstrates how to manually\\n reflect the vector \'v\' about the\\n \'up\' axis resulting in vector, \'vReflected\'.\")";
    }
}