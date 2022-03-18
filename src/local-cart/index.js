const round = (val, precision = 2) => {
  const scalar = 10**precision;
  return Math.round(val * scalar) / scalar;
};


export class LocalCart {

  constructor(state = null) {
    this.state = state || {
      lineItems: [],
      taxRate: 0,
      taxDescription: "",
      taxCalculated: false,
      subTotal: 0,
      shippingSurcharge: 0,
      shippingTotal: 0,
      taxTotal: 0,
      lineItemTotal: 0,
      discountType: "",
      discountValue: 0,
      discountTotal: 0,
      discountSubtotal: 0,
      discountFreeShipping: false,
      freeShippingMinimum: 999999999,
      total: 0
    };
  }

  get lineItems() {
    return this.state.lineItems.map(x => Object.assign({}, x));
  }

  get taxRate() {
    return this.state.taxRate;
  }


  get taxDescription() {
    return this.state.taxDescription;
  }


  get taxCalculated() {
    return this.state.taxCalculated;
  }

  get lineItemTotal() {
    return this.state.lineItemTotal;
  }

  get subTotal() {
    return this.state.subTotal;
  }


  get shippingSurcharge() {
    return this.state.shippingSurcharge;
  }


  get shippingTotal() {
    return this.state.shippingTotal;
  }


  get taxTotal() {
    return this.state.taxTotal;
  }


  get discountType() {
    return this.state.discountType;
  }


  get discountValue() {
    return this.state.discountValue;
  }


  get discountTotal() {
    return this.state.discountTotal;
  }


  get discountSubtotal() {
    return this.state.discountSubtotal;
  }


  get discountFreeShipping() {
    return this.state.discountFreeShipping;
  }


  get freeShippingMinimum() {
    return this.state.freeShippingMinimum;
  }


  get total() {
    return this.state.total;
  }
  //


  toJSON() {
    return JSON.stringify(this.asJSON());
  }

  asJSON() {
    return this.state;
  }

  isEmpty() {
    return this.state.lineItems.length === 0;
  }

  *eachItem() {
    for (let i = 0; i < this.state.lineItems.length; i++) {
        yield this.state.lineItems[i];
    }
  }

  totalSavings() {
    let compareAtTotal = 0;
    let lineItemTotal  = 0;
    const nullReturn = { compareAtTotal: null, lineItemTotal:null, totalSavings: null, totalSavingsPct: null };
    // Only return a value if its valid, otherwise return null.

    for (let i = 0; i < this.state.lineItems.length; i++) {
      const li = this.lineItems[i];
      const price = parseFloat(li.price);
      const compareAtPrice = parseFloat(li.compareAtPrice);
      if (typeof compareAtPrice === 'number' && (compareAtPrice > price)) {
        compareAtTotal += compareAtPrice * li.quantity;
        lineItemTotal  += price          * li.quantity;
      } else {
        return nullReturn;
      }
    }

    if (compareAtTotal === 0) {
      return nullReturn;
    }

    const totalSavings = compareAtTotal - lineItemTotal;
    let totalSavingsPct = compareAtTotal > 0 ? 100*(1 - (lineItemTotal / compareAtTotal)) : null;

    // This is the same % rounding algorithm we use for pricingData.
    const pctDiff = Math.abs(totalSavingsPct - Math.round(totalSavingsPct));
    if (pctDiff < 0.01) {
      totalSavingsPct = Math.round(totalSavingsPct);
    } else {
      totalSavingsPct = Math.floor(totalSavingsPct);
    }

    return { compareAtTotal, lineItemTotal, totalSavings, totalSavingsPct };


  }


  calculateSubTotal() {
    this.state.subTotal = 0.0;
    this.state.discountSubtotal = 0.0;
    this.state.lineItemTotal = 0.0;
    this.state.shippingTotal = this.state.shippingSurcharge;
    this.state.lineItems.forEach(li => {
      const lineSubtotal = li.price * li.quantity;
      const lineShipping = li.shippingRatePerItem * li.quantity;
      this.state.subTotal += lineSubtotal;
      this.state.shippingTotal += lineShipping;
      this.state.lineItemTotal += lineSubtotal;
      if (li.discountable) {
        this.state.discountSubtotal += li.price * li.quantity;
      }
    });
    if (this.state.discountFreeShipping) {
      this.state.shippingTotal = 0.0;
    }
    if (this.state.subTotal >= this.state.freeShippingMinimum) {
      this.state.shippingTotal = 0.0;
    }

  }


  removeDiscount() {
    this.state.discountType         = "";
    this.state.discountValue        = 0;
    this.state.discountFreeShipping = false;
    this.calculate();
  }

  calculateDiscount() {
    this.state.discountTotal = 0;

    if (this.state.discountType === "fixed_amount") {
      this.state.discountTotal = this.state.discountValue;
    }

    if (this.state.discountType === "percentage") {
      this.state.discountTotal = this.state.discountSubtotal * this.state.discountValue;
      this.state.discountTotal = round(this.state.discountTotal);
    }

    if (this.state.discountTotal > this.state.subTotal) {
      this.state.discountTotal = this.state.subTotal;
    }

  }

