import * as THREE from 'three'
import gsap from 'gsap'

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import ThreeJS from './Threejs'

export default class Canvas {
    constructor({ template }) {
        this.template = template
        this.scene = new THREE.Scene()

        this.clock = new THREE.Clock()
        this.time = 0

        this.logoCanvas = document.querySelector('.logo__canvas__container')
        this.width = this.logoCanvas.offsetWidth
        this.height = this.logoCanvas.offsetHeight

        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 100)
        // this.camera.position.set(0, 0, 5)
        this.camera.position.set(30, 30, 30)
        this.camera.lookAt(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })

        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.logoCanvas.appendChild(this.renderer.domElement)

        const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
        directionalLight.position.set(30, 30, 30)
        this.scene.add(directionalLight)

        this.create3dLogo()

        this.onResize()
    }

    create3dLogo() {
        this.geometry = new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16)

        this.material = new THREE.MeshToonMaterial({ color: 0x6C63FF })
        // Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = 27
        this.scene.add(this.mesh)

        /**
         * Textures
         */
        const textureLoader = new THREE.TextureLoader()
        const matcapTexture = textureLoader.load('textures/matcap.png')

        /**
         * Fonts
         */
        const fontLoader = new FontLoader()
        fontLoader.load(
            'fonts/helvetiker_regular.typeface.json',
            (font) => {
                this.textGeometry = new TextGeometry(
                    'LNC',
                    {
                        font: font,
                        size: 1,
                        height: 0.2,
                        // curveSegments: 5,
                        // bevelEnabled: true,
                        // bevelThickness: 0.03,
                        // bevelSize: 0.02,
                        // bevelOffset: 0,
                        // bevelSegments: 4
                    }
                )

                this.textGeometry.center()

                // this.textMaterial = new THREE.MeshBasicMaterial({ color: 0x6C63FF})
                // this.textMaterial = new THREE.MeshPhongMaterial(
                //     { color: 0x6C63FF, specular: 0xffffff }
                // );
                // this.textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
                this.textMaterial = new THREE.MeshMatcapMaterial()
                this.textMaterial.matcap = matcapTexture

                this.text = new THREE.Mesh(this.textGeometry, this.textMaterial)
                this.text.position.y = 27

                gsap.to(this.text.rotation, { duration: 20, y: this.text.rotation.y + Math.PI * 4.25 })

                this.text.rotation.x = 0.5
                this.text.rotation.y = 0.45

                this.text.scale.set(3, 3, 3)

                this.scene.add(this.text)

            }
        )

    }

    createThreejs() {
        this.threejs = new ThreeJS()
    }

    destroyThreejs() {
        if (!this.threejs) return

        this.threejs.destroy()
        this.threejs = null
    }

    create(template) {
        // console.log(template)
        if (template === 'threejs') {
            this.createThreejs()
        } else {
            this.destroyThreejs()
        }

        this.template = template
    }

    onMouseDown(event) {
        if (this.threejs) {
            this.threejs.onMouseDown(event)
        }
    }

    onMouseUp(event) {
        if (this.threejs) {
            this.threejs.onMouseUp(event)
        }
    }

    onMouseMove(event) {
        if (this.threejs) {
            this.threejs.onMouseMove(event)
        }
    }

    update() {
        // console.log('canvas update')
        const elapsedTime = this.clock.getElapsedTime()
        this.renderer.render(this.scene, this.camera)
        this.time += 0.01

        this.mesh.rotation.x = this.time //elapsedTime * 0.5

        if (this.threejs) {
            this.threejs.update()
        }
    }

    onResize() {
        if (this.threejs) {
            this.threejs.onResize()
        }
    }
}