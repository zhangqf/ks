<template>
  <div class="app-container">

    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="班次名称">
        <el-input v-model="filters.keyword" placeholder="输入班次名称查询"></el-input>
      </el-form-item>
<!--      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="handelAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center">
          <template slot-scope="scope">
              <span>{{(startPage - 1) * pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="班次名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.shiftname }}
        </template>
      </el-table-column>
      <el-table-column label="开始时间"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | dateFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | dateFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column
            align="center"
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary" icon="el-icon-edit"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger" icon="el-icon-delete"
                @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
      </el-table-column>
    </el-table>

    <el-col>
    		<div class="block" style="float: right;margin-right: 10px;margin-top: 10px;">
    			<el-pagination
    				@size-change="handleSizeChange"
    				@current-change="handleCurrentChange"
    				:current-page="startPage"
    				:page-sizes="pageSizes"
    				:page-size="pageSize"
    				layout="total, sizes, prev, pager, next, jumper"
    				:total="total">
    			</el-pagination>
    	 </div>
    </el-col>

    <!-- 　　新增和编辑 弹框 -->
    <el-dialog
        :title="titleMap[currentType]"
        :visible.sync="dialogFormVisible" >
          <div style="width:80%;margin: 0 auto">
            <el-form :model="ruleForm" status-icon :rules="rules"  ref="ruleForm" :inline="false" label-width="90px" class="demo-ruleForm">
                <el-form-item label="班次名称"   prop="shiftname">
                  <el-input type="text" placeholder="班次名称" auto-complete="off" v-model="ruleForm.shiftname"></el-input>
                </el-form-item>
              <el-form-item label="选择时间"   prop="startTime">
                <el-date-picker
                  v-model="date"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>

<!--                <el-input type="text" style="width: 48%;display: inline-block" placeholder="开始时间" auto-complete="off" v-model="ruleForm.startTime"></el-input>-->

<!--                <el-input type="text" style="width: 48%;display: inline-block" placeholder="开始时间" auto-complete="off" v-model="ruleForm.startTime"></el-input>-->
              </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input type="text" placeholder="备注" auto-complete="off" v-model="ruleForm.remark"></el-input>
                </el-form-item>
            </el-form>
           </div>
           <div slot="footer" class="dialog-footer">
             <el-button @click="dialogFormVisible = false">取 消</el-button>
             <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
           </div>
   </el-dialog>


  </div>
</template>

<script>
import { getShiftList,addShift,updateShift,deleteShift} from '@/api/shift'
import { formatDate } from '@/utils/date'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    dateFormat(time){
      return formatDate(new Date(time),'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    return {
     fileList: [],
      date:[],
     url: '',
      filters: {
      	keyword: ''
      },
      imageUrl: '',
      activeValue: 1,
      inactiveValue: 0,
      listLoading: false, // 加载等待
      pageSizes: [10, 20, 40, 100],
      startPage: 1,
      pageSize: 10,
      total: 0,
      list: null,
      listLoading: true,
      currentType: 'add',  //新增、查看、编辑公用一个弹窗，当前弹框类型，'add','view','edit'，默认为新增
      dialogFormVisible:false,
      ruleForm: {
        id: '',
      	shiftname: '',
        startTime: '',
        endTime: '',
        remark: ''
      },
      // 表单验证
      rules: {
        shiftname: [
          { required: true, message: '请输入班次名称'},
          { min: 2, max: 10, message: '长度在 5 到 12 个字符'}
        ],
      },
     //新增or编辑弹框标题(根据点击的新增or编辑按钮显示不同的标题)
     titleMap: {
         add:'新增',
         view: "查看信息",
         edit: "修改信息"
     }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    dateFormats(time){
      return formatDate(new Date(time),'yyyy-MM-dd hh:mm:ss')
    },
    fetchData() {
      this.listLoading = true
      let params = {
        startPage: this.startPage,
        pageSize: this.pageSize,
        shiftname: this.filters.keyword
      }
      getShiftList(params).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }).catch(err =>{
        this.listLoading = false
      })
    },

    //查询
    queryData(){
      this.fetchData()
    },

    handleAvatarSuccess(res, file) {
     // this.imageUrl = URL.createObjectURL(file.raw);
    },

    // 表单提交
    submitForm(formName) {
      this.ruleForm.startTime = this.dateFormats(this.date[0])
      this.ruleForm.endTime = this.dateFormats(this.date[1])
    	this.$refs[formName].validate((valid) => {
    		if (valid) {
    			if(this.currentType == 'add'){
            this.doAdd()
          }else if(this.currentType == 'edit'){
            this.doUpdate()
          }
    		} else {
    			console.log('error submit!!');
    			return false
    		}
    	})
    },
     //新增
    handelAdd() {
      this.currentType = 'add'
      this.resultRes()
      //显示弹框
      this.dialogFormVisible = true;
     },

    resultRes() {
      this.ruleForm.id = ''
      this.ruleForm.shiftname = ''
      this.ruleForm.remark = ''
      this.date = []
    },
     //编辑
    handleEdit(obj) {
      this.currentType = 'edit'
      this.ruleForm = obj
      this.date = [];
      this.date.push(new Date(this.ruleForm.startTime))
      this.date.push(new Date(this.ruleForm.endTime))



      //显示弹框
      this.dialogFormVisible = true;
     },
     // 执行添加
    doAdd(){
       addShift(this.ruleForm).then(response => {
         let msgType = 'error'
         if(response.data.code == 200){
           msgType = 'success'
         }
         this.$message({
                   message: response.data.msg,
                   type: msgType
                 });
         // 关闭弹窗
         this.dialogFormVisible = false
         //刷新列表
         this.fetchData()
       }).catch(err =>{
         this.$message({
                   message: '添加失败',
                   type: 'error'
                 });
       })
     },
    // 执行更新
    doUpdate(){
      updateShift(this.ruleForm).then(response => {
        let msgType = 'error'
        if(response.data.code == 200){
          msgType = 'success'
        }
        this.$message({
                  message: response.data.msg,
                  type: msgType
                });
        // 关闭弹窗
        this.dialogFormVisible = false
        //刷新列表
        this.fetchData()
      }).catch(err =>{
        this.$message({
                  message: '修改失败',
                  type: 'error'
                });
      })
    },
    // 删除
    handleDelete(id){
      this.$confirm("确认要删除该班次吗？","友情提示",{
        confirmButtonText: '立即删除',
        cancelButtonText: '再考虑一下',
        type: 'warning'
      }).then(() => {
        let params = {
          id: id
        }
        deleteShift(params).then(response => {
          let msg = "删除失败"
          let msgType = 'error'
          if(response.data.code == 200 && response.data.msg == '1'){
            msg = "删除成功"
            msgType = 'success'
          }
          this.$message({
                    message: msg,
                    type: msgType
                  });
          //刷新列表
          this.fetchData()
        }).catch(err =>{
          this.$message({
                    message: '删除失败',
                    type: 'error'
                  });
        })
      }).catch(() => {
        console.log("再考虑一下")
      })
    },
    // 每页大小改变时触发
    handleSizeChange (val) {
    	this.pageSize = val
    	this.fetchData()
    },
    // 当前页码改变时触发
    handleCurrentChange (val) {
    	this.startPage = val
    	this.fetchData()
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

</style>
