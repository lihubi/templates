
var express = require('express');
var app = express();
const cors = require('cors');
const mongoose = require("mongoose");
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors());


global.dbHelper = require('./db/dbHelper');
//管理数据库
const connectDB = require("./db/connectDB");

connectDB.mongoose(mongoose);

//操作数据的方法
global.utils = require("./utils/utils");
//通用的方法
global.common = require("./utils/common");


//案例
const cases = require("./api/case");
app.use("/case", cases);

app.listen(3000);