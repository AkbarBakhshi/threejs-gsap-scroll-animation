// ***//

// if you get errors, check the error in the chrome tools. Most probably one of the followings is causing the error:

// 1) You forgot to add ; at the end of a line

// 2) Forgot to declare the type of the variable (vec4, vc3, float, etc.)

// 3) Variable type does not match the value (float a = 1) --> float a = 1.0
// 3.1) A variabel is assigned to other variable with different type. The following will throw an error:
//                 float a = 2.0;
//                 int b = a + 3.0;

// 4) xyz and rgba need to be float numbers, so make sure that you add decimals (even 0). All of the followings will work: 
//                  2.0
//                  1.
//                  .5

//***//

// uniform type is used for the data that don't change among the vertices (are uniform)
uniform float uTime;
uniform float uHoverState;

// attribute type is used for the data that change among the vertices
attribute float aRandom;

// varying  type is used to make a variable available in both vertex and fragment shader files
varying vec3 vPosition;


void main() {

    vPosition = position;

    //***** https://learnopengl.com/Getting-started/Coordinate-Systems *****//

    vec3 newPos = position;


    newPos.x += sin(uTime * aRandom) * uHoverState;
    newPos.y += cos(uTime * aRandom) * uHoverState;
    newPos.z += cos(uTime * aRandom) * uHoverState;



    // 1)postion our geometry - coordinates your object begins in.
    vec4 localPosition = vec4(newPos, 1.0);

    // 2)transform the local coordinates to world-space coordinates
    vec4 worldPosition = modelMatrix * localPosition;
    
    // 3)transform the world coordinates to view-space coordinates - seen from the camera/viewer point of view
    vec4 viewPosition = viewMatrix * worldPosition;

    // 4)project view coordinates to clip coordinates and transform to screen coordinates
    vec4 clipPosition = projectionMatrix * viewPosition;

    gl_Position = clipPosition;

    //************ OR ****************//
    // everything in one line:

    //OPTION 1: 
    //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    //OPTION 2 (combine model and view matrices):
    //gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}