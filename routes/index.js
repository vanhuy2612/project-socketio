'use strict'

const Router = require('express').Router();

Router.get('/', (req, res, next) => {
    res.render('index', {
        title: "Trang chu"
    })
})

module.exports = Router;