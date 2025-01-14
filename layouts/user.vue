<template>
  <div>
    <TheUserHeader />

    <v-main  class="black-background">
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