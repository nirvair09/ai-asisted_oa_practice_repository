const DISCOUNT_RATES = { SAVE10: 0.1, SAVE25: 0.25 };
const TAX_RATE = 0.08;

function applyDiscount(subtotalCents, code) {
 if(!Object.hasOwn(DISCOUNT_RATES,code)) return subtotalCents;
  const rate=DISCOUNT_RATES[code];
  return Math.round( subtotalCents - subtotalCents * rate);
}

function orderTotal(items, code) {
  validateItems(items);
  const subtotal = Math.round(items.reduce((sum, i) => sum + i.priceCents * i.qty, 0));
  const discounted = applyDiscount(subtotal, code);
  const tax =Math.round( discounted * TAX_RATE);
  return discounted + tax;
}

function validateItems(items){
 if(!Array.isArray(items)||items.length===0) throw new TypeError("Invalid items");
 for(const item of items){
    if(!Number.isInteger(item.qty)||item.qty<=0) throw new TypeError("Invalid qty");
    if(!Number.isInteger(item.priceCents)||item.priceCents<0) throw new TypeError("Invalid price");
  }
}

function priceOrder(items,code){
  validateItems(items);
  const subtotal = Math.round(items.reduce((sum, i) => sum + i.priceCents * i.qty, 0));
  const discounted = applyDiscount(subtotal, code);
  const tax =Math.round( discounted * TAX_RATE);
 const shipping=discounted>=5000?0:499;
  const total= discounted + tax;
  return {
    subtotal,
    discount:subtotal-discounted,
    tax,
    shipping,
    total:discounted+tax+shipping,
  }
}

module.exports = { applyDiscount, orderTotal, priceOrder };
