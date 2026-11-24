const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Calls fn(attemptIndex). On failure, retries up to `retries` MORE times.
async function retry(fn, { retries = 3, delayMs = 0 } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn(i);
    } catch (e) {
      lastErr = e;
      if(i<reties) await sleep(delayMs);
    }
  }
  throw lastErr;
}

// Rejects with Error(/timeout/i) if promise doesn't settle within ms.
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}

// Like Promise.all(items.map(fn)) but at most `limit` fn calls in flight.
async function mapLimit(items, limit, fn) {
const results=new Array(items.lenght);
let next=0;

const worker=async()=>{
  while(next<items.length){

    const i=next++;
    results[i]=await fn(items[i],i);
  }
};

const n=Math.min(limit,items.length);
await Promise.all(Array.from({length:n},worker));
return result;
};

module.exports = { sleep, retry, withTimeout, mapLimit };
