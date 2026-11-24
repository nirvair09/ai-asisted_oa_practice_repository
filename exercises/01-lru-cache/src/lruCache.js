class LRUCache {
  constructor(capacity, now = () => Date.now()) {
    this.capacity = capacity;
    this.now = now;
    this.map = new Map();
  }

  _live(key){
    const entry=this.map.get(key);

    if(!entry) return undefined;

    if(entry.expiresAt<=this.now()){
      this.map.delete(key);
      return undefined;
    }

    this.map.delete(key);

    this.map.set(key,{value: entry.value, expiresAt: entry.expiresAt + this.now()});
    return entry;
  }

  get(key) {
    return this._live(key);
  }

  has(key) {
    return this.map.has(key);
  }

  set(key, value,ttlMs) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key,{ value,expiresAt:this.now()+ttlMs});
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }

  get size() {
    return this.map.size;
  }
}

module.exports = { LRUCache };
