const users = require('../models/index').user
const checkRole =  (allowedRole) => { //ngatur role yang dibolehin
    return async (req, res, next) => {
        const admin = await users.findOne();
        const userRole = admin.role //cari role nya user dari database
        console.log(userRole)
        if(allowedRole.includes(userRole)){ //kalo sesuai kriteria
            next()
        } else { //kalo ga punya akses
            return res.status(403).json({
                message : "akses ditolak",
                err: null,
            })
        }
    }
}
module.exports = {checkRole}