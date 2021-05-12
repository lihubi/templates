
const mongoose = (mongoose) => { 

  let db = mongoose.connect(`mongodb://localhost:27017/ambry`,(err)=>{
    if(err){
      console.log(err)
      console.log("mongodb数据库连接失败！");
    }else{
      console.log("mongodb数据库连接成功！");
    }
  });  
};
//将配置导出
module.exports = {
  mongoose : mongoose,
};


