<template>
    <el-row>
        <el-col :span="2"><div class="Left">
            <Navi></Navi>
        </div></el-col>
        <el-col :span="22"><div class="Right">
        
        </div></el-col>
    </el-row>
</template>

<script>
import Navi from '@/components/NavigationBar.vue'

export default {
    name: 'Invitation',
    components: {
        Navi,
    },
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>

<style scoped>

</style>