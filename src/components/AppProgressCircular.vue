<template>
  <div>
    <v-progress-circular
      :size="40"
      :width="2"
      :indeterminate="loading"
      color="primary"
    />
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
};
</script>
