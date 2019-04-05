import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/lib/util/colors';
import zhHant from 'vuetify/es5/locale/zh-Hant';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify, {
  theme: {
    primary: colors.indigo,
    secondary: colors.grey,
    accent: colors.purple,
    error: colors.red,
    info: colors.blue,
    success: colors.green,
    warning: colors.orange,
  },
  customProperties: true,
  iconfont: 'mdi',
  lang: {
    locales: { zhHant },
    current: 'zh-Hant',
  },
});
