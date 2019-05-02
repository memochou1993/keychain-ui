import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from '@/store/index';

Vue.use(VueAxios, axios);

axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.params = {};
axios.defaults.params.locale = store.state.settings.data.locale;
