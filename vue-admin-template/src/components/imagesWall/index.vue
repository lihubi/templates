<template>
  <div class="uploadbox">
    <el-upload
      :action="url + uploadUrl"
      multiple
      accept="image/png, image/jpeg"
      list-type="picture-card"
      :before-upload="beforeUploadPicture"
      :on-progress="uploadProgress"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :show-file-list="false"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <div v-for="(item,i) of imgList" :key="i" class="imgbox">
        <img  :src="baseUrl(item)" alt="">
    </div>
    
  </div>
</template>
<script type="text/ecmascript-6">
import base from "../../utils/http/base"
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    uploadUrl:String
  },
  data() {
    return {
      url:base.BASE_URL,
      addForm: {
        photo: "", // 活动图片
      },
      uploadComplete: true, // 图片上传完成状态
      imgList:[]
    };
  },
  mounted() {
      this.imgList = this.list;
      console.log(this.list);
    // this.fileChange(this.list);
  },
  methods: {
    // 上传图片前调用方法
    beforeUploadPicture(file) {
      if (file.size > 10 * 1024 * 1024) {
        this.$message.error("上传图片不能大于10M");
        return false;
      }
    },
    // 上传图片时调用
    uploadProgress(event, file, fileList) {
      this.uploadComplete = false;
    },
    // 上传图片成功
    uploadSuccess(res, file, fileList) {
        this.imgList.push(res.data.url)
        this.$emit('success',this.imgList)
      this.uploadComplete = true;
      this.fileChange(fileList);
    },
    // 上传图片出错
    uploadError(err, file, fileList) {
      this.$message.error("上传出错");
    },
    // 移除图片
    handleRemove(file, fileList) {
      this.fileChange(fileList);
    },
    // 设置photo值
    fileChange(fileList) {
      let temp_str = "";
      if (fileList.length > 0) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response) {
            if (fileList[i].response.code === 0) {
              if (i === 0) {
                temp_str += fileList[i].response.data;
              } else {
                // 最终photo的格式是所有已上传的图片的url拼接的字符串（逗号隔开）
                temp_str += "," + fileList[i].response.data;
              }
            }
          }
        }
      }
      this.addForm.photo = temp_str;
    },
    // 确认添加
    addEnsure() {
      let params = {
            photo: this.addForm.photo,
          };
    },
     baseUrl(data){
      return this.url + data
    }
  },
  filter:{
   
  }
};
</script>
<style lang="scss" scope>
.uploadbox{
    display: flex;
    align-items: center;
    flex-wrap: wrap;

       .imgbox{
             margin: 5px;
        width: 148px;
        height: 148px;
        flex-shrink: 0;
        box-sizing: content-box;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}
 
</style>