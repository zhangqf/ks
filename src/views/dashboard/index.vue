<template>
  <div class="dashboard-container">
    <div class="title">
      <strong><h1>考试试卷生成</h1></strong>
    </div>
    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="1、考试班次">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="siftAdd"
        >添加班次</el-button>
        <div v-if="show" style="display: inline">
          <i class="el-icon-circle-check" style="color: lightseagreen" /><span>添加成功</span>
        </div>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="2、添加考生">
        <el-upload :before-upload="beforeUpload" :disabled="!show">
          <el-button
            slot="trigger"
            size="small"
            icon="el-icon-upload"
            type="primary"
            :disabled="!show"
          >批量导入
          </el-button>
          <div v-if="show1" style="display: inline;">
            <i class="el-icon-circle-check" style="color: lightseagreen" /><span>导入成功</span>
          </div>

          <!-- <download-excel
            class="blueBtn download"
            style="width:96px;display:inline-block;"
            :data="json_data"
            :fields="json_fields"
            worksheet="My Worksheet"
            name="考生模板.xlsx"
          >
            <i class="el-icon-download" style="margin-left:8px;" />
            考生模板</download-excel> -->
          <a class="ui-down" href="/examinee.xlsx" download="考生模板.xlsx"><i class="el-icon-download" style="margin-left:8px;" />考生模板</a>
          <div
            slot="tip"
            class="el-upload-list__item-name"
            style="display:inline"
          >
            {{ fileName }}
          </div>
          <div slot="tip" class="el-upload__tip" style="color: brown">
            只能上传excel文件
          </div>
          <!-- <div style="display: inline;" v-if="show1">
            <i class="el-icon-circle-check" style="color: lightseagreen"></i
            ><span>导入成功</span>

          </div> -->
        </el-upload>

      </el-form-item>
    </el-form>

    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="3、添加题目">
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-upload"
            :disabled="!show1"
            @click="excelAdd"
          >批量导入</el-button>
          <a class="ui-down" href="/fill.xlsx" download="填空题模板.xlsx"><i class="el-icon-download" style="margin-left:8px;" />填空题模板</a>
          <!-- <download-excel
            class="blueBtn download"
            :data="json_dataFill"
            :fields="json_fieldsFill"
            worksheet="My Worksheet"
            name="填空题.xlsx"
            style="display:inline-block;padding-right:6px"
          >
            <i class="el-icon-download" style="margin-left:8px" />
            填空题模板</download-excel> -->
          <a class="ui-down" href="/judge.xlsx" download="判断题模板.xlsx"><i class="el-icon-download" style="margin-left:8px;" />判断题模板</a>
          <!-- <download-excel
            class="blueBtn download"
            :data="json_datajudge"
            :fields="json_fieldsjudge"
            worksheet="My Worksheet"
            name="判断题.xlsx"
            style="display:inline-block;padding-right:6px"
          >
            <i class="el-icon-download" style="margin-left:8px" />
            判断题模板</download-excel> -->
          <a class="ui-down" href="/single.xlsx" download="单选题模板.xlsx"><i class="el-icon-download" style="margin-left:8px;" />单选题模板</a>
          <!-- <download-excel
            class="blueBtn download"
            :data="json_dataSingle"
            :fields="json_fieldsSingle"
            worksheet="My Worksheet"
            name="单选题.xlsx"
            style="display:inline-block;padding-right:6px"
          >
            <i class="el-icon-download" style="margin-left:8px" />
            单选题模板</download-excel> -->
          <a class="ui-down" href="/multiple.xlsx" download="多选题模板.xlsx"><i class="el-icon-download" style="margin-left:8px;" />多选题模板</a>
          <!-- <download-excel
            class="blueBtn download"
            :data="json_dataMultiple"
            :fields="json_fieldsMultiple"
            worksheet="My Worksheet"
            name="多选题.xlsx"
            style="display:inline-block;padding-right:6px"
          >
            <i class="el-icon-download" style="margin-left:8px" />
            多选题模板</download-excel> -->

          <div v-if="show2" style="display: inline">
            <i class="el-icon-circle-check" style="color: lightseagreen" />{{ text1 }}
          </div>
          <div v-if="show3" style="display: inline">
            <i class="el-icon-circle-check" style="color: lightseagreen" />{{ text2 }}
          </div>
          <div v-if="show4" style="display: inline">
            <i class="el-icon-circle-check" style="color: lightseagreen" />{{ text3 }}
          </div>
          <div v-if="show5" style="display: inline">
            <i class="el-icon-circle-check" style="color: lightseagreen" />{{ text4 }}
          </div>
        </el-form-item>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="4、生成试卷">
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            :disabled="!show1"
            @click="testAdd"
          >生成试卷</el-button>
          <div v-if="show6" style="display: inline">
            <i class="el-icon-circle-check" style="color: lightseagreen" /><span>生成成功</span>
          </div>
        </el-form-item>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="5、发布考试">
        <el-form-item>
          <el-button
            type="success"
            :disabled="!show6"
            @click="updateTest"
          >发布考试</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>

    <!--新增和编辑 弹框 -->
    <el-dialog title="生成试卷" :visible.sync="dialogTestVisible">
      <div style="width:85%;margin: 0 auto">
        <el-form
          ref="ruleForm"
          :model="exms"
          status-icon
          :rules="rules"
          :inline="false"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col>
              <el-form-item
                label="试卷名称"
                prop="name"
                :rules="{
                  required: true,
                  message: '请输入试卷名称',
                  trigger: 'change'
                }"
              >
                <el-input
                  v-model="exms.name"
                  type="text"
                  placeholder="试卷名称"
                  auto-complete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="选择试题">
            <el-radio
              v-model="tmType"
              label="1"
              @click="change('1')"
            >导入题目</el-radio>
            <el-radio
              v-model="tmType"
              label="2"
              @click="change('1')"
            >题库试题</el-radio>
          </el-form-item>
          <el-form-item
            v-if="tmType == '2'"
            label="选择专业"
            :rules="{ required: true, message: '请选专业', trigger: 'change' }"
          >
            <el-select v-model="activeid1" placeholder="请选择一级专业">
              <el-option
                v-for="item in shifts1"
                :key="item.id"
                :label="item.profename"
                :value="item.id"
              />
            </el-select>
            <el-select v-model="exms.professid" placeholder="请选择二级专业">
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
                  v-model="exms.fillNumber"
                  type="number"
                  min="0"
                  placeholder="填空题数量"
                  auto-complete="off"
                />
              </el-form-item>
              <i
                v-if="tmType == '2'"
                class="el-icon-circle-plus-outline"
                style="font-size: 24px; vertical-align: middle; width:8%;display: inline-block;text-align: center"
                @click="chooseQuestion('first')"
              />
            </el-col>
            <el-col span="12">
              <el-form-item label="填空题分数">
                <el-input
                  v-model="exms.fillScore"
                  type="number"
                  min="0"
                  placeholder="单题的分数"
                  auto-complete="off"
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
                  v-model="exms.judgeNumber"
                  type="number"
                  min="0"
                  placeholder="判断题数量"
                  auto-complete="off"
                />
              </el-form-item>
              <i
                v-if="tmType == '2'"
                class="el-icon-circle-plus-outline"
                style="font-size: 24px; vertical-align: middle;width:8%;display: inline-block;text-align: center"
                @click="chooseQuestion('second')"
              />
            </el-col>
            <el-col span="12">
              <el-form-item label="判断题分数">
                <el-input
                  v-model="exms.judgeScore"
                  type="number"
                  min="0"
                  placeholder="单题的分数"
                  auto-complete="off"
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
                  v-model="exms.singleNumber"
                  type="number"
                  min="0"
                  placeholder="单选题数量"
                  auto-complete="off"
                />
              </el-form-item>
              <i
                v-if="tmType == '2'"
                class="el-icon-circle-plus-outline"
                style="font-size: 24px; vertical-align: middle;width:8%;display: inline-block;text-align: center"
                @click="chooseQuestion('third')"
              />
            </el-col>
            <el-col span="12">
              <el-form-item label="单选题分数">
                <el-input
                  v-model="exms.singleScore"
                  type="number"
                  min="0"
                  placeholder="单题的分数"
                  auto-complete="off"
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
                  v-model="exms.multiNumber"
                  type="number"
                  min="0"
                  placeholder="多选题数量"
                  auto-complete="off"
                />
              </el-form-item>
              <i
                v-if="tmType == '2'"
                class="el-icon-circle-plus-outline"
                style="font-size: 24px; vertical-align: middle;width:8%;display: inline-block;text-align: center"
                @click="chooseQuestion('fourth')"
              />
            </el-col>
            <el-col span="12">
              <el-form-item label="多选题分数">
                <el-input
                  v-model="exms.multiScore"
                  type="number"
                  min="0"
                  placeholder="单题的分数"
                  auto-complete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="试卷描述">
            <el-input
              v-model="exms.examDesc"
              type="textarea"
              placeholder="试卷描述"
              auto-complete="off"
            />
          </el-form-item>
          <el-form-item
            label="试卷数量"
            :rules="{
              required: true,
              message: '请输入试卷数量',
              trigger: 'change'
            }"
          >
            <el-input
              v-model="exms.examNum"
              type="number"
              placeholder="试卷数量"
              auto-complete="off"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTestVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitTestForm('exms')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!--    批量导入题目弹框-->
    <el-dialog title="批量导入" :visible.sync="dialogExcelVisible">
      <div style="width:80%;margin: 0 auto">
        <el-form
          ref="ruleForm"
          :model="exms"
          status-icon
          :inline="false"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-form-item label="题目类型">
            <el-select v-model="activeName" placeholder="请选择题型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选择专业">
            <el-select v-model="activeid1" placeholder="请选择一级专业">
              <el-option
                v-for="item in shifts1"
                :key="item.id"
                :label="item.profename"
                :value="item.id"
              />
            </el-select>
            <el-select v-model="exms.professid" placeholder="请选择二级专业">
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
            :before-upload="beforeUploadExms"
          >
            <el-button
              slot="trigger"
              size="small"
              icon="el-icon-circle-plus"
              type="primary"
              plain
            >选择文件</el-button>
            <div slot="tip" class="el-upload__tip" style="color: brown">
              *必须选择与题目类型一致的excel文件
            </div>
            <!-- <a
              href="/photos/judgeQuestion.xlsx"
              rel="external nofollow"
              download="模板"
            >
              <el-button
                size="small"
                type="success"
                plain
                icon="el-icon-download"
                >下载模板</el-button
              >
            </a> -->
            <div slot="tip" class="el-upload-list__item-name">
              {{ fileName1 }}
            </div>
          </el-upload>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <template>
          <el-button @click="dialogExcelVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitUploadExms()"
          >确 定</el-button>
        </template>
      </div>
    </el-dialog>
    <!-- 新增班次 -->
    <el-dialog title="添加考试班次" :visible.sync="dialogSiftVisible">
      <div style="width:80%;margin: 0 auto">
        <el-form
          ref="ruleForm"
          :model="siftForm"
          status-icon
          :rules="rules"
          :inline="false"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-form-item label="班次名称" prop="shiftname">
            <el-input
              v-model="siftForm.shiftname"
              type="text"
              placeholder="班次名称"
              auto-complete="off"
            />
          </el-form-item>
          <el-form-item label="选择时间" prop="startTime">
            <el-date-picker
              v-model="date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="siftForm.remark"
              type="text"
              placeholder="备注"
              auto-complete="off"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSiftVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitShift('ruleForm')"
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
import { mapGetters } from 'vuex'
import { addShift } from '@/api/shift'
import { formatDate } from '@/utils/date'
import { doExcel } from '@/api/user'
import { addPaper, updatePaper } from '@/api/paper'
import {
  getQuestionList,
  getProfeOne,
  getProfeById,
  importBdDeptdoc1,
  importBdDeptdoc2,
  importBdDeptdoc3,
  importBdDeptdoc4
} from '@/api/question'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
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
      // 填空题
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

      fileList: [],
      date: [],
      url: '',
      downxlsx: '/static/judgeQuestion.xlsx',
      filters: {
        keyword: ''
      },
      activeName: 'first',
      tmType: '1',
      activeid1: '',
      options: [
        { value: 'first', label: '填空题' },
        { value: 'second', label: '判断题' },
        { value: 'third', label: '单选题' },
        { value: 'fourth', label: '多选题' }
      ],
      shifts1: [],
      shifts2: [],
      fileName: '',
      fileName1: '',
      files1: '',
      files: '',
      show: false,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
      qustionList: null,
      totals: 0,
      pageSizes: [10, 50, 100, 200],
      startPage: 1,
      pageSize: 10,
      ischooseQuestion: false,
      dialogSiftVisible: false,
      dialogExcelVisible: false,
      dialogTestVisible: false,
      listLoading: false, // 加载等待
      siftForm: {
        id: '',
        shiftname: '',
        startTime: '',
        endTime: '',
        remark: ''
      },
      // 表单验证
      rules: {
        shiftname: [
          { required: true, message: '请输入班次名称' },
          { min: 2, max: 10, message: '长度在 5 到 12 个字符' }
        ]
      },
      exms: {
        shiftsid: '',
        professid: '',

        singleIds: '',
        multiIds: '',
        judgeIds: '',
        fillIds: '',

        id: '',
        name: '',
        examDesc: '',
        examNum: '1',

        fillNumber: '',
        judgeNumber: '',
        singleNumber: '',
        multiNumber: '',

        fillScore: '',
        judgeScore: '',
        singleScore: '',
        multiScore: ''
      },
      text1: '',
      text2: '',
      text3: '',
      text4: ''
    }
  },
  watch: {
    activeid1(newName, oldName) {
      if (newName == '') {
        this.$message.warning('请选择一级专业')
        return
      }
      this.shifts2 = []
      this.exms.professid = ''
      const param = {
        id: newName
      }
      getProfeById(param)
        .then(response => {
          if (response.data.code == 200) {
            this.shifts2 = response.data.data
          }
        })
        .catch(err => {})
    }
  },
  created() {
    this.shiftsData()
  },
  methods: {
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    shiftsData() {
      const param = { profename: '' }
      getProfeOne(param)
        .then(response => {
          this.shifts1 = response.data.data
        })
        .catch(err => {})
    },
    dateFormats(time) {
      return formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss')
    },
    // 新增
    siftAdd() {
      // 显示弹框
      this.dialogSiftVisible = true
    },
    chooseQuestion(data) {
      if (this.exms.professid == '') {
        this.$message.warning('请先选择专业')
        return
      }
      this.ischooseQuestion = true
      this.activeName = data
      this.fetchDatas()
    },
    fillScoreChange(val) {
      if (val > 10) {
        this.$message({
          message: '分数不能大于 10 aa',
          type: 'error'
        })
      }
    },
    // 题目列表
    fetchDatas() {
      this.listLoading = true
      const params = {
        startPage: this.startPage,
        pageSize: this.pageSize,
        content: this.filters.keyword,
        questionType: this.activeName,
        professid: this.exms.professid
      }
      getQuestionList(params)
        .then(response => {
          this.qustionList = response.data.data
          this.totals = response.data.total
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
        })
    },
    submitFormTable(formName) {
      const arr = []
      if (this.$refs.tableItem.selection.length != 0) {
        if (this.$refs.tableItem.selection[0].typeStr == '填空题') {
          this.$refs.tableItem.selection.map((item, index) => {
            arr.push(item.id)
          })
          this.exms.fillNumber = this.$refs.tableItem.selection.length
          this.exms.fillIds = arr.join(',')
        }
        if (this.$refs.tableItem.selection[0].typeStr == '判断题') {
          this.$refs.tableItem.selection.map((item, index) => {
            arr.push(item.id)
          })
          this.exms.judgeIds = arr.join(',')
          this.exms.judgeNumber = this.$refs.tableItem.selection.length
        }
        if (this.$refs.tableItem.selection[0].typeStr == '单选题') {
          this.$refs.tableItem.selection.map((item, index) => {
            arr.push(item.id)
          })
          this.exms.singleIds = arr.join(',')
          this.exms.singleNumber = this.$refs.tableItem.selection.length
        }
        if (this.$refs.tableItem.selection[0].typeStr == '多选题') {
          this.$refs.tableItem.selection.map((item, index) => {
            arr.push(item.id)
          })
          this.exms.multiIds = arr.join(',')
          this.exms.multiNumber = this.$refs.tableItem.selection.length
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

    // 表单提交
    submitShift(formName) {
      this.siftForm.startTime = this.dateFormats(this.date[0])
      this.siftForm.endTime = this.dateFormats(this.date[1])
      this.$refs[formName].validate(valid => {
        if (valid) {
          addShift(this.siftForm)
            .then(response => {
              let msgType = 'error'
              if (response.data.code == 200) {
                msgType = 'success'
                this.show = true
                this.exms.shiftsid = response.data.data
              }
              this.$message({
                message: response.data.msg,
                type: msgType
              })
              // 关闭弹窗
              this.dialogSiftVisible = false
            })
            .catch(err => {
              this.$message({
                message: '添加失败',
                type: 'error'
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 导入考生
    beforeUpload(file) {
      if (!this.exms.shiftsid) {
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
      this.listLoading = true
      this.submitUpload()
    },
    submitUpload() {
      if (!this.fileName) {
        this.$message.warning('请先选择上传的文件')
        return
      }
      const fileFormData = new FormData()
      fileFormData.append('file', this.files) // filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      fileFormData.append('shift', this.exms.shiftsid)
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
          this.show1 = true
          this.listLoading = false
        })
        .catch(res => {
          this.$message({
            message: '导入失败',
            type: 'error'
          })
        })
    },
    // 导入考生
    beforeUploadExms(file) {
      if (!this.exms.professid) {
        this.$message.warning('请先选择专业类型')
        return
      }
      console.log(file, '文件')
      this.files1 = file
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      // const isLt2M = file.size / 1024 / 1024 < 5(校验上传文件的大小)
      if (!extension && !extension2) {
        this.$message.warning('上传文档只能是 xls、xlsx格式!')
        return
      }
      this.fileName1 = file.name
      this.listLoading = true
    },
    submitUploadExms() {
      if (!this.fileName1) {
        this.$message.warning('请先选择上传的文件')
        return
      }
      if (!this.exms.shiftsid) {
        this.$message.warning('请先添加班次')
        return
      }
      const fileFormData = new FormData()
      fileFormData.append('file', this.files1) // filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      fileFormData.append('professid', this.exms.professid)
      let doExcels = importBdDeptdoc1
      if (this.activeName == 'second') {
        doExcels = importBdDeptdoc2
      } else if (this.activeName == 'third') {
        doExcels = importBdDeptdoc3
      } else if (this.activeName == 'fourth') {
        doExcels = importBdDeptdoc4
      }
      doExcels(fileFormData)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            if (this.activeName == 'second') {
              this.text2 = '判断题共' + res.data.total + '道导入成功'
              this.exms.judgeIds = res.data.data
              this.exms.judgeNumber = res.data.total
              this.show3 = true
            } else if (this.activeName == 'third') {
              this.text3 = '单选题共' + res.data.total + '道导入成功'
              console.log(this.text3)
              this.exms.singleIds = res.data.data
              this.exms.singleNumber = res.data.total
              this.show4 = true
            } else if (this.activeName == 'fourth') {
              this.text4 = '多选题共' + res.data.total + '道导入成功'
              this.exms.multiIds = res.data.data
              this.exms.multiNumber = res.data.total
              this.show5 = true
            } else {
              this.text1 = '填空题共' + res.data.total + '道导入成功'
              this.exms.fillIds = res.data.data
              this.exms.fillNumber = res.data.total
              this.show2 = true
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
          this.listLoading = false
          this.dialogExcelVisible = false
        })
        .catch(res => {
          console.log(res)
          this.$message({
            message: '导入失败',
            type: 'error'
          })
        })
    },
    excelAdd() {
      // 显示弹框
      this.dialogExcelVisible = true
    },
    // 新增
    testAdd() {
      // this.resultRes()
      // 显示弹框
      this.dialogTestVisible = true
    },
    // 试卷生成表单提交
    submitTestForm() {
      if (!this.exms.shiftsid) {
        this.$message.warning('请先添加班次')
        return
      }
      if (!this.exms.name) {
        this.$message.warning('请输入试卷名称')
        return
      }
      if (!this.exms.professid) {
        this.$message.warning('请先选择专业类型')
        return
      }
      let flag = true
      if (this.exms.fillNumber != '' && this.exms.fillScore == '') {
        this.$message.error('请先填写填空题单题分数')
        return flag = false
      }
      if (this.exms.judgeNumber != '' && this.exms.judgeScore == '') {
        this.$message.error('请先填写判断题单题分数')
        return flag = false
      }
      if (this.exms.multiNumber != '' && this.exms.multiScore == '') {
        this.$message.error('请先填写多选题单题分数')
        return flag = false
      }
      if (this.exms.singleNumber != '' && this.exms.singleScore == '') {
        this.$message.error('请先填写单选题单题分数')
        return flag = false
      }
      console.log(this.exms)
      if (flag) {
        addPaper(this.exms)
          .then(response => {
            let msgType = 'error'
            if (response.data.code == 200) {
              msgType = 'success'
              this.show6 = true
              console.log(response.data)
              this.exms.id = response.data.data
              // 关闭弹窗
              this.dialogTestVisible = false
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
    change(res) {
      this.tmType = res
    },
    updateTest() {
      if (!this.exms.id) {
        this.$message.warning('请先生成试卷')
        return
      }
      const ids = this.exms.id.split(',')
      for (var i = 0; i < ids.length; i++) {
        const param = {
          id: ids[i],
          isPublish: 1
        }
        updatePaper(param)
          .then(response => {
            let msgType = 'error'
            if (response.data.code == 200) {
              msgType = 'success'
              this.$router.push({ path: '/paper' })
            }
            if ((i = ids.length)) {
              this.$message({
                message: response.data.msg,
                type: msgType
              })
            }
          })
          .catch(err => {
            this.$message({
              message: '发布失败',
              type: 'error'
            })
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.download {
  line-height: 28px;
  color: #67c23a;
  background: #f0f9eb;
  border-color: #c2e7b0;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  margin-left: 10px;
}
img {
  margin-top: -100px;
  width: 100%;
  height: 100%;
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
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
</style>
