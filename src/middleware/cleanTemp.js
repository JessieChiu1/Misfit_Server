const fs = require('fs')

const cleanTemp = (req, res, next) => {
    try {
        fs.readdirSync("temp").forEach(file => fs.unlinkSync("temp/" + file))
        req.nextCb()
    } catch(e) {
        next(e)
    }
}

module.exports = cleanTemp;