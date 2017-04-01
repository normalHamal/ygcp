<template>
	<div style="padding: 15px;width: initial;">
		<button-tab v-model="index">
	        <button-tab-item selected>下午</button-tab-item>
	        <button-tab-item>上午</button-tab-item>
    	</button-tab>
      	<group v-show="index === 0">
    		<cell v-for="r in afteroon" :title="r.date" :inline-desc="r.mileage">
    			<label class="label-speed" slot="after-title">{{r.speed}}</label>
    			<icon v-if="r.effective" type="success-circle" slot="value"></icon>
    			<icon v-else type="cancel" slot="value" style="color:red;"></icon>
    		</cell>
		</group>
      	<group v-show="index === 1">
    		<cell v-for="r in morning" :title="r.date" :inline-desc="r.mileage">
    			<label class="label-speed" slot="after-title">{{r.speed}}</label>
    			<icon v-if="r.effective" type="success-circle" slot="value"></icon>
    			<icon v-else type="cancel" slot="value" style="color:red;"></icon>
    		</cell>
    	</group>
	</div>
</template>
<script>
	import { ButtonTab, ButtonTabItem, Cell, Group, Icon } from 'vux'

	export default {
	  data() {
	  	return {
	  		index: 0,
	  		records: []
	  	}
	  },
	  components: {
	    ButtonTab,
	    ButtonTabItem,
	    Cell,
	    Group,
	    Icon
	  },
	  created() {
	  	this.$http
	  	.get('/api/detail')
	  	.then((res) => {
          if(res.data.data) {
            this.records = res.data.data
          }
        })
	  },
	  computed: {
	  	morning() {
	  		return this.records.filter((record) => {
	  			return record.time === '上午'
	  		})
	  	},
	  	afteroon() {
	  		return this.records.filter((record) => {
	  			return record.time === '下午'
	  		})
	  	}
	  }
	}
</script>
<style>
	.label-speed {
		color: #6ae468;
		word-wrap: break-word;
    	word-break: break-all;
	}
</style>