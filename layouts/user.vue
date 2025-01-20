<template>
  <div>
    <TheUserHeader />

    <v-main  class="black-background">
      <TheMenu />
      <slot />
    </v-main>

    <TheFooter />

  </div>
</template>
<style scoped>
.black-background {
  background-color: white  !important;
}
</style>