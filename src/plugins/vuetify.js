import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/lib/util/colors';
import zhHant from 'vuetify/es5/locale/zh-Hant';
import '@mdi/font/css/materialdesignicons.css';
import cache from '@/helpers/cache';

let settings = cache.get('settings');
settings = settings ? settings.data.theme : 'classic';
let primary;
switch (settings) {
  case 'blue': {
    primary = colors.blue;
    break;
  }
  case 'cyan': {
    primary = colors.cyan;
    break;
  }
  case 'teal': {
    primary = colors.teal;
    break;
  }
  default: {
    primary = colors.indigo;
    break;
  }
}

Vue.use(Vuetify, {
  theme: {
    primary,
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
