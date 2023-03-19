<template>
    <div class="index">
        <div class="banner">
            <div v-if="userid" @click="handleBanner('record')">阅读记录</div>
            <div v-if="!userid" @click="gotoLogin(1)">登录</div>
            <div class="divider"></div>
            <div v-if="!userid" @click="gotoLogin(2)">注册</div>
            <div v-if="userid" @click="handleBanner('bookShell')">我的书架</div>
        </div>
        <div class="read-records" v-if="visibled">
            <div v-if="readRecords.length===0">
                ----- 您还没有开始阅读呢！-----
            </div>
            <div v-else>
                <van-list
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="getReadRecords"
                >
                <van-cell 
                    v-for="item in readRecords" 
                    :key="item.id" 
                    :title="`${item.title}-${item.chart}`" 
                    @click="gotoRead(item)"
                />
                </van-list>
            </div>
        </div>
        <div class="read-records" v-if="bookVisibled">
            <div v-if="bookShellList.length===0">
                ----- 您的书架里还没有书籍呢！-----
            </div>
            <div v-else>
                <van-cell 
                    v-for="item in bookShellList" 
                    :key="item.id" 
                    :title="`${item.title}-${item.author}`" 
                    @click="gotoRead(item)"
                />
            </div>
        </div>
        <div class="search">
            <van-search
                clearable
                v-model="keyword"
                shape="round"
                placeholder="请输入搜索关键词"
                @search="handleSearch"
                @clear="handleClear"
            />
        </div>
        <div class="list">
            <van-empty v-if="list.length===0" description="暂无数据" />
            <div v-else>
                <div v-for="item in list" :key="item.id" class="list-item">
                    <div>{{item.title}}</div>
                    <div class="sub-info" style="font-size:12px">
                        <van-space wrap>
                            <div>作者：{{item.author}}</div>
                            <div>更新时间：{{item.updatetime}}</div>
                            <div>{{item.total}}</div>
                        </van-space>
                    </div>
                    <div class="sub-info">
                        <van-text-ellipsis
                            rows="2"
                            :content="item.abstract"
                            expand-text="展开"
                            collapse-text="收起"
                       />
                    </div>
                    <div class="action">
                        <div @click="gotoRead(item)">开始阅读</div>
                        <div @click="addShell(item.id,'add')" v-if="bookShell.findIndex(i=>i===item.id)===-1">加入书架</div>
                        <div @click="addShell(item.id,'remove')" v-else>移出书架</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pagination" v-if="list.length>0">
            <van-button :disabled="current===1" plain type="primary" size="small" @click="handlePrev">上一页</van-button>
            <div>{{current}}</div>
            <van-button plain type="primary" size="small" @click="handleNext">下一页</van-button>
        </div>
    </div>
