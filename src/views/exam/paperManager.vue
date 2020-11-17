<template>
  <div class="app-container">
    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="试卷名称">
        <el-input
          v-model="filters.keyword"
          placeholder="输入试卷名称查询"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="queryData"
        >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelAdd"
        >随机组卷</el-button>
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
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ (startPage - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试卷名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="培训班次" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shiftName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="测试专业"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ scope.row.professName1 }} / {{ scope.row.professName2 }}
        </template>
      </el-table-column>
      <el-table-column label="试卷总分" align="center">
        <template slot-scope="scope">
          {{ scope.row.totalScore }}
        </template>
      </el-table-column>
      <el-table-column label="考试总时间(分钟)" align="center">
        <template slot-scope="scope">
          {{ scope.row.totalTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="340">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-view"
            @click="handleEdit(scope.row.id)"
          >编辑试卷</el-button>
          <el-button
            v-if="scope.row.isPublish != 1"
            size="mini"
            type="success"
            icon="el-icon-share"
            @click="publishExam(scope.row.id)"
          >发布试卷</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteExam(scope.row.id)"
          >删除试卷</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-col>
      <div
        class="block"
        style="float: right;margin-right: 10px;margin-top: 10px;"
      >
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
    <el-dialog :title="titleMap[currentType]" :visible.sync="dialogFormVisible">
      <div style="width:85%;margin: 0 auto">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          status-icon
          :rules="rules"
          :inline="false"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col span="12">
              <el-form-item label="试卷名称" prop="name">
                <el-input
                  v-model="ruleForm.name"
                  type="text"
                  placeholder="试卷名称"
                  auto-complete="off"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col span="12">
              <el-form-item label="考试总时间" prop="totalTime">
                <el-input
                  type="number"
                  placeholder="单位为分钟"
                  auto-complete="off"
                  v-model="ruleForm.totalTime"
                ></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-form-item
            label="选择班次"
            prop="shiftsid"
            :rules="{
              required: true,
              message: '请选择培训班次',
              trigger: 'blur'
            }"
          >
            <el-select
              v-model="ruleForm.shiftsid"
              placeholder="请选择培训班次"
              :disabled="currentType == 'view'"
            >
              <el-option
                v-for="item in shifts0"
                :key="item.id"
                :label="item.shiftname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="选择专业"
            prop="professid"
          >
            <el-select
              v-model="activeid1"
              placeholder="请选择一级专业"
              :disabled="currentType == 'view'"
            >
              <el-option
                v-for="item in shifts1"
                :key="item.id"
                :label="item.profename"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-model="ruleForm.professid"
              placeholder="请选择二级专业"
              :disabled="currentType == 'view'"
            >
              <el-option
                v-for="item in shifts2"
                :key="item.id"
                :label="item.profename"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-row>
            <el-col span="12">
              <el-form-item
                label="选择填空题"
                style=" width:90%;display: inline-block"
              >
                <el-input
                  v-model.number.trim="ruleForm.fillNumber"
                  type="number"
                  placeholder="填空题数量"
                  auto-complete="off"
                  min="0"
                />
              </el-form-item>
              <i
                class="el-icon-circle-plus-outline"
                style="font-size: 24px; vertical-align: middle; width:8%;display: inline-block;text-align: center"
                @click="chooseQuestion('first')"
              />
            </el-col>
            <el-col span="12">
              <el-form-item label="填空题分数">
                <el-input
                  v-model.number.trim="ruleForm.fillScore"
                  type="number"
                  placeholder="单题的分数"
                  auto-complete="off"
                  min="0"
                  @blur="fillScoreChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item
                label="选择判断题"
                style=" width:90%;display: inline-block"
              >
                <el-input
                  v-model.number.trim="ruleForm.judgeNumber"
                  type="number"
                  placeholder="判断题数量"
                  auto-complete="off"
                  min="0"
                />
              </el-form-item>
              <i
                class="el-icon-circle-plus-outline"
                style="font-size: 24px; vertical-align: middle;width:8%;display: inline-block;text-align: center"
                @click="chooseQuestion('second')"
              />
            </el-col>
            <el-col span="12">
              <el-form-item label="判断题分数">
                <el-input
                  v-model.number.trim="ruleForm.judgeScore"
                  type="number"
                  placeholder="单题的分数"
                  auto-complete="off"
                  min="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item
                label="选择单选题"
                style=" width:90%;display: inline-block"
              >
                <el-input
                  v-model.number.trim="ruleForm.singleNumber"
                  type="number"
                  placeholder="单选题数量"
                  auto-complete="off"
                  min="0"
                />
              </el-form-item>
              <i
                class="el-icon-circle-plus-outline"
                style="font-size: 24px; vertical-align: middle;width:8%;display: inline-block;text-align: center"
                @click="chooseQuestion('third')"
              />
            </el-col>
            <el-col span="12">
              <el-form-item label="单选题分数">
                <el-input
                  v-model.number.trim="ruleForm.singleScore"
                  type="number"
                  placeholder="单题的分数"
                  auto-complete="off"
                  min="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item
                label="选择多选题"
                style=" width:90%;display: inline-block"
              >
                <el-input
                  v-model.number.trim="ruleForm.multiNumber"
                  type="number"
                  placeholder="多选题数量"
                  auto-complete="off"
                  min="0"
                />
              </el-form-item>
              <i
                class="el-icon-circle-plus-outline"
                style="font-size: 24px; vertical-align: middle;width:8%;display: inline-block;text-align: center"
                @click="chooseQuestion('fourth')"
              />
            </el-col>
            <el-col span="12">
              <el-form-item label="多选题分数">
                <el-input
                  v-model.number.trim="ruleForm.multiScore"
                  type="number"
                  placeholder="单题的分数"
                  auto-complete="off"
                  min="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="试卷描述">
            <el-input
              v-model.trim="ruleForm.examDesc"
              type="textarea"
              placeholder="试卷描述"
              auto-complete="off"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!--  选择题目  -->
    <el-dialog title="选择题目" :visible.sync="ischooseQuestion">
      <div style="width:85%;margin: 0 auto">
        <el-table
          ref="tableItem"
          v-loading="listLoading"
          style="
max-height: 400px;
    height: auto;
    overflow-y: scroll;"
          :data="qustionList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="序号" type="index" width="50" align="center">
            <template slot-scope="scope">
              <span>{{ (startPage - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="题目内容"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.questionContent }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <!--      <el-table-column label="更新时间"  align="center">
                  <template slot-scope="scope">
                    {{ scope.row.updateTime }}
                  </template>
                </el-table-column> -->
          <el-table-column label="难度等级" align="center">
            <template slot-scope="scope">
              {{ scope.row.questionLevelStr }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ischooseQuestion = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitFormTable('ruleForm')"
        >确 定</el-button>
      </div>
      <el-col>
        <div
          class="block"
          style="text-align:center;margin-right: 10px;margin-top: 20px;"
        >
          <el-pagination
            :current-page="startPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals"
            @size-change="handleSizeChanges"
            @current-change="handleCurrentChanges"
          />
        </div>
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
import {
  getQuestionList,
  getProfeById,
  getProfeOne,
  getShiftfeOne
} from '@/api/question'
import {
  getPaperList,
  addPaper,
  updatePaper,
  editPaper,
  deletePaper,
  queryPaperById,
  getCount
} from '@/api/paper'
import { getUserId } from '@/utils/auth'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    // 校验数字
    const validcodeNumber = (rule, value, callback) => {
      const reg = /^(0|[1-9][0-9]*)$/
      if (!reg.test(value)) {
        callback(new Error('只能填非负整数'))
      } else {
        callback()
      }
    }
    // 校验填空题数量
    const validFill = (rule, value, callback) => {
      const reg = /^(0|[1-9][0-9]*)$/
      if (!reg.test(value)) {
        callback(new Error('只能填非负整数'))
      } else {
        if (this.fillCount && this.fillCount < value) {
          callback(new Error('填空题最多只有 ' + this.fillCount + ' 题'))
        } else {
          callback()
        }
      }
    }
    // 校验判断题数量
    const validJudge = (rule, value, callback) => {
      const reg = /^(0|[1-9][0-9]*)$/
      if (!reg.test(value)) {
        callback(new Error('只能填非负整数'))
      } else {
        if (this.judgeCount && this.judgeCount < value) {
          callback(new Error('判断题最多只有 ' + this.judgeCount + ' 题'))
        } else {
          callback()
        }
      }
    }
    // 校验单选题数量
    const validSingle = (rule, value, callback) => {
      const reg = /^(0|[1-9][0-9]*)$/
      if (!reg.test(value)) {
        callback(new Error('只能填非负整数'))
      } else {
        if (this.singleCount && this.singleCount < value) {
          callback(new Error('单选题最多只有 ' + this.singleCount + ' 题'))
        } else {
          callback()
        }
      }
    }
    // 校验多选题数量
    const validMulti = (rule, value, callback) => {
      const reg = /^(0|[1-9][0-9]*)$/
      if (!reg.test(value)) {
        callback(new Error('只能填非负整数'))
      } else {
        if (this.multiCount && this.multiCount < value) {
          callback(new Error('多选题最多只有 ' + this.multiCount + ' 题'))
        } else {
          callback()
        }
      }
    }
    // 校验分数
    const validcodeScore = (rule, value, callback) => {
      const reg = /^(0|[1-9][0-9]*)+(.[0-9]{1,2})?$/
      if (!reg.test(value)) {
        callback(new Error('分数必须是大于等于0'))
      } else {
        callback()
      }
    }
    return {
      isdisabled: false,
      action: process.env.VUE_APP_BASE_API + '/user/upload',
      videopath: '',
      folderName: { folderName: 'ycylManage' },
      ischooseQuestion: false,
      fullscreenLoading: false,
      filters: {
        keyword: ''
      },
      filelist: [{ name: 'video.mp4' }],
      videoData: {},
      shifts0: [],
      shifts1: [],
      shifts2: [],
      activeid1: '',
      listLoading: false, // 加载等待
      pageSizes: [6, 10, 20, 40],
      startPage: 1,
      pageSize: 6,
      total: 0,
      list: null,
      listLoading: true,
      currentType: 'add', // 新增、查看、编辑公用一个弹窗，当前弹框类型，'add','view','edit'，默认为新增
      dialogFormVisible: false,
      ruleForm: {
        id: '',
        name: '',
        examDesc: '',
        fillNumber: '',
        judgeNumber: '',
        singleNumber: '',
        multiNumber: '',
        fillScore: '',
        judgeScore: '',
        singleScore: '',
        multiScore: '',
        totalTime: '',
        singleIds: '',
        multiIds: '',
        judgeIds: '',
        fillIds: '',
        videopath: '',
        videotime: '',

        shiftsid: '',
        professid: '',
        professName1: '',
        professName2: '',
        shiftName: ''
      },
      // 表单验证
      rules: {
        professid: [
          { required: true, message: '请选培训专业', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
        fillNumber: [
          { required: true, message: '请输入填空题数量', trigger: 'blur' },
          { validator: validFill, trigger: 'blur' }
        ],
        judgeNumber: [
          { required: true, message: '请输入填空题数量', trigger: 'blur' },
          { validator: validJudge, trigger: 'blur' }
        ],
        singleNumber: [
          { required: true, message: '请输入填空题数量', trigger: 'blur' },
          { validator: validSingle, trigger: 'blur' }
        ],
        multiNumber: [
          { required: true, message: '请输入填空题数量', trigger: 'blur' },
          { validator: validMulti, trigger: 'blur' }
        ],
        fillScore: [
          { required: true, message: '请输入分数', trigger: 'blur' },
          { validator: validcodeScore, trigger: 'blur' }
        ],
        judgeScore: [
          { required: true, message: '请输入分数', trigger: 'blur' },
          { validator: validcodeScore, trigger: 'blur' }
        ],
        singleScore: [
          { required: true, message: '请输入分数', trigger: 'blur' },
          { validator: validcodeScore, trigger: 'blur' }
        ],
        multiScore: [
          { required: true, message: '请输入分数', trigger: 'blur' },
          { validator: validcodeScore, trigger: 'blur' }
        ],
        totalTime: [
          { required: true, message: '试卷总时间不能为空', trigger: 'blur' },
          { validator: validcodeNumber, trigger: 'blur' }
        ]
      },

      // 新增or编辑弹框标题(根据点击的新增or编辑按钮显示不同的标题)
      titleMap: {
        add: '添加课件',
        view: '查看信息',
        edit: '修改信息'
      },
      fillCount: null, // 数据库中填空题的数量
      judgeCount: null,
      singleCount: null,
      multiCount: null,
      percents: 0,
      pageSizes: [10, 50, 100, 200],
      startPage: 1,
      pageSize: 10,
      totals: 0,
      list: null,
      qustionList: null,
      videoFlag: false,
      // 是否显示进度条
      videoUploadPercent: '',
      // 进度条的进度，
      isShowUploadVideo: false,
      // 显示上传按钮
      videoForm: {
        showVideoPath: ''
      }
    }
  },
  watch: {
    activeid1(newName, oldName) {
      if (newName == '') {
        return
      }
      this.shifts2 = []
      console.log(12)
      if (Number(this.ruleForm.professfid) != newName) {
        this.ruleForm.professid = ''
      }

      const param = {
        id: newName
      }
      getProfeById(param)
        .then(response => {
          const msgType = 'error'
          if (response.data.code == 200) {
            this.shifts2 = response.data.data
            this.ruleForm.professfid = ''
          }
        })
        .catch(err => {})
    }
  },
  created() {
    this.fetchData()
    this.shiftsData()
    this.shift0Data()
  },
  mounted() {
    this.shiftsData()
    this.shift0Data()
  },
  methods: {
    errorUpdata(err, file, fileList) {
      this.$message({
        message: err,
        type: 'warning'
      })
    },
    progressData(event, file, fileList) {
      this.percents = event.percent
      console.log(event.percent)
      console.log(file)
      console.log(fileList)
    },
    beforeUploadData(file) {
      console.log(file)
      if (
        [
          'video/mp4',
          'video/ogg',
          'video/flv',
          'video/avi',
          'video/wmv',
          'video/rmvb',
          'video/mov'
        ].indexOf(file.type) == -1
      ) {
        this.$message({
          message: '请上传正确的视频格式',
          type: 'warning'
        })
        return false
      }
      this.isdisabled = true
      this.fullscreenLoading = true
    },
    exceed(files, fileList) {
      console.log('exceed')
      console.log(files)
      console.log(fileList)
    },
    successData(response, file, fileList) {
      console.log(response)
      if (response.code == 200) {
        this.ruleForm.videopath = response.data
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.fullscreenLoading = false
        this.isdisabled = false
        return
      } else {
        this.$message({
          message: '上传失败',
          type: 'warning'
        })
      }
      console.log(file)
      console.log(fileList)
    },

    // beforeUploadVideo(file) {
    //   var fileSize = file.size / 1024 / 1024 < 50;
    //   if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
    //     layer.msg("请上传正确的视频格式");
    //     return false;
    //   }
    //   if (!fileSize) {
    //     layer.msg("视频大小不能超过50MB");
    //     return false;
    //   }
    //   this.isShowUploadVideo = false;
    // },

    submitFormTable() {
      const arr = []
      if (this.$refs.tableItem.selection.length != 0) {
        if (this.$refs.tableItem.selection[0].typeStr == '填空题') {
          this.$refs.tableItem.selection.map((item, index) => {
            arr.push(item.id)
          })
          this.ruleForm.fillNumber = this.$refs.tableItem.selection.length
          this.ruleForm.fillIds = arr.join(',')
        }

        if (this.$refs.tableItem.selection[0].typeStr == '判断题') {
          this.$refs.tableItem.selection.map((item, index) => {
            arr.push(item.id)
          })
          this.ruleForm.judgeIds = arr.join(',')
          this.ruleForm.judgeNumber = this.$refs.tableItem.selection.length
        }
        if (this.$refs.tableItem.selection[0].typeStr == '单选题') {
          this.$refs.tableItem.selection.map((item, index) => {
            arr.push(item.id)
          })
          this.ruleForm.singleIds = arr.join(',')
          this.ruleForm.singleNumber = this.$refs.tableItem.selection.length
        }

        if (this.$refs.tableItem.selection[0].typeStr == '多选题') {
          this.$refs.tableItem.selection.map((item, index) => {
            arr.push(item.id)
          })
          this.ruleForm.multiIds = arr.join(',')
          this.ruleForm.multiNumber = this.$refs.tableItem.selection.length
        }
        this.ischooseQuestion = false
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      }
    },
    // 每页大小改变时触发
    handleSizeChanges(val) {
      this.pageSize = val
      this.fetchDatas()
    },
    // 当前页码改变时触发
    handleCurrentChanges(val) {
      this.startPage = val
      this.fetchDatas()
    },
    chooseQuestion(data) {
      if (this.ruleForm.professid == '') {
        this.$message.warning('请先选择专业')
        return
      }
      (this.ischooseQuestion = true), (this.activeName = data)
      this.fetchDatas()
    },
    // 题目列表
    fetchDatas() {
      this.listLoading = true
      const params = {
        startPage: this.startPage,
        pageSize: this.pageSize,
        content: this.filters.keyword,
        questionType: this.activeName,
        professid: this.ruleForm.professid
      }
      getQuestionList(params)
        .then(response => {
          console.log(response)
          this.qustionList = response.data.data
          this.totals = response.data.total
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
        })
    },
    fetchData() {
      this.listLoading = true
      const params = {
        startPage: this.startPage,
        pageSize: this.pageSize,
        userId: getUserId(),
        name: this.filters.keyword
      }
      getPaperList(params)
        .then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
        })
    },
    shiftsData() {
      const param = { profename: '' }
      getProfeOne(param)
        .then(response => {
          this.shifts1 = response.data.data
        })
        .catch(err => {})
    },
    shift0Data() {
      const param = {}
      getShiftfeOne(param)
        .then(response => {
          console.log(response.data.data)
          this.shifts0 = response.data.data
        })
        .catch(err => {})
    },
    queryData() {
      this.fetchData()
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
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

    fillScoreChange(val) {
      if (val > 10) {
        this.$message({
          message: '分数不能大于 10 aa',
          type: 'error'
        })
      }
    },
    // 新增
    handelAdd() {
      this.activeid1 = ''
      if (this.$refs.ruleForm != undefined) {
        this.$refs.ruleForm.resetFields()
      }
      this.currentType = 'add'
      this.resultRes()
      // 显示弹框
      this.dialogFormVisible = true
      // 获取各种题型的数量
      getCount()
        .then(response => {
          this.fillCount = response.data.data.fillCount
          this.judgeCount = response.data.data.judgeCount
          this.singleCount = response.data.data.singleCount
          this.multiCount = response.data.data.multiCount
        })
        .catch(err => {
          this.listLoading = false
        })
    },
    resultRes() {
      this.ruleForm.id = ''
      this.ruleForm.name = ''
      this.ruleForm.examDesc = ''
      this.ruleForm.fillNumber = ''
      this.ruleForm.judgeNumber = ''
      this.ruleForm.singleNumber = ''
      this.ruleForm.multiNumber = ''
      this.ruleForm.fillScore = ''
      this.ruleForm.judgeScore = ''
      this.ruleForm.singleScore = ''
      this.ruleForm.multiScore = ''
      this.ruleForm.totalTime = ''
      this.ruleForm.singleIds = ''
      this.ruleForm.multiIds = ''
      this.ruleForm.fillIds = ''
      this.ruleForm.judgeIds = ''
      this.ruleForm.videopath = ''
      this.ruleForm.videotime = ''
      this.ruleForm.professid = ''
      this.ruleForm.shiftsid = ''
      this.ruleForm.professName1 = ''
      this.ruleForm.professName2 = ''
      this.ruleForm.shiftName = ''
    },
    // 编辑
    handleEdit(id) {
      if (this.$refs.ruleForm != undefined) {
        this.$refs.ruleForm.resetFields()
      }
      const param = {
        id: id
      }
      queryPaperById(param)
        .then(response => {
          if (response.data.code == 200) {
            this.currentType = 'edit'
            this.ruleForm = response.data.data
            console.log(123123)
            console.log(response.data.data)
            this.activeid1 = Number(this.ruleForm.professfid)
            this.ruleForm.professid = Number(this.ruleForm.professid)
            // this.activeid1 =  this.ruleForm.professfid
            // 显示弹框
            this.dialogFormVisible = true
          }
        })
        .catch(err => {
          this.$message({
            message: '查询失败',
            type: 'error'
          })
        })
    },

    // 执行添加
    doAdd() {
      // let params = {
      //   id: id,

      // }

      this.ruleForm.professfid = this.activeid1

      this.shifts1.map((item, index) => {
        if (item.id == this.activeid1) {
          this.ruleForm.professName1 = item.profename
        }
      })
      this.shifts2.map((item, index) => {
        if (item.id == this.ruleForm.professid) {
          this.ruleForm.professName2 = item.profename
        }
      })
      let flag = true
      if (this.ruleForm.fillNumber != '' && this.ruleForm.fillScore == '') {
        this.$message({
          message: '请填写填空题单题分数',
          type: 'warning'
        })
        return flag = false
      }
      if (this.ruleForm.judgeNumber != '' && this.ruleForm.judgeScore == '') {
        this.$message({
          message: '请填写判断题单题分数',
          type: 'warning'
        })
        return flag = false
      }
      if (this.ruleForm.singleNumber != '' && this.ruleForm.singleScore == '') {
        this.$message({
          message: '请填写单选题单题分数',
          type: 'warning'
        })
        return flag = false
      }
      if (this.ruleForm.multiNumber != '' && this.ruleForm.multiScore == '') {
        this.$message({
          message: '请填写多选单题分数',
          type: 'warning'
        })
        return flag = false
      }
      console.log(flag)
      console.log(this.ruleForm)
      if (flag) {
        addPaper(this.ruleForm)
          .then(response => {
            let msgType = 'error'
            if (response.data.code == 200) {
              msgType = 'success'
              // 关闭弹窗
              this.dialogFormVisible = false
              // 刷新列表
              this.fetchData()
            } else {
              msgType = 'error'
            }
            this.$message({
              message: response.data.msg,
              type: msgType
            })
          })
          .catch(err => {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          })
      }
    },

    // 执行编辑
    doUpdate() {
      // let params = {
      //   id: id,

      // }
      console.log(this.ruleForm)
      editPaper(this.ruleForm)
        .then(response => {
          let msg = '修改失败'
          let msgType = 'error'
          if (response.data.code == 200) {
            msg = '修改成功'
            msgType = 'success'
          }
          this.$message({
            message: msg,
            type: msgType
          })
          // 关闭弹窗
          this.dialogFormVisible = false
          // 刷新列表
          this.fetchData()
        })
        .catch(err => {
          this.$message({
            message: '修改失败',
            type: 'error'
          })
        })
    },

    // 查看试卷详情
    handleView(id) {
      alert('该功能尚未开发')
    },

    // 发布考试
    publishExam(id) {
      this.$confirm('确认要发布该试卷吗？', '友情提示', {
        confirmButtonText: '立即发布',
        cancelButtonText: '再考虑一下',
        type: 'warning'
      })
        .then(() => {
          const param = {
            id: id,
            isPublish: 1
          }
          updatePaper(param)
            .then(response => {
              if (response.data.code == 200) {
                this.$message({
                  message: response.data.msg,
                  type: 'success'
                })
              }
              // 刷新列表
              this.fetchData()
            })
            .catch(err => {
              this.$message({
                message: '发布考试失败',
                type: 'error'
              })
            })
        })
        .catch(() => {
          console.log('再考虑一下')
        })
    },

    // 删除考试试卷
    deleteExam(id) {
      this.$confirm('确认要删除该试卷吗？', '友情提示', {
        confirmButtonText: '立即删除',
        cancelButtonText: '再考虑一下',
        type: 'warning'
      })
        .then(() => {
          const param = {
            id: id
          }
          deletePaper(param)
            .then(response => {
              if (response.data.code == 200) {
                this.$message({
                  message: response.data.msg,
                  type: 'success'
                })
              }
              // 刷新列表
              this.fetchData()
            })
            .catch(err => {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            })
        })
        .catch(() => {
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
    }
  }
}
</script>

<style scoped>
.el-loading-mask {
  background-color: rgba(0, 0, 0, 0.6);
}
.el-loading-spinner .el-loading-text {
  font-size: 32px;
}
</style>
