<template>
  <div>
    <v-progress-linear
      :color="error ? 'error' : 'success'"
      :height="2"
      :indeterminate="loading"
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
};
</script>
