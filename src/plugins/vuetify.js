import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/lib/util/colors';
import zhHant from 'vuetify/es5/locale/zh-Hant';
import store from '@/store/index';
import '@mdi/font/css/materialdesignicons.css';

let { theme } = store.state.settings.data;
switch (theme) {
  case 'blue': {
    theme = colors.blue;
    break;
  }
  case 'cyan': {
    theme = colors.cyan;
    break;
  }
  case 'teal': {
    theme = colors.teal;
    break;
  }
  default: {
    theme = colors.indigo;
    break;
  }
}

Vue.use(Vuetify, {
  theme: {
    primary: theme,
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
