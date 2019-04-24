import moment from 'moment';
import cookie from '@/helpers/cookie';

const throttle = {
  data() {
    return {
      max: 3,
      period: 10,
      barrier: cookie.get('barrier'),
      counter: 0,
      attempts: [],
    };
  },
  watch: {
    attempts(value) {
      if (value.length < this.max) {
        return false;
      }
      const begin = value[value.length - this.max];
      const end = value[value.length - 1];
      const period = moment.duration(moment(end).diff(moment(begin))).seconds();
      if (!this.barrier && period < this.period) {
        this.lock();
      }
      return this.countdown();
    },
  },
  created() {
    const attempts = cookie.get('attempts');
    this.setAttempts(attempts ? attempts.data : []);
  },
  methods: {
    setBarrier(barrier) {
      this.barrier = barrier;
    },
    setCounter(counter) {
      this.counter = counter;
    },
    setAttempts(attempts) {
      this.attempts = attempts;
    },
    success() {
      this.reset();
    },
    fail() {
      cookie.set('attempts', [...this.attempts, Date.now()]);
      this.setAttempts([...this.attempts, Date.now()]);
    },
    reset() {
      cookie.delete('attempts');
      this.setAttempts([]);
    },
    countdown() {
      if (!this.barrier) {
        return false;
      }
      const duration = moment.duration(moment(this.barrier.data).diff(moment())).seconds();
      this.setCounter(duration);
      const counter = setInterval(() => {
        this.setCounter(this.counter - 1);
      }, 1000 * 1);
      setTimeout(() => {
        this.reset();
        this.unlock();
        clearInterval(counter);
      }, 1000 * this.counter);
      return true;
    },
    lock() {
      cookie.set('barrier', moment().add(this.period, 's'), moment().add(this.period, 's').toDate());
      this.setBarrier(cookie.get('barrier'));
    },
    unlock() {
      this.setError(null);
      this.setBarrier(null);
    },
  },
};

export default throttle;
