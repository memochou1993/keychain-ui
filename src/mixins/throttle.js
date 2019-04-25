import moment from 'moment';
import cookie from '@/helpers/cookie';

const throttle = {
  data() {
    return {
      limit: 3,
      period: 10,
      counter: 0,
      attempts: cookie.get('attempts') || [],
    };
  },
  watch: {
    attempts(value) {
      if (!value.length) {
        this.setError(null);
      }
      if (this.isSuspended) {
        this.countdown();
      }
    },
  },
  created() {
    const attempts = cookie.get('attempts');
    this.setAttempts(attempts ? attempts.data : []);
  },
  computed: {
    times() {
      return this.attempts.length;
    },
    isSuspended() {
      if (this.times < this.limit) {
        return false;
      }
      const begin = this.attempts[this.times - this.limit];
      const end = this.attempts[this.times - 1];
      return moment.duration(moment(end).diff(begin)).seconds() < this.period;
    },
  },
  methods: {
    setCounter(counter) {
      this.counter = counter;
    },
    setAttempts(attempts) {
      this.attempts = attempts;
    },
    suspend() {
      const attempts = [...this.attempts, Date.now()];
      cookie.set('attempts', attempts, moment().add(this.period, 's').toDate());
      this.setAttempts(attempts);
    },
    countdown() {
      const begin = this.attempts[this.times - 1];
      const end = moment();
      const duration = moment.duration(moment(end).diff(begin)).seconds();
      const remaining = this.period - duration;
      this.setCounter(remaining);
      const counter = setInterval(() => {
        this.setCounter(this.counter - 1);
      }, 1000 * 1);
      setTimeout(() => {
        this.setAttempts([]);
        clearInterval(counter);
      }, 1000 * remaining);
    },
  },
};

export default throttle;
