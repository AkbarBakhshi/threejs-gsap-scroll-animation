import Detection from 'classes/detection'

import Transition from 'components/Transition'
import Preloader from 'components/Preloader'

import Canvas from 'canvas'

import Home from 'pages/Home'
import About from 'pages/About'
import Threejs from 'pages/Threejs'
import Four04 from 'pages/Four04'

import gsap from "gsap"
import { TextPlugin } from "gsap/TextPlugin"

gsap.registerPlugin(TextPlugin);

class App {
    constructor() {
        this.createContent()
        this.createPreloader()
        this.createPages()
        this.createCursor()
        this.createTransition()
        this.create3jsCanvas()

        this.addLinkListeners()
        this.addEventListeners()

        this.onResize()

        this.update()

    }

    createContent() {
        this.content = document.querySelector('.content')
        this.template = this.content.getAttribute('data-template') // this is the value in each pug file under block variables
    }

    createPreloader() {
        this.preloader = new Preloader()
        this.preloader.once('completed', () => {
            gsap.to('.preloader', {
                autoAlpha: 0,
                duration: 1
            })

            this.onResize()
            this.page.animateIn()
            this.canvas.create(this.template)
        })
    }

    createPages() {
        this.pages = {
            home: new Home(),
            about: new About(),
            threejs: new Threejs(),
            four04: new Four04(),
        }
        this.page = this.pages[this.template]
        this.page.create()
        this.page.animateIn()
    }

    createCursor() {
        const cursor = document.querySelector('.cursor')
        if (Detection.isDesktop()) {
            const aTags = document.querySelectorAll('a')
            document.addEventListener('mousemove', (e) => {
                const x = e.clientX
                const y = e.clientY
                cursor.style.left = x + 'px'
                cursor.style.top = y + 'px'
            })

            aTags.forEach(tag => {
                tag.addEventListener('mouseover', () => {
                    // console.log('over')
                    tag.classList.add('curser__hover')
                    cursor.style.borderColor = 'white'
                })
                tag.addEventListener('mouseleave', () => {
                    // console.log('out')
                    tag.classList.remove('curser__hover')
                    cursor.style.borderColor = ''
                })
            })
        } else {
            gsap.set(cursor, { autoAlpha: 0 })
            cursor.style.left = '50%'
            cursor.style.top = '50%'
        }
    }

    createTransition() {
        this.transition = new Transition()
    }

    create3jsCanvas() {
        this.canvas = new Canvas({
            template: this.template
        })
    }

    async onLocalLinkClick({ url, push = true }) {
        const cursor = document.querySelector('.cursor')
        if (!Detection.isDesktop()) {
            gsap.to(cursor, { autoAlpha: 1 })
        }
        cursor.classList.add('cursor__loader')

        const request = await window.fetch(url)
        // console.log(request)

        if (request.status === 200) {
            // console.log(request.text())

            await this.transition.show()
            this.page.animateOut()

            if (push) {
                window.history.pushState({}, '', url)
            }

            const div = document.createElement('div')
            div.innerHTML = await request.text()
            // console.log(div.innerHTML)

            const divContent = div.querySelector('.content')
            this.template = divContent.getAttribute('data-template')
            await this.transition.hide()

            this.content.setAttribute('data-template', this.template)
            this.content.innerHTML = divContent.innerHTML

            this.canvas.create(this.template)

            this.page = this.pages[this.template]
            this.page.create()

            this.onResize()

            await this.page.animateIn()

            this.addLinkListeners()

            //In case we navigate to another page without stopping the video in about page
            gsap.set('.cursor__text', { text: 'Play' })

            if (!Detection.isDesktop()) {
                gsap.to(cursor, { autoAlpha: 0 })
            }
            cursor.classList.remove('cursor__loader')

            this.createCursor()
        } else {
            this.onLocalLinkClick({ url: '/' })
        }
    }

    addLinkListeners() {
        const anchorLinks = document.querySelectorAll('a')

        anchorLinks.forEach((link) => {
            link.onclick = event => {
                // console.log(link.href)
                // console.log(window.location.origin)    ----> this will be the 'root' route of our website
                if (link.href.indexOf(window.location.origin) > -1) {    // this means if the href of the link includes the root route of our website
                    event.preventDefault()
                    this.onLocalLinkClick({
                        url: link.href
                    })
                }
            }
        })
    }

    onMouseDown(event) {
        if (this.canvas && this.canvas.onMouseDown) {
            this.canvas.onMouseDown(event)
        }
    }

    onMouseUp(event) {
        if (this.canvas && this.canvas.onMouseUp) {
            this.canvas.onMouseUp(event)
        }
    }

    onMouseMove(event) {

        if (this.canvas && this.canvas.onMouseMove) {
            this.canvas.onMouseMove(event)
        }
    }


    addEventListeners() {
        window.addEventListener('popstate', this.onPopState.bind(this))

        window.addEventListener('resize', this.onResize.bind(this))

        window.addEventListener('mousedown', this.onMouseDown.bind(this))
        window.addEventListener('touchstart', this.onMouseDown.bind(this))

        window.addEventListener('mouseup', this.onMouseUp.bind(this))
        window.addEventListener('mouseleave', this.onMouseUp.bind(this))
        window.addEventListener('touchend', this.onMouseUp.bind(this))
        window.addEventListener('touchcancel', this.onMouseUp.bind(this))


        window.addEventListener('mousemove', this.onMouseMove.bind(this))
        window.addEventListener('Mousemove', this.onMouseMove.bind(this))
    }

    //===========this is when user clicks browser's back button=============
    onPopState() {
        // console.log(window.location.pathname)
        this.onLocalLinkClick({
            url: window.location.pathname,
            push: false
        })
    }

    update() {
        // console.log('main update')
        if (this.canvas && this.canvas.update) {
            this.canvas.update()
        }
        requestAnimationFrame(this.update.bind(this))

    }

    onResize() {
        if (this.canvas && this.canvas.onResize) {
            this.canvas.onResize()
        }
    }

}

new App()