// 初始化模块Vue/App
import Vue from 'vue'
// 图表模块
import VeLine from 'v-charts/lib/line.common';
// 时间处理函数
import moment from 'moment'
// Element-ui模块
import {
    Container,
    Aside,
    Main,
    Icon,
    Button,
    Input,
    Select,
    Option,
    DatePicker,
    Form,
    FormItem,
    Table,
    TableColumn,
    Pagination,
    Menu,
    Submenu,
    MenuItem,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    MessageBox,
    Message
} from 'element-ui'
// 路由模块
import router from '@/router/router.js'
// 引入axios
import axios from 'axios'
// 引入vuex
import store from './store/store'
import App from './App.vue'

// 引入全局样式
import './styles/index.scss'
import './styles/element.scss'
// 引入element-ui样式
import 'element-ui/lib/theme-chalk/index.css'


// 将element-ui绑定到全局
Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;

//将axios绑定到vue原型上
Vue.prototype.$http = axios
    // 绑定时间处理函数到Vue上
Vue.prototype.$moment = moment
    // v-chart 绑定折线函数到vue
Vue.component(VeLine.name, VeLine)
    // 导航守卫
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('myToken')
    if (token) {
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            next()
        }
    } else {
        if (to.path === '/login') {
            next()
        } else {
            next({ path: '/login' })
        }
    }
})

Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')