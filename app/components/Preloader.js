import EventEmitter from 'events'
import gsap from 'gsap'

export default class Preloader extends EventEmitter {
    constructor() {
        super()
        // console.log('preloader')

        gsap.to('.preloader__container', { opacity: 1 })
        gsap.to('.preloader__number__text', { opacity: 1 })
        this.createLoader()
    }

    createLoader() {
        const images = document.querySelectorAll('img')
        const numberText = document.querySelector('.preloader__number__text')

        const total = images.length
        if (total > 0) {
            images.forEach((img, index) => {
                img.onload = () => {
                    const percent = (index + 1) / total
    
                    numberText.innerHTML = `${Math.round(percent * 100)}%`
    
                    if (percent === 1) {
                        this.allLoaded()
                    }
                }
    
                img.src = img.getAttribute('src')
            })
        } else {
            numberText.innerHTML = '100%'
            this.allLoaded()
        }
    }

    allLoaded() {
        gsap.timeline({
            delay: 2,
            onComplete: () => {
                console.log('completed')
                this.emit('completed')
            }
        })
            .to('.preloader__container', {
                autoAlpha: 0,
                duration: 1.5,
                ease: "expo.out",
                y: '-100%'
            }, 'start')
            .to('.preloader__number__text', {
                autoAlpha: 0,
                duration: 1.5,
                ease: "expo.out",
                y: '100%'
            }, 'start')
    }


}