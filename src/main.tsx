import {useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Calculator, ShieldCheck, Sparkles} from 'lucide-react';
import PricingForm,{type PricingFormValues} from './components/PricingForm';
import ResultPanel from './components/ResultPanel';
import {calculatePricing,parseDecimal} from './lib/pricing';
import './style.css';
const initialValues:PricingFormValues={name:'',cost:'',packaging:'',cardFee:'',margin:''};
function App(){
 const [values,setValues]=useState(initialValues);
 const result=useMemo(()=>[values.cost,values.packaging,values.cardFee,values.margin].some(v=>v.trim()!=='')?calculatePricing({cost:parseDecimal(values.cost),packaging:parseDecimal(values.packaging),cardFeePct:parseDecimal(values.cardFee),marginPct:parseDecimal(values.margin)}):null,[values]);
 return <><header><div className="brand"><div className="logo"><Calculator size={23}/></div><span>Calculadora de Preço</span></div><span className="header-note"><ShieldCheck size={15}/> Simples. Rápido. Sem complicação.</span></header><main><div className="intro"><span className="badge"><Sparkles size={13}/> MAIS CLAREZA PARA O SEU NEGÓCIO</span><h1>O preço certo.<br/><span>O seu negócio crescendo.</span></h1><p>Transforme seus custos em um preço justo.<br className="desktop"/> Calcule sua margem e venda com confiança.</p></div><div className="workspace"><section className="form-card"><div className="card-heading"><div className="step">01</div><div><h2>Descubra quanto cobrar</h2><p>Informe os valores de uma unidade do produto.</p></div></div><PricingForm values={values} onChange={(field,value)=>setValues(p=>({...p,[field]:value}))}/><div className="form-note"><ShieldCheck size={16}/><span>Seus dados ficam apenas nesta página.</span></div></section><aside><ResultPanel productName={values.name} result={result}/><div className="tip"><span className="tip-icon">✦</span><div><strong>Uma dica para precificar</strong><p>Inclua matéria-prima e mão de obra no custo do produto. Assim, seu preço cuida do seu trabalho também.</p></div></div></aside></div><footer>Feito para quem transforma trabalho em valor.<span>Calculadora de Preço</span></footer></main></>;
}
createRoot(document.getElementById('root')!).render(<App/>);
