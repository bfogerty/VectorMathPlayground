import {Vector3} from "three";
import * as THREE from "three";

export default class MathHelpers {

    static lerp(a,b,t)
    {
        return a*(1.0-t) + (b*t);
    }

    static lerpVectors(a,b,t)
    {
        const x = MathHelpers.lerp(a.x, b.x, t);
        const y = MathHelpers.lerp(a.y, b.y, t);
        const z = MathHelpers.lerp(a.z, b.z, t);

        return new THREE.Vector3(x,y,z);
    }

    static getRandomColor()
    {
        return this.lerp(0x000000, 0xffffff, Math.random());
    }

    static floatsAreEqual(floatValueA, floatValueB)
    {
        const epsilon = 0.0000001;
        if(floatValueA >= floatValueB-epsilon &&  floatValueA <= floatValueB+epsilon)
            return true;

        return false;
    }

    static vectorsAreEqual(vectorA, vectorB)
    {
        if( MathHelpers.floatsAreEqual(vectorA.x, vectorB.x) &&
            MathHelpers.floatsAreEqual(vectorA.y, vectorB.y) &&
            MathHelpers.floatsAreEqual(vectorA.z, vectorB.z))
        {
            return true;
        }

        return false;
    }

    static computeAngleBetweenVectors(vecA, vecB)
    {
        const dotResult = vecA.dot(vecB);
        const angleInRadians = Math.acos(dotResult);

        return angleInRadians;
    }

    static radiansToDegrees(radians)
    {
        return radians * (180/Math.PI);
    }

    static degreesToRadians(degrees)
    {
        return degrees * (Math.PI/180);
    }

    static createXRotationMatrix(angleInRadians)
    {
        const matrix = new THREE.Matrix4();
        matrix.set(
            1, 0, 0, 0,
            0, Math.cos(angleInRadians), -Math.sin(angleInRadians), 0,
            0, Math.sin(angleInRadians), Math.cos(angleInRadians), 0,
            0, 0, 0, 1
        );

        return matrix
    }

    static createYRotationMatrix(angleInRadians)
    {
        const matrix = new THREE.Matrix4();
        matrix.set(
            Math.cos(angleInRadians), 0, -Math.sin(angleInRadians), 0,
            0, 1, 0, 0,
            Math.sin(angleInRadians), 0, Math.cos(angleInRadians), 0,
            0, 0, 0, 1
        );

        return matrix;
    }

    static createZRotationMatrix(angleInRadians)
    {
        const matrix = new THREE.Matrix4();
        matrix.set(
            Math.cos(angleInRadians), -Math.sin(angleInRadians), 0, 0,
            Math.sin(angleInRadians), Math.cos(angleInRadians), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );

        return matrix;
    }

    static createTranslationMatrix(x,y,z)
    {
        const matrix = new THREE.Matrix4();
        matrix.set(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        );

        return matrix;
    }

    static createScaleMatrix(x,y,z)
    {
        const matrix = new THREE.Matrix4();
        matrix.set(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        );

        return matrix;
    }

    static createAxisFromVector(inputForwardAxis, positionVector)
    {
        const worldForward = new THREE.Vector3(0,0,1);
        const worldUp = new THREE.Vector3(0,1,0);
        const worldLeft = new THREE.Vector3(1,0,0);
        const worldNegForward = new THREE.Vector3(0,0,-1);
        const worldNegUp = new THREE.Vector3(0,-1,0);
        const worldNegLeft = new THREE.Vector3(-1,0,0);

        const forwardVec = inputForwardAxis.clone().normalize();

        // Negate the newly chosen forward vector but project it on to the plane where y == 0.
        // we can then cross the new forward vector with the flat plane projected negated vector to give us
        // the new left vector.  With the new forward and new left vectors, we can cross them to get the
        // new up vector.
        const negForwardVec = new THREE.Vector3(forwardVec.x, forwardVec.y, forwardVec.z);
        negForwardVec.x *= -1.0;
        negForwardVec.y *= -1.0;
        negForwardVec.z *= -1.0;


        // We need to handle the special cases in which the forward vector is equal to one of the global axes.
        if(MathHelpers.vectorsAreEqual(forwardVec, worldUp) || MathHelpers.vectorsAreEqual(forwardVec, worldNegUp) ||
            MathHelpers.vectorsAreEqual(forwardVec, worldForward) || MathHelpers.vectorsAreEqual(forwardVec, worldNegForward) ||
            MathHelpers.vectorsAreEqual(forwardVec, worldLeft) || MathHelpers.vectorsAreEqual(forwardVec, worldNegLeft)) {

            const someSmallOffsetValue = -0.000001;
            let checkForSpecialCase = true;
            if (checkForSpecialCase && (MathHelpers.vectorsAreEqual(forwardVec, worldUp) || MathHelpers.vectorsAreEqual(forwardVec, worldNegUp))) {
                negForwardVec.z = someSmallOffsetValue;
                checkForSpecialCase = false;
            }
            else
                negForwardVec.z = 0;

            if(checkForSpecialCase) {
                if (MathHelpers.vectorsAreEqual(forwardVec, worldForward) || MathHelpers.vectorsAreEqual(forwardVec, worldNegForward)) {
                    negForwardVec.y = someSmallOffsetValue;
                    checkForSpecialCase = false;
                } else
                    negForwardVec.y = 0;
            }

            if(checkForSpecialCase) {
                if (MathHelpers.vectorsAreEqual(forwardVec, worldLeft) || MathHelpers.vectorsAreEqual(forwardVec, worldNegLeft)) {
                    negForwardVec.y = someSmallOffsetValue;
                    checkForSpecialCase = false;
                } else
                    negForwardVec.y = 0;
            }
        }
        else
            negForwardVec.y *= 0.0;

        negForwardVec.normalize();

        // Ensure we don't flip the up and left vectors when the new forward vector
        // has a negative y value.
        const tempVec = new THREE.Vector3(forwardVec.x, forwardVec.y, forwardVec.z);
        if(MathHelpers.floatsAreEqual(forwardVec.dot(negForwardVec), -1.0))
            negForwardVec.y = -0.01;

        const dot = tempVec.dot(worldUp);

        const leftVec = new THREE.Vector3();
        if(dot <= 0)
            leftVec.crossVectors(forwardVec, negForwardVec);
        else
            leftVec.crossVectors(negForwardVec, forwardVec);

        leftVec.normalize();

        const upVec = new THREE.Vector3();
        upVec.crossVectors(forwardVec, leftVec);
        upVec.normalize();

        const resultMatrix = new THREE.Matrix4();
        resultMatrix.makeBasis(leftVec, upVec, forwardVec);

        if(positionVector != null)
            resultMatrix.setPosition(positionVector.x, positionVector.y, positionVector.z);

        return resultMatrix;
    }
}