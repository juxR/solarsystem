var Atmospheres = require('../lib/threex.atmospherematerial');
const PATH = "./images/"
//@math var Degree = require('../lib/degreeInRadian');
var Earth = {
    //@math 60 * 60 * 23.5603 (23h56 03')
    timeToFullSelfRotation: 84817.4724,
    isRealistic: false,
    diameter: 3,
    nbpoly: 32,
    atmosphereRadius: undefined,
    atmosphereSize: undefined,
    axialTilt: 23.4,
    //@math return (Degree.convert(360) / this.timeToFullSelfRotation);
    rotationPerSecond: 0.000007393570389010043,
    orbitRadius: 35643,
    animations: [],

    make: function (scene, isRealistic) {
        this.manageRealism(isRealistic);
        this.init(scene);
        this.createMesh();
        this.createAtmosphere();
        this.createClouds();
        return this;
    },
    getAnimations: function () {
        return this.animations;
    },
    init: function (scene) {
        this.containerEarth = new THREE.Object3D();
        this.containerEarth.rotateZ(this.axialTilt * Math.PI / 180);
        //Sun diameter * 109 = radius of earth's orbit (149,597,870 km) (35643)
        this.containerEarth.position.x = this.orbitRadius;
        scene.add(this.containerEarth);
        this.atmosphereRadius = this.diameter;
    },
    createMesh: function () {
        //Earth is more or less 109 times smaller than sun
        var geometry = new THREE.SphereGeometry(this.diameter, this.nbpoly, this.nbpoly)
        var texture = THREE.ImageUtils.loadTexture(PATH + 'earthdiffuse.jpg');
        var material = new THREE.MeshPhongMaterial({
            map: texture,
            bumpMap: THREE.ImageUtils.loadTexture(PATH + 'earthbump1k.jpg'),
            bumpScale: 1,
            specularMap: THREE.ImageUtils.loadTexture(PATH + 'earthspec1k.jpg'),
            specular: new THREE.Color('0xffffff')
        });
        //texture.needsUpdate = true;
        //obj.mesh.material.uniforms.texture = THREE.ImageUtils.loadTexture(PATH+"earthnight.jpg");
        material.shininess = 60;
        material.map.minFilter = THREE.LinearFilter;
        material.bumpMap.minFilter = THREE.LinearFilter;
        material.specularMap.minFilter = THREE.LinearFilter;
        this.earthMesh = new THREE.Mesh(geometry, material)

        this.earthMesh.rotation.y = 0;
        this.earthMesh.receiveShadow = true;
        this.earthMesh.castShadow = true;
        this.containerEarth.add(this.earthMesh);
        this.registerAnimation(function (delta, now) {
            Earth.earthMesh.rotation.y += Earth.rotationPerSecond / 60;
        })
    },
    createClouds: function () {
        var geometry = new THREE.SphereGeometry(this.diameter, this.nbpoly, this.nbpoly)
        var material = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture(PATH + 'earthclouds.png'),
            side: THREE.FrontSide,
            transparent: true
        })
        this.earthCloud = new THREE.Mesh(geometry, material)
        this.earthCloud.receiveShadow = true;
        this.earthCloud.castShadow = true;
        this.containerEarth.add(this.earthCloud);
        this.registerAnimation(function (delta, now) {
            Earth.earthCloud.rotation.y += (Earth.rotationPerSecond * 1.2) / 60;
        });
    },
    createAtmosphere: function () {
        var geometry = new THREE.SphereGeometry(this.diameter, this.nbpoly, this.nbpoly);
        var material = Atmospheres.createAtmosphereMaterial()
        material.uniforms.glowColor.value.set(0x00b3ff)
        material.uniforms.coeficient.value = 1
        material.uniforms.power.value = 6.5
        this.atmosphere1 = new THREE.Mesh(geometry, material);
        this.atmosphere1.scale.multiplyScalar(1.04);
        this.containerEarth.add(this.atmosphere1);
    },
    manageRealism: function (isRealistic) {
        if (typeof isRealistic != "undefined") {
            this.isRealistic = isRealistic;
        }

        if (!this.isRealistic) {
            this.diameter *= 10;
            this.orbitRadius /= 100;
            this.rotationPerSecond *= 600;
        }
    },
    registerAnimation: function (callable) {
        this.animations.push(callable);
    }
};

module.exports = Earth;
