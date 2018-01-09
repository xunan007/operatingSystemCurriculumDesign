<template>
    <div class="m-wrapper">
        <input-msg class="margin"
                   :originAvailArray="originAvailArray"
                   :availArray="availArray"
                   :progressSum="progressSum"
                   :toReset="resetFlag"
                   @addSource="addAvail"
                   @addProgress="addProgress">
        </input-msg>
        <table-view class="margin"
                    :tableData="tableData"
                    :nowSelect="nowSelect">
        </table-view>
        <action-operate class="margin"
                        :progressSum="progressSum"
                        :finishArray="finishArray"
                        :toReset="resetFlag"
                        @selectChange="selectChange"
                        @pushData="actionCaculate"
                        @reset="reset">
        </action-operate>
        <record-list class="margin"
                     :recordTip="recordTip">
        </record-list>
    </div>
</template>
<script>
    import InputMsg from 'components/input-msg.vue';
    import TableView from 'components/table-view.vue';
    import ActionOperate from 'components/action-operate.vue';
    import RecordList from 'components/record-list.vue';
    // 引入银行家算法和安全算法
    import { banker, safe } from '@/lib/calculate.js';
    export default {
        components: {
            InputMsg,
            TableView,
            ActionOperate,
            RecordList
        },
        data() {
            // 设置初始变量值
            return {
                // 原始总可用资源
                originAvailArray: [10, 5, 7],
                // 进程数量
                progressSum: 5,
                // 可利用资源向量
                availArray: [
                    3, 3, 2
                ],
                // 最大需求矩阵
                maxArray: [
                    [7, 5, 3],
                    [3, 2, 2],
                    [9, 0, 2],
                    [2, 2, 2],
                    [4, 3, 3]
                ],
                // 分配矩阵
                allocateArray: [
                    [0, 1, 0],
                    [2, 0, 0],
                    [3, 0, 2],
                    [2, 1, 1],
                    [0, 0, 2]
                ],
                // 需求矩阵
                needArray: [
                    [7, 4, 3],
                    [1, 2, 2],
                    [6, 0, 0],
                    [0, 1, 1],
                    [4, 3, 1]
                ],
                // Finish变量
                finishArray: [
                    'false', 'false', 'false', 'false', 'false'
                ],
                // 进程资源请求向量
                requestArray: [],
                // 发起进程对应的索引
                progressIndex: '',
                // 操作记录
                recordTip: [],
                // 当前select选中的值
                nowSelect: '',
                // 是否reset
                resetFlag: false
            };
        },
        computed: {
            // 整合变量提供给table-view
            tableData() {
                let tmp = [];
                for (let i = 0; i < this.progressSum; i++) {
                    tmp.push({
                        index: `进程${i}`,
                        Max: this.maxArray[i],
                        Allocation: this.allocateArray[i],
                        Need: this.needArray[i],
                        Available: this.availArray,
                        finish: this.finishArray[i]
                    });
                }
                return tmp;
            }
        },
        // data初始化的时候对data做一个保存
        created() {
            this.backUp = {
                progressSum: this.progressSum,
                availArray: JSON.stringify(this.availArray),
                maxArray: JSON.stringify(this.maxArray),
                allocateArray: JSON.stringify(this.allocateArray),
                needArray: JSON.stringify(this.needArray),
                finishArray: JSON.stringify(this.finishArray),
                originAvailArray: JSON.stringify(this.originAvailArray)
            };
        },
        methods: {
            // 响应inputMsg组件发起的操作，添加资源
            addAvail(data) {
                this.availArray = data.map((x, i) => {
                    return Number(x) + this.availArray[i];
                });
                this.originAvailArray = data.map((x, i) => {
                    return Number(x) + this.originAvailArray[i];
                });
                this.msg({
                    message: '添加资源成功',
                    type: 'success'
                });
                this.recordTip.push(
                    `【添加资源】：添加的资源分别是A：${Number(data[0])}、B：${Number(data[1])}、C：${Number(data[2])}，
                    现可用资源分别是A：${this.availArray[0]}、B：${this.availArray[1]}、C：${this.availArray[2]}。`
                );
            },
            // 响应inputMsg组件发起的操作，动态添加进程
            addProgress(data) {
                // 先把进程的相关信息处理好并登记
                let progressMax = data.slice(0, 3).map((x) => {
                    return Number(x);
                });
                let progressAllocate = data.slice(3, 6).map((x) => {
                    return Number(x);
                });
                let progressNeed = progressMax.map((x, i) => {
                    return x - progressAllocate[i];
                });
                // 更新进程数量
                this.progressSum++;
                // 如果此时需要分配的资源都是0，说明已经执行完毕，要释放空间
                if (progressNeed[0] === 0 && progressNeed[1] === 0 && progressNeed[2] === 0) {
                    this.finishArray.push('true');
                    // 可用资源变量不变
                    // 更新最大需求矩阵
                    this.maxArray.push(progressMax);
                    // 更新分配矩阵
                    this.allocateArray.push([0, 0, 0]);
                    // 更新需求矩阵
                    this.needArray.push([0, 0, 0]);
                    // 这个时候加进程跟不加的效果是一样的，所以也不用进行安全性校验，直接结束。
                    this.msg({
                        message: '添加进程成功',
                        type: 'success'
                    });
                    this.recordTip.push(
                        `【添加进程】：添加新的进程${this.progressSum - 1}成功。`
                    );
                    return true;
                } else {
                    this.finishArray.push('false');
                    // 更新可利用资源向量
                    this.availArray = this.availArray.map((x, i) => {
                        return x - progressAllocate[i];
                    });
                    // 更新最大需求矩阵
                    this.maxArray.push(progressMax);
                    // 更新分配矩阵
                    this.allocateArray.push(progressAllocate);
                    // 更新需求矩阵
                    this.needArray.push(progressNeed);
                }
                // 如果只是单纯的添加进程而没有分配资源，可以不用进行安全性检测
                if (progressAllocate[0] === 0 && progressAllocate[1] === 0 && progressAllocate[2] === 0) {
                    this.msg({
                        message: '添加进程成功',
                        type: 'success'
                    });
                    this.recordTip.push(
                        `【添加进程】：添加新的进程${this.progressSum - 1}成功。`
                    );
                    return true;
                }
                // 状态更新完毕进行安全算法的校验
                let safeResult = safe.call(this);
                if (safeResult === false) {
                    // 回滚状态
                    // 由于finish置为true的时候肯定是安全的，所以不用考虑把finish置为false
                    this.progressSum--;
                    this.availArray = this.availArray.map((x, i) => {
                        return x + progressAllocate[i];
                    });
                    this.maxArray.pop();
                    this.allocateArray.pop();
                    this.needArray.pop();
                    this.finishArray.pop();
                    this.msg({
                        message: '添加进程使得系统处于不安全状态，添加失败！',
                        type: 'warning'
                    });
                    this.recordTip.push(
                        `【添加进程】：添加新的进程${this.progressSum}失败，因为添加后系统处于不安全状态。`
                    );
                } else {
                    // 校验成功
                    this.msg({
                        message: '添加进程成功',
                        type: 'success'
                    });
                    this.recordTip.push(
                        `【添加进程】：添加新的进程${this.progressSum - 1}成功，系统此时安全序列为${safeResult}`
                    );
                }
            },
            // 响应actionOperate组件发起的操作，进行分配资源
            actionCaculate(data) {
                // 先把传递过来的数据进行登记
                this.requestArray = data.slice(0, 3).map((x) => {
                    return Number(x);
                });
                this.progressIndex = data[data.length - 1];
                // 接下来进行算法的计算
                let bankerResult = banker.call(this, this.progressIndex, this.requestArray);
                if (bankerResult.result === false) {
                    // 置空初始赋值
                    this.requestArray = [];
                    this.progressIndex = '';
                    this.msg({ message: bankerResult.reason, type: 'warning' });
                    return false;
                }
                // 如果不为false则进行安全性算法校验
                let safeResult = safe.call(this);
                if (safeResult === false) {
                    // 说明校验失败，回滚
                    // 由于finish置为true的时候肯定是安全的，所以不用考虑把finish置为false
                    for (let i = 0; i < 3; i++) {
                        this.availArray[i] += this.requestArray[i];
                        this.allocateArray[this.progressIndex][i] -= this.requestArray[i];
                        this.needArray[this.progressIndex][i] += this.requestArray[i];
                    }
                    this.msg({ message: '因分配使得系统进入不安全状态，因此分配失败', type: 'warning' });
                    this.recordTip.push(
                        `【响应进程资源请求】：响应进程${this.progressIndex}发起的资源分配请求失败，因为此时系统处于不安全状态，
                        其请求的资源分别为A：${this.requestArray[0]}、B：${this.requestArray[1]}、C：${this.requestArray[2]}。`
                    );
                } else {
                    // 说明校验成功
                    this.msg({ message: '分配成功', type: 'success' });
                    // 采取特殊的手段触发视图更新
                    this.availArray = this.availArray.slice();
                    this.maxArray = this.maxArray.slice();
                    this.allocateArray = this.allocateArray.slice();
                    this.needArray = this.needArray.slice();
                    this.finishArray = this.finishArray.slice();
                    this.recordTip.push(
                        `【响应进程资源请求】：响应进程${this.progressIndex}发起的资源分配请求成功，此时系统安全序列为${safeResult}，
                        其请求的资源分别为A：${this.requestArray[0]}、B：${this.requestArray[1]}、C：${this.requestArray[2]}。`
                    );
                }
                // 置空初始值
                this.requestArray = [];
                this.progressIndex = '';
            },
            // 响应actionOperate组件发起的操作，重置状态
            reset() {
                this.progressSum = this.backUp.progressSum;
                this.availArray = JSON.parse(this.backUp.availArray);
                this.maxArray = JSON.parse(this.backUp.maxArray);
                this.allocateArray = JSON.parse(this.backUp.allocateArray);
                this.needArray = JSON.parse(this.backUp.needArray);
                this.finishArray = JSON.parse(this.backUp.finishArray);
                this.originAvailArray = JSON.parse(this.backUp.originAvailArray);
                this.msg({
                    message: '重置完毕',
                    type: 'success'
                });
                this.recordTip = [];
                this.nowSelect = '';
                this.resetFlag = !this.resetFlag;
            },
            // 管理select的改变
            selectChange(data) {
                this.nowSelect = data;
            },
            msg(obj) {
                this.$message(obj);
            }
        }
    };
</script>
<style lang="scss">
    .m-wrapper {
        .margin {
            margin-bottom: 10px;
        }
    }
</style>