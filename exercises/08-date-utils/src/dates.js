// All functions work in UTC so results don't depend on the machine's timezone.

function isLeapYear(y) {
  
  if(!Number.isInteger(y)) return false;

  return (y % 4 === 0&&(y%100!==0||y%400===0));

}

// Adds n months; if the day doesn't exist in the target month, clamp to its last day.
function addMonths(date, n) {
 
  const d = new Date(date);

  const day=d.getUTCDate();

  day.setUTCDate(1);
  
  day.setUTCMonth(d.getUTCMonth() + n);

  // 4. last day of the target month: day 0 of the NEXT month = last day of this one
  const lastDay = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)
  ).getUTCDate();

  d.setUTCDate(Math.min(day,lastDay));

  return d;

}

// Whole days from a to b (b - a), ignoring time-of-day.
function daysBetween(a, b) {
  
  const newA=Date.UTC(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate());
  const newB=Date.UTC(b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate());

  if(newB>=newA){
    return Math.round((newB - newA) / 86400000);
    
  }
}

// Monday 00:00 UTC of the week containing `date`.
function startOfWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const daysBack=(d.getUTCDate()+6)%7;
  d.setUTCDate(d.getUTCDate() - daysBack);
  return d;
}

// 'YYYY-MM-DD'
function formatDate(date) {

  const y=date.getUTCFullYear();
  const m=String(date.getUTCMonth()+ 1).padStart(2,0);
  const d=String(date.getUTCDate()).padStart(2,0);

  return `${y}-${m}-${d}`;

}

// Count of Mon–Fri days in [start, end) (end exclusive, start inclusive).
function businessDaysBetween_n(start, end) {
  let count=0;
   const cur = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const stop = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  
  while(cur.getTime()<stop){
    const day=cur.getUTCDay();
    if(day>=1&&day<=5) count++;
    cur.setUTCDate(cur.getUTCDate()+1);
  }
  return count;
}

function businessDaysBetween_1(start, end) {

  const s = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const e = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  const total = Math.round((e - s) / 86400000);
  if (total <= 0) return 0;

  const weeks = Math.floor(total / 7);
  let count = weeks * 5;                    // full weeks: 5 business days each

  let day = new Date(s).getUTCDay();        // weekday of the start date
  for (let i = 0; i < total % 7; i++) {     // at most 6 leftover days
    if (day >= 1 && day <= 5) count++;
    day = (day + 1) % 7;                    // next weekday, wraps 6 → 0
  }
  return count;
}


module.exports = { isLeapYear, addMonths, daysBetween, startOfWeek, formatDate, businessDaysBetween_n,businessDaysBetween_1 };
