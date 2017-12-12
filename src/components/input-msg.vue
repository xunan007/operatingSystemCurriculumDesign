<template>
    <div class="input-msg">
        <h3 class="header">【说明】</h3>
        <p>
            基于原始已存在的进程和资源，可以动态增加进程和资源的总量，进程的最大数设置为8，资源总类为3。<br> 资源分为A、B、C三类，其中对应的总量分别为10、5、7。
            <br> 初始进程为五个，最多可添加到九个。
        </p>
        <h3 class="header">【添加进程】</h3>
        <div>
            <el-form :inline="true"
                     :model="inputMsg"
                     class="demo-form-inline">
                <el-form-item label="进程最大需求量">
                    <el-input v-model="inputMsg.progressNeed"
                              placeholder="请用空格隔开"></el-input>
                </el-form-item>
                <el-form-item label="进程分配到的资源">
                    <el-input v-model="inputMsg.progressAllocate"
                              placeholder="请用空格隔开"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="pSubmit">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
        <h3 class="s-header">【添加资源】</h3>
        <div>
            <el-form :inline="true"
                     :model="inputMsg"
                     class="demo-form-inline">
                <el-form-item label="添加可分配资源">
                    <el-input v-model="inputMsg.sourceAdd"
                              placeholder="请用空格隔开"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="sSubmit">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['originAvailArray', 'availArray', 'progressSum', 'toReset'],
        data() {
            return {
                inputMsg: {
                    progressNeed: '',
                    progressAllocate: '',
                    sourceAdd: ''
                }
            };
        },
        watch: {
            toReset() {
                this.inputMsg.progressNeed = '';
                this.inputMsg.progressAllocate = '';
                this.inputMsg.sourceAdd = '';
            }
        },
        methods: {
            // 动态添加进程
            pSubmit() {
                // 检测是否超过设置的最大进程数
                if (this.progressSum === 8) {
                    this.msg({
                        message: '已超过设置的进程最大数8，不能添加！',
                        type: 'warning'
                    });
                    return false;
                }
                let progressNeed = this.inputMsg.progressNeed;
                let progressAllocate = this.inputMsg.progressAllocate;
                progressNeed = progressNeed.split(' ');
                progressAllocate = progressAllocate.split(' ');
                console.log(progressNeed, progressAllocate);
                // 检测长度
                if (progressNeed.length !== 3 || progressAllocate.length !== 3) {
                    this.msg({
                        message: '输入格式错误，请重新输入！',
                        type: 'warning'
                    });
                    return false;
                }
                // 检测项是否为空
                for (let i = 0; i < progressNeed.length; i++) {
                    if (progressNeed[i] === '') {
                        this.msg({
                            message: '输入项不能为空，请重新输入！',
                            type: 'warning'
                        });
                        return false;
                    }
                }
                for (let i = 0; i < progressAllocate.length; i++) {
                    if (progressAllocate[i] === '') {
                        this.msg({
                            message: '输入项不能为空，请重新输入！',
                            type: 'warning'
                        });
                        return false;
                    }
                }
                // 检测最大需求量是否为0
                if (progressNeed[0] === '0' && progressNeed[1] === '0' && progressNeed[2] === '0') {
                    this.msg({
                        message: '进程的最大需求量不能都为0',
                        type: 'warning'
                    });
                    return false;
                }
                // 检测最大需求量是否小于进程分配到的资源
                for (let i = 0; i < 3; i++) {
                    if (progressNeed[i] < progressAllocate[i]) {
                        this.msg({
                            message: '进程请求分配的资源大于进程最大需求量！',
                            type: 'warning'
                        });
                        return false;
                    }
                }
                // 检测最大需求量是否大于系统的总量
                for (let i = 0; i < 3; i++) {
                    if (progressNeed[i] > this.originAvailArray[i]) {
                        this.msg({
                            message: '进程最大需求量已经超过系统总资源',
                            type: 'warning'
                        });
                        return false;
                    }
                }
                // 检测需要分配的资源是否大于当前系统可用的资源
                for (let i = 0; i < 3; i++) {
                    if (progressAllocate[i] > this.availArray[i]) {
                        this.msg({
                            message: '进程需要分配的资源超过当前可用资源',
                            type: 'warning'
                        });
                        return false;
                    }
                }
                // 最终通知父组件添加进程
                this.$emit('addProgress', [...progressNeed, ...progressAllocate]);
            },
            // 动态添加资源
            sSubmit() {
                let str = this.inputMsg.sourceAdd;
                str = str.split(' ');
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
                this.$emit('addSource', str);
            },
            msg(obj) {
                this.$message(obj);
            }
        }
    };
</script>
<style lang="scss">
    .input-msg {
        .s-header {
            padding-bottom: 15px;
            margin-top: -7px;
        }
    }
</style>