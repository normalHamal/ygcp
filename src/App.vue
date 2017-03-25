<template>
  <div id="app" style="height:100%;">
  	<!-- loading层 -->
  	<div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
     <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="55px">
     	<x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="leftOptions"
      	:title="title"
      	:transition="headerTransition"></x-header>

     	<transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
    		<router-view class="router-view"></router-view>
    	</transition>

    	<tabbar class="vux-demo-tabbar" icon-class="vux-center" slot="bottom">
	        <tabbar-item :link="{path:'/'}" :selected="route.path === '/'">
	          <icon type="circle" slot="icon"></icon>
	          <span slot="label">主页</span>
	        </tabbar-item>
	        <tabbar-item :link="{path:'/search'}" :selected="route.path === '/search'">
	          <icon type="search" slot="icon"></icon>
	          <span slot="label">搜索</span>
	        </tabbar-item>
	        <tabbar-item :link="{path:'/profile'}" :selected="route.path === '/profile'">
	          <icon type="info" slot="icon"></icon>
	          <span slot="label">profile</span>
	        </tabbar-item>
	      </tabbar>
    </view-box>
  </div>
</template>

<script>
import { Icon, ViewBox, XHeader, Tabbar, TabbarItem, Loading, TransferDomDirective as TransferDom } from 'vux'
import { mapState } from 'vuex'
export default {
  directives: {
	  TransferDom
  },
  components: {
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Loading,
    Icon
  },
  computed: {
  	leftOptions () {
      return {
        showBack: this.route.path !== '/'
      }
    },
    headerTransition () {
      return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    },
    title () {
     	return this.route.meta || '未知'
    },
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      isLoading: state => state.vux.isLoading,
      direction: state => state.vux.direction
    }),
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
body {
  background-color: #fbf9fe;
}
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
/**
* vue-router transition
*/
.router-view {
  width: 100%;
  animation-duration: 0.5s;
  animation-fill-mode: both;
  backface-visibility: hidden;
}
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  height: 100%;
  position: absolute;
  left: 0;
}
.vux-pop-out-enter-active {
  animation-name: popInLeft;
}
.vux-pop-out-leave-active {
  animation-name: popOutRight;
}
.vux-pop-in-enter-active {
  perspective: 1000;
  animation-name: popInRight;
}
.vux-pop-in-leave-active {
  animation-name: popOutLeft;
}
@keyframes popInLeft {
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes popOutLeft {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes popInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes popOutRight {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}
</style>
