import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useId } from 'react';

const base =
  'w-full rounded-xl border bg-white px-3.5 text-sm text-brand-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2';
const state = (error, valid) =>
  error
    ? 'border-red-400 pr-10 focus:border-red-500 focus:ring-red-200'
    : valid
      ? 'border-emerald-400 pr-10 focus:border-emerald-500 focus:ring-emerald-100'
      : 'border-slate-300 focus:border-brand-400 focus:ring-brand-100';

// Polje obrasca s oznakom, pomoćnim tekstom i vizualnim stanjem (greška / ispravno)
export function Field({ label, hint, required, error, valid, as = 'input', options, choose = '…', className = '', ...props }) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  const common = {
    id,
    'aria-invalid': !!error,
    'aria-describedby': describedBy,
    className: `${base} ${state(error, valid)}`,
    ...props,
  };

  let control;
  if (as === 'select') {
    control = (
      <select {...common} className={`${common.className} h-11 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23103A6E%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat`}>
        <option value="">{choose}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  } else if (as === 'textarea') {
    control = <textarea rows={4} {...common} className={`${common.className} py-2.5`} />;
  } else {
    control = <input {...common} className={`${common.className} h-11`} />;
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-brand-900">
        {label} {required && <span className="text-amber-600" aria-hidden>*</span>}
      </label>
      <div className="relative">
        {control}
        {as !== 'select' && (error || valid) && (
          <span className="pointer-events-none absolute right-3 top-3">
            {error ? <AlertCircle className="h-5 w-5 text-red-500" /> : <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
          </span>
        )}
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function Checkbox({ label, error, value, valid, ...props }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
        <input
          id={id}
          type="checkbox"
          checked={!!value}
          aria-invalid={!!error}
          className={`mt-0.5 h-5 w-5 shrink-0 rounded border accent-brand-700 ${error ? 'outline outline-2 outline-red-400' : ''}`}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && <p className="mt-1.5 pl-8 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export function FormSuccess({ title, children, onReset, resetLabel = 'Pošalji novi upit' }) {
  return (
    <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
      <h4 className="mt-3 font-display text-xl font-bold text-brand-900">{title}</h4>
      <div className="mt-2 text-sm text-slate-700">{children}</div>
      {onReset && (
        <button type="button" onClick={onReset} className="mt-4 text-sm font-semibold text-brand-700 underline underline-offset-4">
          {resetLabel}
        </button>
      )}
    </div>
  );
}
