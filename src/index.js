const VuePouch = {
  test () {
    
  },
  install (Vue, options) {
    Vue.mixin({
      mounted () {
        console.log('vuepouch mixin called')
      }
    })
  }
}
export default VuePouch