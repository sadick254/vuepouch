var init = function(){
  var bindings = this.$options.pouchdb
  ensureRef(this)
  for(var key in bindings) {
    bind(this,key,bindings[key])
  }
}
function ensureRef (vm) {
	  if (!vm.$pouchdbRefs) {
	    vm.$pouchdbRefs = Object.create(null)
	  }
}
function defineReactive(vm,key,val){
  if(key in vm){
    vm[key] = val
  } else {
    Vue.util.defineReactive(vm,key,val)
  }
}
function bind(vm,key,source){
  var array = []
  defineReactive(vm,key,array)
  vm.$pouchdbRefs[key] = source
  source.changes({
    since:'now',
    live: true,
    include_docs: true
  }).on('complete',function(info){
    
  }).on('change',function(change){
    vm[key].push(change.doc)

  }).on('err',function(err){
    
  })
  source.allDocs({
        include_docs: true,
        descending: true
      }).then(function(doc){
        var docs = doc.rows.map(function(obj){
            return obj.doc
        })
        defineReactive(vm,key,docs)
      }).catch(function(err){

      })
}
var PouchMixin = {
  init: init, // making it usable with vuejs 1.x.x
  beforeCreate: init
}

function install(Vue){
  Vue.mixin(PouchMixin)
}

	// auto install
	if (typeof window !== 'undefined' && window.Vue) {
	  install(window.Vue)
	}