<template>
  <div>
    <v-progress-linear
      :color="color"
      :height="2"
      :indeterminate="loading"
      class="my-0"
    />
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: false,
      default: 'success',
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
