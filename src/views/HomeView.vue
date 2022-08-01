<template>
  <div class="home">
    <Navi></Navi>
  </div>
</template>

<script>
// @ is an alias to /src
import Navi from '@/components/NavigationBar.vue'

export default {
  name: 'HomeView',
  components: {
    Navi,
  }
}
</script>
