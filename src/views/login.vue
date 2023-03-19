<template>
    <div class="login-page">
        <img class="login_bg" src="../assets/login_bg.jpg" alt=""/>
        <div class="APP-title">
            <img src="../assets/logo.png" alt="READ NOW!"/>
        </div>
        <div class="login-form">
            <van-space direction="vertical" fill>
                <van-field v-model="name" label="用户名" placeholder="请输入用户名" />
                <van-field v-model="psw" label="密码" placeholder="请输入密码" type="password" />
                <van-button type="primary" block :disabled="!name||!psw" @click="handleLogin" >
                    {{isLogin ? '登 录' : '注 册' }}
                </van-button>
                <div style="text-align:right">
                    <a @click="isLogin=!isLogin" class="btn-link">
                        {{isLogin ? '还没有账号？去注册':'已有帐号？去登录'}}
                    </a>
                </div>
            </van-space>
        </div>
    </div>
</template>

<script setup>
import { showToast } from 'vant'
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const isLogin = ref(true)
const name = ref('')
const psw = ref('')

onMounted(()=>{
    if(route.params)
        isLogin.value = route.params.tab !== 2
})

function handleLogin(){
    proxy.fetchData(
        isLogin.value?'getUserInfoByName':'registerUser',
        {name:name.value,psw:psw.value},
        'post'
    ).then(res=>{
        console.log('登录：',res)
        if(isLogin.value&&(!res||res.length===0)){
            showToast('当前用户不存在，请确认用户名和密码无误后再试')
            return
        }
        if(!isLogin.value&& (!res||!res.insertId)){
            showToast('该用户名已被使用，请修改后重试')
            return
        }
        let id = isLogin.value?res[0].userid:res.insertId
        localStorage.setItem('userid',id)
        if(!isLogin.value)
            showToast('注册成功，系统暂不提供密码找回功能，请妥善保管密码')
        router.push({
            path: "/"
        })
    }).catch(err=>{
        showToast('服务器异常，请稍侯再试')
        console.log(err)
    })
}
</script>
<style scoped>
.login-page{
    text-align: center;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
}
.login_bg{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
}
.APP-title img{
    width: 65%;
    position: relative;
}
.login-form{
    margin: 24px;
    border: 1px solid #f0f0f0;
    border-radius: 2px;
    padding: 12px;
    background-color: #fff;
    position: relative;
}
.btn-link{
    color: #1890ff;
    font-size: 12px;
}
</style>