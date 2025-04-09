<template>
  <div class="agenda-component">
    <h3 class="agenda-title">会议议程</h3>
    <div v-if="!hasAgendaData" class="agenda-placeholder">
      <i class="el-icon-date"></i>
      <span>请在属性面板添加会议日程数据</span>
    </div>
    <div v-else class="agenda-content">
      <el-tabs v-model="activeDay" type="card">
        <el-tab-pane 
          v-for="(day, index) in processedDays" 
          :key="index"
          :label="day.label"
          :name="String(index)"
        >
          <div class="agenda-day">
            <div 
              v-for="(session, sIndex) in day.sessions" 
              :key="sIndex"
              class="agenda-session"
            >
              <div class="session-time">{{ session.time }}</div>
              <div class="session-content">
                <div class="session-title">{{ session.title }}</div>
                <div v-if="session.speaker" class="session-speaker">{{ session.speaker }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgendaComponent',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeDay: '0'
    }
  },
  computed: {
    hasAgendaData() {
      return this.config.days && this.config.days.length > 0;
    },
    processedDays() {
      if (!this.hasAgendaData) {
        return [
          {
            label: '示例日程',
            date: '2023-01-01',
            sessions: [
              { time: '09:00 - 09:30', title: '开幕式', speaker: '' },
              { time: '09:30 - 10:30', title: '主题演讲', speaker: '张教授' },
              { time: '10:30 - 11:00', title: '茶歇', speaker: '' },
              { time: '11:00 - 12:00', title: '专题讨论', speaker: '多位嘉宾' }
            ]
          }
        ];
      }
      
      return this.config.days.map(day => {
        return {
          label: day.label || `Day ${day.date}`,
          date: day.date,
          sessions: day.sessions || []
        };
      });
    }
  }
}
</script>

<style scoped>
.agenda-component {
  padding: 20px;
}

.agenda-title {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
}

.agenda-placeholder {
  padding: 50px;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  color: #909399;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.agenda-placeholder i {
  font-size: 40px;
  margin-bottom: 10px;
}

.agenda-session {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.agenda-session:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.session-time {
  flex: 0 0 150px;
  font-weight: bold;
  color: #409eff;
}

.session-content {
  flex: 1;
}

.session-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.session-speaker {
  color: #606266;
  font-size: 14px;
}
</style> 