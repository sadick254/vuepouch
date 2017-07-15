export default {
  install (Vue, options) {
    Vue.mixin({
      mounted () {
        console.log('vuepouch mixin called')
      }
    })
  }
}