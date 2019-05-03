import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '@/store/index';
import en from '@/i18n/lang/en';
import zhTW from '@/i18n/lang/zh-TW';
import ja from '@/i18n/lang/ja';

Vue.use(VueI18n);

const locale = store.state.settings.data.language;

const messages = {
  en,
  zhTW,
  ja,
};

const i18n = new VueI18n({
  locale,
  messages,
});

export default i18n;
