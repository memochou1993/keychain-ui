export default {
  links: {
    login: 'ログイン',
    register: 'アカウントを作成',
    logout: 'ログアウト',
    account: 'アカウント',
    keys: 'キー',
    settings: '設定',
  },
  tabs: {
    profile: 'プロフィール',
    password: 'パスワード',
    general: '一般',
    login: 'ログイン',
    pagination: 'ページネーション',
    theme: 'テーマ',
  },
  settings: {
    general: {
      language: {
        title: '言語',
        languages: {
          en: 'English',
          zhTW: '中文',
          ja: '日本語',
        },
      },
      accessControl: {
        title: 'アクセス制御',
        alwaysAskPassword: '常にパスワードを要求する',
      },
    },
    login: {
      rememberMeExpiration: {
        title: 'ログイン状態の保存期間',
        day: '{n} 日',
      },
    },
    pagination: {
      types: {
        title: 'ページングタイプ',
        types: {
          loadMoreButton: '「もっと見る」ボタン',
          pagination: 'ページネーション',
          infiniteScroll: '無限スクロール',
        },
      },
    },
    theme: {
      primaryColor: {
        title: 'カラー',
        colors: {
          indigo: 'インディゴ',
          purple: 'パープル',
          blue: 'ブルー',
          cyan: 'シアン',
          teal: 'ティール',
          amber: 'アンバー',
          orange: 'オレンジ',
        },
      },
    },
    hints: {
      keepDays: 'この設定は再ログイン時に有効になります。',
    },
  },
  headers: {
    title: 'タイトル',
    content: '内容',
    tags: 'タグ',
  },
  fields: {
    username: 'ユーザー名',
    email: 'Eメールアドレス',
    password: 'パスワード',
    rememberMe: 'ログイン状態を保持する',
    name: '名前',
    oldPassword: '現在のパスワード',
    newPassword: '新しいパスワード',
    confirmPassword: 'パスワードの確認',
    confirmNewPassword: '新しいパスワードの確認',
    title: 'タイトル',
    content: '内容',
    link: 'リンク',
    lock: 'ロックする',
  },
  actions: {
    login: 'ログイン',
    register: 'アカウントを作成',
    clear: 'クリア',
    create: '作成',
    reset: 'リセット',
    update: '更新',
    refresh: '再読込',
    search: '検索',
    load: 'もっと見る',
    openLink: 'リンクを開く',
    view: '表示',
    edit: '編集',
    remove: '削除',
    clickToConfirm: '確認',
    save: 'セーブ',
  },
  rules: {
    email: '{f}は、有効なメールアドレス形式で指定してください。',
    required: '{f}は、必ず指定してください。',
    min: '{f}は、{n} 文字以上にしてください。',
    alphaNum: '{f}には、英数字が使用できます。',
    confirmPassword: 'パスワードと確認のパスワードが一致しません。',
    confirmNewPassword: '新しいパスワードと確認のパスワードが一致しません。',
  },
  messages: {
    register: {
      success: 'アカウントの作成が完了しました。',
    },
    login: {
      failed: 'ユーザー名またはパスワードが正しくありません。',
      throttle: '試行回数の制限を超えました。しばらくしてからもう一度お試しください。',
    },
    profile: {
      update: {
        success: 'プロフィールが更新されました。',
      },
    },
    password: {
      update: {
        success: 'パスワードが更新されました。',
        failed: '現在のパスワードが正しくありません。',
      },
    },
    unlock: {
      failed: 'パスワードが正しくありません。',
      throttle: '試行回数の制限を超えました。しばらくしてからもう一度お試しください。',
    },
    key: {
      noData: 'キーがありません。',
    },
  },
};
