<template>
  <div
    class="text-xs-center ma-5"
  >
    <div
      v-if="noData"
    >
      {{ message }}
    </div>
    <AppProgressCircular
      v-else
    />
  </div>
</template>

<script>
import AppProgressCircular from '@/components/AppProgressCircular.vue';

export default {
  components: {
    AppProgressCircular,
  },
  props: {
    noData: {
      type: Boolean,
      required: false,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
  },
};
</script>
