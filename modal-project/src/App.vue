<template>
  <h1>{{ title }}</h1>
  <Modal/>
</template>

<script>
import Modal from './components/ModalProject.vue'
export default {
  name: 'App',
  components: { Modal },
  data() {
    return {
      title: 'My First Vue App'
    }
  },
  methods: {
    handleClick() {
      console.log(this.$refs.name)
      this.$refs.name.classList.add('active')
      this.$refs.name.focus()
    }
  }
}
</script>


<style>
  h1{
    color: black;
  }
</style>
