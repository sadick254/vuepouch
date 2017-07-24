# Vuepouch
A tiny library to enable you work with PouchDB in a Vuejs app. It syncs with remote CouchDB too :-)
## Installation
Installing Vuepouch is as easy as including it in your html script tag. Being that it is a vuejs mixin 
it has a dependancy on vuejs. So dont forget to include that.
``` html
<script src="vue.js"></script>
<script src="vuepouch.js"></script>
```
## Usage
Vuepouch by default gets auto installed when you include it in your html. You dont 
have to to `Vue.use(vuepouch)`. <br>

``` javascript
var app = new Vue({
  el: "#app",
  pouchdb: {
    uber: {
      localdb: "uber",
      remoteURL: "http://127.0.0.1:5984/uber"
    }
  },
  computed () {
    drivers () {
      return this.uber.drivers
    },
    passengers () {
      return this.uber.passengers
    }
  }
})
```
## Adding data
``` javascript
...
methods: {
  addDriver () {
    this.$pouchdbRefs.uber.put('drivers',/*your data*/)
  },
  addPassenger () {
    this.$pouchdbRefs.uber.put('passengers', /*your data*/)
  } 
}
```
## Deleting data
``` javascript
this.$pouchdbRefs.uber.remove(/*your data*/)
```
## Updating data
``` javascript
this.$pouchdbRefs.uber.update(/*your data*/)
```

## Displaying data in your html
``` html
<div id="app">
  <ul>
    <li v-for="driver in drivers">{{driver.name}}</li>
  </ul>
</div>
```