  getVariantQuantity(variantId) {
    variantId = parseFloat(variantId);

    for (let i = 0; i < this.state.lineItems.length ; i++) {
      const li = this.state.lineItems[i];
      if (parseFloat(li.variantId) === variantId) {
        return parseFloat(li.quantity);
      }
    }

    return 0;
  }

  // This will not deal with qty = 0, that logic lives in SessionCart.
  setVariantQuantity(variantId, qty) {
    for (let i = 0; i < this.state.lineItems.length; i++) {
      const li = this.state.lineItems[i];
      if (li.variantId === variantId) {
        li.quantity = qty;
        this.calculate();
        return;
      }
    }
  }

  highestValueVariantId() {
    if (this.state.lineItems.length === 0) {
      return null;
    }
    let highestValue = 0;
    let variantId = null
    for (let i = 0; i < this.state.lineItems.length; i++) {
      const li = this.state.lineItems[i];
      const price = parseFloat(li.price);
      if (!isNaN(price)) {
        if (price > highestValue) {
          highestValue = price;
          variantId    = li.variantId;
        }
      }
    }
    return variantId;
  }

  hasVariant(variantId) {
    return this.state.lineItems.map(x => parseFloat(x.variantId)).indexOf(parseFloat(variantId)) > -1;
  }

  removeLineItem(variantId) {
    this.state.lineItems = this.state.lineItems.filter(x => parseFloat(x.variantId) != parseFloat(variantId));
    this.calculate();
  }

  clearLineItems() {
    this.state.lineItems = [];
    this.calculate();
  }

  calculate() {
    this.calculateSubTotal();
    this.calculateDiscount();
    this.state.total = this.state.subTotal - this.state.discountTotal + this.state.taxTotal + this.state.shippingTotal
    this.state.taxableAmount = this.state.total - this.state.taxTotal;
    this.state.taxableAmount = round(this.state.taxableAmount);
    this.state.total         = round(this.state.total);
    this.state.subTotal      = round(this.state.subTotal);
    this.state.discountTotal = round(this.state.discountTotal);
    this.state.taxTotal      = round(this.state.taxTotal);
    this.state.shippingTotal = round(this.state.shippingTotal);

  }

  setFreeShippingMinimum(freeShippingMinimum) {
    this.state.freeShippingMinimum = freeShippingMinimum;
    this.calculate();
  }

  setShippingSurcharge(amount) {
    this.state.shippingSurcharge = amount;
    this.calculate();
  }

  setDiscount(discountType, discountValue, freeShipping) {
    this.state.discountType         = discountType;
    this.state.discountValue        = discountValue;
    this.state.discountFreeShipping = freeShipping === true;
    this.calculate();
  }

  getDiscount() {
    return {
      discountTotal: this.state.discountTotal,
      discountType: this.state.discountType,
      discountValue: this.state.discountValue,
      discountFreeShipping: this.state.discountFreeShipping
    }
  }


  addLineItem(variantId, title, subtitle, price, quantity, shippingRatePerItem, discountable = true, compareAtPrice = null, productImage=null, displayName=null) {
    price               = parseFloat(price);
    quantity            = parseInt(quantity);
    compareAtPrice      = parseFloat(compareAtPrice)      || null;
    shippingRatePerItem = parseFloat(shippingRatePerItem) || 0.0;
    this.state.lineItems.push({ variantId, title, subtitle, price, quantity, shippingRatePerItem, discountable, compareAtPrice, productImage, displayName });
    this.calculate();
  }

  setTax(taxDescription, taxRate, taxTotal) {
    this.state.taxDescription = taxDescription;
    this.state.taxRate        = parseFloat(taxRate);
    this.state.taxTotal      = parseFloat(taxTotal);
    this.state.taxCalculated = true;
    this.calculate();
  }

}

LocalCart.fromJSON = (jsonStr) => {
  return new LocalCart(JSON.parse(jsonStr));
}


/*
const lc = new LocalCart();

lc.addLineItem(1234, "Main Title", "SubTitle", 19.95, 5, 3.923423412349);

//console.log(lc.state);
lc.setTax("Tax", 0.10);
//console.log(lc.state);
lc.setDiscount("percent", 0.10);
//console.log(lc.state);
lc.setDiscount("fixed_amount", 10.0);
//console.log(lc.state);


const lc2 = LocalCart.fromJSON(lc.toJSON());
console.log(lc2.state);

console.log("Has Variant");
console.log(lc2.hasVariant(1234));

lc2.setShippingSurcharge(50);
console.log(lc2.state);

lc2.removeLineItem(1234);
console.log(lc2.state);

console.log("Has Variant");
console.log(lc2.hasVariant(1234));
*/
