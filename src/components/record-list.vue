<template>
    <div class="record-list">
        <h3 class="s-header">【操作记录】</h3>
        <ul>
            <li v-for="(val,index) in recordTip" :key="index" class="animated fadeInUp">
                {{val}}
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        props: ['recordTip']
    };
</script>
<style lang="scss">
    .record-list {
        .s-header {
            padding-bottom: 15px;
            margin-top: -7px;
        }
    }
    li {
        list-style: none;
        padding: 3px 0;
    }
</style>