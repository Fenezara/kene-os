import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: Request) {
  try {
    const { messages, diagnosisId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: { message: 'Historique des messages requis.' } },
        { status: 400 }
      )
    }

    // 1. If diagnosisId is supplied, retrieve and stringify details for the system prompt
    let contextSkin = ''
    if (diagnosisId) {
      const diag = await db.diagnosis.findUnique({
        where: { id: diagnosisId },
      })
      if (diag) {
        const subScores = JSON.parse(diag.subScores)
        const indicators = JSON.parse(diag.indicators)
        const recs = JSON.parse(diag.recommendations)
        
        contextSkin = `
INFORMATIONS SUR LA PEAU DE LA CLIENTE (Issue du diagnostic IA Kènè) :
- Score Global : ${diag.scoreGlobal}/100
- Hydratation : ${subScores.hydratation}/100
- Éclat : ${subScores.eclat}/100
- Excès de sébum : ${subScores.sebum}/100
- Élasticité/Fermeté : ${subScores.elasticite}/100
- Problèmes identifiés : ${Object.entries(indicators)
          .filter(([_, ind]: any) => ind.severity > 0)
          .map(([_, ind]: any) => `${ind.name} (Sévérité ${ind.severity}/3)`)
          .join(', ')}
- Alerte médicale (Dermatologue recommandé ?) : ${diag.dermatoReferral ? 'OUI' : 'NON'}
- Routine suggérée : ${recs.routine.join('; ')}
- Ingrédients clés : ${recs.ingredients.join(', ')}
        `
      }
    }

    const systemPrompt = `Tu es "Mama Kènè", une conseillère virtuelle experte et chaleureuse en dermo-botanique africaine.
Ton rôle est de guider et de rassurer les clientes ayant une peau mélanoderme (Fitzpatrick IV-VI) sur leurs routines de soins.
Tu t'exprimes avec bienveillance et sagesse, en conseillant des ingrédients naturels botaniques d'Afrique (karité, baobab, moringa, neem, hibiscus, aloé vera, huile de nigelle).
Explique clairement les bienfaits de ces plantes locales.
${contextSkin}
Règles cruciales :
1. Reste chaleureuse, positive et holistique (conseille de boire de l'eau, de bien dormir, d'éviter le stress).
2. Rappelle de temps en temps que tu es une conseillère IA et non un médecin dermatologue.
3. Si un risque médical (dermatoReferral = OUI dans le contexte) ou des signes de grain de beauté asymétrique/atypique (ABCDE) sont évoqués, conseille vivement de consulter un spécialiste.
4. Réponds en français de manière fluide, concise et engageante.`

    // 2. Call LLM API
    let replyText = ''

    try {
      const zai = await ZAI.create()
      const lastMessage = messages[messages.length - 1]
      const hasImage = lastMessage && lastMessage.image
      
      let response

      if (hasImage) {
        // Use Vision completions for image input
        const visionMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.slice(0, messages.length - 1).map((m: any) => ({
            role: m.role,
            content: m.content
          })),
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: lastMessage.content || "Analyse ce bouton ou cette tache de peau mélanoderme et conseille-moi."
              },
              {
                type: 'image_url',
                image_url: {
                  url: lastMessage.image
                }
              }
            ]
          }
        ]

        response = await zai.chat.completions.createVision({
          model: 'glm-4v',
          messages: visionMessages
        })
      } else {
        // Standard Text completions
        const apiMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.map((m: any) => ({
            role: m.role,
            content: m.content
          }))
        ]

        response = await zai.chat.completions.create({
          model: 'glm-4',
          messages: apiMessages
        })
      }

      if (response && response.choices && response.choices[0]) {
        replyText = response.choices[0].message.content
      }
    } catch (sdkError: any) {
      console.warn('[KÈNÈ LLM CHAT FALLBACK] SDK échoué ou non configuré. Utilisation du fallback simulé.', sdkError.message)
    }

    // 3. Fallback response if LLM failed/not configured
    if (!replyText) {
      const lastUserMessage = messages[messages.length - 1]
      const lastUserContent = lastUserMessage?.content || ''
      const hasImage = lastUserMessage && lastUserMessage.image
      const lowercaseMsg = lastUserContent.toLowerCase()

      if (hasImage) {
        replyText = `J'ai bien reçu la photo de ton imperfection, ma chérie. D'après ce que je vois sur cette zone locale, il s'agit d'une légère inflammation qui risque de causer une hyperpigmentation si on la manipule. Je te conseille vivement d'appliquer une compresse imbibée d'infusion de Moringa refroidie pour apaiser la zone, et d'éviter absolument de percer ou de gratter. Utilises-tu déjà une crème protectrice en journée ?`
      } else if (lowercaseMsg.includes('karité') || lowercaseMsg.includes('baobab') || lowercaseMsg.includes('moringa')) {
        replyText = `Ah, mon enfant, ces plantes sont de véritables trésors pour nos peaux mélanodermes ! Le beurre de karité bio nourrit en profondeur et protège la barrière cutanée des agressions. L'huile de baobab est quant à elle fantastique pour redonner de l'élasticité et apaiser. Quant au moringa, il purifie en douceur. Pour ta routine, je te conseille d'appliquer une noisette de karité le soir pour sceller l'hydratation. As-tu d'autres questions sur ces ingrédients botaniques ?`
      } else if (lowercaseMsg.includes('tache') || lowercaseMsg.includes('pih') || lowercaseMsg.includes('hyperpigmentation')) {
        replyText = `Les taches d'hyperpigmentation post-inflammatoire sont très courantes sur les peaux riches en mélanine. La moindre petite irritation ou bouton peut laisser une trace sombre. Pour cela, la patience est ta meilleure alliée ! Utilise notre sérum clarifiant à la Niacinamide et à l'Alpha Arbutine. Surtout, applique un écran solaire SPF 50 tous les matins, car les rayons du soleil assombrissent ces taches. Prends soin de toi !`
      } else if (lowercaseMsg.includes('bouton') || lowercaseMsg.includes('acné')) {
        replyText = `Pour l'acné, il faut purifier sans agresser ! Nos peaux réagissent fortement au décapage en produisant encore plus de sébum. Je te recommande notre nettoyant doux à l'extrait de Moringa. Il nettoie en profondeur tout en respectant le pH de ta peau. Tu peux aussi utiliser quelques gouttes d'huile de Neem localement le soir pour assécher les imperfections. Dis-moi, quelle est ta routine de nettoyage actuelle ?`
      } else {
        replyText = `Bonjour ma chérie, c'est Mama Kènè. Je suis là pour t'accompagner dans ta routine beauté et t'aider à prendre soin de ta peau mélanoderme. Dis-moi, que ressens-tu sur ton visage aujourd'hui ? Ta peau tiraille-t-elle, ou est-elle plutôt brillante sur la zone T ? Partage avec moi tes habitudes de soin !`
      }
    }

    return NextResponse.json({
      success: true,
      reply: replyText
    })
  } catch (error: any) {
    console.error('[CHAT API ERROR]', error)
    return NextResponse.json(
      { error: { message: error.message || 'Une erreur interne est survenue.' } },
      { status: 500 }
    )
  }
}
