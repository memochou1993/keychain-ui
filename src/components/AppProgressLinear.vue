<template>
  <div>
    <v-progress-linear
      :color="color"
      :indeterminate="loading"
      height="2"
      class="my-0"
    />
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    error: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    color() {
      return this.error ? 'error' : 'success';
    },
  },
};
</script>
