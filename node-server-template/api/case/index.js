const express = require(`express`)
const common = require("../../utils/common")
const router = express.Router()


//上传图片
const uploadImg = require("./uploadImg")
let upload = common.uploadFile("./public/upload");
router.post('/uploadImg', upload.array('file', 10), uploadImg)

//添加案例
const addCase = require("./addCase")
router.post("/addCase",addCase)

//查询案例
const getCase = require("./getCase")
router.post("/getCase",getCase)

//修改案例
const updateCase = require("./updateCase")
router.post("/updateCase",updateCase)

//修改删除
const deleteCase = require("./deleteCase")
router.post("/deleteCase",deleteCase)

module.exports = router