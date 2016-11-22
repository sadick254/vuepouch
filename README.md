# Vuepouch
A tiny library to enable you work with PouchDB in a Vuejs app. It syncs with remote CouchDB too :-)

## Installation
Installing Vuepouch is as easy as including it in your html script tag. Being that it is a vuejs plugin 
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
    todos: {
      localdb: "todos",
      remoteURL: "http://127.0.0.1:5984/todos"
    }
  }
})
```
## Adding data
``` javascript
...
methods: {
  addData: function(){
    this.$pouchdbRefs.todos.push(/*your data*/)
  }
}
```
## Deleting data
``` javascript
this.$pouchdbRefs.todos.delete(/*your data*/)
```
## Updating data
``` javascript
this.$pouchdbRefs.todos.update(/*your data*/)
```

## Displaying data in your html
``` html
<div id="app">
  <ul>
    <li v-for="t in todos">{{t}}</li>
  </ul>
</div>
```