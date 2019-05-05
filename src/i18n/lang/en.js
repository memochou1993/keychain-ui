export default {
  links: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    account: 'Account',
    keys: 'Keys',
    settings: 'Settings',
  },
  tabs: {
    profile: 'Profile',
    password: 'Password',
    general: 'General',
    login: 'Login',
    pagination: 'Pagination',
    theme: 'Theme',
  },
  settings: {
    general: {
      language: {
        title: 'Language',
        languages: {
          en: 'English',
          zhTW: '中文',
          ja: '日本語',
        },
      },
      accessControl: {
        title: 'Access Control',
        alwaysAskPassword: 'Always require a password',
      },
    },
    login: {
      rememberMeExpiration: {
        title: 'Remember Me Expiration',
        day: '{n} day | {n} days',
      },
    },
    pagination: {
      types: {
        title: 'Paging Type',
        types: {
          loadMoreButton: 'Load more button',
          pagination: 'Pagination',
          infiniteScroll: 'Infinite scroll',
        },
      },
    },
    theme: {
      primaryColor: {
        title: 'Primary Color',
        colors: {
          indigo: 'Indigo',
          purple: 'Purple',
          blue: 'Blue',
          cyan: 'Cyan',
          teal: 'Teal',
          amber: 'Amber',
          orange: 'Orange',
        },
      },
    },
    hints: {
      keepDays: 'This setting will take effect on next login.',
    },
  },
  headers: {
    title: 'Title',
    content: 'Content',
    tags: 'Tags',
  },
  fields: {
    username: 'Username',
    email: 'Email address',
    password: 'Password',
    rememberMe: 'Remember me',
    name: 'Name',
    oldPassword: 'Old password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    confirmNewPassword: 'Confirm new password',
    title: 'Title',
    content: 'Content',
    link: 'Link',
    lock: 'Lock',
  },
  actions: {
    login: 'Login',
    register: 'Register',
    clear: 'Clear',
    create: 'Create',
    reset: 'Reset',
    update: 'Update',
    refresh: 'Refresh',
    search: 'Search',
    load: 'Load More',
    openLink: 'Open Link',
    view: 'View',
    edit: 'Edit',
    remove: 'Remove',
    clickToConfirm: 'Click to Confirm',
    save: 'Save',
  },
  rules: {
    email: 'The {f} must be a valid email address.',
    required: 'The {f} is required.',
    min: 'The {f} must be at least {n} characters.',
    alphaNum: 'The {f} may only contain letters and numbers.',
    confirmPassword: 'The password confirmation does not match.',
    confirmNewPassword: 'The password confirmation does not match.',
  },
  messages: {
    register: {
      success: 'Registered successfully.',
    },
    login: {
      failed: 'Incorrect username or password.',
      throttle: 'Too many login attempts. Please try again later.',
    },
    profile: {
      update: {
        success: 'Profile updated successfully.',
      },
    },
    password: {
      update: {
        success: 'Password updated successfully.',
        failed: 'Old password is not correct.',
      },
    },
    unlock: {
      failed: 'Incorrect password.',
      throttle: 'Too many unlock attempts. Please try again later.',
    },
    key: {
      noData: 'No key found. | No keys found.',
    },
  },
};
