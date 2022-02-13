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
 uniform vec3 uColor;
 uniform vec3 uColor1;

// varying  type is used to make a variable available in both vertex and fragment shader files
varying vec3 vPosition;


void main() {

    //**** simple color - a vector of rgba
    // vec4 color = vec4(1., 0.0, .0, 1.);
    // gl_FragColor = color;
    //******

    //***** use mix function

    float depth = (vPosition.x + 5.) / 10.0;

    // vec3 color1 = vec3(1., 1.0, 1.0);
    // vec3 color2 = vec3(0., .0, 1.0);

    // vec3 mixedColor = mix(color1, color2, depth);
    vec3 mixedColor = mix(uColor, uColor1, depth);
    gl_FragColor = vec4(mixedColor, 1.0);
}