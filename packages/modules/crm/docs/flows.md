# Flux — Module CRM

## Flux principal : MiKL recherche un client

```mermaid
flowchart TD
    Start([MiKL accède au CRM]) --> LoadList[Charger liste clients]
    LoadList --> CheckEmpty{Liste vide ?}

    CheckEmpty -->|Oui - Aucun client| ShowEmpty[Afficher état vide + CTA]
    ShowEmpty --> CreateClient[Créer un client]

    CheckEmpty -->|Non| ShowList[Afficher DataTable avec clients]

    ShowList --> UserAction{Action utilisateur ?}

    UserAction -->|Recherche| TypeSearch[Saisir texte recherche]
    TypeSearch --> Debounce[Debounce 300ms]
    Debounce --> CheckVolume{> 500 clients ?}

    CheckVolume -->|Non| FilterClient[Filtrer côté client]
    CheckVolume -->|Oui| ServerSearch[Requête serveur FTS]

    FilterClient --> UpdateList[Mettre à jour liste]
    ServerSearch --> UpdateList

    UserAction -->|Filtres| SelectFilters[Sélectionner filtres]
    SelectFilters --> ApplyFilters[Appliquer filtres combinés]
    ApplyFilters --> UpdateList

    UserAction -->|Clic ligne| NavigateDetail[Naviguer vers fiche client]

    UpdateList --> CheckResults{Résultats ?}
    CheckResults -->|Non| ShowEmptySearch[État vide recherche]
    CheckResults -->|Oui| ShowList

    NavigateDetail --> End([Fin])
    CreateClient --> End
```

## Flux secondaire : Pagination

```mermaid
flowchart LR
    List[Liste affichée] --> Page{Page actuelle}
    Page --> Next[Clic suivant]
    Page --> Prev[Clic précédent]
    Page --> Jump[Saut direct]

    Next --> Fetch[Fetch données page N+1]
    Prev --> Fetch[Fetch données page N-1]
    Jump --> Fetch[Fetch données page X]

    Fetch --> Update[Mettre à jour DataTable]
    Update --> List
```

## Flux technique : Data fetching

```mermaid
sequenceDiagram
    participant UI as ClientList Component
    participant TQ as TanStack Query
    participant SA as Server Action
    participant SB as Supabase
    participant RLS as RLS Policies

    UI->>TQ: useQuery(['clients', operatorId])
    TQ->>SA: getClients(operatorId)
    SA->>SB: SELECT * FROM clients
    SB->>RLS: Vérifier operator_id
    RLS->>SB: Autoriser seulement clients de l'opérateur
    SB-->>SA: Données (snake_case)
    SA->>SA: Transform toCamelCase
    SA-->>TQ: {data: Client[], error: null}
    TQ-->>UI: Render DataTable
```

## Flux : Création d'un client

```mermaid
flowchart TD
    Start([MiKL clique "Créer un client"]) --> OpenDialog[Ouvrir dialog modal]
    OpenDialog --> FillForm[Remplir formulaire]
    FillForm --> Submit[Cliquer "Créer"]

    Submit --> ClientValidation{Validation client Zod ?}
    ClientValidation -->|Erreurs| ShowErrors[Afficher erreurs inline]
    ShowErrors --> FillForm

    ClientValidation -->|OK| ServerAction[Server Action createClient]
    ServerAction --> ServerValidation{Validation serveur ?}
    ServerValidation -->|Erreurs| ReturnError[Retourner { data: null, error }]

    ServerAction --> CheckEmail{Email unique ?}
    CheckEmail -->|Déjà utilisé| EmailError[Erreur EMAIL_ALREADY_EXISTS]
    EmailError --> ShowEmailError[Afficher erreur champ email]
    ShowEmailError --> FillForm

    CheckEmail -->|Unique| InsertDB[INSERT clients + client_configs]
    InsertDB --> CheckInsert{Insertion OK ?}
    CheckInsert -->|Erreur| DBError[Toast erreur DB]
    DBError --> FillForm

    CheckInsert -->|OK| InvalidateCache[Invalider cache TanStack Query]
    InvalidateCache --> Toast[Toast "Client créé avec succès"]
    Toast --> CloseDialog[Fermer dialog]
    CloseDialog --> Navigate[Router.push vers fiche client]
    Navigate --> End([Fin])
```

## Flux : Édition d'un client

```mermaid
flowchart TD
    Start([MiKL clique "Modifier"]) --> OpenDialog[Ouvrir dialog édition]
    OpenDialog --> PreFill[Pré-remplir formulaire avec données existantes]
    PreFill --> EditForm[Modifier champs]
    EditForm --> Submit[Cliquer "Enregistrer"]

    Submit --> Validation{Validation Zod ?}
    Validation -->|Erreurs| ShowErrors[Afficher erreurs inline]
    ShowErrors --> EditForm

    Validation -->|OK| ServerAction[Server Action updateClient]
    ServerAction --> CheckEmail{Email modifié et unique ?}
    CheckEmail -->|Déjà utilisé| EmailError[Erreur email]
    EmailError --> EditForm

    CheckEmail -->|OK ou non modifié| UpdateDB[UPDATE clients]
    UpdateDB --> InvalidateCache[Invalider cache liste + fiche]
    InvalidateCache --> Toast[Toast "Client mis à jour"]
    Toast --> CloseDialog[Fermer dialog]
    CloseDialog --> End([Fin])
```