</template>
<script setup>
import { showToast } from 'vant'
import { ref, getCurrentInstance, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { proxy } = getCurrentInstance()
const userid = ref(localStorage.getItem('userid'))
const bookShell = ref([])
const userName = ref('')
const current = ref(1)
const list = ref([])
const keyword = ref('')
const readRecords = ref([])
const visibled = ref(false)
const bookVisibled = ref(false)
const finished = ref(false)
const records_current = ref(0)
const loading = ref(false)
const bookShellList = ref([])

onMounted(()=>{
    if(userid.value)
        proxy.fetchData('getUserInfoById',{id: userid.value},'get').then(res=>{
            console.log('获取用户信息', res)
            if(ref){
                bookShell.value = res.bookShell ? res.bookShell.split(','): []
                userName.value = res.userName
            }
        })
    getLastNovels()
    getReadRecords()
})
watch(current,(newCurrent,oldCurrent)=>{
    console.log(current,newCurrent)
        if(newCurrent===oldCurrent) return
        if(keyword.value){
            getNovelsByKeyword()
        }else{
            getLastNovels()
        }
    }
)
// 获取最新小说
function getLastNovels(){
    loading.value = true
    proxy.fetchData('getLastNovels',{current:current.value},'get').then(res=>{
        console.log('最新小说', res)
        list.value = res
        window.scrollTo(0,0)
    }).finally(()=>{
        loading.value = false
    })
}
// 根据搜索关键词获取列表
function getNovelsByKeyword(){
    loading.value = true
    proxy.fetchData('getNovelsByKeyword',{current:current.value,keyword: keyword.value},'post').then(res=>{
        console.log('根据搜索关键词获取列表', res)
        list.value = res
        window.scrollTo(0,0)
    }).finally(()=>{
        loading.value = false
    })
}
// 根据用户id获取阅读记录
function getReadRecords(){
    proxy.fetchData('getReadRecords',{userid:userid.value,current: records_current.value + 1},'get').then(res=>{
        console.log('根据用户id获取阅读记录',res)
        if(res.length>0){
            readRecords.value = res
            records_current.value = records_current.value + 1
        }else{
            finished.value = true
        }
        
    })
}
// 搜索
function handleSearch(){
    if(keyword.value === 'isHHH=true'){
        localStorage.setItem('isHHH',true)
    }
    if(keyword.value === 'isHHH=false'){
        localStorage.removeItem('isHHH')
    }
    console.log('11111',keyword.value)
    if(keyword.value){
        getNovelsByKeyword()
    }else{
        getLastNovels()
    }
}
// 清除
function handleClear(){
    current.value = 1
    keyword.value=''
    getLastNovels()
}
// 上一页
function handlePrev(){
    if(current.value===1)return
    current.value= current.value-1
}
// 下一页
function handleNext(){
    current.value = current.value+1
}
// 前往登录页
function gotoLogin(tab){
    router.push({
        path: "/login",
        params: {
            tab
        }
    })
}
// 前往阅读页
function gotoRead(book){
    proxy.fetchData('setReadRecord',book,'post').then(res=>{
        console.log('插入阅读记录')
    })
    router.push({
        path: "/book-view",
        query: {
            id: book.id,
            chart: book.lastpage || book.first_chart,
            title: book.title,
            author: book.author
        }
    })
}
// 加入书架
function addShell(id,type){
    if(userid.value){
        let books
        if(type==='add'){
            books = bookShell.value.concat(id)
        }else{
            books = bookShell.value.filter(i=>i!==id)
        }
        proxy.fetchData('updateBookShell',{booksid:books.join(','),userid:userid.value},'post').then(res=>{
            showToast(`${type==='add'?'加入':'移出'}书架成功`)
            bookShell.value = books
        })
    }else{
        router.push({
            path: "/login"
        })
    }
}
//根据id批量查找数据
function queryNovelsById(){
    proxy.fetchData('getNovelsById',{books:bookShell.value.join(',')},'post').then(res=>{
        console.log('根据id批量查找数据',res)
        bookShellList.value = res
    })
}
// banner
function handleBanner(type){
    if(type === 'record'){
        visibled.value = !visibled.value
        bookVisibled.value = false
    }else{
        bookVisibled.value = !bookVisibled.value
        visibled.value = false
        if(bookVisibled.value)
            queryNovelsById()
    }
}
</script>
<style scoped>
.index{
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
.read-records{
    min-height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #79c48c;
    position: absolute;
    width: 100%;
    max-height: 250px;
    background: #fff;
    z-index: 99;
}
.search{
    margin: 12px 0;
}
.sub-info{
    color: #9e9d9d;
    font-size: 14px;
}
.action{
    display: flex;
    justify-content: end;
}
.action div{
    margin-left: 12px;
    margin-top: 8px;
    font-size: 14px;
    color: #79c48c;
}
.list-item{
    margin: 12px;
    background: #fff;
    padding: 12px;
    border-radius: 4px;
}
.pagination{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    background: #fff;
}
.pagination div{
    margin: 0 8px;
}
</style>