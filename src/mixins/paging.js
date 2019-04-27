import { mapGetters } from 'vuex';

const paging = {
  computed: {
    ...mapGetters([
      'defaultPaging',
    ]),
    isLoadMoreButton() {
      return this.defaultPaging === 'loadMoreButton';
    },
    isPagination() {
      return this.defaultPaging === 'pagination';
    },
    isInfiniteScroll() {
      return this.defaultPaging === 'infiniteScroll';
    },
  },
};

export default paging;
