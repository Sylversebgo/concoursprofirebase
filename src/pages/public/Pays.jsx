import { useState } from 'react';
import { Search, MapPin, Users, Languages, Maximize2 } from 'lucide-react';

const AFRICAN_COUNTRIES = [
  ['Afrique du Sud', 'za', 'Pretoria', '1 221 037 km²', '62,0 M', 'zoulou, xhosa, afrikaans, anglais'],
  ['Algérie', 'dz', 'Alger', '2 381 741 km²', '46,8 M', 'arabe, tamazight'],
  ['Angola', 'ao', 'Luanda', '1 246 700 km²', '37,9 M', 'portugais'],
  ['Bénin', 'bj', 'Porto-Novo', '114 763 km²', '14,5 M', 'français, fon, yoruba'],
  ['Botswana', 'bw', 'Gaborone', '581 730 km²', '2,5 M', 'anglais, setswana'],
  ['Burkina Faso', 'bf', 'Ouagadougou', '274 200 km²', '23,5 M', 'français, mooré, dioula'],
  ['Burundi', 'bi', 'Gitega', '27 834 km²', '14,0 M', 'kirundi, français, anglais'],
  ['Cameroun', 'cm', 'Yaoundé', '475 442 km²', '28,6 M', 'français, anglais'],
  ['Cap-Vert', 'cv', 'Praia', '4 033 km²', '0,5 M', 'portugais, créole capverdien'],
  ['Comores', 'km', 'Moroni', '1 862 km²', '0,9 M', 'comorien, arabe, français'],
  ['Congo', 'cg', 'Brazzaville', '342 000 km²', '6,3 M', 'français, lingala, kituba'],
  ['Côte d’Ivoire', 'ci', 'Yamoussoukro', '322 463 km²', '31,5 M', 'français, dioula'],
  ['Djibouti', 'dj', 'Djibouti', '23 200 km²', '1,1 M', 'français, arabe, somali'],
  ['Égypte', 'eg', 'Le Caire', '1 001 450 km²', '114,5 M', 'arabe'],
  ['Érythrée', 'er', 'Asmara', '117 600 km²', '3,6 M', 'tigrigna, arabe, anglais'],
  ['Eswatini', 'sz', 'Mbabane', '17 364 km²', '1,2 M', 'swati, anglais'],
  ['Éthiopie', 'et', 'Addis-Abeba', '1 104 300 km²', '126,5 M', 'amharique, oromo, tigrigna'],
  ['Gabon', 'ga', 'Libreville', '267 668 km²', '2,4 M', 'français'],
  ['Gambie', 'gm', 'Banjul', '11 295 km²', '2,8 M', 'anglais, mandingue, wolof'],
  ['Ghana', 'gh', 'Accra', '238 533 km²', '34,1 M', 'anglais, akan, ewe'],
  ['Guinée', 'gn', 'Conakry', '245 857 km²', '14,8 M', 'français, peul, malinké'],
  ['Guinée-Bissau', 'gw', 'Bissau', '36 125 km²', '2,2 M', 'portugais, créole'],
  ['Guinée équatoriale', 'gq', 'Malabo', '28 051 km²', '1,7 M', 'espagnol, français, portugais'],
  ['Kenya', 'ke', 'Nairobi', '580 367 km²', '55,1 M', 'anglais, swahili'],
  ['Lesotho', 'ls', 'Maseru', '30 355 km²', '2,3 M', 'sesotho, anglais'],
  ['Liberia', 'lr', 'Monrovia', '111 369 km²', '5,5 M', 'anglais'],
  ['Libye', 'ly', 'Tripoli', '1 759 540 km²', '7,3 M', 'arabe'],
  ['Madagascar', 'mg', 'Antananarivo', '587 041 km²', '31,1 M', 'malgache, français'],
  ['Malawi', 'mw', 'Lilongwe', '118 484 km²', '21,1 M', 'anglais, chichewa'],
  ['Mali', 'ml', 'Bamako', '1 240 192 km²', '24,5 M', 'français, bambara'],
  ['Maroc', 'ma', 'Rabat', '446 550 km²', '37,8 M', 'arabe, amazighe, français'],
  ['Maurice', 'mu', 'Port-Louis', '2 040 km²', '1,3 M', 'anglais, français, créole mauricien'],
  ['Mauritanie', 'mr', 'Nouakchott', '1 030 700 km²', '5,0 M', 'arabe, pulaar, soninké, wolof'],
  ['Mozambique', 'mz', 'Maputo', '801 590 km²', '34,6 M', 'portugais, makhuwa, tsonga'],
  ['Namibie', 'na', 'Windhoek', '825 615 km²', '2,6 M', 'anglais, oshiwambo, afrikaans'],
  ['Niger', 'ne', 'Niamey', '1 267 000 km²', '27,2 M', 'français, haoussa, zarma'],
  ['Nigeria', 'ng', 'Abuja', '923 768 km²', '223,8 M', 'anglais, haoussa, yoruba, igbo'],
  ['Ouganda', 'ug', 'Kampala', '241 038 km²', '48,6 M', 'anglais, swahili, luganda'],
  ['République centrafricaine', 'cf', 'Bangui', '622 984 km²', '5,7 M', 'français, sango'],
  ['République démocratique du Congo', 'cd', 'Kinshasa', '2 344 858 km²', '105,6 M', 'français, lingala, swahili'],
  ['Rwanda', 'rw', 'Kigali', '26 338 km²', '14,3 M', 'kinyarwanda, français, anglais'],
  ['Sao Tomé-et-Principe', 'st', 'São Tomé', '964 km²', '0,2 M', 'portugais'],
  ['Sénégal', 'sn', 'Dakar', '196 722 km²', '18,1 M', 'français, wolof'],
  ['Seychelles', 'sc', 'Victoria', '455 km²', '0,1 M', 'créole seychellois, anglais, français'],
  ['Sierra Leone', 'sl', 'Freetown', '71 740 km²', '8,6 M', 'anglais, krio'],
  ['Somalie', 'so', 'Mogadiscio', '637 657 km²', '18,1 M', 'somali, arabe'],
  ['Soudan', 'sd', 'Khartoum', '1 886 068 km²', '48,1 M', 'arabe, anglais'],
  ['Soudan du Sud', 'ss', 'Djouba', '619 745 km²', '11,1 M', 'anglais, arabe juba'],
  ['Tanzanie', 'tz', 'Dodoma', '945 087 km²', '67,4 M', 'swahili, anglais'],
  ['Tchad', 'td', 'N’Djamena', '1 284 000 km²', '19,0 M', 'français, arabe'],
  ['Togo', 'tg', 'Lomé', '56 785 km²', '9,3 M', 'français, éwé, kabyè'],
  ['Tunisie', 'tn', 'Tunis', '163 610 km²', '12,5 M', 'arabe, français'],
  ['Zambie', 'zm', 'Lusaka', '752 618 km²', '20,6 M', 'anglais, bemba, nyanja'],
  ['Zimbabwe', 'zw', 'Harare', '390 757 km²', '16,7 M', 'anglais, shona, ndebele'],
].map(([name, code, capital, area, population, languages]) => ({ name, code, capital, area, population, languages }));

export default function Pays() {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(AFRICAN_COUNTRIES[0]);
  const filteredCountries = AFRICAN_COUNTRIES.filter(({ name }) =>
    name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  return (
    <div className="country-page">
      <section className="country-explorer overflow-hidden bg-ink px-5 py-12 text-white md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-200">ConcoursPro Explore</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">Apprendre sur les pays de l’Afrique</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">Recherchez un pays pour découvrir sa capitale, sa superficie, sa population et ses langues parlées.</p>
          <label className="relative mt-8 block max-w-xl">
            <span className="sr-only">Rechercher un pays africain</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un pays..." className="h-13 w-full rounded-xl border border-white/10 bg-white/10 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-blue-300 focus:bg-white/15" />
          </label>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ink">Pays d’Afrique</h2>
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
                <p className="text-xs font-bold uppercase tracking-widest text-brand">Fiche pays</p>
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
