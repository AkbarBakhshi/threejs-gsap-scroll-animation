import gsap from 'gsap'

export default class Threejs {
    constructor() {
    }
    create() {

    }

    animateIn() {
        // return new Promise(resolve => {
        //     gsap.timeline({ onComplete: resolve })
        //         .from('.threejs', { y: '-200%' })
        //         .from('.threejs__canvas__container', { x: '100%' })
        //     // .from('.threejs__canvas__container', { autoAlpha: 0 })
        // })
    }

    animateOut() {
        // return new Promise(resolve => {
        //     gsap.timeline({ onComplete: resolve })
        //         .to('.threejs', { y: '200%' })
        //         .to('.threejs__canvas__container', { x: '-100%' })
        // })
    }
}