import Vue from 'nativescript-vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import TaskList from './components/TaskList.vue';
new Vue({
render: (h) => h('frame', [h(Login)]),
}).$start();
