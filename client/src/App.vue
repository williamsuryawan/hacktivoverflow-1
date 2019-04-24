<template>
  <div id="app">
    <navbar-section />
    <router-view/>
    <footbar-section />
  </div>
</template>

<script>
import Navbar from '@/views/Navbar.vue';
import Footbar from '@/views/Footbar.vue';

export default {
  components: {
    "navbar-section": Navbar,
    "footbar-section": Footbar
  },
  data() {
    return {
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
