import * as THREE from 'three'
import gsap from 'gsap'

import vertex from 'shaders/vertex.glsl'
import fragment from 'shaders/fragment.glsl'
import particleVertex from 'shaders/particlesVertex.glsl'
import particleFragment from 'shaders/particlesFragment.glsl'

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default class {
    constructor() {

        this.clock = new THREE.Clock()

        this.threejsCanvas = document.querySelector('.threejs__canvas__container')
        this.width = this.threejsCanvas.offsetWidth
        this.height = this.threejsCanvas.offsetHeight

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
        this.camera.position.set(0, 0, 50)

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        })

        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.threejsCanvas.appendChild(this.renderer.domElement)

        this.planetGeometry = new THREE.SphereBufferGeometry(1, 50, 50)
        // console.log(geometry)

        const count = this.planetGeometry.attributes.position.count //number of vertices in the geometry
        const randoms = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            randoms[i] = Math.random()
        }
        // console.log(randoms)

        this.planetGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uHoverState: { value: 0 },
                uColor: { value: new THREE.Color(0x31c48D) },
                uColor1: { value: new THREE.Color(0x6C63FF) },
            }
        })

        this.object = new THREE.Mesh(this.planetGeometry, this.material)

        this.scene.add(this.object)

        this.raycaster = new THREE.Raycaster()

        this.mouse = new THREE.Vector2()

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        // this.controls.enableDamping = true

        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);

        this.clicked = false


        this.createStars()

        // this.createSphereParticles()
        this.setupScrollAnimation()
    }

    createStars() {
        const numParticles = 100000
        const vertices = []
        const randomForParticles = new Float32Array(numParticles * 3)

        for (let i = 0; i < numParticles; i++) {

            const x = THREE.MathUtils.randFloatSpread(10)//random float between -5 and 5
            const y = THREE.MathUtils.randFloatSpread(10)
            const z = THREE.MathUtils.randFloatSpread(10)

            vertices.push(x, y, z)

            randomForParticles.set([
                Math.random() * 2 - 1,// zero to 2 minus 1
                Math.random() * 2 - 1,// zero to 2 minus 1
                Math.random() * 2 - 1// zero to 2 minus 1

            ], i * 3)

        }

        this.starsGeometry = new THREE.BufferGeometry()
        this.starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
        this.starsGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randomForParticles, 3))

        // this.starsMaterial = new THREE.PointsMaterial({ color: 0x31c48D, size: 0.02 })
        this.starsMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: new THREE.Color(0x31c48D) },
                uColor1: { value: new THREE.Color(0x6C63FF) },
                uTime: { value: 0 },
                uScale: { value: 0 }
            },
            vertexShader: particleVertex,
            fragmentShader: particleFragment,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        const stars = new THREE.Points(this.starsGeometry, this.starsMaterial)

        this.scene.add(stars)
    }

    createSphereParticles() {
        this.particlesMaterials = new THREE.PointsMaterial({ color: 0x31c48D, size: 0.02 })

        const particles = new THREE.Points(this.planetGeometry, this.particlesMaterials)

        this.scene.add(particles)
    }

    setupScrollAnimation() {

        const allowScroll = () => {
            gsap.set(".threejs__story", { display: "block" })
            gsap.timeline({
                scrollTrigger: {
                    trigger: ".threejs__intro",
                    start: "top top",
                    pin: true,
                    // markers: true,
                    end: "+=" + window.innerHeight * 3,
                    scrub: 0.5
                }
            })
                .to(".threejs__intro__context__text1", { x: -100, opacity: 0 })
                .to(".threejs__intro__context__text2", { x: 100, opacity: 0 }, "<")
                .set(".threejs__intro__context__text3__Wrapper", { opacity: 1 }, "<")
                .from(".threejs__intro__context__text3", { opacity: 0, x: 0, stagger: 1 }, "<")
                .to(".threejs__intro__context__text3", { opacity: 0, x: 200, stagger: 1 }, "<+1")

            gsap.timeline({
                scrollTrigger: {
                    trigger: '.threejs__story',
                    start: 'top bottom',
                    end: "top top",
                    scrub: 1
                }
            })
                .to(this.camera.position, { x: 0, y: 0, z: 5 })
                .to(this.object.rotation, { y: Math.PI })
                // .to(this.object.position, { y: 1 }, '<')
                .to(this.material.uniforms.uHoverState, {
                    value: 1,
                    ease: 'expo.inOut'
                })
                .to(this.object.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    ease: 'expo.in'
                })
                .to(this.starsMaterial.uniforms.uScale, {
                    value: 1,
                    ease: 'expo.in'
                })

        }

        gsap.timeline({ onComplete: allowScroll })
            .set(".threejs__intro__content", { opacity: 1 }, "<+=0.5")
            .from(".threejs__intro__context__text1", { xPercent: -100, opacity: 0, duration: 1 }, "<")
            .from(".threejs__intro__context__text2", { xPercent: 100, opacity: 0, duration: 1 }, "<+0.25")
            .duration(2)
    }

    onMouseDown(event) {

        this.mouse.x = (event.clientX / this.width) * 2 - 1
        this.mouse.y = - (event.clientY / this.height) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera)

        const clickIntersects = this.raycaster.intersectObjects([this.object])

        if (clickIntersects.length > 0) {
            this.clicked = true
            gsap.timeline()
                .to(this.object.scale, {
                    x: 2,
                    y: 2,
                    z: 2,
                    ease: 'expo.in'
                })
            // .to(this.starsMaterial.uniforms.uScale, {
            //     value: 0,
            //     // duration: 3,
            //     ease: 'expo.in'
            // })
        }

    }

    onMouseUp(event) {
        if (this.clicked) {
            gsap.timeline()
                .to(this.object.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    ease: 'expo.in'
                })
                .to(this.starsMaterial.uniforms.uScale, {
                    value: 1,
                    ease: 'expo.in'
                })
            this.clicked = false
        }
    }

    onMouseMove(event) {

        this.mouse.x = (event.clientX / this.width) * 2 - 1
        this.mouse.y = - (event.clientY / this.height) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera)

        const objects = [this.object]
        this.intersects = this.raycaster.intersectObjects(objects)

        if (this.intersects.length > 0) {
            // console.log('intersect')
            gsap.to(this.material.uniforms.uHoverState, {
                value: 1,
                ease: 'expo.inOut'
            })
        } else {
            gsap.to(this.material.uniforms.uHoverState, {
                value: 0,
                ease: 'expo.inOut'
            })

        }

    }

    update() {
        this.renderer.render(this.scene, this.camera)
        // this.controls.update()

        // this.object.rotation.x += 0.01;
        // this.object.rotation.y += 0.01;

        const elapsedTime = this.clock.getElapsedTime()
        this.material.uniforms.uTime.value = elapsedTime
        this.starsMaterial.uniforms.uTime.value = elapsedTime
    }


    onResize() {
        this.width = this.threejsCanvas.offsetWidth
        this.height = this.threejsCanvas.offsetHeight

        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()

    }

    /**
     * Destroy.
     */
    destroy() {
        this.destroyThreejs(this.scene)
    }

    destroyThreejs(obj) {
        while (obj.children.length > 0) {
            this.destroyThreejs(obj.children[0]);
            obj.remove(obj.children[0]);
        }
        if (obj.geometry) obj.geometry.dispose();

        if (obj.material) {
            //in case of map, bumpMap, normalMap, envMap ...
            Object.keys(obj.material).forEach(prop => {
                if (!obj.material[prop])
                    return;
                if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function')
                    obj.material[prop].dispose();
            })
            // obj.material.dispose();
        }
    }
}