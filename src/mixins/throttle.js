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
    begin() {
      return this.attempts[this.times - this.limit];
    },
    end() {
      return this.attempts[this.times - 1];
    },
    remaining() {
      return this.period - this.isExpended();
    },
    isSuspended() {
      if (this.times < this.limit) {
        return false;
      }
      return moment.duration(moment(this.end).diff(this.begin)).seconds() < this.period;
    },
  },
  methods: {
    setCounter(counter) {
      this.counter = counter;
    },
    setAttempts(attempts) {
      this.attempts = attempts;
    },
    isExpended() {
      return moment.duration(moment().diff(this.end)).seconds();
    },
    suspend() {
      const attempts = [...this.attempts, Date.now()];
      cookie.set('attempts', attempts, moment().add(this.period, 's').toDate());
      this.setAttempts(attempts);
    },
    countdown() {
      this.setCounter(this.remaining);
      const counter = setInterval(() => {
        this.setCounter(this.counter - 1);
      }, 1000 * 1);
      setTimeout(() => {
        this.setAttempts([]);
        clearInterval(counter);
      }, 1000 * this.remaining);
    },
  },
};

export default throttle;
