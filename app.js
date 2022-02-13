require('dotenv').config()

const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')

const uaParser = require('ua-parser-js')

const port = 3000
const app = express()
const path = require('path')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')


app.use((req, res, next) => {
  // console.log(req.headers)
  const ua = uaParser(req.headers['user-agent'])
  // console.log(ua)
  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'
  next()
})

//=======================All the routes - these can have their own file/folder========================
app.get('/', (req, res) => {
  res.render('pages/home')
})

app.get('/about', (req, res) => {
  res.render('pages/about')
})

app.get('/threejs', (req, res) => {
  res.render('pages/threejs')
})

//=====================================Undefined routes error handling==================
app.all('*', async (req, res, next) => {
  res.render('pages/Four04')
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Code 500: Something Went Wrong'
  res.status(statusCode).send(err.message)
})

//=======================Connecting to port====================================
app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`)
})