<template>
    <div class="book-view">
        <div class="banner">
            <div v-if="userid" @click="handleBanner('record')">阅读记录</div>
            <div v-if="!userid" @click="gotoLogin(1)">登录</div>
            <div class="divider"></div>
            <div v-if="!userid" @click="gotoLogin(2)">注册</div>
            <div v-if="userid" @click="handleBanner('bookShell')">我的书架</div>
        </div>
        <div class="book-iframe" v-if="chart">
            <iframe :src="chart"></iframe>
        </div>
        <van-empty v-else description="暂无数据" />
    </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const userid = ref(localStorage.getItem('userid'))
const id = ref('')
const chart = ref('')
const title = ref('')
const author = ref('')


onMounted(()=>{
    if(route.query)
        id.value = route.query.id
        chart.value = route.query.chart
        title.value= route.query.title
        author.value=route.query.author
})

</script>
<style scoped>
.book-view{
    position: relative;
    background: #f0f0f0;
    padding-bottom: 24px;
    min-height: 100vh;
}
.banner{
    height: 50px;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 0 12px;
    background: #79c48c;
    color: #fff;
}
.divider{
    width: 2px;
    height: 30%;
    background: #fff;
    margin: 0 8px;
}
.book-iframe{
    width: 100%;
    height: calc(100vh - 50px);
}
iframe{
    height: 100%;
    width: 100%;
}
</style>