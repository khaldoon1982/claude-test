import { Metadata } from 'next/metadata'
import { Locale } from '@/lib/i18n/config'
import { getTranslations } from '@/lib/i18n/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen (FAQ) | RefurbX',
  description: 'Antwoorden op veelgestelde vragen over RefurbX',
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const translations = await getTranslations(locale as Locale)

  const faqs = [
    {
      category: 'Bestellen & Levering',
      questions: [
        {
          q: 'Hoe snel wordt mijn bestelling geleverd?',
          a: 'Standaard verzending duurt 3-5 werkdagen. Express verzending 1-2 werkdagen. Bestellingen voor 15:00 worden dezelfde dag verstuurd.',
        },
        {
          q: 'Wat zijn de verzendkosten?',
          a: 'Standaard verzending kost €5,95. Express verzending €9,95. Gratis verzending bij bestellingen vanaf €75.',
        },
        {
          q: 'Kan ik mijn bestelling volgen?',
          a: 'Ja, zodra je bestelling verzonden is ontvang je een Track & Trace code per email.',
        },
      ],
    },
    {
      category: 'Producten & Garantie',
      questions: [
        {
          q: 'Wat betekent "refurbished"?',
          a: 'Refurbished betekent dat het apparaat professioneel is getest, gereinigd en waar nodig gerepareerd. Het werkt als nieuw maar heeft mogelijk lichte cosmetische gebruikssporen.',
        },
        {
          q: 'Welke garantie krijg ik?',
          a: 'Alle RefurbX laptops komen met 12 maanden volledige garantie. Ook heb je 14 dagen retourrecht.',
        },
        {
          q: 'Wat betekenen de verschillende grades?',
          a: 'Grade A = als nieuw, Grade A- = zeer lichte gebruikssporen, Grade B+ = lichte gebruikssporen, Grade B = normaal gebruik, Grade C = duidelijke gebruikssporen.',
        },
      ],
    },
    {
      category: 'Betalen & Retourneren',
      questions: [
        {
          q: 'Welke betaalmethoden accepteren jullie?',
          a: 'We accepteren iDEAL, creditcard (Visa, Mastercard) en andere veelgebruikte betaalmethoden via Mollie.',
        },
        {
          q: 'Kan ik mijn bestelling retourneren?',
          a: 'Ja, je hebt 14 dagen bedenktijd. Het product moet onbeschadigd en compleet zijn. Retourkosten zijn voor eigen rekening.',
        },
        {
          q: 'Hoe lang duurt een terugbetaling?',
          a: 'Zodra we je retour ontvangen en goedkeuren, ontvang je binnen 5-7 werkdagen je geld terug.',
        },
      ],
    },
    {
      category: 'Account & Privacy',
      questions: [
        {
          q: 'Moet ik een account aanmaken om te bestellen?',
          a: 'Nee, je kunt ook als gast bestellen. Met een account kun je wel je bestellingen makkelijk volgen en adressen opslaan.',
        },
        {
          q: 'Hoe gaan jullie om met mijn gegevens?',
          a: 'We behandelen je gegevens vertrouwelijk volgens de AVG. Lees ons privacybeleid voor meer informatie.',
        },
        {
          q: 'Kan ik me uitschrijven voor de nieuwsbrief?',
          a: 'Ja, onderaan elke nieuwsbrief staat een afmeldlink. Je kunt je ook uitschrijven via je account instellingen.',
        },
      ],
    },
  ]

  return (
    <>
      <Header locale={locale as Locale} translations={translations} />

      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 text-5xl font-bold">Veelgestelde Vragen</h1>
            <p className="mb-12 text-xl text-gray-600">
              Vind snel antwoord op je vraag. Staat je vraag er niet bij? Neem
              gerust contact met ons op.
            </p>

            <div className="space-y-8">
              {faqs.map((category, idx) => (
                <section key={idx} className="rounded-lg bg-white p-8 shadow-sm">
                  <h2 className="mb-6 text-2xl font-bold text-primary-600">
                    {category.category}
                  </h2>

                  <div className="space-y-6">
                    {category.questions.map((item, qIdx) => (
                      <div key={qIdx} className="border-b border-gray-200 pb-6 last:border-0">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">
                          {item.q}
                        </h3>
                        <p className="text-gray-700">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-lg bg-primary-600 p-8 text-center text-white">
              <h2 className="mb-4 text-2xl font-bold">
                Niet gevonden wat je zocht?
              </h2>
              <p className="mb-6 text-lg">
                Ons klantenservice team helpt je graag verder!
              </p>
              <a
                href={`/${locale}/contact`}
                className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-primary-600 hover:bg-gray-100"
              >
                Neem contact op
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale as Locale} translations={translations} />
    </>
  )
}
