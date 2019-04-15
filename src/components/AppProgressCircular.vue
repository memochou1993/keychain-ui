<template>
  <div>
    <v-progress-circular
      :size="40"
      :color="color"
      :width="2"
      :indeterminate="loading"
    />
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    loading: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
};
</script>
