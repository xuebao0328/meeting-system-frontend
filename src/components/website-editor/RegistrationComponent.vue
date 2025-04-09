<template>
  <div class="registration-component">
    <h3 class="form-title">参会注册</h3>
    <el-form :model="formData" label-width="100px" label-position="left" class="registration-form centered-form">
      <template v-if="hasFormFields">
        <el-form-item 
          v-for="(field, index) in processedFields" 
          :key="index"
          :label="field.label"
          :required="field.required"
        >
          <el-input 
            v-if="field.type === 'text'" 
            v-model="formData[field.name]"
            :placeholder="field.placeholder || ''"
          ></el-input>
          
          <el-input 
            v-else-if="field.type === 'email'" 
            v-model="formData[field.name]"
            type="email"
            :placeholder="field.placeholder || ''"
          ></el-input>
          
          <el-input 
            v-else-if="field.type === 'tel'" 
            v-model="formData[field.name]"
            :placeholder="field.placeholder || ''"
          ></el-input>
          
          <el-select 
            v-else-if="field.type === 'select'"
            v-model="formData[field.name]"
            :placeholder="field.placeholder || '请选择'"
          >
            <el-option
              v-for="(option, oIndex) in field.options"
              :key="oIndex"
              :label="option"
              :value="option"
            ></el-option>
          </el-select>
          
          <el-checkbox-group 
            v-else-if="field.type === 'checkbox'"
            v-model="formData[field.name]"
          >
            <el-checkbox 
              v-for="(option, oIndex) in field.options"
              :key="oIndex"
              :label="option"
            ></el-checkbox>
          </el-checkbox-group>
          
          <el-radio-group 
            v-else-if="field.type === 'radio'"
            v-model="formData[field.name]"
          >
            <el-radio 
              v-for="(option, oIndex) in field.options"
              :key="oIndex"
              :label="option"
            >{{ option }}</el-radio>
          </el-radio-group>
          
          <el-input 
            v-else-if="field.type === 'textarea'" 
            v-model="formData[field.name]"
            type="textarea"
            :rows="3"
            :placeholder="field.placeholder || ''"
          ></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="姓名" required>
          <el-input placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="单位" required>
          <el-input placeholder="请输入单位名称"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" required>
          <el-input type="email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="参会类型" required>
          <el-select placeholder="请选择参会类型">
            <el-option label="专家学者" value="expert"></el-option>
            <el-option label="企业代表" value="business"></el-option>
            <el-option label="学生" value="student"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
      </template>
      
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">{{ submitButtonText }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'RegistrationComponent',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  computed: {
    hasFormFields() {
      return this.config.fields && this.config.fields.length > 0;
    },
    processedFields() {
      if (!this.hasFormFields) return [];
      return this.config.fields;
    },
    submitButtonText() {
      return this.config.submitButtonText || '提交注册';
    }
  },
  methods: {
    handleSubmit() {
      // 在真实场景中会处理表单提交
      this.$message.success('表单提交成功（编辑器演示）');
    }
  }
}
</script>

<style scoped>
.registration-component {
  padding: 20px;
}

.form-title {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
}

.registration-form {
  max-width: 600px;
  margin: 0 auto;
}
</style> 