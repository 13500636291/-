<template>
    <div class="manageSchool">
        <div class="manForm">
            <p>
                <span>学校列表</span>
                <span>学校详情</span>
            </p>
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="ruleForm">
                <el-form-item label="学校编号" prop="id">
                    <el-input v-model="ruleForm.id"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="createdAt">
                    <el-input v-model="ruleForm.createdAt"></el-input>
                </el-form-item>
                <el-form-item label="学校名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="学校地址" prop="address">
                    <el-input v-model="ruleForm.address"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-input v-model="ruleForm.status"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">返回列表</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {getScoolShow} from '@/api/index'
export default {
    data () {
        return {
            ruleForm:{
                id:null,
                createdAt:null,
                name:'',
                address:'',
                status:''
            }
        }
    },
    mounted () {
        getScoolShow({params:{id:this.$store.state.id}}).then(res=>{
            if(res.retCode==2000){
                this.ruleForm = {
                    id:res.data.id,
                    createdAt:res.data.createdAt.substr(0,10),
                    name:res.data.name,
                    address:res.data.address,
                    status:res.data.status=='normal'?'正常':'异常'
                }
            }
        })
    },
    methods:{
        // 返回列表
        submitForm() {
            this.$router.push("/manageSchool");
        }
    }
}
</script>
<style lang="scss" scoped>
    .manageSchool {
        width: 100%;
        height: 100%;
        padding-top: 16px;
        padding-left: 17px;
        padding-right: 20px;
        box-sizing: border-box;
        border-radius: 5px;
        background-color: white;
        p {
            width: 100%;
            height: 31px;
            background-color: #0E1935;
            span {
                display: block;
                float: left;
                width: 61px;
                line-height: 31px;
                font-size: 12px;
                text-align: center;
            }
            span:first-of-type {
                color: #BBBBBB;
                }
            span:last-of-type {
                color: white;
            }
        }
        .ruleForm {
            width: 480px;
            margin-top: 20px;
        }
    }
</style>


