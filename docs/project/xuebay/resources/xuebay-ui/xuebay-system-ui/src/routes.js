import Login from './views/cjc/Login.vue'
import Register from './views/cjc/Register.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Systemdictionary from './views/cjc/Systemdictionary.vue'
import Systemdictionaryitem from './views/cjc/Systemdictionaryitem.vue'
import CourseVideo from './views/cjc/CourseVideo.vue'
import CourseType from './views/cjc/CourseType.vue'
import CourseChapter from './views/cjc/CourseChapter.vue'
import Department from './views/cjc/department.vue'
import Course from './views/cjc/Course.vue'
import Pager from './views/cjc/Pager.vue'
import Role from './views/cjc/role.vue'
import echarts from './views/charts/echarts.vue'
import Teacher from './views/cjc/Teacher.vue'
import CouseOrder from './views/cjc/CouseOrder.vue'
import PayFlow from './views/cjc/PayFlow.vue'
import AliPay from './views/cjc/AliPay.vue'
import SMSMessage from './views/cjc/SMSMessage.vue'
import StationMessage from './views/cjc/StationMessage.vue'
import EmailMessage from './views/cjc/EmailMessage'
import Employee from './views/cjc/Employee'
import Table from './views/cjc/Table'
import Permission from './views/cjc/Permission'
import CourseKill from './views/cjc/CourseKill'
import KillActivity from './views/cjc/KillActivity'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/register',
        component: Register,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/table',
        component: Table,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '首页',
        leaf: true,//只有一个节点
        iconCls: 'el-icon-s-home',
        children: [
            { path: '/echarts', component: echarts, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '组织机构管理',
        iconCls: 'el-icon-s-grid',//图标样式class
        children: [
            { path: '/employee', component: Employee, name: '员工管理' },
            { path: '/department', component: Department, name: '部门管理' },
            { path: '/role', component: Role, name: '角色管理' },
            { path: '/permission', component: Permission, name: '权限管理' },
        ]
    }
    ,
    {
        path: '/',
        component: Home,
        name: '系统基础设置',
        iconCls: 'el-icon-s-tools',//图标样式class
        children: [
            { path: '/systemdictionary', component: Systemdictionary, name: '数据字典' },
            { path: '/systemdictionaryitem', component: Systemdictionaryitem, name: '数据字典明细' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '课程相关',
        iconCls: 'el-icon-video-camera-solid',
        children: [
            { path: '/courseType', component: CourseType, name: '课程类型' },
            { path: '/teacher', component: Teacher, name: '讲师管理' },
            { path: '/course', component: Course, name: '课程管理' },
            { path: '/courseChapter', component: CourseChapter, name: '课程章节' },
            { path: '/courseVideo', component: CourseVideo, name: '课程视频' }

        ]
    },
    {
        path: '/',
        component: Home,
        name: '订单中心',
        iconCls: 'el-icon-s-order',
        children: [
            { path: '/couseOrder', component: CouseOrder, name: '课程订单' },
            { path: '/payFlow', component: PayFlow, name: '支付账单' },
            { path: '/AliPay', component: AliPay, name: '支付宝设置' },

        ]
    },
    {
        path: '/',
        component: Home,
        name: '秒杀中心',
        iconCls: 'el-icon-s-goods',
        children: [
            { path: '/killActivity', component: KillActivity, name: '秒杀活动' },
            { path: '/kourseKill', component: CourseKill, name: '秒杀课程' }

        ]
    },
    {
        path: '/',
        component: Home,
        name: '消息中心',
        iconCls: 'el-icon-message-solid',
        children: [
            { path: '/SMSMessage', component: SMSMessage, name: '短信管理' },
            { path: '/emailMessage', component: EmailMessage, name: '邮件管理' },
            { path: '/stationMessage', component: StationMessage, name: '站内信管理' },

        ]
    },
    {
        path: '/',
        component: Home,
        name: '页面管理',
        iconCls: 'el-icon-s-home',
        children: [
            { path: '/pager', component: Pager, name: '静态化页面管理' },
            { path: '/site', component: Pager, name: '站点管理' }
        ]
    },

    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;