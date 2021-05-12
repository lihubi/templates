<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin:0 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-select
            v-model="listQuery.isnew"
            class="filter-item"
            @change="changeIsNew"
          >
            <el-option label="全部" value="" />
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="日期" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.timestamp | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.title
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新品">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.isnew | isnew }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览量">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.view }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 550px; margin-left: 50px"
      >
        <el-form-item label="日期" prop="timestamp">
          <el-date-picker
            v-model="temp.timestamp"
            type="datetime"
            value-format="timestamp"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="新品">
          <el-select
            v-model="temp.isnew"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item label="照片" prop="address">
          <imagesWall
            v-if="dialogFormVisible"
            :list="temp.images"
            uploadUrl="case/uploadImg"
            @success="upLoadSuccess"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { addCase } from '@/api/case'
// import waves from '@/directive/waves' // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // 分页
import imagesWall from "@/components/imagesWall"; //照片墙
export default {
  name: "ComplexTable",
  components: { Pagination, imagesWall },
  //   directives: { waves },
  filters: {
    isnew(data){
      return data ? '是' : '否'
    },
    parseTime,
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        isnew:'',
      },
      temp: {
        images: [],
        address: "",
        isnew: false,
        timestamp: new Date(),
        title: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建",
      },
      rules: {
        title: [{ required: true, message: "标题必填", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    upLoadSuccess(res) {
      console.log(res);
    },
    async getList() {
      this.listLoading = true;
      let {page, rows, isnew} = this.listQuery;
      let query = {isnew};
      isnew === "" && delete query.isnew //如果isnew为空则删除
      let res = await this.$api.getCase({page, rows,query});
      this.list = res.result.result;
      this.total = res.result.totalItem || 5;
      this.listLoading = false;
    },

    resetTemp() {
      this.temp = {
        images: [],
        address: "",
        isnew: false,
        timestamp: new Date(),
        title: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          // console.log(this.temp);
          let res = await this.$api.addCase(this.temp);
          this.getList();
          this.dialogFormVisible = false;
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          let { address, images, isnew, timestamp, title, _id } = this.temp;
          let params = { address, images, isnew, timestamp, title };
          let res = await this.$api.updateCase({ params, _id });
          console.log(res);
          this.getList();
          this.dialogFormVisible = false;
          this.$notify({
            title: "提示",
            message: "更新成功！",
            type: "success",
            duration: 2000,
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let _id = row._id;
        let res = await this.$api.deleteCase({ _id });
        console.log(res);
        this.getList();
        this.dialogFormVisible = false;
        this.$notify({
          title: "提示",
          message: "删除成功!",
          type: "success",
          duration: 2000,
        });
      });
    },
    changeIsNew(){
      this.getList();
    }
  }
};
</script>
