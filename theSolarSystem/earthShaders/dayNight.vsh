attribute vec4 tangent;

uniform sampler2D displacementMap;
uniform float displacementLevel;

uniform vec2 uvScale;
uniform vec3 sunDirection;
varying vec2 vUv;
varying mat3 tbn;
varying vec3 vLightVector;
varying vec3 vNormal;
void main()
{
    vUv = uv;

    /** Create tangent-binormal-normal matrix used to transform
    coordinates from object space to tangent space */
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vTangent = normalize(normalMatrix * tangent.xyz);
    vec3 vBinormal = normalize(cross(vNormal, vTangent) * tangent.w);
    tbn = mat3(vTangent, vBinormal, vNormal);

    /** Calculate the vertex-to-light vector */
    vec4 lightVector = viewMatrix * vec4(sunDirection, 1.0);
    vec3 displacementMap = texture2D(displacementMap, vUv).xyz;
    float displacementDiff = displacementMap.x * displacementLevel;
    vec3 positionDisplacement = position + normalize( normal ) * displacementDiff;

    //vec3 dv = texture2D( tDisplacement, vUv ).xyz;",
    //float df = uDisplacementScale * dv.x + uDisplacementBias;",
    //displacedPosition = position + normalize( normal ) * df;",

    vec4 modelViewPosition = modelViewMatrix * vec4(positionDisplacement, 1.0);
    vLightVector = normalize(lightVector.xyz - modelViewPosition.xyz);

    gl_Position = projectionMatrix * modelViewPosition;
}

