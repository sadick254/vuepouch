const init = vm => {
  const bindings = vm.$options.pouchdb
  if (!bindings) {
    return
  }
  ensureRef(vm)
  for (const key in bindings) {
    makeReactive(vm, key, bindings[key])
    bind(vm, key, bindings[key])
  }
}

const ensureRef = vm => {
  if (!vm.$pouchdbRefs) {
    vm.$pouchdbRefs = Object.create(null)
  }
}

const bind = (vm, key, source) => {
  const localDB = new PouchDB(source.localDB)
  initDB(vm, key, localDB)
  vm.$pouchdbRefs[key] = Object.create(null)
  attachMethods(vm, key, localDB)
  if (!source.remoteURL) {
    return
  }
  const remoteDB = new PouchDB(source.remoteURL)
  syncDB(vm, key, localDB, remoteDB)
}

const makeReactive = (vm, key, val) => {
  if (key in vm) {
    return
  }
  Vue.util.defineReactive(vm, key, val)
}
function initDB(vm, key, localDB) {
  localDB.allDocs({
    include_docs: true,
    descending: true
  }).then(function (doc) {
    var objs = {}
    doc.rows.forEach(function (d) {
      objs[d.id] = d.doc
    })
    let uniques = [...new Set(Object.keys(objs).map(item => objs[item].doctype))]
    vm.$options.pouchdb.uniques = uniques
    let data = []
    Object.keys(objs).forEach(item => {
      uniques.forEach(unique => {
        if (objs[item].doctype === unique) {
          if (!vm[key][unique]) {
            Vue.set(vm[key], unique, Object.create(null))
          }
          Vue.set(vm[key][unique], item, objs[item])
        }
      })
    })
  })
}

function syncDB(vm, key, localDB, remoteDB) {
  localDB.sync(remoteDB, {
    live: true,
    retry: true,
    include_docs: true
  }).on('change', change => {
    handleChanges(vm, key, change)
  })
}

const handleChanges = (vm, key, change) => {
  const { docs } = change.change
  docs.forEach(function (doc) {
    if (doc['_deleted']) {
      vm.$options.pouchdb.uniques.forEach(unique => {
        if (vm[key][unique][doc['_id']]) {
          Vue.delete(vm[key][unique], doc['_id'])
        }
      })
      return
    }
    vm[key][doc['doctype']][doc['_id']] = doc
  })
}

const attachMethods = (vm, key, localDB) => {
  vm.$pouchdbRefs[key] = Object.create(null)
  vm.$pouchdbRefs[key].put = put.bind({
    localDB,
    vm,
    key
  })
  vm.$pouchdbRefs[key].get = get.bind({
    localDB,
    vm,
    key
  })
  vm.$pouchdbRefs[key].update = update.bind({
    localDB,
    vm,
    key
  })
  vm.$pouchdbRefs[key].remove = remove.bind({
    localDB,
    vm,
    key
  })
}

function put(docName, data) {
  data['_id'] = new Date().toISOString()
  data['doctype'] = docName
  const {
    localDB,
    vm,
    key
  } = this
  if (!vm[key][docName]) {
    Vue.set(vm[key], [docName], Object.create(null))
  }
  localDB.put(data).then(doc => {
    data['rev'] = doc['rev']
    Vue.set(vm[key][docName], [data['_id']], data)
  })
}

function get(docName, options) {

}
function update(doc) {
  const { localDB, key, vm } = this
  return localDB.put(doc)
}
function remove(doc) {
  const { localDB, key, vm } = this
  return localDB.remove(doc)
}
Vue.mixin({
  created() {
    init(this)
  }
})