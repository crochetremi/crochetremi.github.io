export const projectsData = [
  {
    id: "supervision-zabbix-netbox",
    title: "Refonte de la Supervision & Automatisation (Zabbix / NetBox)",
    category: "Supervision & Automatisation",
    isoDate: "2027-01-05",
    displayDate: "05/01/2027",
    featured: true,
    image: "./assets/zabbix.png",
    imageAlt: "Logo Zabbix",
    description: "Pilotage de la migration complète de PRTG vers Zabbix 8 avec synchronisation dynamique de l'inventaire.",
    link: "./project.html?id=supervision-zabbix-netbox",
    linkLabel: "Détails sur demande",
    context: "Remplacement d'une solution PRTG par une architecture centralisée Zabbix 8 couplée à NetBox en tant que Source of Truth (SoT).",
    objectives: [
      "Assurer une transition sans perte de visibilité sur les équipements critiques (switches Aruba AOS-CX, clusters VMware ESXi, onduleurs APC/Eaton).",
      "Automatiser l'ajout et la mise à jour des hôtes dans Zabbix dès leur déclaration dans NetBox.",
      "Standardiser les templates SNMPv3, ICMP et les appels API RESTful (HPE iLO 6)."
    ],
    details: [
      "Déploiement et durcissement du serveur Zabbix et de sa base de données.",
      "Développement de scripts Python pour synchroniser dynamiquement les hôtes, interfaces, tags et groupes de configuration entre NetBox et Zabbix.",
      "Création de tableaux de bord et configuration des déclencheurs par niveau de criticité."
    ],
    tags: ["Zabbix 8", "NetBox", "Python", "SNMPv3", "API REST", "HPE iLO 6", "VMware ESXi"]
  },
  {
    id: "lab-infra-securite",
    title: "Conception d'un Laboratoire d'Infrastructure & Sécurité",
    category: "Infrastructure & Réseau",
    isoDate: "2026-07-15",
    displayDate: "15/07/2026",
    featured: true,
    image: "./assets/hochland.jpg",
    imageAlt: "Logo Hochland",
    description: "Déploiement de A à Z d'un environnement de test isolé : réseau collapsed-core Aruba...",
    link: "./project.html?id=lab-infra-securite",
    linkLabel: "Détails sur demande",
    context: "Mise en place d'une maquette représentative du réseau de production pour valider les mises à jour de firmware, la segmentation réseau et les scénarios de PRA sans risque pour la production.",
    objectives: [
      "Concevoir une topologie réseau collapsed-core sous Aruba AOS-CX.",
      "Isoler les flux d'administration, de production et de test par VLAN et ACL.",
      "Tester les procédures de bascule et de haute disponibilité."
    ],
    details: [
      "Configuration des switches Aruba AOS-CX (VLANs, agrégation LACP, Spanning Tree, routage inter-VLAN).",
      "Déploiement d'hôtes ESXi de test et intégration vCenter.",
      "Rédaction de la documentation d'architecture et des procédures d'exploitation."
    ],
    tags: ["Aruba AOS-CX", "VLAN / Routing", "VMware ESXi", "Sécurité Réseau"]
  },
  {
    id: "migration-clients-legers-leafos",
    title: "Benchmark & Migration du Parc Clients Légers vers LeafOS",
    category: "Poste de Travail & Industrie",
    isoDate: "2026-08-28",
    displayDate: "28/08/2026",
    featured: true,
    image: "./assets/leafos.png",
    imageAlt: "Logo LeafOS",
    description: "Pilotage technique de l'évaluation comparative (10ZiG vs LeafOS) en vue du remplacement de...",
    link: "./project.html?id=migration-clients-legers-leafos",
    linkLabel: "Détails sur demande",
    context: "Modernisation du parc de terminaux légers en environnement industriel et bureautique afin d'améliorer la stabilité des sessions distantes et centraliser l'administration.",
    objectives: [
      "Comparer objectivement les solutions 10ZiG et NComputing LeafOS (performances, sécurité, coût de licence, administration).",
      "Réutiliser et convertir du matériel existant de manière transparente.",
      "Standardiser les profils de connexion RDS."
    ],
    details: [
      "Réalisation d'un benchmark multicritère et validation terrain avec les équipes en production.",
      "Déploiement de la console d'administration centralisée PMC Endpoint Manager.",
      "Planification et exécution de la migration progressive par atelier."
    ],
    tags: ["LeafOS", "10ZiG", "PMC Endpoint Manager", "RDS", "Industrie"]
  },
  {
    id: "deploiement-zero-touch-pxe",
    title: "Industrialisation du Déploiement Postes (Zero-Touch PXE)",
    category: "Systèmes & Déploiement",
    isoDate: "2026-06-10",
    displayDate: "10/06/2026",
    featured: true,
    image: "./assets/windows-server.jpg",
    imageAlt: "Logo Windows Server 2022",
    description: "Mise en place des services d'infrastructure Windows Server (Active Directory, DNS, DHCP) et...",
    link: "./project.html?id=deploiement-zero-touch-pxe",
    linkLabel: "Détails sur demande",
    context: "Automatisation complète du cycle de préparation des postes de travail pour réduire le temps de masterisation et garantir un socle système homogène.",
    objectives: [
      "Mettre en place un démarrage réseau PXE fonctionnel en UEFI.",
      "Automatiser l'installation de l'OS, la jonction au domaine Active Directory et le déploiement applicatif.",
      "Éliminer les saisies manuelles des techniciens (Zero-Touch)."
    ],
    details: [
      "Configuration des rôles Windows Server 2022 (AD DS, DNS, DHCP avec options PXE/UEFI, MDT/WDS).",
      "Création des séquences de tâches, intégration des pilotes matériels et configuration des fichiers de réponses (CustomSettings.ini / Bootstrap.ini).",
      "Application automatique des GPO dès l'intégration dans l'OU cible."
    ],
    tags: ["Windows Server 2022", "PXE", "MDT / WDS", "Active Directory", "DHCP / DNS", "PowerShell"]
  }
];