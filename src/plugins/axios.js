import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from '@/store/index';

Vue.use(VueAxios, axios);

const languages = {
  en: 'en',
  zhTW: 'zh-TW',
  ja: 'ja',
};

axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.params = {};
axios.defaults.params.locale = languages[store.state.settings.data.language];

export default axios;
