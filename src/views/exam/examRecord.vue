<template>
  <div class="app-container">

    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="考试名称">
        <el-input v-model="filters.keyword" placeholder="输入考试名称查询" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
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
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center">
        <template slot-scope="scope">
          {{ scope.row.deptname }}
        </template>
      </el-table-column>
      <el-table-column label="站段" align="center">
        <template slot-scope="scope">
          {{ scope.row.station }}
        </template>
      </el-table-column>
      <el-table-column label="考试名称" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.examName!=''">{{ scope.row.examName }}</span>
          <span v-if="scope.row.trainName!=''">{{ scope.row.trainName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state==1" style="color: dodgerblue">培训测试</span>
          <span v-else style="color: salmon">正式考试</span>
        </template>
      </el-table-column>
      <el-table-column label="得分" align="center">
        <template slot-scope="scope" style="color: red">
          {{ scope.row.finalScore }}
        </template>
      </el-table-column>
      <el-table-column label="分数等级" align="center">
        <template slot-scope="scope">
          {{ scope.row.resultLevel }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="交卷时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.finishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试实际时间(分钟)" align="center">
        <template slot-scope="scope">
          {{ scope.row.costTime }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-view"
            @click="handleView(scope.row.id,scope.row.state)"
          >查看试卷详情</el-button>
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

  </div>
</template>

<script>
import { getExamRecordList } from '@/api/exam'
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
      filters: {
      	keyword: ''
      },
      listLoading: false, // 加载等待
      pageSizes: [10, 20, 40, 100],
      startPage: 1,
      pageSize: 10,
      total: 0,
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const params = {
        startPage: this.startPage,
        pageSize: this.pageSize,
        userId: getUserId(),
        name: this.filters.keyword
      }
      getExamRecordList(params).then(response => {
        this.list = response.data.data
        console.log(response)
        this.total = response.data.total
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },

    queryData() {
      this.fetchData()
    },

    // 查看试卷详情
    handleView(recordId, state) {
      console.log(recordId)
      this.$router.push({ path: '/exam/record/viewAnswer', query: { state: state, recordId: recordId, isPractice: true }})
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
