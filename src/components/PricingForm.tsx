import type { ProductCost, ProductCostInputs } from '../lib/pricing';

export type PricingFormValues = ProductCostInputs & {
  name: string;
  cardFee: string;
  margin: string;
};

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

type Props = {
  values: PricingFormValues;
  productCost: ProductCost | string | null;
  onChange: (field: keyof PricingFormValues, value: string) => void;
};

export default function PricingForm({ values, productCost, onChange }: Props) {
  const cost = typeof productCost === 'string' ? null : productCost;

  return (
    <form onSubmit={event => event.preventDefault()}>
      <label htmlFor="name">Nome do produto <span className="optional">opcional</span></label>
      <input id="name" placeholder="Ex.: Brownie de chocolate" value={values.name}
        onChange={event => onChange('name', event.target.value)} maxLength={100} />

      <fieldset className="product-cost">
        <legend>Custo do produto</legend>
        <p className="cost-instructions">Informe o gasto total e a quantidade correspondente.</p>
        <div className="fields">
          <div>
            <label htmlFor="expenses">Gasto direto total (R$)</label>
            <input id="expenses" inputMode="decimal" placeholder="0,00" value={values.expenses}
              aria-describedby="expenses-hint" onChange={event => onChange('expenses', event.target.value)} />
            <small id="expenses-hint">Some materiais ou produto, embalagem, mão de obra e frete.</small>
          </div>
          <div>
            <label htmlFor="units">Unidades prontas para vender</label>
            <input id="units" inputMode="numeric" value={values.units}
              onChange={event => onChange('units', event.target.value)} />
          </div>
        </div>

        <details className="monthly-costs">
          <summary>Adicionar contas mensais <span className="optional">opcional</span></summary>
          <div className="fields">
            <div>
              <label htmlFor="monthly">Contas por mês (R$)</label>
              <input id="monthly" inputMode="decimal" placeholder="0,00" value={values.monthly}
                onChange={event => onChange('monthly', event.target.value)} />
            </div>
            <div>
              <label htmlFor="monthlyUnits">Unidades vendidas por mês</label>
              <input id="monthlyUnits" inputMode="numeric" placeholder="Ex.: 100" value={values.monthlyUnits}
                onChange={event => onChange('monthlyUnits', event.target.value)} />
            </div>
          </div>
        </details>

        {typeof productCost === 'string' && <p className="cost-error" role="status">{productCost}</p>}
        <output className="cost-total" htmlFor="expenses units monthly monthlyUnits">
          <span>Custo por unidade</span>
          <strong>{cost ? money.format(cost.unitCost) : '—'}</strong>
          {cost && Number(values.units) > 1 && (
            <small>Custo do lote de {Number(values.units).toLocaleString('pt-BR')} unidades · {money.format(cost.batchCost)}</small>
          )}
        </output>
      </fieldset>

      <div className="fields">
        {([
          { key: 'cardFee', label: 'Taxa do cartão', hint: 'Taxa cobrada sobre a venda' },
          { key: 'margin', label: 'Margem de lucro', hint: 'Percentual do preço que será lucro' },
        ] as const).map(({ key, label, hint }) => (
          <div key={key}>
            <label htmlFor={key}>{label}</label>
            <div className="input-wrap suffix">
              <span aria-hidden="true">%</span>
              <input id={key} inputMode="decimal" placeholder="0,00" value={values[key]}
                aria-describedby={key + '-hint'} onChange={event => onChange(key, event.target.value)} />
            </div>
            <small id={key + '-hint'}>{hint}</small>
          </div>
        ))}
      </div>
    </form>
  );
}
