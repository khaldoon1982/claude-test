import { Metadata } from 'next/metadata'
import { Locale } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Over Ons | RefurbX',
  description: 'Leer meer over RefurbX en onze missie',
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const translations = await getTranslations(locale as Locale)

  return (
    <>
      <Header locale={locale as Locale} translations={translations} />

      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-8 text-5xl font-bold">Over RefurbX</h1>

            <div className="space-y-8">
              <section className="rounded-lg bg-white p-8 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold">Onze Missie</h2>
                <p className="text-lg text-gray-700">
                  Bij RefurbX geloven we in kwaliteit, duurzaamheid en
                  toegankelijkheid. We bieden refurbished laptops van topkwaliteit
                  aan tegen eerlijke prijzen, zodat iedereen toegang heeft tot
                  betrouwbare technologie.
                </p>
              </section>

              <section className="rounded-lg bg-white p-8 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold">Waarom Refurbished?</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-primary-600">
                      Duurzaam
                    </h3>
                    <p className="text-gray-700">
                      Door refurbished te kiezen, draag je bij aan een circulaire
                      economie en verminder je e-waste.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-primary-600">
                      Betaalbaar
                    </h3>
                    <p className="text-gray-700">
                      Krijg premium laptops tot 50% goedkoper dan nieuwprijs,
                      zonder in te leveren op kwaliteit.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-primary-600">
                      Betrouwbaar
                    </h3>
                    <p className="text-gray-700">
                      Alle laptops worden grondig getest en komen met 12 maanden
                      garantie.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-lg bg-white p-8 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold">Ons Proces</h2>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 font-bold text-white">
                      1
                    </span>
                    <div>
                      <h3 className="font-semibold">Selectie</h3>
                      <p className="text-gray-700">
                        We selecteren alleen laptops van topmerken zoals Dell, HP
                        en Lenovo.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 font-bold text-white">
                      2
                    </span>
                    <div>
                      <h3 className="font-semibold">Inspectie</h3>
                      <p className="text-gray-700">
                        Elk apparaat wordt grondig geïnspecteerd op functionaliteit
                        en cosmetische staat.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 font-bold text-white">
                      3
                    </span>
                    <div>
                      <h3 className="font-semibold">Refurbishment</h3>
                      <p className="text-gray-700">
                        We vervangen onderdelen indien nodig en reinigen elk
                        apparaat professioneel.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 font-bold text-white">
                      4
                    </span>
                    <div>
                      <h3 className="font-semibold">Testen</h3>
                      <p className="text-gray-700">
                        Uitgebreide tests zorgen ervoor dat alles perfect
                        functioneert.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 font-bold text-white">
                      5
                    </span>
                    <div>
                      <h3 className="font-semibold">Verzending</h3>
                      <p className="text-gray-700">
                        Je laptop wordt veilig verpakt en snel naar je verzonden.
                      </p>
                    </div>
                  </li>
                </ol>
              </section>

              <section className="rounded-lg bg-primary-600 p-8 text-white">
                <h2 className="mb-4 text-2xl font-bold">Onze Garantie</h2>
                <p className="text-lg">
                  Alle RefurbX laptops komen met 12 maanden volledige garantie en
                  14 dagen retourrecht. We staan achter de kwaliteit van onze
                  producten.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale as Locale} translations={translations} />
    </>
  )
}
