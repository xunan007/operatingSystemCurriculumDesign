/**
 * @export
 * @param {any} index // 标识发起请求的进程
 * @param {any} Request // 发起资源请求的数目
 * 备注：函数必须绑定this
 */
export function banker(index, request) {
    const len = 3;
    for (let i = 0; i < len; i++) {
        // 如果所需要的资源数已超过它所宣布的最大值
        if (request[i] > this.needArray[index][i]) {
            // 直接结束
            return {
                result: false,
                reason: '所需资源数已经超过它所宣布的最大值'
            };
        }
    }
    // 如果所需资源数没有超过，进行下一步判断
    for (let i = 0; i < len; i++) {
        // 判断是否有足够的资源可以分配
        if (request[i] > this.availArray[i]) {
            // 直接结束
            return {
                result: false,
                reason: '没有足够的资源可供分配'
            };
        }
    }
    // 如果通过了上面两个验证，系统试探性把资源分配给进程，并修改相应的数据
    for (let i = 0; i < len; i++) {
        this.availArray[i] -= request[i];
        this.allocateArray[index][i] += request[i];
        this.needArray[index][i] -= request[i];
    }
    if (
        this.needArray[index][0] === 0 &&
        this.needArray[index][1] === 0 &&
        this.needArray[index][2] === 0
    ) {
        // 说明进程运行完毕，需要释放资源，改变状态
        this.finishArray[index] = 'true';
        for (let i = 0; i < len; i++) {
            this.availArray[i] += this.allocateArray[index][i];
            this.allocateArray[index][i] = 0;
            this.needArray[index][i] = 0;
        }
    }

    return {
        result: true,
        message: '进行安全性算法的校验'
    };
    // 之后需要调用安全性算法
}
/**
 * @export
 * 备注：函数必须绑定this
 */
export function safe() {
    let availStr = JSON.stringify(this.availArray);
    // 标识分配资源是否比剩余资源大
    let flag = true;
    // 标识是否检索完成
    let sort = true;
    // 记录安全队列
    let safeArray = [];
    // 记录是否完成
    let finishArray = JSON.parse(JSON.stringify(this.finishArray));
    const progressSum = this.progressSum;
    const len = 3;
    // 备份一个workArray供后面使用
    let workArray = JSON.parse(availStr);
    // 进行循环找出安全队列
    while (sort === true) {
        for (var i = 0; i < progressSum; i++) {
            // 重置防止上一次的结果影响下面的计算
            flag = true;
            if (finishArray[i] === 'false') {
                for (let j = 0; j < len; j++) {
                    // 如果需要分配的资源比剩余可用的资源还大，分配失败
                    if (this.needArray[i][j] > workArray[j]) {
                        flag = false;
                        break;
                    }
                }
                if (flag !== false) {
                    for (let k = 0; k < len; k++) {
                        workArray[k] += this.allocateArray[i][k];
                        finishArray[i] = 'true';
                    }
                    safeArray.push(i);
                    break;
                }
            }
        }
        // while循环实际上要多跑一次
        if (i === progressSum) {
            sort = false;
        }
    }
    let finishFalse = 0;
    for (let i = 0; i < progressSum; i++) {
        if (this.finishArray[i] === 'false') {
            finishFalse++;
        }
    }
    // 判断安全队列的长度检测是否真的是安全
    if (safeArray.length === finishFalse) {
        return safeArray;
    } else {
        return false;
    }
}
