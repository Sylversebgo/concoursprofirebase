import { useState } from 'react';
import { Search, MapPin, Users, Languages, Maximize2 } from 'lucide-react';

const INTERNATIONAL_COUNTRIES = [
  ['Allemagne', 'de', 'Berlin', '357 022 km²', '84,5 M', 'allemand', 'Europe'],
  ['Espagne', 'es', 'Madrid', '505 990 km²', '48,4 M', 'espagnol', 'Europe'],
  ['France', 'fr', 'Paris', '551 695 km²', '68,2 M', 'français', 'Europe'],
  ['Italie', 'it', 'Rome', '301 340 km²', '58,8 M', 'italien', 'Europe'],
  ['Portugal', 'pt', 'Lisbonne', '92 212 km²', '10,3 M', 'portugais', 'Europe'],
  ['Royaume-Uni', 'gb', 'Londres', '243 610 km²', '68,4 M', 'anglais', 'Europe'],
  ['Russie', 'ru', 'Moscou', '17 098 246 km²', '143,8 M', 'russe', 'Europe / Asie'],
  ['Suisse', 'ch', 'Berne', '41 285 km²', '8,8 M', 'allemand, français, italien', 'Europe'],
  ['États-Unis', 'us', 'Washington D.C.', '9 833 517 km²', '335,9 M', 'anglais', 'Amérique'],
  ['Canada', 'ca', 'Ottawa', '9 984 670 km²', '40,1 M', 'anglais, français', 'Amérique'],
  ['Brésil', 'br', 'Brasília', '8 515 767 km²', '216,4 M', 'portugais', 'Amérique'],
  ['Argentine', 'ar', 'Buenos Aires', '2 780 400 km²', '45,8 M', 'espagnol', 'Amérique'],
  ['Chili', 'cl', 'Santiago', '756 102 km²', '19,6 M', 'espagnol', 'Amérique'],
  ['Colombie', 'co', 'Bogotá', '1 141 748 km²', '52,1 M', 'espagnol', 'Amérique'],
  ['Mexique', 'mx', 'Mexico', '1 964 375 km²', '128,5 M', 'espagnol', 'Amérique'],
  ['Cuba', 'cu', 'La Havane', '109 884 km²', '11,0 M', 'espagnol', 'Amérique'],
  ['Chine', 'cn', 'Pékin', '9 596 960 km²', '1 410,7 M', 'mandarin', 'Asie'],
  ['Inde', 'in', 'New Delhi', '3 287 263 km²', '1 428,6 M', 'hindi, anglais', 'Asie'],
  ['Japon', 'jp', 'Tokyo', '377 975 km²', '124,5 M', 'japonais', 'Asie'],
  ['Corée du Sud', 'kr', 'Séoul', '100 210 km²', '51,7 M', 'coréen', 'Asie'],
  ['Indonésie', 'id', 'Jakarta', '1 904 569 km²', '277,5 M', 'indonésien', 'Asie'],
  ['Thaïlande', 'th', 'Bangkok', '513 120 km²', '71,8 M', 'thaï', 'Asie'],
  ['Vietnam', 'vn', 'Hanoï', '331 212 km²', '98,2 M', 'vietnamien', 'Asie'],
  ['Arabie saoudite', 'sa', 'Riyad', '2 149 690 km²', '36,9 M', 'arabe', 'Asie'],
  ['Émirats arabes unis', 'ae', 'Abou Dabi', '83 600 km²', '9,5 M', 'arabe', 'Asie'],
  ['Turquie', 'tr', 'Ankara', '783 562 km²', '85,3 M', 'turc', 'Europe / Asie'],
  ['Israël', 'il', 'Jérusalem', '22 145 km²', '9,8 M', 'hébreu, arabe', 'Asie'],
  ['Australie', 'au', 'Canberra', '7 692 024 km²', '26,6 M', 'anglais', 'Océanie'],
  ['Nouvelle-Zélande', 'nz', 'Wellington', '268 021 km²', '5,2 M', 'anglais, maori', 'Océanie'],
  ['Fidji', 'fj', 'Suva', '18 274 km²', '0,9 M', 'anglais, fidjien, hindi', 'Océanie'],
  ['Papouasie-Nouvelle-Guinée', 'pg', 'Port Moresby', '462 840 km²', '10,3 M', 'anglais, tok pisin, hiri motu', 'Océanie'],
].map(([name, code, capital, area, population, languages, continent]) => ({ name, code, capital, area, population, languages, continent }));

