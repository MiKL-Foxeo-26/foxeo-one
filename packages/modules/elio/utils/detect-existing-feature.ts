/**
 * Vérifie si un besoin exprimé correspond à un module déjà actif.
 * Story 8.8 — Task 6 (AC5)
 */

interface FeatureCheck {
  exists: boolean
  instructions?: string
}

interface FeatureMapping {
  keywords: string[]
  moduleLabel: string
  route: string
  description: string
}

const FEATURE_MAPPINGS: FeatureMapping[] = [
  {
    keywords: ['sms', 'envoi sms', 'message sms', 'texto'],
    moduleLabel: 'SMS',
    route: '/modules/sms',
    description: 'envoyer des SMS groupés à vos contacts',
  },
  {
    keywords: ['calendrier', 'événement', 'agenda', 'réservation', 'rdv', 'rendez-vous', 'planning'],
    moduleLabel: 'Agenda',
    route: '/modules/agenda',
    description: 'gérer vos événements, réservations et planification',
  },
  {
    keywords: ['export', 'télécharger', 'exporter', 'excel', 'csv'],
    moduleLabel: 'Documents',
    route: '/modules/documents',
    description: 'exporter vos documents en différents formats',
  },
  {
    keywords: ['membre', 'adhérent', 'équipe', 'association'],
    moduleLabel: 'Membres',
    route: '/modules/membres',
    description: 'gérer vos membres, adhérents et équipes',
  },
  {
    keywords: ['présence', 'émargement', 'feuille de présence', 'cours', 'formation'],
    moduleLabel: 'Présences',
    route: '/modules/presences',
    description: 'gérer vos feuilles d\'émargement',
  },
  {
    keywords: ['facture', 'devis', 'facturation', 'paiement'],
    moduleLabel: 'Facturation',
    route: '/modules/facturation',
    description: 'gérer vos factures, devis et paiements',
  },
]

export function checkIfFeatureExists(
  request: string,
  activeModulesDoc: string
): FeatureCheck {
  if (!request || !activeModulesDoc) {
    return { exists: false }
  }

  const lowerRequest = request.toLowerCase()
  const lowerDoc = activeModulesDoc.toLowerCase()

  for (const mapping of FEATURE_MAPPINGS) {
    const requestMatch = mapping.keywords.some((k) => lowerRequest.includes(k))
    if (!requestMatch) continue

    // Vérifier que le module est dans la documentation des modules actifs
    const docMatch =
      lowerDoc.includes(mapping.moduleLabel.toLowerCase()) ||
      mapping.keywords.some((k) => lowerDoc.includes(k))

    if (docMatch) {
      return {
        exists: true,
        instructions: `Cette fonctionnalité existe déjà ! Rendez-vous dans "${mapping.moduleLabel}" (${mapping.route}) pour ${mapping.description}.`,
      }
    }
  }

  return { exists: false }
}
