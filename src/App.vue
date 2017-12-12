<template>
    <div class="m-wrapper">
        <m-header></m-header>
        <m-wrapper></m-wrapper>
    </div>
</template>

<script>
    import MHeader from 'components/m-header.vue';
    import MWrapper from 'components/m-wrapper.vue';
    export default {
        components: {
            MHeader,
            MWrapper
        }
    };
</script>

<style lang="scss">
    .m-wrapper {
        padding: 20px;
    }
    .inline-block {
        display: inline-block;
    }
    .header {
        padding: 15px 0;
    }
</style>

