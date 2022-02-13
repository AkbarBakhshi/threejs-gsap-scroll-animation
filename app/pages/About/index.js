import gsap from 'gsap'

export default class About {
    constructor() {
    }
    create() {
        const cursorText = document.querySelector('.cursor__text')
        const video = document.querySelector('.about__video__link')
        video.addEventListener('mouseenter', () => {
            gsap.timeline()
                .to('.cursor__text', { opacity: 1 })
                .to('.cursor', { backgroundColor: 'green', duration: 0 }, 0)
        })
        video.addEventListener('mouseout', () => {
            gsap.timeline()
                .to('.cursor__text', { opacity: 0, duration: 0 })
                .to('.cursor', { backgroundColor: '', duration: 0 }, 0)
        })
        video.addEventListener('click', () => {
            if (video.paused) {
                cursorText.innerHTML = 'Pause'
                console.log('play clicked')
                video.play()
            } else {
                cursorText.innerHTML = 'Play'
                console.log('paused')
                video.pause()
            }
        })

        video.addEventListener('ended', () => {
            console.log('ended')
            cursorText.innerHTML = 'Play'
        })
    }

    animateIn() {
        return new Promise(resolve => {
            gsap.timeline({ onComplete: resolve })
                .from('.about', { x: '-100vh' })
        })
    }

    animateOut() {
        return new Promise(resolve => {
            gsap.timeline({ onComplete: resolve })
                .to('.about', { x: '-100vh' })
        })
    }
}