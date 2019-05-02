export default {
  links: {
    login: '登入',
    register: '註冊',
    logout: '登出',
    account: '帳號',
    keys: '鑰匙',
    settings: '設定',
  },
  tabs: {
    profile: '個人資料',
    password: '密碼',
    general: '一般',
    authentication: '認證',
    pagination: '頁碼',
    theme: '主題',
  },
  settings: {
    accessControl: '存取控制',
    alwaysAskPassword: '總是詢問密碼',
    rememberMeExpiration: '「記住我」有效期限',
    day: '{n} 天',
    pagingType: '頁碼類型',
    loadMoreButton: '「更多」按鈕',
    pagination: '頁碼',
    infiniteScroll: '無限滾動',
    colors: '顏色',
    indigo: '靛藍色',
    blue: '藍色',
    cyan: '青色',
    teal: '藍綠色',
    hints: {
      keepDays: '此設定在下一次登入時生效。',
      theme: '此設定在重新整理頁面後生效。',
    },
  },
  headers: {
    title: '標題',
    content: '內容',
    tags: '標記',
  },
  fields: {
    username: '使用者名稱',
    email: '信箱',
    password: '密碼',
    rememberMe: '記住我',
    name: '名字',
    oldPassword: '舊密碼',
    newPassword: '新密碼',
    confirmPassword: '確認密碼',
    confirmNewPassword: '確認密碼',
    title: '標題',
    content: '內容',
    link: '連結',
    lock: '需要密碼',
  },
  actions: {
    login: '登入',
    clear: '重設',
    create: '新增',
    reset: '重設',
    update: '更新',
    refresh: '重新整理',
    search: '檢索',
    view: '查看',
    edit: '編輯',
    remove: '移除',
    clickToConfirm: '點擊確認',
    save: '儲存',
  },
  rules: {
    email: '{f}必須是有效的電子郵件地址。',
    required: '{f}不能留空。',
    min: '{f}不能小於 {n} 個字元。',
    alphaNum: '{f}只能以字母及數字組成。',
    confirmNewPassword: '確認密碼與新密碼不一致。',
  },
  messages: {
    register: {
      success: '註冊成功！',
    },
    login: {
      failed: '錯誤的使用者名稱或密碼。',
      throttle: [
        '嘗試登入次數過多，請',
        '秒後再試。',
      ],
    },
    unlock: {
      failed: '錯誤的密碼。',
      throttle: [
        '嘗試解鎖次數過多，請稍後再試。',
      ],
    },
  },
};
