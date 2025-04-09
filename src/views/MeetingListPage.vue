<template>
  <div class="meeting-list-page">
    <!-- 顶部区域 -->
    <div class="top-section">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索会议名称、时间、地点"
        class="search-input"
      />
      <div class="filters">
        <select v-model="statusFilter" class="filter-select">
          <option value="">全部状态</option>
          <option value="进行中">进行中</option>
          <option value="已结束">已结束</option>
        </select>
        <input
          v-model="dateRange"
          type="date"
          class="filter-select"
        />
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="table-section">
      <table class="meeting-table">
        <thead>
          <tr>
            <th>会议名称</th>
            <th>时间</th>
            <th>地点</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="meeting in filteredMeetings"
            :key="meeting.id"
            @click="goToMeetingDetail(meeting.id)"
            class="table-row"
          >
            <td>{{ meeting.name }}</td>
            <td>{{ meeting.time }}</td>
            <td>{{ meeting.location }}</td>
            <td>{{ meeting.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 底部区域 -->
    <div class="bottom-section">
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <span>第 {{ currentPage }} 页</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      </div>
      <p class="copyright">© 2023 会晤系统. 保留所有权利.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeetingListPage',
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      dateRange: '',
      currentPage: 1,
      pageSize: 10,
      meetings: [
        { id: 1, name: '2023 全球创新峰会', time: '2023-10-15', location: '上海国际会议中心', status: '进行中' },
        { id: 2, name: '2023 科技论坛', time: '2023-09-20', location: '北京国家会议中心', status: '已结束' },
        // 更多会议数据...
      ]
    }
  },
  computed: {
    filteredMeetings() {
      return this.meetings
        .filter(meeting => {
          const matchesSearch = meeting.name.includes(this.searchQuery) ||
                               meeting.time.includes(this.searchQuery) ||
                               meeting.location.includes(this.searchQuery)
          const matchesStatus = this.statusFilter ? meeting.status === this.statusFilter : true
          const matchesDate = this.dateRange ? meeting.time === this.dateRange : true
          return matchesSearch && matchesStatus && matchesDate
        })
        .slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    totalPages() {
      return Math.ceil(this.meetings.length / this.pageSize)
    }
  },
  methods: {
    goToMeetingDetail(id) {
      this.$router.push({ name: 'MeetingDetail', params: { id } })
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    }
  }
}
</script>

<style scoped>
.meeting-list-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1d1d1f;
  padding: 20px;
}

.top-section {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
}

.filters {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.table-section {
  overflow-x: auto;
}

.meeting-table {
  width: 100%;
  border-collapse: collapse;
}

.meeting-table th,
.meeting-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.meeting-table th {
  background-color: #f5f5f7;
  font-weight: bold;
}

.table-row:hover {
  background-color: #f5f5f7;
  cursor: pointer;
}

.bottom-section {
  margin-top: 20px;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.pagination button {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  background-color: #007aff;
  color: #fff;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.copyright {
  font-size: 14px;
  color: #666;
}
</style> 