import { createContext, useCallback, useContext, useState } from 'react';
import { InquiryForm } from './components/InquiryForm.jsx';
import { Dialog } from './components/ui/Dialog.jsx';
import { useT } from './i18n/index.jsx';

// Prozor „Zatraži ponudu za školu“ (izbornik i ostali gumbi)
const OfferContext = createContext(() => {});

export function OfferProvider({ children }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <OfferContext.Provider value={() => setOpen(true)}>
      {children}
      <Dialog open={open} onClose={close} title={t.ui.requestOffer} subtitle={t.trip.inquiryText} closeLabel={t.ui.close}>
        <InquiryForm />
      </Dialog>
    </OfferContext.Provider>
  );
}

export const useOffer = () => useContext(OfferContext);
