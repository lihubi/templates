module.exports = async (req, res) => {
    // 读取上传的图片信息
    var files = req.files;
    // console.log(files);
    // 设置返回结果
    var result = {};
    if (!files[0]) {
      result.code = 1;
      result.errMsg = '上传失败';
    } else {
      result.code = 0;
      result.data = {
        url: 'upload/' + files[0].filename
      }
      result.errMsg = '上传成功';
    }
    res.send(JSON.stringify(result));
  }