<template>
  <div>
    <v-progress-circular
      :size="size"
      :color="color"
      :width="2"
      :indeterminate="loading"
    />
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      required: false,
      default: 40,
    },
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
