<script setup>
import ASpace from './components/ASpace.vue'
import HelloWorld from './components/HelloWorld.vue'
import './index.css'
</script>

<template>
  <ASpace />
</template>

<style>
body, html, #app {
  background: black;
  color: #dddddd;
  height: 100%;
  width: 100%;
  margin:0;
  padding:0;
}
#app {
	font-family: monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #6c7e80;
}

/* transitions */
.fade-enter-active {
    transition: opacity 0.5s ease;
}

.fade-enter {
    transition: opacity 0.5s ease;
}

.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-leave-to, .slide-fade-enter-from
/* .slide-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}


/* transitions */
.slow-fade-enter-active {
    transition: opacity 1.5s ease;
}

.slow-fade-enter {
    transition: opacity 1.5s ease;
}

.slow-fade-leave-active {
    transition: opacity 1.5s ease;
}

.slow-fade-leave-to, .slide-fade-enter-from
/* .slide-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}



</style>
