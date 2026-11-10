export const projectsData = [
  {
    id: 'refonte-supervision-zabbix',
    title: 'Refonte de la Supervision & Automatisation (Zabbix / NetBox)',
    category: 'Supervision & Automatisation',
    displayDate: '05/01/2027',
    isoDate: '2027-01-05',
    featured: true,
    image: './assets/project-placeholder.svg',
    imageAlt: 'Architecture de supervision Zabbix 8 et NetBox synchronisée via nbxsync',
    description: 'Pilotage de la migration complète de PRTG vers Zabbix 8 avec synchronisation dynamique de l’inventaire NetBox via nbxsync. Définition des seuils critiques orientés production, règles d’escalade d’astreinte (Opsgenie) et création de dashboards dédiés.',
    link: '#contact',
    linkLabel: 'Détails sur demande'
  },
  {
    id: 'lab-infrastructure-aruba-vmware',
    title: 'Conception d’un Laboratoire d’Infrastructure & Sécurité',
    category: 'Infrastructure & Réseau',
    displayDate: '15/07/2026',
    isoDate: '2026-07-15',
    featured: true,
    image: './assets/project-placeholder.svg',
    imageAlt: 'Topologie réseau Aruba 3810M et cluster VMware vSphere haute disponibilité',
    description: 'Déploiement de A à Z d’un environnement de test isolé : réseau collapsed-core Aruba 3810M en stacking (VLANs, ACLs) et cluster VMware vSphere (HA, vMotion) sur baie SAN SAS. Cloisonnement par pare-feu OPNsense et authentification 802.1X (RADIUS/NPS).',
    link: '#contact',
    linkLabel: 'Détails sur demande'
  },
  {
    id: 'migration-clients-legers-leafos',
    title: 'Benchmark & Migration du Parc Clients Légers vers LeafOS',
    category: 'Poste de Travail & Industrie',
    displayDate: '28/08/2026',
    isoDate: '2026-08-28',
    featured: false,
    image: './assets/project-placeholder.svg',
    imageAlt: 'Comparatif technique et déploiement de clients légers LeafOS en environnement industriel',
    description: 'Pilotage technique de l’évaluation comparative (10ZiG vs LeafOS) en vue du remplacement de l’infrastructure Stratodesk existante. Préparation et déploiement de la nouvelle solution pour les terminaux bureautiques et les lignes de production agroalimentaires.',
    link: '#contact',
    linkLabel: 'Détails sur demande'
  },
  {
    id: 'industrialisation-masterisation-windows',
    title: 'Industrialisation du Déploiement Postes (Zero-Touch PXE)',
    category: 'Systèmes & Déploiement',
    displayDate: '10/06/2026',
    isoDate: '2026-06-10',
    featured: false,
    image: './assets/project-placeholder.svg',
    imageAlt: 'Chaîne de déploiement automatisé Windows Server via WDS, MDT et SCCM',
    description: 'Mise en place des services d’infrastructure Windows Server (Active Directory, DNS, DHCP) et automatisation de la masterisation des postes de travail via PXE (WDS, MDT et SCCM), accompagnée d’une standardisation de la sécurité du parc par GPO dans le cadre d\'une infrascture de test.',
    link: '#contact',
    linkLabel: 'Détails sur demande'
  }

  /* ==========================================================================
     COMMENT AJOUTER UN PROJET :
     Copiez-collez simplement l'objet ci-dessous après une virgule.
     Dès que la liste dépasse 4 projets, la grille bascule automatiquement
     en carrousel horizontal infini et les nouvelles catégories s'ajoutent au filtre.
     ==========================================================================
  ,
  {
    id: 'projet-5',
    title: 'Centralisation des Logs (Migration Graylog vers ELK) & Jumeau GNS3',
    category: 'Supervision & Automatisation',
    displayDate: '01/03/2027',
    isoDate: '2027-03-01',
    featured: true,
    image: './assets/project-placeholder.svg',
    imageAlt: 'Stack ELK et topologie réseau simulée sous GNS3',
    description: 'Mise en œuvre d’une stack ELK en remplacement de Graylog pour l’analyse centralisée des journaux d’événements, couplée à une simulation réseau GNS3 miroir de l’environnement de production.',
    link: '#contact',
    linkLabel: 'Détails sur demande'
  }
  */
];