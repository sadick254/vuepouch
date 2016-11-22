var init = function () {
  var bindings = this.$options.pouchdb
  ensureRef(this)
  for (var key in bindings) {
    bind(this, key, bindings[key])
  }
}

function ensureRef(vm) {
  if (!vm.$pouchdbRefs) {
    vm.$pouchdbRefs = Object.create(null)
  }
}

function defineReactive(vm, key, val) {
  if (key in vm) {
    vm[key] = val
  } else {
    Vue.util.defineReactive(vm, key, val)
  }
}

function bind(vm, key, source) {
  var array = []
  defineReactive(vm, key, array)
  var localDB = new PouchDB(source.localdb)
  var remoteDB = new PouchDB(source.remoteURL)

  vm.$pouchdbRefs[key] = localDB
  
  vm.$pouchdbRefs[key].push = function(data){
    var uuid = new Date().toISOString()
    data['_id'] = uuid

    vm[key][uuid] = data
    return new Promise(function (resolve, reject) {
      localDB.put(data).then(function (doc) {
        data['_rev'] = doc.rev
        resolve(data)
      }).catch(function (err) {
        data = Object.create(null)
        reject(err)
      })
    })
  }
  vm.$pouchdbRefs[key].update = function(data){
    var uuid = data['_id']
    vm[key][uuid] = data
    return new Promise(function (resolve, reject) {
      localDB.put(data).then(function (doc) {
        data['_rev'] = doc.rev
        resolve(doc)
      }).catch(function (err) {
        reject(err)
      })
    })
  }
  vm.$pouchdbRefs[key].delete = function(data){
    var id = data['_id']
    var rev = data['_rev']
   
    return new Promise(function (resolve, reject) {
      localDB.remove(id, rev).then(function (doc) {
        // check for connection
        remoteDB.info().catch(function(err){
          Vue.delete(vm[key], id)
        })
        resolve(doc)
      }).catch(function (err) {
        reject(err)
      })
    })
    
  }
  localDB.sync(remoteDB, {
    live: true,
    retry: true
  }).on('change', function (change) {
    var docs = change.change.docs
    console.log("change")
    docs.forEach(function (doc) {
      var uuid = doc['_id']
      if ((uuid in vm[key])) {
        if (doc['_deleted']) {
          Vue.delete(vm[key], uuid)
          return
        }
        vm[key][uuid] = doc
      } else {
        var obj = vm[key]
        Vue.set(obj, uuid, doc)
      }
    })
  })
  localDB.allDocs({
    include_docs: true,
    descending: true
  }).then(function (doc) {
    var objs = {}
    doc.rows.forEach(function(d){
      objs[d.id] = d.doc
    })
    defineReactive(vm, key, objs)
    
  }).catch(function (err) {

  })
}
var PouchMixin = {
  init: init, // making it usable with vuejs 1.x.x
  beforeCreate: init
}

function install(Vue) {
  Vue.mixin(PouchMixin)
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

module.exports = install