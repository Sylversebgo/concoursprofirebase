import { useState } from 'react';
import { Search, MapPin, Users, Languages, Maximize2 } from 'lucide-react';
import { COUNTRY_LEADERS } from '../../data/countryLeaders';

const AFRICAN_COUNTRIES = [
  ['Afrique du Sud', 'za', 'Pretoria', '1 221 037 km²', 64747319, 'zoulou, xhosa, afrikaans, anglais'],
  ['Algérie', 'dz', 'Alger', '2 381 741 km²', 47435312, 'arabe, tamazight'],
  ['Angola', 'ao', 'Luanda', '1 246 700 km²', 39040039, 'portugais'],
  ['Bénin', 'bj', 'Porto-Novo', '114 763 km²', 14814460, 'français, fon, yoruba'],
  ['Botswana', 'bw', 'Gaborone', '581 730 km²', 2562122, 'anglais, setswana'],
  ['Burkina Faso', 'bf', 'Ouagadougou', '274 200 km²', 24074580, 'français, mooré, dioula'],
  ['Burundi', 'bi', 'Gitega', '27 834 km²', 14390003, 'kirundi, français, anglais'],
  ['Cameroun', 'cm', 'Yaoundé', '475 442 km²', 29879337, 'français, anglais'],
  ['Cap-Vert', 'cv', 'Praia', '4 033 km²', 527326, 'portugais, créole capverdien'],
  ['Comores', 'km', 'Moroni', '1 862 km²', 882847, 'comorien, arabe, français'],
  ['Congo', 'cg', 'Brazzaville', '342 000 km²', 6484437, 'français, lingala, kituba'],
  ['Côte d’Ivoire', 'ci', 'Yamoussoukro', '322 463 km²', 32711547, 'français, dioula'],
  ['Djibouti', 'dj', 'Djibouti', '23 200 km²', 1184076, 'français, arabe, somali'],
  ['Égypte', 'eg', 'Le Caire', '1 001 450 km²', 118365995, 'arabe'],
  ['Érythrée', 'er', 'Asmara', '117 600 km²', 3607003, 'tigrigna, arabe, anglais'],
  ['Eswatini', 'sz', 'Mbabane', '17 364 km²', 1256174, 'swati, anglais'],
  ['Éthiopie', 'et', 'Addis-Abeba', '1 104 300 km²', 135472051, 'amharique, oromo, tigrigna'],
  ['Gabon', 'ga', 'Libreville', '267 668 km²', 2593130, 'français'],
  ['Gambie', 'gm', 'Banjul', '11 295 km²', 2822093, 'anglais, mandingue, wolof'],
  ['Ghana', 'gh', 'Accra', '238 533 km²', 35064272, 'anglais, akan, ewe'],
  ['Guinée', 'gn', 'Conakry', '245 857 km²', 15099727, 'français, peul, malinké'],
  ['Guinée-Bissau', 'gw', 'Bissau', '36 125 km²', 2249515, 'portugais, créole'],
  ['Guinée équatoriale', 'gq', 'Malabo', '28 051 km²', 1938431, 'espagnol, français, portugais'],
  ['Kenya', 'ke', 'Nairobi', '580 367 km²', 57532493, 'anglais, swahili'],
  ['Lesotho', 'ls', 'Maseru', '30 355 km²', 2363325, 'sesotho, anglais'],
  ['Liberia', 'lr', 'Monrovia', '111 369 km²', 5731206, 'anglais'],
  ['Libye', 'ly', 'Tripoli', '1 759 540 km²', 7458555, 'arabe'],
  ['Madagascar', 'mg', 'Antananarivo', '587 041 km²', 32740678, 'malgache, français'],
  ['Malawi', 'mw', 'Lilongwe', '118 484 km²', 22216120, 'anglais, chichewa'],
  ['Mali', 'ml', 'Bamako', '1 240 192 km²', 25198821, 'français, bambara'],
  ['Maroc', 'ma', 'Rabat', '446 550 km²', 38430770, 'arabe, amazighe, français'],
  ['Maurice', 'mu', 'Port-Louis', '2 040 km²', 1243741, 'anglais, français, créole mauricien'],
  ['Mauritanie', 'mr', 'Nouakchott', '1 030 700 km²', 5315065, 'arabe, pulaar, soninké, wolof'],
  ['Mozambique', 'mz', 'Maputo', '801 590 km²', 35631653, 'portugais, makhuwa, tsonga'],
  ['Namibie', 'na', 'Windhoek', '825 615 km²', 3092816, 'anglais, oshiwambo, afrikaans'],
  ['Niger', 'ne', 'Niamey', '1 267 000 km²', 27917831, 'français, haoussa, zarma'],
  ['Nigeria', 'ng', 'Abuja', '923 768 km²', 237527782, 'anglais, haoussa, yoruba, igbo'],
  ['Ouganda', 'ug', 'Kampala', '241 038 km²', 51384894, 'anglais, swahili, luganda'],
  ['République centrafricaine', 'cf', 'Bangui', '622 984 km²', 5513282, 'français, sango'],
  ['République démocratique du Congo', 'cd', 'Kinshasa', '2 344 858 km²', 112832473, 'français, lingala, swahili'],
  ['Rwanda', 'rw', 'Kigali', '26 338 km²', 14569341, 'kinyarwanda, français, anglais'],
  ['Sao Tomé-et-Principe', 'st', 'São Tomé', '964 km²', 240254, 'portugais'],
  ['Sénégal', 'sn', 'Dakar', '196 722 km²', 18931966, 'français, wolof'],
  ['Seychelles', 'sc', 'Victoria', '455 km²', 122730, 'créole seychellois, anglais, français'],
  ['Sierra Leone', 'sl', 'Freetown', '71 740 km²', 8819794, 'anglais, krio'],
  ['Somalie', 'so', 'Mogadiscio', '637 657 km²', 19654739, 'somali, arabe'],
  ['Soudan', 'sd', 'Khartoum', '1 886 068 km²', 51662147, 'arabe, anglais'],
  ['Soudan du Sud', 'ss', 'Djouba', '619 745 km²', 12188788, 'anglais, arabe juba'],
  ['Tanzanie', 'tz', 'Dodoma', '945 087 km²', 70545865, 'swahili, anglais'],
  ['Tchad', 'td', 'N’Djamena', '1 284 000 km²', 21003705, 'français, arabe'],
  ['Togo', 'tg', 'Lomé', '56 785 km²', 8591626, 'français, éwé, kabyè'],
  ['Tunisie', 'tn', 'Tunis', '163 610 km²', 12348573, 'arabe, français'],
  ['Zambie', 'zm', 'Lusaka', '752 618 km²', 21913874, 'anglais, bemba, nyanja'],
  ['Zimbabwe', 'zw', 'Harare', '390 757 km²', 16950795, 'anglais, shona, ndebele'],
].map(([name, code, capital, area, population, languages]) => ({ name, code, capital, area, population, languages }));

const populationFormatter = new Intl.NumberFormat('fr-FR');

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
            <div className="rounded-xl bg-emerald-50 p-4"><Users size={18} className="text-emerald-600" /><p className="mt-3 text-xs font-semibold text-gray-500">Population estimée (2025)</p><p className="mt-1 font-bold">{populationFormatter.format(selectedCountry.population)} habitants</p></div>
            <div className="rounded-xl bg-amber-50 p-4"><p className="text-xs font-semibold text-gray-500">Chef d’État</p><p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-700">{COUNTRY_LEADERS[selectedCountry.code]?.title || 'Fonction non renseignée'}</p><p className="mt-1 font-bold">{COUNTRY_LEADERS[selectedCountry.code]?.name || 'À vérifier'}</p></div>
            <div className="rounded-xl bg-rose-50 p-4"><Languages size={18} className="text-rose-600" /><p className="mt-3 text-xs font-semibold text-gray-500">Langues parlées</p><p className="mt-1 text-sm font-bold leading-5">{selectedCountry.languages}</p></div>
          </div>
        </article>
      </section>
    </div>
  );
}
