class Emitter {
  constructor() {
    this.listeners = {};
  }

  on(event, fn) {
    (this.listeners[event] ||= []).push(fn);
    return this;
  }

  once(event, fn) {
    return this.on(event, fn);
  }

  off(event, fn) {
    const list = this.listeners[event];
    if (!list) return this;
    this.listeners[event] = list.filter((l) => l !== fn);
    return this;
  }

  // Returns true if any listener was called.
  // Emitting 'error' with no listener must throw the payload.
  emit(event, ...args) {
    const list = this.listeners[event] || [];
    for (const fn of list) fn(...args);
  }

  listenerCount(event) {
    throw new Error('not implemented');
  }

  // Adds listener to the FRONT of the queue.
  prependListener(event, fn) {
    throw new Error('not implemented');
  }
}

module.exports = { Emitter };
