export type PricingResult = { price: number; cost: number; fee: number; profit: number; margin: number; error?: string };
export function parseDecimal(value: string): number {
 const normalized = value.trim().replace(/\s|R\$/g, '');
 return Number(normalized.includes(',') ? normalized.replace(/\./g, '').replace(',', '.') : normalized);
}
export function calculatePricing({cost, packaging, cardFeePct, marginPct}: {cost:number; packaging:number; cardFeePct:number; marginPct:number}): PricingResult {
 const base = {price:0,cost:cost+packaging,fee:0,profit:0,margin:marginPct};
 if (![cost,packaging,cardFeePct,marginPct].every(Number.isFinite)) return {...base,error:'Digite apenas números válidos.'};
 if ([cost,packaging,cardFeePct,marginPct].some(n=>n<0)) return {...base,error:'Os valores não podem ser negativos.'};
 if(cardFeePct+marginPct>=100) return {...base,error:'A soma da taxa e da margem deve ser menor que 100%.'};
 const price=(cost+packaging)/(1-(cardFeePct+marginPct)/100);
 return {...base,price,fee:price*cardFeePct/100,profit:price*marginPct/100};
}

export type ProductCostInputs = {
  expenses: string;
  units: string;
  monthly: string;
  monthlyUnits: string;
};

export type ProductCost = {
  unitCost: number;
  batchCost: number;
};

function parseCost(value: string): number {
  const raw = value.trim();
  if (!raw) return 0;

  const money = /^(?:\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:[,.]\d{1,2})?)$/;
  if (!money.test(raw)) return NaN;

  const amount = /^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(raw)
    ? Number(raw.replace(/\./g, '').replace(',', '.'))
    : parseDecimal(raw);
  return amount <= Number.MAX_SAFE_INTEGER ? amount : NaN;
}

function parseUnits(value: string): number {
  const raw = value.trim();
  if (!/^\d+$/.test(raw)) return NaN;
  const count = Number(raw);
  return Number.isSafeInteger(count) ? count : NaN;
}

export function calculateProductCost(inputs: ProductCostInputs): ProductCost | string | null {
  const expenses = parseCost(inputs.expenses);
  const monthly = parseCost(inputs.monthly);
  const units = parseUnits(inputs.units);
  const monthlyUnits = inputs.monthlyUnits.trim() ? parseUnits(inputs.monthlyUnits) : 0;

  if (!Number.isFinite(expenses) || !Number.isFinite(monthly)) {
    return 'Informe um valor em reais válido, igual ou maior que zero.';
  }
  if (!Number.isFinite(units) || units < 1) {
    return 'Informe uma quantidade inteira de unidades, a partir de 1.';
  }
  if (!Number.isFinite(monthlyUnits) || (monthly > 0 && monthlyUnits < 1)) {
    return 'Informe quantas unidades inteiras você vende por mês.';
  }
  if (!inputs.expenses.trim() && monthly === 0) return null;

  const overhead = monthly > 0 ? monthly / monthlyUnits : 0;
  return { unitCost: expenses / units + overhead, batchCost: expenses + overhead * units };
}
