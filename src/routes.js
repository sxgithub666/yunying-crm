import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import ChannelTable from './views/channelTable' //通道信息号码表
import ChannelInfo from './views/channelInfo' //通道信息
import ClientTable from './views/clientTable'   //客户信息号码表
import ClientInfo from './views/clientInfo'   //客户信息
import Robot from './views/joinFlow/robot.vue'  //小水智能
import Switchboard from './views/joinFlow/switchboard.vue' //小水总机
import VoicePass from './views/joinFlow/voicePass.vue' //语音pass
import Gathering from './views/gathering' //收款
import CluesInfo from './views/cluesInfo' //线索信息
import CluesTailAfter from './views/cluesTailAfter' //线索跟进

import UserManage from './views/userManage' //用户管理
import MenuManage from './views/menuManage' //菜单管理
import RoleManage from './views/roleManage' //角色管理
import Reconciliation from './views/reconciliation' //对账信息
import ContractAndInvoice from './views/contractAndInvoice' //合同和发票
import SystemParam from './views/systemParam' //系统参数
import Backlog from './views/backlog' //系统参数

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true,//只有一个节点
        iconCls: 'iconfont icon-navicon-dxtdwh',//图标样式class
        children: [
            { path: '/channelTable', component: ChannelTable, name: '通道信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true,//只有一个节点
        iconCls: 'iconfont icon-icon-contract',//图标样式class
        children: [
            { path: '/clientTable', component: ClientTable, name: '客户信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '接入流程',
        iconCls: 'iconfont icon-manage-process',
        children: [
            { path: '/robot', iconCls: 'iconfont icon-jian', component: Robot, name: '小水智能'},
            { path: '/switchboard',iconCls: 'iconfont icon-jian', component: Switchboard, name: '小水总机' },
            { path: '/voicePass',iconCls: 'iconfont icon-jian', component: VoicePass, name: '语音pass' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-shoukuan-',
        leaf: true,//只有一个节点
        children: [
            { path: '/gathering', component: Gathering, name: '收款' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-yonghuguanli',
        children: [
            { path: '/userManage', component: UserManage, name: '用户管理' },
            { path: '/menuManage', component: MenuManage, name: '菜单管理' },
            { path: '/roleManage', component: RoleManage, name: '角色管理' },
            { path: '/systemParam', component: SystemParam, name: '系统参数管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-yonghuguanli',
        leaf: true,//只有一个节点
        children: [
            { path: '/reconciliation', component: Reconciliation, name: '对账信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-fapiao1',
        leaf: true,//只有一个节点
        children: [
            { path: '/contractAndInvoice', component: ContractAndInvoice, name: '发票信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-yonghuguanli',
        leaf: true,//只有一个节点
        children: [
            { path: '/channelInfo', component: ChannelInfo, name: '通道信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-yonghuguanli',
        leaf: true,//只有一个节点
        children: [
            { path: '/clientInfo', component: ClientInfo, name: '客户信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-yonghuguanli',
        leaf: true,//只有一个节点
        children: [
            { path: '/cluesInfo', component: CluesInfo, name: '线索信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-yonghuguanli',
        leaf: true,//只有一个节点
        children: [
            { path: '/cluesTailAfter', component: CluesTailAfter, name: '线索跟进' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-yonghuguanli',
        leaf: true,//只有一个节点
        children: [
            { path: '/backlog', component: Backlog, name: '待办事项' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;