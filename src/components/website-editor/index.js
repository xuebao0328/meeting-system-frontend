import HeaderComponent from './HeaderComponent.vue'
import TextComponent from './TextComponent.vue'
import ImageComponent from './ImageComponent.vue'
import AgendaComponent from './AgendaComponent.vue'
import RegistrationComponent from './RegistrationComponent.vue'

// 注册所有组件
const registerComponents = (Vue) => {
  Vue.component('HeaderComponent', HeaderComponent)
  Vue.component('TextComponent', TextComponent)
  Vue.component('ImageComponent', ImageComponent)
  Vue.component('AgendaComponent', AgendaComponent)
  Vue.component('RegistrationComponent', RegistrationComponent)
}

export {
  registerComponents,
  HeaderComponent,
  TextComponent,
  ImageComponent,
  AgendaComponent,
  RegistrationComponent
} 