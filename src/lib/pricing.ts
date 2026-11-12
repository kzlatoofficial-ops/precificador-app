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
