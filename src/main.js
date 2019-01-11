import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
// import Mock from './mock'
import './assets/iconfonts/iconfont.css'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import ZkTable from 'vue-table-with-tree-grid' 
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

import 'vue-area-linkage/dist/index.css'; // v2 or higher

import VueAreaLinkage from 'vue-area-linkage';

Vue.use(VueAreaLinkage)

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(ZkTable)
Vue.use(preview)


//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

