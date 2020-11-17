<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="填空题" name="first" />
      <el-tab-pane label="判断题" name="second" />
      <el-tab-pane label="单选题" name="third" />
      <el-tab-pane label="多选题" name="fourth" />
    </el-tabs>

    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="题目内容">
        <el-input
          v-model="filters.keyword"
          placeholder="输入题目内容查询"
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
        >新增题目</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          icon="el-icon-upload"
          @click="excelAdd"
        >批量导入</el-button>
      </el-form-item>
      <a class="ui-down" href="/fill.xlsx" download="填空题模板.xlsx"><i class="el-icon-download" style="margin-left:8px;" />填空题模板</a>
      <a class="ui-down" href="/judge.xlsx" download="判断题模板.xlsx"><i class="el-icon-download" style="margin-left:8px;" />判断题模板</a>
      <a class="ui-down" href="/single.xlsx" download="单选题模板.xlsx"><i class="el-icon-download" style="margin-left:8px;" />单选题模板</a>
      <a class="ui-down" href="/multiple.xlsx" download="多选题模板.xlsx"><i class="el-icon-download" style="margin-left:8px;" />多选题模板</a>

      <!-- <download-excel
        class="blueBtn download"
        :data="json_dataFill"
        :fields="json_fieldsFill"
        worksheet="My Worksheet"
        name="填空题.xlsx"
        style="display:inline-block;padding-right:6px"
      >
        <i class="el-icon-download" style="margin-left:8px" />
        填空题模板</download-excel>

      <download-excel
        class="blueBtn download"
        :data="json_datajudge"
        :fields="json_fieldsjudge"
        worksheet="My Worksheet"
        name="判断题.xlsx"
        style="display:inline-block;padding-right:6px"
      >
        <i class="el-icon-download" style="margin-left:8px" />
        判断题模板</download-excel>

      <download-excel
        class="blueBtn download"
        :data="json_dataSingle"
        :fields="json_fieldsSingle"
        worksheet="My Worksheet"
        name="单选题.xlsx"
        style="display:inline-block;padding-right:6px"
      >
        <i class="el-icon-download" style="margin-left:8px" />
        单选题模板</download-excel>
      <download-excel
        class="blueBtn download"
        :data="json_dataMultiple"
        :fields="json_fieldsMultiple"
        worksheet="My Worksheet"
        name="多选题.xlsx"
        style="display:inline-block;padding-right:6px"
      >
        <i class="el-icon-download" style="margin-left:8px" />
        多选题模板</download-excel> -->
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
      <el-table-column
        label="题目内容"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ scope.row.questionContent }}
        </template>
      </el-table-column>
      <el-table-column
        label="题目专业"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ scope.row.professName1 }} / {{ scope.row.professName2 }}
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
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >编辑题目</el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >查看题目</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteExam(scope.row.id)"
          >删除题目</el-button>
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
    <!--    批量导入弹框-->
    <el-dialog title="批量导入" :visible.sync="dialogExcelVisible">
      <div style="width:80%;margin: 0 auto">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          status-icon
          :inline="false"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-form-item label="题目类型">
            <el-select
              v-model="activeName"
              placeholder="请选择题型"
              :disabled="currentType == 'view'"
              @blur="changeType"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="选择专业"
            prop="professid"
            :rules="{ required: true, message: '请选专业', trigger: 'change' }"
          >
            <el-select
              v-model="activeid1"
              placeholder="请选择一级专业"
              :disabled="currentType == 'view'"
              @blur="changeType"
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
              @blur="changeType"
            >
              <el-option
                v-for="item in shifts2"
                :key="item.id"
                :label="item.profename"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-upload
            class="upload-demo"
            :limit="1"
            :before-upload="beforeUpload"
          >
            <el-button
              slot="trigger"
              size="small"
              icon="el-icon-circle-plus"
              type="primary"
              plain
            >选择文件</el-button>
            <div slot="tip" class="el-upload__tip" style="color: brown">
              只能上传excel文件
            </div>
            <div slot="tip" class="el-upload-list__item-name">
              {{ fileName }}
            </div>
          </el-upload>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <template v-if="currentType == 'view'">
          <el-button @click="dialogExcelVisible = false">关 闭</el-button>
        </template>
        <template v-else>
          <el-button @click="dialogExcelVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload()">确 定</el-button>
        </template>
      </div>
    </el-dialog>
    <!-- 　新增和编辑 弹框 -->
    <el-dialog :title="titleMap[currentType]" :visible.sync="dialogFormVisible">
      <div style="width:80%;margin: 0 auto">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          status-icon
          :inline="false"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-form-item label="题目类型">
            <el-select
              v-model="activeName"
              placeholder="请选择题型"
              :disabled="currentType == 'view'"
              @blur="changeType"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="选择专业"
            prop="professid"
            :rules="{ required: true, message: '请选专业', trigger: 'blur' }"
          >
            <el-select
              v-model="activeid1"
              placeholder="请选择一级专业"
              :disabled="currentType == 'view'"
              @blur="changeType"
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
              @blur="changeType"
            >
              <el-option
                v-for="item in shifts2"
                :key="item.id"
                :label="item.profename"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="题目"
            prop="questionContent"
            :rules="[
              { required: true, message: '请输入题目'},
              { min: 1, max: 200, message: '长度在 1 到 200 个字符' }
            ]"
          >
            <el-input
              v-model="ruleForm.questionContent"
              type="textarea"
              placeholder="输入题目,如:从计算机网络系统组成的角度看，计算机网络可以分为()和()。注意需要考生答题部分一定要用括号（英文半角）括起来。"
              auto-complete="off"
              :disabled="currentType == 'view'"
            />
          </el-form-item>
          <!-- 填空题 -->
          <template v-if="activeName == 'first'">
            <el-form-item
              label="正确答案"
              prop="questionAnswer"
              :rules="[
                { required: true, message: '请输入题目',},
                { min: 1, max: 500, message: '长度在 1 到 500 个字符' }
              ]"
            >
              <el-input
                v-model="ruleForm.questionAnswer"
                type="text"
                placeholder="每两个个空之间的答案用英文逗号分隔"
                auto-complete="off"
                :disabled="currentType == 'view'"
              />
            </el-form-item>
          </template>
          <!-- 判断题 -->
          <template v-if="activeName == 'second'">
            <el-form-item
              label="正确答案"
              prop="questionAnswer"
              :rules="{
                required: true,
                message: '请选择答案',
                trigger: 'change'
              }"
            >
              <el-select
                v-model="ruleForm.questionAnswer"
                filterable
                placeholder="请选择答案"
                :disabled="currentType == 'view'"
              >
                <el-option
                  v-for="item in judgeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 单选、多选公共部分 -->
          <template v-if="activeName == 'third' || activeName == 'fourth'">
            <el-form-item
              label="选项A"
              prop="choiceA"
              :rules="[
                { required: true, message: '输入选项内容' },
                { min: 1, max: 100, message: '长度在 1 到 100 个字符' }
              ]"
            >
              <el-input
                v-model="ruleForm.choiceA"
                type="text"
                placeholder="输入选项内容"
                auto-complete="off"
                :disabled="currentType == 'view'"
              />
            </el-form-item>
            <el-form-item
              label="选项B"
              prop="choiceB"
              :rules="[
                { required: true, message: '输入选项内容' },
                { min: 1, max: 100, message: '长度在 1 到 100 个字符' }
              ]"
            >
              <el-input
                v-model="ruleForm.choiceB"
                type="text"
                placeholder="输入选项内容"
                auto-complete="off"
                :disabled="currentType == 'view'"
              />
            </el-form-item>
            <el-form-item
              label="选项C"
              prop="choiceC"
              :rules="[
                { required: true, message: '输入选项内容' },
                { min: 1, max: 100, message: '长度在 1 到 100 个字符' }
              ]"
            >
              <el-input
                v-model="ruleForm.choiceC"
                type="text"
                placeholder="输入选项内容"
                auto-complete="off"
                :disabled="currentType == 'view'"
              />
            </el-form-item>
            <el-form-item
              label="选项D"
              prop="choiceD"
              :rules="[
                { required: true, message: '输入选项内容' },
                { min: 1, max: 100, message: '长度在 1 到 100 个字符' }
              ]"
            >
              <el-input
                v-model="ruleForm.choiceD"
                type="text"
                placeholder="输入选项内容"
                auto-complete="off"
                :disabled="currentType == 'view'"
              />
            </el-form-item>
          </template>
          <!-- 单选 -->
          <template v-if="activeName == 'third'">
            <el-form-item
              label="正确答案"
              prop="questionAnswer"
              :rules="{
                required: true,
                message: '请选择答案',
                trigger: 'change'
              }"
            >
              <el-select
                v-model="ruleForm.questionAnswer"
                filterable
                placeholder="请选择答案"
                :disabled="currentType == 'view'"
              >
                <el-option
                  v-for="item in singleOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 多选 -->
          <template v-if="activeName == 'fourth'">
            <el-form-item
              label="正确答案"
              prop="multi"
              :rules="{
                required: true,
                message: '请选择答案',
                trigger: 'change'
              }"
            >
              <el-select
                v-model="ruleForm.multi"
                multiple
                filterable
                placeholder="请选择答案"
                :disabled="currentType == 'view'"
              >
                <el-option
                  v-for="item in singleOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <el-form-item
            label="题目难度"
            prop="questionLevel"
            :rules="[
              { required: true, message: '请选择题目难度', trigger: 'change' }
            ]"
          >
            <el-select
              v-model="ruleForm.questionLevel"
              filterable
              placeholder="请选择"
              :disabled="currentType == 'view'"
            >
              <el-option
                v-for="item in levels"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="答案解析"
            prop="questionExplain"
            :rules="[
              { max: 200, message: '最多输入 200 个字符', trigger: 'blur' }
            ]"
          >
            <el-input
              v-model="ruleForm.questionExplain"
              type="textarea"
              placeholder="解析答案,方便理解"
              auto-complete="off"
              :disabled="currentType == 'view'"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <template v-if="currentType == 'view'">
          <el-button @click="dialogFormVisible = false">关 闭</el-button>
        </template>
        <template v-else>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >确 定</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getQuestionList,
  getProfeOne,
  getProfeById,
  addFill,
  addJudge,
  addSingle,
  addMulti,
  editFill,
  editJudge,
  editSingle,
  editMulti,
  deleteFill,
  deleteJudge,
  deleteSingle,
  deleteMulti,
  importBdDeptdoc1,
  importBdDeptdoc2,
  importBdDeptdoc3,
  importBdDeptdoc4
} from '@/api/question'
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
    return {
      //  填空题
      json_fieldsFill: {
        // 导出Excel表格的表头设置
        题目描述: 'desc',
        '题目结果 （正确：T 错误：F）': 'TitleResults',
        题目解析: 'Topicanalysis',
        '难度指数（简单：1  中等：2  困难：3）': 'difficulty'
      },
      json_dataFill: [
        {
          desc: '4与5的和是（）2比6少()。',
          TitleResults: '9，4',
          Topicanalysis: '解析...',
          difficulty: '1'
        }
      ],
      // 判断题
      json_fieldsjudge: {
        // 导出Excel表格的表头设置
        题目描述: 'desc',
        '题目结果 （正确：T 错误：F）': 'TitleResults',
        题目解析: 'Topicanalysis',
        '难度指数（简单：1  中等：2  困难：3）': 'difficulty'
      },
      json_datajudge: [
        {
          desc: '与理想气体相比，真实气体的相互作用力偏小。',
          TitleResults: 'F',
          Topicanalysis: '解析。。',
          difficulty: '1'
        },
        {
          desc:
            '总压100Kpa的某气含A与B两种气体，A的摩尔分数为0.20，则B的分压为80KPa',
          TitleResults: 'T',
          Topicanalysis: '解析。。',
          difficulty: '1'
        }
      ],
      // 多选题
      json_fieldsMultiple: {
        // 导出Excel表格的表头设置
        题目描述: 'desc',
        选项A: 'descA',
        选项B: 'descB',
        选项C: 'descC',
        选项D: 'descD',
        '题目结果 （正确：T 错误：F）': 'TitleResults',
        题目解析: 'Topicanalysis',
        '难度指数（简单：1  中等：2  困难：3）': 'difficulty'
      },
      json_dataMultiple: [
        {
          desc: '组织行为学的特点有：()',
          descA: ' A边缘性',
          descB: 'B综合性',
          descC: 'C两重性',
          descD: 'D多层次性',
          TitleResults: 'ABC',
          Topicanalysis: '题目解析',
          difficulty: '1'
        }
      ],
      // 单选题
      json_fieldsSingle: {
        // 导出Excel表格的表头设置
        题目描述: 'desc',
        选项A: 'descA',
        选项B: 'descB',
        选项C: 'descC',
        选项D: 'descD',
        '题目结果 （正确：T 错误：F）': 'TitleResults',
        题目解析: 'Topicanalysis',
        '难度指数（简单：1  中等：2  困难：3）': 'difficulty'
      },
      json_dataSingle: [
        {
          desc: '在我国，将“修”与“辞”两字连起来使用的最早见于（）',
          descA: ' A《周易》',
          descB: 'B《春秋》',
          descC: 'C《文心雕龙》',
          descD: 'D《庄子》',
          TitleResults: 'A',
          Topicanalysis: '题目解析',
          difficulty: '1'
        }
      ],

      filters: {
        keyword: ''
      },
      activeName: 'first',
      activeid1: '',
      options: [
        { value: 'first', label: '填空题' },
        { value: 'second', label: '判断题' },
        { value: 'third', label: '单选题' },
        { value: 'fourth', label: '多选题' }
      ],
      shifts1: [],
      shifts2: [],
      judgeOptions: [{ id: 'T', name: '正确' }, { id: 'F', name: '错误' }],
      singleOptions: [
        { id: 'A', name: 'A' },
        { id: 'B', name: 'B' },
        { id: 'C', name: 'C' },
        { id: 'D', name: 'D' }
      ],
      // 题目难度等级，最好是到后台查数据字典，这里简单起见，没有这么做了
      levels: [
        { id: 1, name: '简单' },
        { id: 2, name: '中等' },
        { id: 3, name: '困难' }
      ],
      listLoading: false, // 加载等待
      pageSizes: [10, 20, 40, 10],
      startPage: 1,
      pageSize: 10,
      total: 0,
      list: null,
      listLoading: true,
      currentType: 'add', // 新增、查看、编辑公用一个弹窗，当前弹框类型，'add','view','edit'，默认为新增
      dialogFormVisible: false,
      dialogExcelVisible: false,
      fileName: '',
      ruleForm: {
        id: '',
        questionContent: '',
        professid: '',
        questionAnswer: '',
        questionLevel: '',
        questionExplain: '',
        multi: [], // 多选题选项答案，用数组临时存储
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: '',
        professName1: '',
        professName2: ''
      },
      // 新增or编辑弹框标题(根据点击的新增or编辑按钮显示不同的标题)
      titleMap: {
        add: '新增',
        view: '查看',
        edit: '修改'
      }
    }
  },
  watch: {
    activeid1(newName, oldName) {
      if (newName == '') {
        // this.$message.warning('请选择一级专业')
        return
      }
      this.shifts2 = []
      // this.ruleForm.professid = ''
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
          }
        })
        .catch(err => {})
    }
  },
  created() {
    this.fetchData()
    this.shiftsData()
  },
  mounted() {
    this.shiftsData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const params = {
        startPage: this.startPage,
        pageSize: this.pageSize,
        content: this.filters.keyword,
        questionType: this.activeName
      }
      getQuestionList(params)
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

    queryData() {
      this.fetchData()
    },
    // 切换标签页
    handleClick(tab, event) {
      this.fetchData()
      //
      // console.log("tab =="+tab+ " event =="+event)
    },
    // 查看题目详情
    handleView(obj) {
      this.currentType = 'view'

      this.ruleForm = obj
      if (!obj.questionExplain) {
        this.ruleForm.questionExplain = '暂无解析'
      }
      if (this.activeName == 'fourth') {
        // 给多选题答案赋值
        this.ruleForm.multi = obj.questionAnswer.split(',')
      }
      // 显示弹框
      this.dialogFormVisible = true
    },
    // 添加
    handelAdd() {
      this.currentType = 'add'
      this.activeid1 = ''
      if (this.$refs.ruleForm != undefined) {
        this.$refs.ruleForm.resetFields()
      }
      this.resultRes()
      // 显示弹框
      this.dialogFormVisible = true
    },
    // 导入
    excelAdd() {
      this.resultRes()
      // 显示弹框
      this.dialogExcelVisible = true
    },
    resultRes() {
      this.ruleForm.id = ''
      this.ruleForm.professid = ''
      this.ruleForm.questionContent = ''
      this.ruleForm.questionAnswer = ''
      this.ruleForm.questionLevel = ''
      this.ruleForm.questionExplain = ''
      this.ruleForm.multi = []
      this.ruleForm.choiceA = ''
      this.ruleForm.choiceB = ''
      this.ruleForm.choiceC = ''
      this.ruleForm.choiceD = ''
      this.fileName = ''
    },
    // 编辑
    handleEdit(obj) {
      if (this.$refs.ruleForm != undefined) {
        this.$refs.ruleForm.resetFields()
      }
      this.currentType = 'edit'
      this.ruleForm = JSON.parse(JSON.stringify(obj))
      this.activeid1 = Number(obj.professfid)
      this.ruleForm.professid = Number(obj.professid)
      if (!obj.questionExplain) {
        this.ruleForm.questionExplain = '暂无解析'
      }
      if (this.activeName == 'fourth') {
        // 给多选题答案赋值
        this.ruleForm.multi = obj.questionAnswer.split(',')
      }
      // 显示弹框
      this.dialogFormVisible = true
    },
    changeType(val) {
      // let t = this.activeName

      // 要清除单选的值，不然切换到多选时只能 只读，不能修改，
      this.ruleForm.questionAnswer = ''
      // console.log("当前值 "+val)
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 新增
          if (this.currentType == 'add') {
            //
            let doAdd = addFill
            if (this.activeName == 'second') {
              doAdd = addJudge
            } else if (this.activeName == 'third') {
              doAdd = addSingle
            } else if (this.activeName == 'fourth') {
              // console.log("多选题答案  "+this.multi)
              const answer = this.ruleForm.multi
              this.ruleForm.questionAnswer = answer.join(',')
              doAdd = addMulti
            }

            // 这里主要是为了复用代码，没有分别写一个函数，通过这种方式，可以动态改变要调用的方法
            doAdd(this.ruleForm)
              .then(response => {
                // 不管成功还是失败，清除答案
                // this.ruleForm.questionAnswer = ''
                let msg = '添加失败'
                let msgType = 'error'
                if (response.data.code == 200) {
                  msg = '添加成功'
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
                  message: '添加失败',
                  type: 'error'
                })
              })
          } else if (this.currentType == 'edit') {
            // this.doUpdate()
            let doEdit = editFill
            if (this.activeName == 'second') {
              doEdit = editJudge
            } else if (this.activeName == 'third') {
              doEdit = editSingle
            } else if (this.activeName == 'fourth') {
              // console.log("多选题答案  "+this.multi)
              const answer = this.ruleForm.multi
              this.ruleForm.questionAnswer = answer.join(',')
              doEdit = editMulti
            }
            // 这里主要是为了复用代码，没有分别写一个函数，通过这种方式，可以动态改变要调用的方法
            doEdit(this.ruleForm)
              .then(response => {
                // 不管成功还是失败，清除答案
                // this.ruleForm.questionAnswer = ''
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
          }
        } else {
          this.$message({ message: '表单有必填项没填', type: 'error' })
          return false
        }
      })
    },
    // 删除
    deleteExam(id) {
      this.$confirm('确认要删除该题目吗？', '友情提示', {
        confirmButtonText: '立即删除',
        cancelButtonText: '再考虑一下',
        type: 'warning'
      })
        .then(() => {
          const param = {
            id: id
          }
          let doDel = deleteFill
          if (this.activeName == 'second') {
            doDel = deleteJudge
          } else if (this.activeName == 'third') {
            doDel = deleteSingle
          } else if (this.activeName == 'fourth') {
            // console.log("多选题答案  "+this.multi)
            const answer = this.ruleForm.multi
            this.ruleForm.questionAnswer = answer.join(',')
            doDel = deleteMulti
          }
          // 这里主要是为了复用代码，没有分别写一个函数，通过这种方式，可以动态改变要调用的方法
          doDel(param)
            .then(response => {
              // 不管成功还是失败，清除答案
              // this.ruleForm.questionAnswer = ''
              let msg = '删除失败'
              let msgType = 'error'
              if (response.data.code == 200) {
                msg = '删除成功'
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
    },
    beforeUpload(file) {
      console.log(file, '文件')
      this.files = file
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      // const isLt2M = file.size / 1024 / 1024 < 5(校验上传文件的大小)
      if (!extension && !extension2) {
        this.$message.warning('上传文档只能是 xls、xlsx格式!')
        return
      }
      console.log(file.name)
      this.fileName = file.name
    },
    submitUpload() {
      if (this.ruleForm.professid == '') {
        this.$message.warning('请先选择专业')
        return
      }
      if (this.fileName == '') {
        this.$message.warning('请先选择文件')
        return
      }
      this.dialogExcelVisible = false
      const fileFormData = new FormData()
      fileFormData.append('file', this.files) // filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      fileFormData.append('professid', this.ruleForm.professid)
      let doExcel = importBdDeptdoc1
      if (this.activeName == 'second') {
        doExcel = importBdDeptdoc2
      } else if (this.activeName == 'third') {
        doExcel = importBdDeptdoc3
      } else if (this.activeName == 'fourth') {
        doExcel = importBdDeptdoc4
      }
      doExcel(fileFormData)
        .then(res => {
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
        })
        .catch(res => {
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
.ui-down {
  line-height: 28px;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
  border-radius: 2px;
  font-size: 12px;
  margin-top: 4px;
  display: inline-block;
  padding-right: 8px;
  padding-top: 4px;
    padding-bottom: 4px
}
a, a:focus, a:hover {
    cursor: pointer;
    color: #fff;
    text-decoration: none;
}
</style>
