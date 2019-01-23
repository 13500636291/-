<template>
    <div class="addSuccess">
        <div>
            <i class="el-icon-check"></i>
            <span>添加成功</span>
        </div>
        <el-button class="button" type="primary" @click="refAdd">继续添加</el-button>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                
            }
        },
        methods:{
            refAdd(){
                this.$router.push('/manageAdd')
            }
        }
    }
</script>
<style lang="scss" scoped>
.addSuccess{
    width: 100%;
    height: 100%;
    padding: 20px 0 0 20px;
    div {
        i{
            color: green;
        }
        i,span {
            font-size: 25px;
            font-weight: 600;
        }
    }
    .button {
        margin-top: 20px;
        margin-left: 10px;
    }
}
</style>



