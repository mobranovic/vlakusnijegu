import App from './App.jsx';
import { LanguageProvider } from './i18n/index.jsx';
import { OfferProvider } from './offer.jsx';
import { RouteProvider } from './route.jsx';

/** Zajednički korijen za preglednik i za unaprijed iscrtane stranice. */
export default function Root({ route }) {
  return (
    <RouteProvider initial={route}>
      <LanguageProvider>
        <OfferProvider>
          <App />
        </OfferProvider>
      </LanguageProvider>
    </RouteProvider>
  );
}
