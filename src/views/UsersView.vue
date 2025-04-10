<template>
  <div class="users-container">
    <h1>用户列表</h1>
    
    <div class="user-list">
      <table v-if="users.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>手机号</th>
            <th>角色</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone || '-' }}</td>
            <td>{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
      
      <div v-else-if="loading" class="loading">
        加载中...
      </div>
      
      <div v-else class="no-users">
        暂无用户数据
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { getAllUsers } from '@/api/users';

export default {
  name: 'UsersView',
  data() {
    return {
      users: [],
      loading: true,
      error: null
    };
  },
  async mounted() {
    try {
      this.loading = true;
      this.users = await getAllUsers();
    } catch (error) {
      console.error('获取用户列表失败', error);
      this.error = '获取用户列表失败，请确保后端服务已启动';
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.users-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.loading, .no-users {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error-message {
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
}
</style> 