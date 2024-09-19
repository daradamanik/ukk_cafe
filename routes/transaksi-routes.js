const express = require('express')
const app = express()
const control = require('../controllers/transaksiController')
const auth  = require('../auth/auth')
const {checkRole} = require('../middleware/checkRole') 
app.use(express.json())

app.get("/filtertanggal/:startDate/:endDate", auth.authVerify, checkRole(["manajer"]), control.filtertanggal)
app.get("/filterbulan/:bulan_transaksi", auth.authVerify, checkRole(["manajer"]), control.filterBulan)
app.get("/getUser/:id_user", auth.authVerify, checkRole(["manajer"]), control.getIdUser)
app.get("/namaUser", auth.authVerify, checkRole(["manajer"]), control.filterNamaUser)
app.get("/getAll", auth.authVerify, checkRole(["manajer", "kasir"]), control.getAll)
app.get("/getID/:id", auth.authVerify, checkRole(["manajer","kasir"]), control.getID)
app.get("/history", auth.authVerify, checkRole(["manajer", "kasir"]), control.orderHistory)
app.post("/add", auth.authVerify, checkRole(["manajer", "kasir"]), control.addTransaksi)
app.put("/update/:id", auth.authVerify, checkRole(["manajer", "kasir"]), control.editTransaksi)
app.delete("/delete/:id", auth.authVerify, checkRole(["manajer","kasir"]), control.deleteTransaksi)

module.exports = app