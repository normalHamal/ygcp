<template>
	<div>
		<search @on-change="getResult" v-model="value" position="absolute" auto-scroll-to-top top="46px"></search>
    <br>
    <br>
    <form-preview v-if="list.length > 0" :header-label="result.num_school" :header-value="result.name" :body-items="list"></form-preview>
	</div>
</template>
<script>
import { Group, Search, Cell, FormPreview, debounce } from 'vux'
export default {
  data() {
    return {
      value: '',
      result: null
    }
  },
  components: {
    Search,
    Cell,
    Group,
    FormPreview
  },
  methods: {
    getResult: debounce(function() {
        if(!this.value) return
        let vm = this
        vm.$http.get('/api/search',{
          params: {
            number: vm.value
          }
        }).then((res) => {
          if(res.data.data) {
            this.result = res.data.data
          }
        })
      }, 500)
  },
  computed: {
    list: function () {
      if(this.result) {
        let arr = []
        arr.push({ label: '性别', value: this.result.sex})
        arr.push({ label: '有效次数', value: this.result.num_effective})
        arr.push({ label: '分组', value: this.result.group})
        arr.push({ label: '平均速度', value: this.result.average_speed})
        return arr
      }
      return []
    }
  }
}

</script>
<style>
	
</style>