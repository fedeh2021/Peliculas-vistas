const fs = require('fs');
const path = require('path');
var express = require('express');

const mainController = 
{
    index: (req, res) => {
        res.render("home", { title: 'Digital Movies' })
    }
};

module.exports = mainController