export default function International() {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(INTERNATIONAL_COUNTRIES[0]);
  const filteredCountries = INTERNATIONAL_COUNTRIES.filter(({ name, continent }) =>
    `${name} ${continent}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  return (
    <div className="country-page">
      <section className="country-explorer overflow-hidden bg-ink px-5 py-12 text-white md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-200">ConcoursPro Explore</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">Apprendre sur les autres pays du monde</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">Parcourez l’Europe, l’Amérique, l’Asie et l’Océanie pour découvrir les grands repères de chaque pays.</p>
          <label className="relative mt-8 block max-w-xl">
            <span className="sr-only">Rechercher un pays ou un continent</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un pays ou un continent..." className="h-13 w-full rounded-xl border border-white/10 bg-white/10 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-blue-300 focus:bg-white/15" />
          </label>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ink">Pays du monde</h2>
            <span className="text-sm text-gray-500">{filteredCountries.length} résultat{filteredCountries.length > 1 ? 's' : ''}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filteredCountries.map((country) => (
              <button key={country.code} type="button" onClick={() => setSelectedCountry(country)} className={`country-chip flex items-center gap-2 rounded-xl border p-3 text-left transition ${selectedCountry.code === country.code ? 'border-brand bg-blue-50 text-brand' : 'border-black/5 bg-white text-ink hover:-translate-y-0.5 hover:shadow-md'}`}>
                <img src={`https://flagcdn.com/w40/${country.code}.png`} alt="" className="h-5 w-8 rounded-sm object-cover" />
                <span className="text-xs font-bold leading-4">{country.name}</span>
              </button>
            ))}
          </div>
          {!filteredCountries.length && <p className="rounded-xl bg-white p-6 text-sm text-gray-500">Aucun pays ne correspond à votre recherche.</p>}
        </div>

        <article className="country-profile h-fit rounded-2xl bg-white p-5 text-ink shadow-lg ring-1 ring-black/5 md:p-7 lg:sticky lg:top-24">
          <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-5">
            <div className="flex items-center gap-4">
              <img src={`https://flagcdn.com/w160/${selectedCountry.code}.png`} alt={`Drapeau de ${selectedCountry.name}`} className="h-16 w-24 rounded-lg object-cover shadow-sm ring-1 ring-black/10" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand">{selectedCountry.continent}</p>
                <h2 className="mt-1 font-display text-2xl font-bold">{selectedCountry.name}</h2>
              </div>
            </div>
            <Maximize2 size={18} className="mt-1 text-gray-300" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-blue-50 p-4"><MapPin size={18} className="text-brand" /><p className="mt-3 text-xs font-semibold text-gray-500">Capitale</p><p className="mt-1 font-bold">{selectedCountry.capital}</p></div>
            <div className="rounded-xl bg-amber-50 p-4"><Maximize2 size={18} className="text-amber-600" /><p className="mt-3 text-xs font-semibold text-gray-500">Superficie</p><p className="mt-1 font-bold">{selectedCountry.area}</p></div>
            <div className="rounded-xl bg-emerald-50 p-4"><Users size={18} className="text-emerald-600" /><p className="mt-3 text-xs font-semibold text-gray-500">Population</p><p className="mt-1 font-bold">{selectedCountry.population}</p></div>
            <div className="rounded-xl bg-rose-50 p-4"><Languages size={18} className="text-rose-600" /><p className="mt-3 text-xs font-semibold text-gray-500">Langues parlées</p><p className="mt-1 text-sm font-bold leading-5">{selectedCountry.languages}</p></div>
          </div>
        </article>
      </section>
    </div>
  );
}
