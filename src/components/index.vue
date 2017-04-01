<template>
  <div>
  	<search @on-focus="onFocus"></search>
	<group>
		<cell :title="person.name" :value="person.num_school" is-link></cell>
	</group>
  <box gap="10px">
    <x-progress :percent="percent" :show-cancel="false"></x-progress>
  </box>
  <div style="margin: 10px;overflow: hidden;" @click="toDetail">
      <masker style="border-radius: 2px;">
        <div class="m-img" style="background-image:url(http://omsiv11v3.bkt.clouddn.com/4a36acaf2edda3cce8866c9a02e93901213f922e.jpg)"></div>
        <div slot="content" class="m-title">
          长跑信息
          <br/>
          <span class="m-time">截至{{dateFormat}}</span>
        </div>
      </masker>
  </div>
	<group title="剩余时间">
      <cell title="剩余时间">
        <clocker time="2017-05-27" slot="value">
          <span class="day">%_D1</span>
          <span class="day">%_D2</span>天
          <span class="day">%_H1</span>
          <span class="day">%_H2</span>时
          <span class="day">%_M1</span>
          <span class="day">%_M2</span>分
          <span class="day">%_S1</span>
          <span class="day">%_S2</span>秒
        </clocker>
      </cell>
    </group>
    <br>
	<swiper height="150px" auto loop :interval="2000" v-model="index">
      <swiper-item>
      <div style="width:150px;height:150px;margin:0 auto;">
      	<x-circle :percent="percent" :stroke-width="10" stroke-color="#04BE02">
		<countup :end-val="percent" :duration="5" style="color: #04BE02"></countup>
		</x-circle>
	  </div>
      </swiper-item>
      <swiper-item>
      <div style="width:150px;height:150px;margin:0 auto;">
      	<x-circle :percent="percent" :stroke-width="10" stroke-color="#04BE02">
		<countup :end-val="percent" :duration="5" style="color: #04BE02"></countup>
		</x-circle>
	  </div>
      </swiper-item>
      <swiper-item>
      <div style="width:150px;height:150px;margin:0 auto;">
      	<x-circle :percent="percent" :stroke-width="10" stroke-color="#04BE02">
		<countup :end-val="percent" :duration="5" style="color: #04BE02"></countup>
		</x-circle>
	  </div>
      </swiper-item>
    </swiper>
    <marquee>
      <marquee-item v-for="item in items" :key="item.index" class="align-middle">{{items[index].content}}</marquee-item>
    </marquee>

    <flexbox orient="vertical">
      <flexbox-item>
      	<card :header="{title:'长跑情况'}">
	      <div slot="content" class="card-demo-flex card-demo-content01">
	        <div class="vux-1px-r">
	          <span>{{person.total_mileage}}</span>
	          <br/>
	          总里程
	        </div>
	        <div class="vux-1px-r">
	          <span>{{person.average_speed}}</span>
	          <br/>
	          平均速度
	        </div>
	        <div>
	          <span>{{person.num_effective}}</span>
	          <br/>
	          有效次数
	        </div>
	      </div>
	    </card>
      </flexbox-item>
      <flexbox-item>
      	<card>
	      <div slot="content" class="card-demo-flex card-demo-content01">
	        <div class="vux-1px-r">
	          <span>{{person.group}}</span>
	          <br/>
	          分组
	        </div>
	        <div class="vux-1px-r">
	          <span>{{person.min_speed}}</span>
	          <br/>
	          最低速度
	        </div>
	        <div>
	          <span>{{person.min_mileage}}</span>
	          <br/>
	          最低里程
	        </div>
	      </div>
	    </card>
      </flexbox-item>
      <flexbox-item>
      	<card>
	      <div slot="content" class="card-demo-flex card-demo-content01">
	        <div class="vux-1px-r">
	          <span>{{person.reward}}</span>
	          <br/>
	          奖励加分
	        </div>
	        <div class="vux-1px-r">
	          <span>{{person.punish}}</span>
	          <br/>
	          惩罚扣分
	        </div>
	        <div>
	          <span>{{person.finnal}}</span>
	          <br/>
	          最终得分
	        </div>
	      </div>
	    </card>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { Group, Cell, Card, XProgress, Box, XCircle, Swiper, SwiperItem, Clocker, Countup, Marquee, MarqueeItem, Flexbox, FlexboxItem, Search, Masker, dateFormat } from 'vux'
import { mapState } from 'vuex'

export default {
  components: {
    Card,
    XProgress,
    Box,
    XCircle,
    SwiperItem,
    Swiper,
    Clocker,
    Group,
    Cell,
    Countup,
    Marquee,
    MarqueeItem,
    Flexbox, 
    FlexboxItem,
    Search,
    Masker
  },
  data () {
    return {
      index: 0,
      items: [
      	{ index: 0, content: '总共'},
      	{ index: 1, content: '早上'},
      	{ index: 2, content: '下午'}
      ]
    }
  },
  methods: {
  	onFocus() {
  		this.$router.push('/search')
  	},
    toDetail() {
      this.$router.push('/detail')
    }
  },
  computed: {
    ...mapState({
      person: state => state.perInfo.person
    }),
    dateFormat() {
      return dateFormat(new Date(), 'YYYY-MM-DD')
    },
    percent() {
      return (this.person.num_effective / 22) * 100
    }
  }
}
</script>

<style>
.card-demo-flex {
  display: flex;
}
.card-demo-content01 {
  padding: 10px 0;
}
.card-padding {
  padding: 15px;
}
.card-demo-flex > div {
  flex: 1;
  text-align: center;
  font-size: 12px;
}
.card-demo-flex span {
  color: #f74c31;
}
.day {
  background-color:#000;
  color:#fff;
  text-align:center;
  display:inline-block;
  padding:0 3px;
  border-radius:3px;
}
.align-middle {
  text-align: center;
}
.m-img {
  padding-bottom: 33%;
  display: block;
  position: relative;
  max-width: 100%;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  border-radius: 2px;
}

.m-title {
  color: #fff;
  text-align: center;
  text-shadow: 0 0 2px rgba(0, 0, 0, .5);
  font-weight: 500;
  font-size: 16px;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}

.m-time {
  font-size: 12px;
  padding-top: 4px;
  border-top: 1px solid #f0f0f0;
  display: inline-block;
  margin-top: 5px;
}
</style>
