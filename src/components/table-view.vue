<template>
    <div class="table-view">
        <el-table :data="tableData"
                  border
                  row-class-name="animated fadeInUp"
                  :row-class-name="addBlue">
            <el-table-column prop="index"
                             label="进程 \ 资源">
            </el-table-column>
            <el-table-column label="最大需求量Max">
                <el-table-column prop="Max[0]"
                                 label="A"
                                 min-width="50px">
                </el-table-column>
                <el-table-column prop="Max[1]"
                                 label="B"
                                 min-width="50px">
                </el-table-column>
                <el-table-column prop="Max[2]"
                                 label="C"
                                 min-width="50px">
                </el-table-column>
            </el-table-column>
            <el-table-column label="已分配资源Allocation">
                <el-table-column prop="Allocation[0]"
                                 label="A"
                                 min-width="50px">
                </el-table-column>
                <el-table-column prop="Allocation[1]"
                                 label="B"
                                 min-width="50px">
                </el-table-column>
                <el-table-column prop="Allocation[2]"
                                 label="C"
                                 min-width="50px">
                </el-table-column>
            </el-table-column>
            <el-table-column label="需要资源Need">
                <el-table-column prop="Need[0]"
                                 label="A"
                                 min-width="50px">
                </el-table-column>
                <el-table-column prop="Need[1]"
                                 label="B"
                                 min-width="50px">
                </el-table-column>
                <el-table-column prop="Need[2]"
                                 label="C"
                                 min-width="50px">
                </el-table-column>
            </el-table-column>
            <el-table-column label="可用资源Available">
                <el-table-column prop="Available[0]"
                                 label="A"
                                 min-width="50px">
                </el-table-column>
                <el-table-column prop="Available[1]"
                                 label="B"
                                 min-width="50px">
                </el-table-column>
                <el-table-column prop="Available[2]"
                                 label="C"
                                 min-width="50px">
                </el-table-column>
            </el-table-column>
            <el-table-column prop="finish"
                             label="状态">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        props: ['tableData', 'nowSelect'],
        methods: {
            addBlue({ row, rowIndex }) {
                if (rowIndex === this.nowSelect) {
                    return 'blue animated fadeIn';
                }
            }
        }
    };
</script>
<style lang="scss">
    .table-view {
        .cell {
            text-align: center;
        }
        .el-table tr th {
            border-right: 1px solid rgb(230, 235, 245) !important;
        }
        .el-table__body-wrapper {
            overflow: hidden;
        }
        .blue {
            background: #acd5ff;
        }
    }
</style>