## Flux : Navigation fiche client multi-onglets

```mermaid
flowchart TD
    Start([MiKL clique sur un client]) --> FetchClient[Server Component: getClient]
    FetchClient --> CheckResult{Client trouvé ?}

    CheckResult -->|Non / Erreur| NotFound[Afficher page 404]
    CheckResult -->|Oui| RenderPage[Afficher ClientDetailContent]

    RenderPage --> Header[ClientHeader: nom, badges, date, bouton Modifier]
    RenderPage --> Tabs[ClientTabs: 4 onglets]

    Tabs --> TabInfo[Informations - défaut]
    Tabs --> TabHist[Historique]
    Tabs --> TabDocs[Documents]
    Tabs --> TabExch[Échanges]

    TabInfo --> LazyInfo[useClient → Coordonnées, Config, Lab, One]
    TabHist --> LazyHist[useClientActivityLogs → Timeline]
    TabDocs --> LazyDocs[useClientDocuments → Liste docs]
    TabExch --> LazyExch[useClientExchanges → Messages récents]

    Header --> ClickEdit[Clic Modifier]
    LazyInfo --> ClickEdit
    ClickEdit --> OpenDialog[Ouvrir EditClientDialog]
    OpenDialog --> SubmitEdit[Soumettre modifications]
    SubmitEdit --> InvalidateCache[Invalider cache TanStack Query]
    InvalidateCache --> RefreshData[Rafraîchir données header + onglet Info]
    RefreshData --> RenderPage
```

```mermaid
flowchart LR
    URL[URL: ?tab=historique] --> ParseParam[Lire searchParams]
    ParseParam --> SetActive[Activer onglet correspondant]
    SetActive --> UserSwitch[MiKL change d'onglet]
    UserSwitch --> UpdateURL[router.push avec nouveau tab]
    UpdateURL --> URL
```

## Flux : Assignation parcours Lab

```mermaid
flowchart TD
    Start([MiKL clique "Assigner un parcours Lab"]) --> OpenDialog[Ouvrir AssignParcoursDialog]
    OpenDialog --> LoadTemplates[useParcoursTemplates]

    LoadTemplates --> CheckTemplates{Templates disponibles ?}
    CheckTemplates -->|Non| EmptyState[Afficher état vide + mention Epic 12]
    CheckTemplates -->|Oui| ShowTemplates[Lister templates]

    ShowTemplates --> SelectTemplate[MiKL sélectionne un template]
    SelectTemplate --> ShowStages[Afficher étapes avec toggles]
    ShowStages --> ConfigStages[MiKL active/désactive étapes]
    ConfigStages --> ClickAssign[Cliquer "Assigner"]

    ClickAssign --> ServerAction[Server Action assignParcours]
    ServerAction --> InsertParcours[INSERT parcours]
    InsertParcours --> UpdateConfig[UPDATE client_configs dashboard_type=lab]
    UpdateConfig --> LogActivity[INSERT activity_logs]
    LogActivity --> InvalidateCache[Invalider caches TanStack Query]
    InvalidateCache --> Toast[Toast "Parcours Lab assigné avec succès"]
    Toast --> CloseDialog[Fermer dialog]
    CloseDialog --> End([Fin])
```

## Flux : Toggle accès Lab/One

```mermaid
flowchart TD
    Start([MiKL toggle accès Lab ou One]) --> CheckDisable{Désactivation ?}

    CheckDisable -->|Non - activation| ExecuteToggle[Server Action toggleAccess]
    CheckDisable -->|Oui| ShowConfirm[Dialog confirmation]

    ShowConfirm --> UserDecision{MiKL confirme ?}
    UserDecision -->|Non| Cancel[Fermer dialog]
    UserDecision -->|Oui| ExecuteToggle

    ExecuteToggle --> UpdateDashboardType[UPDATE client_configs.dashboard_type]
    UpdateDashboardType --> CheckLabOff{Lab désactivé + parcours en cours ?}

    CheckLabOff -->|Oui| SuspendParcours[UPDATE parcours status=suspendu]
    CheckLabOff -->|Non| CheckLabOn{Lab activé + parcours suspendu ?}

    CheckLabOn -->|Oui| ReactivateParcours[UPDATE parcours status=en_cours]
    CheckLabOn -->|Non| LogActivity

    SuspendParcours --> LogActivity[INSERT activity_logs]
    ReactivateParcours --> LogActivity

    LogActivity --> InvalidateCache[Invalider caches TanStack Query]
    InvalidateCache --> Toast[Toast confirmation]
    Toast --> End([Fin])
```

## Notes

- La recherche utilise un debounce de 300ms pour éviter les requêtes excessives
- Le seuil de 500 clients détermine si le filtrage est client-side ou server-side
- RLS garantit l'isolation des données même si le front-end est compromis
- TanStack Query met en cache les résultats pour améliorer les performances
- Les onglets utilisent le lazy-loading : les données ne sont fetchées qu'au premier clic
- L'onglet actif est synchronisé avec l'URL query param pour le partage de liens
