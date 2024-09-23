const fs = require ('fs')
const pdf = require('pdf-creator-node')
const path = require('path')

const invoice = async(request, response, next) => {
    const html = fs.readFileSync(path.join(__dirname, './receipt.html'), 'utf-8')
}