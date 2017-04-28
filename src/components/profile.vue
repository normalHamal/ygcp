<template>
	<div>
		<group v-if="logged">
		    <cell title="账号" :value="person.name"></cell>
		    <cell title="性别" :value="person.sex"></cell>
		    <cell title="学号">
		        <div slot="value">
		          <span style="color: green">{{person.num_school}}</span>
		        </div>
	        </cell>
	        <cell title="当前体育课老师">
		        <div slot="value">
		          <span style="color: green">{{person.teacher}}</span>
		        </div>
	        </cell>
	        <cell title="体育课">
		        <div slot="value">
		          <span style="color: green">{{person.course}}</span>
		        </div>
	        </cell>
	        <x-button plain type="primary" class="custom-primary-red" @click.native="logout">退出</x-button>
		</group>
		<group v-else>
			<cell title="登录" is-link @click.native="toLogin">
		        <img slot="icon" width="20" style="display:block;margin-right:5px;border-radius: 50%;" :src="src">
		    </cell>
		</group>
		
		<popup v-model="show" height="100%">
	      <div style="width:100%;height:100%">
	        <x-header :left-options="{showBack: false}">登录</x-header>
	        <br>
	      	<step v-model="step" background-color='#eeeeee' gutter="20px">
		        <step-item title="学号"></step-item>
		        <step-item title="密码"></step-item>
		        <step-item title="完成"></step-item>
		    </step>

	        <group>
	          <x-switch title="取消" v-model="show"></x-switch>
	          <br>
	          <x-input title="学号" v-model="value1"></x-input>
	          <br>
	          <x-input title="密码" type="password" v-model="value2"></x-input>
	          <br>
	          <x-button plain type="primary" style="border-radius:99px;" @click.native="login">登录</x-button>
	        </group>

	        <div v-transfer-dom>
		      <x-dialog v-model="showError" class="dialog-demo" :scroll="false" :hideOnBlur="true">
		        <p class="dialog-title">密码或账号错误</p>
		        <div class="img-box">
		          <img src="http://omsiv11v3.bkt.clouddn.com/error.jpg/wc" style="max-width:100%">
		        </div>
		        <span class="vux-close" @click="showError=false"></span>
		      </x-dialog>
		    </div>
	      </div>
	    </popup>
	</div>
</template>
<script>
	import { Step, StepItem, XSwitch, Popup, Group, Cell, XInput, XButton, XHeader, XDialog, TransferDomDirective as TransferDom } from 'vux'
	import { mapMutations, mapState } from 'vuex'
	import init from '../init'
	export default {
		directives: {
		    TransferDom
		},
		data() {
			return {
				show: false,
				showError: false,
				value2: '',
				value1: '',
				src: 'data:image/jpeg;base64,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'
			}
		},
		components: {
			Group,
			Cell,
			Popup,
			XInput,
			XSwitch,
			XButton,
			Step, 
			StepItem,
			XHeader,
			XDialog
		},
		methods: {
			toLogin() {
				this.show = true
			},
			login() {
				let vm = this
				this.$http.post('/api/login',{
					username: vm.value1,
					password: vm.value2
				}).then((res) => {
					if(res.data.data) {
						vm.updatePersonInfo({
							person: res.data.data
						})
						//保存登录后用户的数据
      					window.localStorage.setItem('user', JSON.stringify({
      						username: vm.value1,
      						password: vm.value2
      					}))
						this.$router.push('/')
					} else {
						this.showError = true
					}
				})
			},
			logout() {
				this.updatePersonInfo({
					person: init
				})
				window.localStorage.clear()
			},
			...mapMutations(['updatePersonInfo'])
		},
		computed: {
			step() {
				return (this.value1 && this.value2 && 3) || (this.value2 && 2) || (this.value1 && 1) || 0
			},
			...mapState({
		      person: state => state.perInfo.person
		    }),
		    logged() {
		    	return this.person.num_school !== '0'
		    }
		}
	}
</script>
<style lang="less" scoped>
@import '~vux/src/styles/close';
.dialog-demo {
  .weui-dialog{
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    height: 350px;
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>