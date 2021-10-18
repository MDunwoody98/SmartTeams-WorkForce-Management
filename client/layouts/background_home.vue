<template>
  <div>
    <section class="home-header"/>
        <Nuxt />
    <section class="home-footer"/>
  </div>
</template>

<style>
.home-header, .home-footer{
    width: 100%;
    position: fixed;        
    padding: 10px 0;
    color: #ffff;
}
.home-header{
    top: 0;
    background: #091C58;
}
.home-footer{
    bottom: 0;
    background: #2D9FA0;
}   
</style>