class Detection {
    isPhone() {
        if (!this.isPhoneChecked) {
            this.isPhoneChecked = true

            this.isPhoneCheck = document.documentElement.classList.contains('phone')
        }

        return this.isPhoneCheck
    }

    isTablet() {
        if (!this.TabletChecked) {
            this.TabletChecked = true

            this.TabletCheck = document.documentElement.classList.contains('tablet')
        }

        return this.TabletCheck
    }

    isDesktop() {
        if (!this.DesktopChecked) {
            this.DesktopChecked = true

            this.DesktopCheck = document.documentElement.classList.contains('desktop')
        }

        return this.DesktopCheck
    }
}

const DetectionManager = new Detection()

export default DetectionManager