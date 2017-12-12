<template>
    <div>
        <h3 class="header">【分配资源】</h3>
        <div>
            <el-form :inline="true"
                     :model="action"
                     class="demo-form-inline">
                <el-form-item label="进程">
                    <el-select v-model="action.progress"
                               placeholder="请选择"
                               @change="selectChange">
                        <el-option v-for="i in progressSum"
                                   :key="i-1"
                                   :label="`进程${i-1}`"
                                   :value="i-1">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分配的数量">
                    <el-input v-model="action.sourceNum"
                              placeholder="请用空格隔开"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="aSubmit">提交</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="aReset">重置状态</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['progressSum', 'finishArray', 'toReset'],
        data() {
            return {
                action: {
                    progress: '',
                    sourceNum: ''
                }
            };
        },
        watch: {
            toReset() {
                this.action.progress = '';
                this.action.sourceNum = '';
            }
        },
        methods: {
            selectChange(data) {
                this.$emit('selectChange', data);
            },
            aSubmit() {
                let str = this.action.sourceNum;
                str = str.split(' ');
                if (this.action.progress === '') {
                    this.msg({
                        message: '请选择发起资源请求的进程！',
                        type: 'warning'
                    });
                    return false;
                }
                if (str.length !== 3) {
                    console.log('输入错误，请重新输入！');
                    this.msg({
                        message: '输入错误，请重新输入！',
                        type: 'warning'
                    });
                    return false;
                }
                for (let i = 0; i < str.length; i++) {
                    if (str[i] === '') {
                        console.log('输入项不能为空，请重新输入！');
                        this.msg({
                            message: '输入项不能为空，请重新输入！',
                            type: 'warning'
                        });
                        return false;
                    }
                }
                if (this.finishArray[this.action.progress] === 'true') {
                    this.msg({
                        message: '不能对已经完成的进程做发起资源请求的操作',
                        type: 'warning'
                    });
                    return false;
                }
                this.msg({
                    message: '提交成功！',
                    type: 'success'
                });
                this.$emit('pushData', [...str, this.action.progress]);
            },
            aReset() {
                this.$emit('reset');
            },
            msg(obj) {
                this.$message(obj);
            }
        }
    };
</script>
<style lang="scss">

</style>