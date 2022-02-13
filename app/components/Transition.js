import gsap from 'gsap'

export default class {
    constructor() {
    }

    show() {
        return new Promise(resolve => {
            gsap.fromTo('.transition', {
                scale: 0
            }, {
                scale: 2,
                duration: 2,
                ease: 'expo.out',
                onComplete: resolve
            })
        })
    }

    hide() {
        return new Promise(resolve => {
            gsap.to('.transition', {
                scale: 0,
                duration: 2,
                ease: 'expo.in',
                onComplete: resolve
            })
        })
    }

}
