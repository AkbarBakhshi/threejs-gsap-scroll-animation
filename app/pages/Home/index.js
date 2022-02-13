import gsap from 'gsap'

export default class Home {
    constructor() {
    }
    create() {
        
    }

    animateIn() {
        return new Promise(resolve => {
            gsap.timeline({onComplete: resolve})
                .from('.home__welcome', { opacity: 0 })
                .from('.home__youtube__channel__link', { y: '200%' })
                .from('.home__go__to__about__link', { x: '200%'})
                .from('.home__go__to__threejs__link', { x: '-200%'})
        })
    }

    animateOut() {
        return new Promise(resolve => {
            gsap.timeline({onComplete: resolve})
                .to('.home__welcome', { opacity: 0})
                .to('.home__youtube__channel__link', { y: '200%'})
                .to('.home__go__to__about__link', { x: '200%'})
        })
    }
}