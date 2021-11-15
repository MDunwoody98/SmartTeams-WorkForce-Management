<template>
  <div>
    <section class="home-header">
      <Navbar/>
    </section>
    <div class="main">
      <Nuxt/>
    </div>
    <section class="home-footer"/>
  </div>
</template>

<style>
.home-header, .home-footer{
    width: 100%;
    position: fixed;        
    color: #ffff;
}
.home-header{
    top: 0;
    z-index: 999;
}
.home-footer{
    bottom: 0;
    background: #2D9FA0;
    position: fixed;
    padding: 10px 0;
}   
@media all and (min-width: 961px) {
  .main {
    margin-left: 256px;
  }
}
@media all and (max-width: 960px) {
  .main {
    margin-left: 56px;
  }
}

</style>