export const cvData = {
  profileSummary: 'Passionné par l\'automatisation et la fiabilité des infrastructures. J\'administre des environnements virtualisés et déploie des architectures as-code pour garantir la continuité de service en production.',
  pdfUrl: './assets/cv-placeholder.pdf',
  pdfButtonLabel: 'Télécharger le CV (PDF)',

  experiences: [
    {
      period: '09/2026 — Présent',
      role: 'Alternant en Administration Systèmes et Réseaux',
      organization: 'Henri Hutin - Groupe Hochland',
      location: 'Dieue-sur-Meuse, France',
      description: 'Pilotage de la refonte globale de la supervision (migration PRTG vers Zabbix 8 couplée à NetBox/nbxsync) avec définition des seuils critiques, escalades d’astreinte et dashboards. Support N1/N2 (AD, ClearPass, Azure, GLPI/Jira) et projets d’infrastructure (migration clients légers vers LeafOS, stack ELK, simulation GNS3).'
    },
    {
      period: '07/2026 — 08/2026',
      role: 'Technicien Informatique (CDD)',
      organization: 'Henri Hutin - Groupe Hochland',
      location: 'Dieue-sur-Meuse, France',
      description: 'Maintien en condition opérationnelle des équipements bureautiques et industriels sur lignes de production (terminaux MES XTIME, sondes JRI MySirius) et déploiement SCCM. Benchmark de solutions clients légers (10ZiG vs LeafOS), maintenance réseau/Wi-Fi et échanges techniques en anglais avec les équipes internationales du groupe.'
    },
    {
      period: '02/2026 — 07/2026',
      role: 'Stagiaire en Administration Systèmes et Réseaux',
      organization: 'Henri Hutin - Groupe Hochland',
      location: 'Dieue-sur-Meuse, France',
      description: 'Conception et déploiement de A à Z d’un laboratoire d’essais isolé : architecture réseau collapsed-core (Aruba 3810M en stacking, VLANs, ACLs) et cluster VMware HA/vMotion sur stockage SAN. Implémentation des services Windows Server (AD, DNS, DHCP, déploiement PXE WDS/MDT) et sécurisation des flux via pare-feu OPNsense et 802.1X (RADIUS/NPS).'
    }
  ],

  education: [
    {
      period: '2024 — 2027',
      degree: 'BUT Informatique — Parcours DACS',
      school: 'IUT Nancy-Charlemagne (Université de Lorraine)',
      location: 'Nancy, France',
      details: 'Parcours Déploiement d’Applications Communicantes et Sécurisées (Niveau L3). Troisième année réalisée en alternance.'
    },
    {
      period: '2021 — 2024',
      degree: 'Baccalauréat Général',
      school: 'Lycée Jean-Auguste Margueritte',
      location: 'Verdun, France',
      details: 'Mention Très Bien — Section Européenne.'
    }
  ],

  skills: [
    {
      category: 'Supervision, Logs & Documentation',
      items: ['Zabbix 7 et 8', 'NetBox & nbxsync', 'PRTG', 'ELK & Graylog', 'Opsgenie', 'Confluence']
    },
    {
      category: 'Réseau & Sécurité',
      items: ['Aruba (Switching & Wi-Fi)', 'Aruba ClearPass & 802.1X (RADIUS)', 'OPNsense & Check Point', 'Cisco', 'GNS3', 'NetDisco']
    },
    {
      category: 'Systèmes, Virtualisation & Cloud',
      items: ['VMware vSphere (ESXi, vCenter, HA)', 'Windows Server & Active Directory', 'Microsoft Azure', 'Debian GNU/Linux', 'HPE & Stockage SAN']
    },
    {
      category: 'Déploiement, ITSM & Informatique Industrielle',
      items: ['SCCM, WDS & MDT', 'Clients légers (LeafOS, Stratodesk, 10ZiG)', 'GLPI, Jira ITSM & Matrix42', 'MES GFOS XTIME & JRI MySirius', 'Frigate']
    }
  ],

  languages: [
    { name: 'Français', level: 'Langue maternelle' },
    { name: 'Anglais', level: 'Professionnel (Cambridge B2 )' }
  ]
};