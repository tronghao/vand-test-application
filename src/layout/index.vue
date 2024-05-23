<template>
  <div
    class="bg-gradient-to-r from-[#e46988] to-[#670495] bg-cover p-[2rem] min-h-[100vh]"
  >
    <div class="rounded-3xl bg-[#F6F7FF] min-h-[calc(100vh-2rem)] p-[2rem]">
      <app-main></app-main>
    </div>
  </div>
</template>
<script>
import AppMain from "./AppMain";
export default {
  components: {
    AppMain,
  },
};
</script>
