import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import Home from './components/index'
import Search from './components/search'
import Profile from './components/profile'
import Detail from './components/detail'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import { AjaxPlugin } from 'vux'
import init from './init'

Vue.use(AjaxPlugin)
Vue.use(Vuex)
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    meta: '主页'
  },
  {
    path: '/search',
    component: Search,
    meta: '搜索'
  },
  {
    path: '/profile',
    component: Profile,
    meta: 'profile'
  },
  {
    path: '/detail',
    component: Detail,
    meta: '长跑成绩'
  }
]

const router = new VueRouter({
  routes
})

let store = new Vuex.Store()

FastClick.attach(document.body)

store.registerModule('vux', {
  state: {
    isLoading: false,
    direction: 'forward'
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    },
    updateDirection (state, payload) {
      state.direction = payload.direction
    }
  }
})

store.registerModule('perInfo', {
  state: {
    person: init
  },
  mutations: {
    updatePersonInfo (state, payload) {
      state.person = payload.person
    }
  }
})
//把路由和全局状态管理store同步起来
sync(store, router)

const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true})

  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (toIndex > fromIndex || !fromIndex || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', {direction: 'forward'})
    } else {
      store.commit('updateDirection', {direction: 'reverse'})
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', {direction: 'forward'})
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
})

router.afterEach(function (to) {
	store.commit('updateLoadingStatus', {isLoading: false})
})

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')
