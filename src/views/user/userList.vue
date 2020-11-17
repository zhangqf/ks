<template>
  <div class="app-container">

    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="filters.keyword" placeholder="输入用户名查询" />
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
      <el-form-item label="培训班次" prop="shift">
        <el-select v-model="selectShift" filterable placeholder="请选择">
          <el-option
            v-for="item in shifts"
            :key="item.shiftname"
            :label="item.shiftname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-upload style="line-height:30px" :file-list="fileList" :before-upload="beforeUpload">
          <el-button slot="trigger" size="small" type="primary">批量导入</el-button>
          <span slot="tip" class="el-upload__tip" style="color: brown;display:inline-block">只能上传excel文件</span>
          <!-- <a href="/photos/judgeQuestion.xlsx" rel="external nofollow" download="模板"  >
          <el-button size="small" type="success">下载模板</el-button></a> -->
          <!-- <download-excel
            class="blueBtn download"
            style="width:96px;display:inline-block"
            :data="json_data"
            :fields="json_fields"
            worksheet="My Worksheet"
            name="考生模板.xlsx"
          >
            <i class="el-icon-download" style="margin-left:8px;" />
            考生模板</download-excel> -->
          <a class="ui-down" href="/examinee.xlsx" download="考生模板.xlsx"><i class="el-icon-download" style="margin-left:8px;" />考生模板</a>

          <div slot="tip" class="el-upload-list__item-name">{{ fileName }}</div>
        </el-upload>
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
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ (startPage - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.idcard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deptname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="站段" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.station }}</span>
        </template>
      </el-table-column>
      <el-table-column label="培训班次" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shiftName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登陆时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.lastLoginTime">{{ scope.row.lastLoginTime | dateFormat }}</span>
          <span v-else>尚未登录</span>
        </template>
      </el-table-column>
      <el-table-column label="允许登陆" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="activeValue"
            :inactive-value="inactiveValue"
            @change="switchChange(scope.row.enable,scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="操作"
        width="200px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-col>
      <div class="block" style="float: right;margin-right: 10px;margin-top: 10px;">
        <el-pagination
          :current-page="startPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-col>

    <!-- 　　新增和编辑 弹框 -->
    <el-dialog
      :title="titleMap[currentType]"
      :visible.sync="dialogFormVisible"
    >
      <div style="width:80%;margin: 0 auto">
        <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" :inline="false" label-width="90px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" type="text" placeholder="用户名" auto-complete="off" />
          </el-form-item>
          <el-form-item label="真实姓名" prop="name">
            <el-input v-model="ruleForm.name" type="text" placeholder="真实姓名" auto-complete="off" />
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="ruleForm.tel" type="text" placeholder="联系电话" auto-complete="off" />
          </el-form-item>
          <el-form-item label="选择性别">
            <el-radio v-model="ruleForm.sex" label="1">男</el-radio>
            <el-radio v-model="ruleForm.sex" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" type="text" placeholder="邮箱" />
          </el-form-item>
          <el-form-item label="身份证号码" prop="idcard">
            <el-input v-model="ruleForm.idcard" type="text" placeholder="身份证号码" auto-complete="off" />
          </el-form-item>
          <el-form-item label="培训班次" prop="shift">
            <el-select v-model="ruleForm.shiftid" filterable placeholder="请选择">
              <el-option
                v-for="item in shifts"
                :key="item.shiftname"
                :label="item.shiftname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="dept">
            <el-input v-model="ruleForm.deptname" type="text" placeholder="部门" />
          </el-form-item>
          <el-form-item label="站段" prop="depts">
            <el-input v-model="ruleForm.station" type="text" placeholder="站段" />
          </el-form-item>
          <!--                <el-form-item label="密码" prop="password">
                  <el-input type="password" placeholder="密码以字母开头，长度在6~18之间，只能包含字符、数字和下划线" auto-complete="off" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="pass2">
               <el-input type="password" placeholder="确认密码" auto-complete="off"  v-model="ruleForm.pass2"></el-input> -->

          <!--               <el-form-item label="头像"   prop="photoUrl">-->
          <!--               <el-upload-->
          <!--                   class="avatar-uploader"-->
          <!--                   action="xxx"-->
          <!--                   :show-file-list="false"-->
          <!--                   :on-success="handleAvatarSuccess"-->
          <!--                   :before-upload="beforeAvatarUpload">-->
          <!--                   <img v-if="ruleForm.photoUrl" :src="ruleForm.photoUrl" class="avatar">-->
          <!--                   <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
          <!--                 </el-upload>-->
          <!--               </el-form-item>-->
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="ruleForm.roleName" filterable placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch
              v-model="ruleForm.enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="activeValue"
              :inactive-value="inactiveValue"
            />
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
import { getUserList, addUser, updateUser, deleteUser, getRoleList, getShiftList, upload, doExcel } from '@/api/user'
import { getUserId } from '@/utils/auth'
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
    dateFormat(time) {
      return formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    return {
      json_fields: {
        // 导出Excel表格的表头设置
        用户名: 'username',
        真实姓名: 'name',
        联系电话: 'phone',
        '性别（男：1 女：2）': 'sex',
        邮箱: 'email',
        身份证号码: 'IDendtify',
        部门名称: 'partName',
        站段: 'port',
        '角色（管理员：1  教师：2  考生：3）': 'role'
      },
      json_data: [
        {
          username: 'zhangsan43',
          name: '张三',
          phone: '18693654241',
          sex: '1',
          email: 'wwwwwww@163.com',
          IDendtify: '6242455*******************',
          partName: '*****部门',
          port: '***************站段',
          role: 3
        }
      ],
      fileList: [],
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
      selectShift: '',
      list: null,
      listLoading: true,
      currentType: 'add', // 新增、查看、编辑公用一个弹窗，当前弹框类型，'add','view','edit'，默认为新增
      dialogFormVisible: false,
      ruleForm: {
        id: '',
      	username: '',
        sex: 1,
      	password: '123456', // 默认密码
      	email: '',
      	enable: 1,
        photoUrl: '',
      	roleName: '',
        name: '',
        tel: '',
        idcard: '',
        shiftid: '',
        deptname: '',
        station: '',
        shiftName: ''
      },
      // 表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名' },
          { min: 2, max: 10, message: '长度在 5 到 12 个字符' }
        ],
        name: [
          { required: true, message: '请输入真实姓名' }
        ],
        tel: [
          { required: true, message: '请输入联系电话' }
        ],
        idcard: [
          { required: true, message: '请输入身份证号码' }
        ],
        roleName: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ]
      },
      // 新增or编辑弹框标题(根据点击的新增or编辑按钮显示不同的标题)
      titleMap: {
        add: '新增',
        view: '查看信息',
        edit: '修改信息'
      },
      roles: [], // 角色列表
      shifts: [] // 班次列表
    }
  },
  created() {
    this.fetchData()
    this.getRoles()
    this.getShift()
  },
  mounted() {
    this.getShift()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const params = {
        startPage: this.startPage,
        pageSize: this.pageSize,
        username: this.filters.keyword
      }
      getUserList(params).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    // 获取角色列表
    getRoles() {
      getRoleList().then(response => {
        this.roles = response.data.data
      }).catch(err => {
        console.log('获取角色列表失败')
      })
    },
    // 获取班次列表
    getShift() {
      getShiftList().then(response => {
        this.shifts = response.data.data
      }).catch(err => {
        console.log('获取列表失败')
      })
    },
    // 查询
    queryData() {
      this.fetchData()
    },

    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const formData = new FormData()
      formData.append('multipartFiles', file)
      upload(formData).then(response => {
        if (response.data.code == 200) {
          // console.log("返回的头像名："+response.data.data)
          this.ruleForm.photoUrl = response.data.data
        }
      }).catch(err => {
        this.$message({
          message: '上传头像失败',
          type: 'error'
        })
      })
    },

    // 表单提交
    submitForm(formName) {
    	this.$refs[formName].validate((valid) => {
    		if (valid) {
    			if (this.currentType == 'add') {
            this.doAdd()
          } else if (this.currentType == 'edit') {
            this.doUpdate()
          }
    		} else {
    			console.log('error submit!!')
    			return false
    		}
    	})
    },
    // 新增
    handelAdd() {
      this.currentType = 'add'
      this.resultRes()
      // 显示弹框
      this.dialogFormVisible = true
    },

    resultRes() {
      this.ruleForm.id = ''
      this.ruleForm.username = ''
      this.ruleForm.password = '123456'
      this.ruleForm.email = ''
      this.ruleForm.enable = 1
      this.ruleForm.photoUrl = ''
      this.ruleForm.roleName = ''
      this.ruleForm.name = ''
      this.ruleForm.tel = ''
      this.ruleForm.idcard = ''
      this.ruleForm.shiftid = ''
      this.ruleForm.deptname = ''
      this.ruleForm.station = ''
      this.ruleForm.shiftName = ''
      this.ruleForm.sex = 1
    },
    // 编辑
    handleEdit(obj) {
      console.log(obj)
      this.currentType = 'edit'

      this.ruleForm = obj
      this.ruleForm.shiftid = Number(obj.shiftid)
      // 显示弹框
      this.dialogFormVisible = true
    },
    // 执行添加
    doAdd() {
      // let params = {
      //   id: id,

      // }
      addUser(this.ruleForm).then(response => {
        let msgType = 'error'
        if (response.data.code == 200) {
          msgType = 'success'
        }
        this.$message({
          message: response.data.msg,
          type: msgType
        })
        // 关闭弹窗
        this.dialogFormVisible = false
        // 刷新列表
        this.fetchData()
      }).catch(err => {
        this.$message({
          message: '添加失败',
          type: 'error'
        })
      })
    },
    // 执行更新
    doUpdate() {
      updateUser(this.ruleForm).then(response => {
        let msgType = 'error'
        if (response.data.code == 200) {
          msgType = 'success'
        }
        this.$message({
          message: response.data.msg,
          type: msgType
        })
        // 关闭弹窗
        this.dialogFormVisible = false
        // 刷新列表
        this.fetchData()
      }).catch(err => {
        this.$message({
          message: '修改失败',
          type: 'error'
        })
      })
    },
    // 删除
    handleDelete(id) {
      this.$confirm('确认要删除该试卷吗？', '友情提示', {
        confirmButtonText: '立即删除',
        cancelButtonText: '再考虑一下',
        type: 'warning'
      }).then(() => {
        const params = {
          id: id
        }
        deleteUser(params).then(response => {
          let msg = '删除失败'
          let msgType = 'error'
          if (response.data.code == 200 && response.data.msg == '1') {
            msg = '删除成功'
            msgType = 'success'
          }
          this.$message({
            message: msg,
            type: msgType
          })
          // 刷新列表
          this.fetchData()
        }).catch(err => {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
        })
      }).catch(() => {
        console.log('再考虑一下')
      })
    },
    // 每页大小改变时触发
    handleSizeChange(val) {
    	this.pageSize = val
    	this.fetchData()
    },
    // 当前页码改变时触发
    handleCurrentChange(val) {
    	this.startPage = val
    	this.fetchData()
    },
    // 修改用户状态
    switchChange(status, id) {
      const params = {
        enable: status,
        id: id
      }
      updateUser(params).then(response => {
        const msg = status == 1 ? '已允许用户登录' : '已禁止用户登录'
        this.$message({
          message: msg,
          type: 'success'
        })
        // 刷新列表
        this.fetchData()
      }).catch(err => {
        this.$message({
          message: '修改用户状态失败',
          type: 'error'
        })
      })
    },

    beforeUpload(file) {
      if (!this.selectShift) {
        this.$message.warning('请先选择培训班次')
        return
      }
      console.log(file, '文件')
      this.files = file
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      // const isLt2M = file.size / 1024 / 1024 < 5(校验上传文件的大小)
      if (!extension && !extension2) {
        this.$message.warning('上传文档只能是 xls、xlsx格式!')
        return
      }
      this.fileName = file.name
      // return false // 返回false不会自动上传
      this.addLoading = true
      this.submitUpload()
    },
    submitUpload() {
      const fileFormData = new FormData()
      fileFormData.append('file', this.files)// filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      fileFormData.append('shift', this.selectShift)
      doExcel(fileFormData).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
        // 刷新列表
        this.fetchData()
      }).catch(res => {
        this.$message({
          message: '导入失败',
          type: 'error'
        })
      })
    }

  }
}
</script>

<style>
.download {
  line-height: 28px;
  color: #67c23a;
  background: #f0f9eb;
  border-color: #c2e7b0;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
}
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
.ui-down{
      line-height: 28px;
    color: #67c23a;
    background: #f0f9eb;
    border-color: #c2e7b0;
    border-width: 1px;
    border-style: solid;
    cursor: pointer;
    margin-left: 10px;
    padding-right: 8px;
    padding-top: 4px;
    padding-bottom: 4px
}
a, a:focus, a:hover {
    cursor: pointer;
    color: #67c23a;
    text-decoration: none;
}
</style>
