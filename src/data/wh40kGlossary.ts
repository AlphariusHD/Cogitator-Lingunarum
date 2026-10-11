import { GlossaryTerm } from '../types/wh40k';

export const OFFICIAL_WH40K_GLOSSARY: GlossaryTerm[] = [
  // Formacje i Frakcje
  {
    id: 'f-1',
    englishTerm: 'Space Marines',
    polishTerm: 'Kosmiczni Marines',
    category: 'Formacje i Frakcje',
    notes: 'Wersja oficjalna PL. W żargonie dopuszcza się także Astartes.',
    exampleContext: 'The Space Marines advanced through the breach.',
    declension: {
      mianownik: 'Kosmiczni Marines',
      dopelniacz: 'Kosmicznych Marines',
      celownik: 'Kosmicznym Marines',
      biernik: 'Kosmicznych Marines',
      narzednik: 'Kosmicznymi Marines',
      miejscownik: 'Kosmicznych Marines',
      wolacz: 'Kosmiczni Marines',
      mnoga: 'Kosmiczni Marines',
    }
  },
  {
    id: 'f-2',
    englishTerm: 'Adeptus Astartes',
    polishTerm: 'Adeptus Astartes',
    category: 'Formacje i Frakcje',
    notes: 'Wysoki Gotyk (High Gothic) – pozostawia się w oryginale bez odmiany.',
    keepOriginal: true,
    declension: {
      mianownik: 'Adeptus Astartes',
      dopelniacz: 'Adeptus Astartes',
      celownik: 'Adeptus Astartes',
      biernik: 'Adeptus Astartes',
      narzednik: 'Adeptus Astartes',
      miejscownik: 'Adeptus Astartes',
    }
  },
  {
    id: 'f-3',
    englishTerm: 'Imperial Guard',
    polishTerm: 'Gwardia Imperialna',
    category: 'Formacje i Frakcje',
    notes: 'Potoczna / historyczna nazwa Astra Militarum w polskim kanonie.',
    declension: {
      mianownik: 'Gwardia Imperialna',
      dopelniacz: 'Gwardii Imperialnej',
      celownik: 'Gwardii Imperialnej',
      biernik: 'Gwardię Imperialną',
      narzednik: 'Gwardią Imperialną',
      miejscownik: 'Gwardii Imperialnej',
    }
  },
  {
    id: 'f-4',
    englishTerm: 'Astra Militarum',
    polishTerm: 'Astra Militarum',
    category: 'Formacje i Frakcje',
    notes: 'Oficjalna nazwa w Wysokim Gotyku.',
    keepOriginal: true
  },
  {
    id: 'f-5',
    englishTerm: 'Sisters of Battle',
    polishTerm: 'Siostry Bitwy',
    category: 'Formacje i Frakcje',
    notes: 'Ramię zbrojne Eklezjarchii, Adepta Sororitas.',
    declension: {
      mianownik: 'Siostry Bitwy',
      dopelniacz: 'Sióstr Bitwy',
      celownik: 'Siostrom Bitwy',
      biernik: 'Siostry Bitwy',
      narzednik: 'Siostrami Bitwy',
      miejscownik: 'Siostrach Bitwy',
    }
  },
  {
    id: 'f-6',
    englishTerm: 'Adepta Sororitas',
    polishTerm: 'Adepta Sororitas',
    category: 'Formacje i Frakcje',
    notes: 'Zachowuje się w oryginale (Wysoki Gotyk).',
    keepOriginal: true
  },
  {
    id: 'f-7',
    englishTerm: 'Inquisition',
    polishTerm: 'Inkwizycja',
    category: 'Formacje i Frakcje',
    notes: 'Święte Oficjum Imperatora.',
    declension: {
      mianownik: 'Inkwizycja',
      dopelniacz: 'Inkwizycji',
      celownik: 'Inkwizycji',
      biernik: 'Inkwizycję',
      narzednik: 'Inkwizycją',
      miejscownik: 'Inkwizycji',
    }
  },
  {
    id: 'f-8',
    englishTerm: 'Adeptus Mechanicus',
    polishTerm: 'Adeptus Mechanicus',
    category: 'Formacje i Frakcje',
    notes: 'Kapłaństwo Marsa, czciciele Boga-Maszyny.',
    keepOriginal: true
  },
  {
    id: 'f-9',
    englishTerm: 'Chaos Space Marines',
    polishTerm: 'Kosmiczni Marines Chaosu',
    category: 'Formacje i Frakcje',
    declension: {
      mianownik: 'Kosmiczni Marines Chaosu',
      dopelniacz: 'Kosmicznych Marines Chaosu',
      celownik: 'Kosmicznym Marines Chaosu',
      biernik: 'Kosmicznych Marines Chaosu',
      narzednik: 'Kosmicznymi Marines Chaosu',
      miejscownik: 'Kosmicznych Marines Chaosu',
    }
  },
  {
    id: 'f-luna-wolves',
    englishTerm: 'Luna Wolves',
    polishTerm: 'Wilki Luny',
    category: 'Formacje i Frakcje',
    notes: 'XVI Legion Kosmicznych Marines pod wodzą Horusa. Kanoniczne tłumaczenie PL: Wilki Luny.',
    declension: {
      mianownik: 'Wilki Luny',
      dopelniacz: 'Wilków Luny',
      celownik: 'Wilkom Luny',
      biernik: 'Wilki Luny',
      narzednik: 'Wilkami Luny',
      miejscownik: 'Wilkach Luny',
      wolacz: 'Wilki Luny',
      mnoga: 'Wilki Luny',
    }
  },
  {
    id: 'f-sons-of-horus',
    englishTerm: 'Sons of Horus',
    polishTerm: 'Synowie Horusa',
    category: 'Formacje i Frakcje',
    notes: 'XVI Legion po przemianowaniu na cześć Mistrza Wojny Horusa.',
    declension: {
      mianownik: 'Synowie Horusa',
      dopelniacz: 'Synów Horusa',
      celownik: 'Synom Horusa',
      biernik: 'Synów Horusa',
      narzednik: 'Synami Horusa',
      miejscownik: 'Synach Horusa',
      wolacz: 'Synowie Horusa',
      mnoga: 'Synowie Horusa',
    }
  },
  {
    id: 'f-mournival',
    englishTerm: 'Mournival',
    polishTerm: 'Mournival',
    category: 'Formacje i Frakcje',
    notes: 'Elitarny krąg czterech doradców Mistrza Wojny (Loken, Torgaddon, Aximand, Abaddon).',
    declension: {
      mianownik: 'Mournival',
      dopelniacz: 'Mournivalu',
      celownik: 'Mournivalowi',
      biernik: 'Mournival',
      narzednik: 'Mournivalem',
      miejscownik: 'Mournivalu',
    }
  },
  {
    id: 'f-10',
    englishTerm: 'Tyranids',
    polishTerm: 'Tyranidzi',
    category: 'Formacje i Frakcje',
    notes: 'Rój pozagalaktycznych drapieżników.',
    declension: {
      mianownik: 'Tyranidzi',
      dopelniacz: 'Tyranidów',
      celownik: 'Tyranidom',
      biernik: 'Tyranidów',
      narzednik: 'Tyranidami',
      miejscownik: 'Tyranidach',
    }
  },
  {
    id: 'f-11',
    englishTerm: 'Hive Fleet',
    polishTerm: 'Flota-Rój',
    category: 'Formacje i Frakcje',
    notes: 'Np. Flota-Rój Lewiatan, Flota-Rój Behemot.',
    declension: {
      mianownik: 'Flota-Rój',
      dopelniacz: 'Floty-Roju',
      celownik: 'Flocie-Rojowi',
      biernik: 'Flotę-Rój',
      narzednik: 'Flotą-Rojem',
      miejscownik: 'Flocie-Roju',
    }
  },
  {
    id: 'f-12',
    englishTerm: 'Genestealer',
    polishTerm: 'Genokrad',
    category: 'Formacje i Frakcje',
    notes: 'W starszym kanonie także Genuokrad.',
    declension: {
      mianownik: 'Genokrad',
      dopelniacz: 'Genokrada',
      celownik: 'Genokradowi',
      biernik: 'Genokrada',
      narzednik: 'Genokradem',
      miejscownik: 'Genokradzie',
      mnoga: 'Genokrady / Genokradzi',
    }
  },
  {
    id: 'f-13',
    englishTerm: 'Eldar / Aeldari',
    polishTerm: 'Eldarzy / Aeldari',
    category: 'Formacje i Frakcje',
    notes: 'Starożytna rasa, mieszkańcy światostatków.',
    declension: {
      mianownik: 'Eldarzy',
      dopelniacz: 'Eldarów',
      celownik: 'Eldarom',
      biernik: 'Eldarów',
      narzednik: 'Eldarami',
      miejscownik: 'Eldarach',
    }
  },
  {
    id: 'f-14',
    englishTerm: 'Dark Eldar / Drukhari',
    polishTerm: 'Mroczni Eldarzy / Drukari',
    category: 'Formacje i Frakcje',
    notes: 'Mieszkańcy Commorragh.'
  },
  {
    id: 'f-15',
    englishTerm: 'Necrons',
    polishTerm: 'Nekroni',
    category: 'Formacje i Frakcje',
    notes: 'Mechaniczne istoty z żywego metalu.',
    declension: {
      mianownik: 'Nekroni',
      dopelniacz: 'Nekronów',
      celownik: 'Nekronom',
      biernik: 'Nekronów',
      narzednik: 'Nekronami',
      miejscownik: 'Nekronach',
    }
  },
  {
    id: 'f-16',
    englishTerm: 'Orks',
    polishTerm: 'Orkowie',
    category: 'Formacje i Frakcje',
    notes: 'W narracji Black Library po polsku: Orkowie.',
    declension: {
      mianownik: 'Orkowie',
      dopelniacz: 'Orków',
      celownik: 'Orkom',
      biernik: 'Orków',
      narzednik: 'Orkami',
      miejscownik: 'Orkach',
    }
  },

  // Stopnie i Tytuły
  {
    id: 't-1',
    englishTerm: 'Chapter Master',
    polishTerm: 'Mistrz Zakonu',
    category: 'Stopnie i Tytuły',
    notes: 'Najwyższy dowódca Zakonu Astartes.',
    declension: {
      mianownik: 'Mistrz Zakonu',
      dopelniacz: 'Mistrza Zakonu',
      celownik: 'Mistrzowi Zakonu',
      biernik: 'Mistrza Zakonu',
      narzednik: 'Mistrzem Zakonu',
      miejscownik: 'Mistrzu Zakonu',
      wolacz: 'Mistrzu Zakonu',
      mnoga: 'Mistrzowie Zakonów',
    }
  },
  {
    id: 't-2',
    englishTerm: 'Company Commander / Captain',
    polishTerm: 'Kapitan Kompanii',
    category: 'Stopnie i Tytuły',
    notes: 'Dowódca kompanii.',
    declension: {
      mianownik: 'Kapitan Kompanii',
      dopelniacz: 'Kapitana Kompanii',
      celownik: 'Kapitanowi Kompanii',
      biernik: 'Kapitana Kompanii',
      narzednik: 'Kapitanem Kompanii',
      miejscownik: 'Kapitanie Kompanii',
      mnoga: 'Kapitanowie Kompanii',
    }
  },
  {
    id: 't-first-captain',
    englishTerm: 'First Captain',
    polishTerm: 'Pierwszy Kapitan',
    category: 'Stopnie i Tytuły',
    notes: 'Dowódca 1. Kompanii Legionu/Zakonu (np. First Captain Ezekyle Abaddon, First Captain Sigismund).',
    declension: {
      mianownik: 'Pierwszy Kapitan',
      dopelniacz: 'Pierwszego Kapitana',
      celownik: 'Pierwszemu Kapitanowi',
      biernik: 'Pierwszego Kapitana',
      narzednik: 'Pierwszym Kapitanem',
      miejscownik: 'Pierwszym Kapitanie',
      wolacz: 'Pierwszy Kapitanie',
      mnoga: 'Pierwsi Kapitanowie',
    }
  },
  {
    id: 't-3',
    englishTerm: 'Librarian',
    polishTerm: 'Kronikarz',
    category: 'Stopnie i Tytuły',
    notes: 'Psionik Astartes (NIE "bibliotekarz"!). Kluczowy błąd automatycznych translatorów.',
    declension: {
      mianownik: 'Kronikarz',
      dopelniacz: 'Kronikarza',
      celownik: 'Kronikarzowi',
      biernik: 'Kronikarza',
      narzednik: 'Kronikarzem',
      miejscownik: 'Kronikarzu',
      wolacz: 'Kronikarzu',
      mnoga: 'Kronikarze / Kronikarzy',
    }
  },
  {
    id: 't-4',
    englishTerm: 'Epistolary',
    polishTerm: 'Epistolary',
    category: 'Stopnie i Tytuły',
    notes: 'Wysoki stopień w hierarchii Kronikarzy Astartes.'
  },
  {
    id: 't-5',
    englishTerm: 'Chaplain',
    polishTerm: 'Kapelan',
    category: 'Stopnie i Tytuły',
    notes: 'Duchowy przewodnik Zakonu, strażnik litanii.',
    declension: {
      mianownik: 'Kapelan',
      dopelniacz: 'Kapelana',
      celownik: 'Kapelanowi',
      biernik: 'Kapelana',
      narzednik: 'Kapelanem',
      miejscownik: 'Kapelanie',
      wolacz: 'Kapelanie',
      mnoga: 'Kapelani / Kapelanów',
    }
  },
  {
    id: 't-6',
    englishTerm: 'Apothecary',
    polishTerm: 'Aptekarz',
    category: 'Stopnie i Tytuły',
    notes: 'Oficer medyczny Astartes, pobierający ziarno genowe.',
    declension: {
      mianownik: 'Aptekarz',
      dopelniacz: 'Aptekarza',
      celownik: 'Aptekarzowi',
      biernik: 'Aptekarza',
      narzednik: 'Aptekarzem',
      miejscownik: 'Aptekarzu',
      wolacz: 'Aptekarzu',
      mnoga: 'Aptekarze / Aptekarzy',
    }
  },
  {
    id: 't-7',
    englishTerm: 'Techmarine',
    polishTerm: 'Techmarine',
    category: 'Stopnie i Tytuły',
    notes: 'Kosmiczny Marine wtajemniczony w arkana Marsa.'
  },
  {
    id: 't-8',
    englishTerm: 'Primarch',
    polishTerm: 'Prymarcha',
    category: 'Stopnie i Tytuły',
    notes: 'Jeden z dwudziestu synów Imperatora.',
    declension: {
      mianownik: 'Prymarcha',
      dopelniacz: 'Prymarchy',
      celownik: 'Prymarsze',
      biernik: 'Prymarchę',
      narzednik: 'Prymarchą',
      miejscownik: 'Prymarsze',
      wolacz: 'Prymarcho',
      mnoga: 'Prymasi / Prymarchowie',
    }
  },
  {
    id: 't-9',
    englishTerm: 'Warmaster',
    polishTerm: 'Mistrz Wojny',
    category: 'Stopnie i Tytuły',
    notes: 'Tytuł Horusa przed Herezją.',
    declension: {
      mianownik: 'Mistrz Wojny',
      dopelniacz: 'Mistrza Wojny',
      celownik: 'Mistrzowi Wojny',
      biernik: 'Mistrza Wojny',
      narzednik: 'Mistrzem Wojny',
      miejscownik: 'Mistrzu Wojny',
      wolacz: 'Mistrzu Wojny',
      mnoga: 'Mistrzowie Wojny',
    }
  },
  {
    id: 't-10',
    englishTerm: 'Commissar',
    polishTerm: 'Komisarz',
    category: 'Stopnie i Tytuły',
    notes: 'Oficer polityczny i dyscyplinarny Astra Militarum.',
    declension: {
      mianownik: 'Komisarz',
      dopelniacz: 'Komisarza',
      celownik: 'Komisarzowi',
      biernik: 'Komisarza',
      narzednik: 'Komisarzem',
      miejscownik: 'Komisarzu',
      wolacz: 'Komisarzu',
      mnoga: 'Komisarze / Komisarzy',
    }
  },
  {
    id: 't-11',
    englishTerm: 'Lord Commander',
    polishTerm: 'Lord Dowódca',
    category: 'Stopnie i Tytuły',
    notes: 'Wysoki rangą dowódca imperialny.'
  },
  {
    id: 't-12',
    englishTerm: 'Tech-Priest',
    polishTerm: 'Techkapłan',
    category: 'Stopnie i Tytuły',
    notes: 'Kapłan Kultu Mechanicus.',
    declension: {
      mianownik: 'Techkapłan',
      dopelniacz: 'Techkapłana',
      celownik: 'Techkapłanowi',
      biernik: 'Techkapłana',
      narzednik: 'Techkapłanem',
      miejscownik: 'Techkapłanie',
      mnoga: 'Techkapłani / Techkapłanów',
    }
  },
  {
    id: 't-13',
    englishTerm: 'Magos',
    polishTerm: 'Magos',
    category: 'Stopnie i Tytuły',
    notes: 'Wysoki rangą uczony/kapłan Adeptus Mechanicus.'
  },
  {
    id: 't-14',
    englishTerm: 'Servitor',
    polishTerm: 'Serwitor',
    category: 'Stopnie i Tytuły',
    notes: 'Lobotomizowany cyborg roboczy.',
    declension: {
      mianownik: 'Serwitor',
      dopelniacz: 'Serwitora',
      celownik: 'Serwitorowi',
      biernik: 'Serwitora',
      narzednik: 'Serwitorem',
      miejscownik: 'Serwitorze',
      mnoga: 'Serwitorzy / Serwitorów',
    }
  },
  {
    id: 't-15',
    englishTerm: 'Inquisitor',
    polishTerm: 'Inkwizytor',
    category: 'Stopnie i Tytuły',
    notes: 'Przedstawiciel Świętego Oficjum.',
    declension: {
      mianownik: 'Inkwizytor',
      dopelniacz: 'Inkwizytora',
      celownik: 'Inkwizytorowi',
      biernik: 'Inkwizytora',
      narzednik: 'Inkwizytorem',
      miejscownik: 'Inkwizytorze',
      wolacz: 'Inkwizytorze',
      mnoga: 'Inkwizytorzy / Inkwizytorów',
    }
  },
  {
    id: 't-16',
    englishTerm: 'Battle-brother',
    polishTerm: 'Brat bitewny',
    category: 'Stopnie i Tytuły',
    notes: 'Forma zwracania się między Kosmicznymi Marines.',
    declension: {
      mianownik: 'Brat bitewny',
      dopelniacz: 'Brata bitewnego',
      celownik: 'Bratu bitewnemu',
      biernik: 'Brata bitewnego',
      narzednik: 'Bratem bitewnym',
      miejscownik: 'Bracie bitewnym',
      wolacz: 'Bracie bitewny',
      mnoga: 'Bracia bitewni',
    }
  },
  {
    id: 't-17',
    englishTerm: 'Rogue Trader',
    polishTerm: 'Wolny Handlarz',
    category: 'Stopnie i Tytuły',
    notes: 'Posiadacz Listu Kaperskiego Imperatora.',
    declension: {
      mianownik: 'Wolny Handlarz',
      dopelniacz: 'Wolnego Handlarza',
      celownik: 'Wolnemu Handlarzowi',
      biernik: 'Wolnego Handlarza',
      narzednik: 'Wolnym Handlarzem',
      miejscownik: 'Wolnym Handlarzu',
      mnoga: 'Wolni Handlarze',
    }
  },

  // Broń i Ekwipunek
  {
    id: 'w-1',
    englishTerm: 'Bolter',
    polishTerm: 'Bolter',
    category: 'Broń i Ekwipunek',
    notes: 'Karabin wystrzeliwujący samobieżne pociski kalibru .75.',
    keepOriginal: true,
    declension: {
      mianownik: 'Bolter',
      dopelniacz: 'Boltera',
      celownik: 'Bolterowi',
      biernik: 'Bolter',
      narzednik: 'Bolterem',
      miejscownik: 'Bolterze',
      mnoga: 'Boltery / Bolterów',
    }
  },
  {
    id: 'w-2',
    englishTerm: 'Boltgun',
    polishTerm: 'Karabin bolterowy',
    category: 'Broń i Ekwipunek',
    notes: 'Standardowa broń Kosmicznych Marines.',
    declension: {
      mianownik: 'Karabin bolterowy',
      dopelniacz: 'Karabinu bolterowego',
      celownik: 'Karabinowi bolterowemu',
      biernik: 'Karabin bolterowy',
      narzednik: 'Karabinem bolterowym',
      miejscownik: 'Karabinie bolterowym',
      mnoga: 'Karabiny bolterowe',
    }
  },
  {
    id: 'w-3',
    englishTerm: 'Bolt pistol',
    polishTerm: 'Pistolet bolterowy',
    category: 'Broń i Ekwipunek',
    notes: 'Boczna broń oficerów i szturmowców.',
    declension: {
      mianownik: 'Pistolet bolterowy',
      dopelniacz: 'Pistoletu bolterowego',
      celownik: 'Pistoletowi bolterowemu',
      biernik: 'Pistolet bolterowy',
      narzednik: 'Pistoletem bolterowym',
      miejscownik: 'Pistoletu bolterowym',
      mnoga: 'Pistolety bolterowe',
    }
  },
  {
    id: 'w-4',
    englishTerm: 'Heavy Bolter',
    polishTerm: 'Ciężki bolter',
    category: 'Broń i Ekwipunek',
    notes: 'Ciężka broń wsparcia.',
    declension: {
      mianownik: 'Ciężki bolter',
      dopelniacz: 'Ciężkiego boltera',
      celownik: 'Ciężkiemu bolterowi',
      biernik: 'Ciężki bolter',
      narzednik: 'Ciężkim bolterem',
      miejscownik: 'Ciężkim bolterze',
      mnoga: 'Ciężkie boltery',
    }
  },
  {
    id: 'w-5',
    englishTerm: 'Storm Bolter',
    polishTerm: 'Bolter szturmowy',
    category: 'Broń i Ekwipunek',
    notes: 'Dwulufowy karabin bolterowy (często w pancerzach Terminator).'
  },
  {
    id: 'w-6',
    englishTerm: 'Chainsword',
    polishTerm: 'Miecz łańcuchowy',
    category: 'Broń i Ekwipunek',
    notes: 'Kultowy oręż z napędzanym ostrzem zębatym.',
    declension: {
      mianownik: 'Miecz łańcuchowy',
      dopelniacz: 'Miecza łańcuchowego',
      celownik: 'Mieczowi łańcuchowemu',
      biernik: 'Miecz łańcuchowy',
      narzednik: 'Mieczem łańcuchowym',
      miejscownik: 'Mieczu łańcuchowym',
      mnoga: 'Miecze łańcuchowe',
    }
  },
  {
    id: 'w-7',
    englishTerm: 'Chainaxe',
    polishTerm: 'Topór łańcuchowy',
    category: 'Broń i Ekwipunek',
    notes: 'Ulubiona broń berserkerów Khorne’a.',
    declension: {
      mianownik: 'Topór łańcuchowy',
      dopelniacz: 'Topora łańcuchowego',
      celownik: 'Toporowi łańcuchowemu',
      biernik: 'Topór łańcuchowy',
      narzednik: 'Toporem łańcuchowym',
      miejscownik: 'Toporze łańcuchowym',
      mnoga: 'Topory łańcuchowe',
    }
  },
  {
    id: 'w-8',
    englishTerm: 'Power Sword',
    polishTerm: 'Miecz energetyczny',
    category: 'Broń i Ekwipunek',
    notes: 'Ostrze otoczone polem rozszczepiającym materię.',
    declension: {
      mianownik: 'Miecz energetyczny',
      dopelniacz: 'Miecza energetycznego',
      celownik: 'Mieczowi energetycznemu',
      biernik: 'Miecz energetyczny',
      narzednik: 'Mieczem energetycznym',
      miejscownik: 'Mieczu energetycznym',
      mnoga: 'Miecze energetyczne',
    }
  },
  {
    id: 'w-9',
    englishTerm: 'Power Axe',
    polishTerm: 'Topór energetyczny',
    category: 'Broń i Ekwipunek',
    notes: 'Broń do walki wręcz z polem energetycznym.',
    declension: {
      mianownik: 'Topór energetyczny',
      dopelniacz: 'Topora energetycznego',
      celownik: 'Toporowi energetycznemu',
      biernik: 'Topór energetyczny',
      narzednik: 'Toporem energetycznym',
      miejscownik: 'Toporze energetycznym',
      mnoga: 'Topory energetyczne',
    }
  },
  {
    id: 'w-10',
    englishTerm: 'Power Fist',
    polishTerm: 'Pięść energetyczna',
    category: 'Broń i Ekwipunek',
    notes: 'Pancerna rękawica o niszczycielskiej sile.',
    declension: {
      mianownik: 'Pięść energetyczna',
      dopelniacz: 'Pięści energetycznej',
      celownik: 'Pięści energetycznej',
      biernik: 'Pięść energetyczną',
      narzednik: 'Pięścią energetyczną',
      miejscownik: 'Pięści energetycznej',
      mnoga: 'Pięści energetyczne',
    }
  },
  {
    id: 'w-11',
    englishTerm: 'Thunder Hammer',
    polishTerm: 'Młot gromu',
    category: 'Broń i Ekwipunek',
    notes: 'Ciężki młot wyzwalający falę uderzeniową.',
    declension: {
      mianownik: 'Młot gromu',
      dopelniacz: 'Młota gromu',
      celownik: 'Młotowi gromu',
      biernik: 'Młot gromu',
      narzednik: 'Młotem gromu',
      miejscownik: 'Młocie gromu',
      mnoga: 'Młoty gromu',
    }
  },
  {
    id: 'w-12',
    englishTerm: 'Lasgun',
    polishTerm: 'Karabin laserowy',
    category: 'Broń i Ekwipunek',
    notes: 'Standardowa broń piechoty Astra Militarum.',
    declension: {
      mianownik: 'Karabin laserowy',
      dopelniacz: 'Karabinu laserowego',
      celownik: 'Karabinowi laserowemu',
      biernik: 'Karabin laserowy',
      narzednik: 'Karabinem laserowym',
      miejscownik: 'Karabinie laserowym',
      mnoga: 'Karabiny laserowe',
    }
  },
  {
    id: 'w-13',
    englishTerm: 'Lascannon',
    polishTerm: 'Działo laserowe',
    category: 'Broń i Ekwipunek',
    notes: 'Ciężka broń przeciwpancerna.',
    declension: {
      mianownik: 'Działo laserowe',
      dopelniacz: 'Działa laserowego',
      celownik: 'Działu laserowemu',
      biernik: 'Działo laserowe',
      narzednik: 'Działem laserowym',
      miejscownik: 'Dziale laserowym',
      mnoga: 'Działa laserowe',
    }
  },
  {
    id: 'w-14',
    englishTerm: 'Plasma Gun',
    polishTerm: 'Karabin plazmowy',
    category: 'Broń i Ekwipunek',
    notes: 'Broń miotająca przegrzaną plazmę, ryzyko przegrzania.'
  },
  {
    id: 'w-15',
    englishTerm: 'Meltagun',
    polishTerm: 'Karabin termiczny',
    category: 'Broń i Ekwipunek',
    notes: 'Broń do niszczenia pancerzy z bliska promieniowaniem mikrofalowym.'
  },
  {
    id: 'w-16',
    englishTerm: 'Flamer',
    polishTerm: 'Miotacz ognia',
    category: 'Broń i Ekwipunek',
    notes: 'Broń zasilana prometium.',
    declension: {
      mianownik: 'Miotacz ognia',
      dopelniacz: 'Miotacza ognia',
      celownik: 'Miotaczowi ognia',
      biernik: 'Miotacz ognia',
      narzednik: 'Miotaczem ognia',
      miejscownik: 'Miotaczu ognia',
      mnoga: 'Miotacze ognia',
    }
  },
  {
    id: 'w-17',
    englishTerm: 'Power Armour',
    polishTerm: 'Pancerz wspomagany',
    category: 'Broń i Ekwipunek',
    notes: 'Zasilany pancerz z ceramitu i włókien mięśniowych.',
    declension: {
      mianownik: 'Pancerz wspomagany',
      dopelniacz: 'Pancerza wspomaganego',
      celownik: 'Pancerzowi wspomaganemu',
      biernik: 'Pancerz wspomagany',
      narzednik: 'Pancerzem wspomaganym',
      miejscownik: 'Pancerzu wspomaganym',
      mnoga: 'Pancerze wspomagane',
    }
  },
  {
    id: 'w-18',
    englishTerm: 'Terminator Armour',
    polishTerm: 'Pancerz Terminatorski',
    category: 'Broń i Ekwipunek',
    notes: 'Taktyczny Pancerz Bojowy (Tactical Dreadnought Armour).',
    declension: {
      mianownik: 'Pancerz Terminatorski',
      dopelniacz: 'Pancerza Terminatorskiego',
      celownik: 'Pancerzowi Terminatorskiemu',
      biernik: 'Pancerz Terminatorski',
      narzednik: 'Pancerzem Terminatorskim',
      miejscownik: 'Pancerzu Terminatorskim',
      mnoga: 'Pancerze Terminatorskie',
    }
  },
  {
    id: 'w-19',
    englishTerm: 'Rosarius',
    polishTerm: 'Rosarius',
    category: 'Broń i Ekwipunek',
    notes: 'Pole ochronne i symbol wiary Kapelana.',
    keepOriginal: true
  },
  {
    id: 'w-20',
    englishTerm: 'Iron Halo',
    polishTerm: 'Żelazna Aureola',
    category: 'Broń i Ekwipunek',
    notes: 'Generator pola siłowego na pancerzu dowódcy.'
  },

  // Pojazdy i Okręty
  {
    id: 'v-1',
    englishTerm: 'Dreadnought',
    polishTerm: 'Drednot',
    category: 'Pojazdy i Okręty',
    notes: 'Pancerny sarkofag kroczący podtrzymujący rannego bohatera Astartes.',
    declension: {
      mianownik: 'Drednot',
      dopelniacz: 'Drednota',
      celownik: 'Drednotowi',
      biernik: 'Drednota',
      narzednik: 'Drednotem',
      miejscownik: 'Drednocie',
      wolacz: 'Drednocie',
      mnoga: 'Drednoty / Drednotów',
    }
  },
  {
    id: 'v-2',
    englishTerm: 'Land Raider',
    polishTerm: 'Land Raider',
    category: 'Pojazdy i Okręty',
    notes: 'Ciężki czołg Astartes. Zwykle pozostawiany w oryginale.',
    keepOriginal: true,
    declension: {
      mianownik: 'Land Raider',
      dopelniacz: 'Land Raidera',
      celownik: 'Land Raiderowi',
      biernik: 'Land Raidera',
      narzednik: 'Land Raiderem',
      miejscownik: 'Land Raiderze',
      mnoga: 'Land Raidery',
    }
  },
  {
    id: 'v-3',
    englishTerm: 'Rhino',
    polishTerm: 'Rhino',
    category: 'Pojazdy i Okręty',
    notes: 'Transporter opancerzony Kosmicznych Marines.',
    keepOriginal: true,
    declension: {
      mianownik: 'Rhino',
      dopelniacz: 'Rhino',
      celownik: 'Rhino',
      biernik: 'Rhino',
      narzednik: 'Rhino',
      miejscownik: 'Rhino',
    }
  },
  {
    id: 'v-4',
    englishTerm: 'Drop Pod',
    polishTerm: 'Kapsuła desantowa',
    category: 'Pojazdy i Okręty',
    notes: 'Kapsuła orbitalna Astartes zrzucana na pole bitwy.',
    declension: {
      mianownik: 'Kapsuła desantowa',
      dopelniacz: 'Kapsuły desantowej',
      celownik: 'Kapsule desantowej',
      biernik: 'Kapsułę desantową',
      narzednik: 'Kapsułą desantową',
      miejscownik: 'Kapsule desantowej',
      mnoga: 'Kapsuły desantowe',
    }
  },
  {
    id: 'v-5',
    englishTerm: 'Thunderhawk',
    polishTerm: 'Thunderhawk',
    category: 'Pojazdy i Okręty',
    notes: 'Okręt desantowy i kanonierka Kosmicznych Marines.',
    keepOriginal: true
  },
  {
    id: 'v-6',
    englishTerm: 'Battle Barge',
    polishTerm: 'Barka Bitewna',
    category: 'Pojazdy i Okręty',
    notes: 'Najpotężniejszy okręt wojenny Zakonu Astartes.',
    declension: {
      mianownik: 'Barka Bitewna',
      dopelniacz: 'Barki Bitewnej',
      celownik: 'Barce Bitewnej',
      biernik: 'Barkę Bitewną',
      narzednik: 'Barką Bitewną',
      miejscownik: 'Barce Bitewnej',
      mnoga: 'Barki Bitewne',
    }
  },
  {
    id: 'v-7',
    englishTerm: 'Strike Cruiser',
    polishTerm: 'Krążownik Uderzeniowy',
    category: 'Pojazdy i Okręty',
    notes: 'Szybki okręt bojowy Astartes.',
    declension: {
      mianownik: 'Krążownik Uderzeniowy',
      dopelniacz: 'Krążownika Uderzeniowego',
      celownik: 'Krążownikowi Uderzeniowemu',
      biernik: 'Krążownik Uderzeniowy',
      narzednik: 'Krążownikiem Uderzeniowym',
      miejscownik: 'Krążowniku Uderzeniowym',
      mnoga: 'Krążowniki Uderzeniowe',
    }
  },
  {
    id: 'v-8',
    englishTerm: 'Leman Russ',
    polishTerm: 'Leman Russ',
    category: 'Pojazdy i Okręty',
    notes: 'Główny czołg bojowy Astra Militarum.',
    keepOriginal: true
  },
  {
    id: 'v-vengeful-spirit',
    englishTerm: 'Vengeful Spirit',
    polishTerm: 'Mściwy Duch',
    category: 'Pojazdy i Okręty',
    notes: 'Gloriana-class Battleship, okręt flagowy Mistrza Wojny Horusa Lupercala i Wilków Luny.',
    declension: {
      mianownik: 'Mściwy Duch',
      dopelniacz: 'Mściwego Ducha',
      celownik: 'Mściwemu Duchowi',
      biernik: 'Mściwego Ducha',
      narzednik: 'Mściwym Duchem',
      miejscownik: 'Mściwym Duchu',
      wolacz: 'Mściwy Duchu',
    }
  },
  {
    id: 'v-macragges-honour',
    englishTerm: "Macragge's Honour",
    polishTerm: 'Duma Macragge',
    category: 'Pojazdy i Okręty',
    notes: 'Potężny okręt flagowy Roboute Guillimana i Ultramarines (klasa Gloriana).',
    declension: {
      mianownik: 'Duma Macragge',
      dopelniacz: 'Dumy Macragge',
      celownik: 'Dumie Macragge',
      biernik: 'Dumę Macragge',
      narzednik: 'Dumą Macragge',
      miejscownik: 'Dumie Macragge',
      wolacz: 'Dumo Macragge',
    }
  },

  // Osnowa i Mistycyzm
  {
    id: 'w-warp-1',
    englishTerm: 'Warp',
    polishTerm: 'Osnowa',
    category: 'Osnowa i Mistycyzm',
    notes: 'Wymiar niematerialny, Immaterium. Kluczowy kanoniczny termin!',
    declension: {
      mianownik: 'Osnowa',
      dopelniacz: 'Osnowy',
      celownik: 'Osnowie',
      biernik: 'Osnowę',
      narzednik: 'Osnową',
      miejscownik: 'Osnowie',
    }
  },
  {
    id: 'w-warp-2',
    englishTerm: 'Immaterium',
    polishTerm: 'Immaterium',
    category: 'Osnowa i Mistycyzm',
    notes: 'Łacińska nazwa Osnowy.',
    keepOriginal: true
  },
  {
    id: 'w-warp-3',
    englishTerm: 'Empyrean',
    polishTerm: 'Empireum',
    category: 'Osnowa i Mistycyzm',
    notes: 'Poetycka / archaiczna nazwa Osnowy.'
  },
  {
    id: 'w-warp-4',
    englishTerm: 'Warp Storm',
    polishTerm: 'Burza Osnowy',
    category: 'Osnowa i Mistycyzm',
    notes: 'Zakłócenie czasoprzestrzeni uniemożliwiające podróż nadświetlną.',
    declension: {
      mianownik: 'Burza Osnowy',
      dopelniacz: 'Burzy Osnowy',
      celownik: 'Burzy Osnowy',
      biernik: 'Burzę Osnowy',
      narzednik: 'Burzą Osnowy',
      miejscownik: 'Burzy Osnowy',
      mnoga: 'Burze Osnowy',
    }
  },
  {
    id: 'w-warp-5',
    englishTerm: 'Geller Field',
    polishTerm: 'Pole Gellara',
    category: 'Osnowa i Mistycyzm',
    notes: 'Pole siłowe chroniące okręt przed bytami z Osnowy.',
    declension: {
      mianownik: 'Pole Gellara',
      dopelniacz: 'Pola Gellara',
      celownik: 'Polu Gellara',
      biernik: 'Pole Gellara',
      narzednik: 'Polem Gellara',
      miejscownik: 'Polu Gellara',
    }
  },
  {
    id: 'w-warp-6',
    englishTerm: 'Astronomican',
    polishTerm: 'Astronomicum',
    category: 'Osnowa i Mistycyzm',
    notes: 'Latarnia psioniczna na Ziemi podtrzymywana przez Imperatora.'
  },
  {
    id: 'w-warp-7',
    englishTerm: 'Machine Spirit',
    polishTerm: 'Duch Maszyny',
    category: 'Osnowa i Mistycyzm',
    notes: 'Mistycyzm Mechanicus – esencja świadomości technologii.',
    declension: {
      mianownik: 'Duch Maszyny',
      dopelniacz: 'Ducha Maszyny',
      celownik: 'Duchowi Maszyny',
      biernik: 'Ducha Maszyny',
      narzednik: 'Duchem Maszyny',
      miejscownik: 'Duchu Maszyny',
      wolacz: 'Duchu Maszyny',
      mnoga: 'Duchy Maszyny',
    }
  },

  // Eklezjarchia i Prawo
  {
    id: 'e-1',
    englishTerm: 'Ecclesiarchy',
    polishTerm: 'Eklezjarchia',
    category: 'Eklezjarchia i Prawo',
    notes: 'Adeptus Ministorum, oficjalny kościół Imperium.',
    declension: {
      mianownik: 'Eklezjarchia',
      dopelniacz: 'Eklezjarchii',
      celownik: 'Eklezjarchii',
      biernik: 'Eklezjarchię',
      narzednik: 'Eklezjarchią',
      miejscownik: 'Eklezjarchii',
    }
  },
  {
    id: 'e-2',
    englishTerm: 'Imperial Creed',
    polishTerm: 'Kult Imperialny / Wyznanie Imperialne',
    category: 'Eklezjarchia i Prawo',
    notes: 'Oficjalna religia czcząca Boga-Imperatora.'
  },
  {
    id: 'e-3',
    englishTerm: 'Exterminatus',
    polishTerm: 'Exterminatus',
    category: 'Eklezjarchia i Prawo',
    notes: 'Rozkaz całkowitego zniszczenia wszelkiego życia na planecie.',
    keepOriginal: true
  },
  {
    id: 'e-4',
    englishTerm: 'Purity Seal',
    polishTerm: 'Pieczęć Czystości',
    category: 'Eklezjarchia i Prawo',
    notes: 'Woskowy znak z pergaminową modlitwą chroniący przed spaczeniem.',
    declension: {
      mianownik: 'Pieczęć Czystości',
      dopelniacz: 'Pieczęci Czystości',
      celownik: 'Pieczęci Czystości',
      biernik: 'Pieczęć Czystości',
      narzednik: 'Pieczęcią Czystości',
      miejscownik: 'Pieczęci Czystości',
      mnoga: 'Pieczęcie Czystości',
    }
  },
  {
    id: 'e-5',
    englishTerm: 'Heretic',
    polishTerm: 'Heretyk',
    category: 'Eklezjarchia i Prawo',
    notes: 'Zdrajca Imperatora i zasad kultu.',
    declension: {
      mianownik: 'Heretyk',
      dopelniacz: 'Heretyka',
      celownik: 'Heretykowi',
      biernik: 'Heretyka',
      narzednik: 'Heretykiem',
      miejscownik: 'Heretyku',
      wolacz: 'Heretyku',
      mnoga: 'Heretycy / Heretyków',
    }
  },
  {
    id: 'e-6',
    englishTerm: 'High Lords of Terra',
    polishTerm: 'Wysocy Lordowie Terry',
    category: 'Eklezjarchia i Prawo',
    notes: 'Dwanaście najpotężniejszych osób rządzących Imperium.'
  },

  // Technologia i Maszyny
  {
    id: 'tm-1',
    englishTerm: 'Servo-skull',
    polishTerm: 'Serwoczaszka',
    category: 'Technologia i Maszyny',
    notes: 'Cyborgizowana czaszka lewitująca na silniku antygrawitacyjnym.',
    declension: {
      mianownik: 'Serwoczaszka',
      dopelniacz: 'Serwoczaszki',
      celownik: 'Serwoczaszce',
      biernik: 'Serwoczaszkę',
      narzednik: 'Serwoczaszką',
      miejscownik: 'Serwoczaszce',
      mnoga: 'Serwoczaszki',
    }
  },
  {
    id: 'tm-2',
    englishTerm: 'Auspex',
    polishTerm: 'Auspeks',
    category: 'Technologia i Maszyny',
    notes: 'Ręczny skaner wykrywający formy życia, promieniowanie i ruch.',
    declension: {
      mianownik: 'Auspeks',
      dopelniacz: 'Auspeksu',
      celownik: 'Auspeksowi',
      biernik: 'Auspeks',
      narzednik: 'Auspeksem',
      miejscownik: 'Auspeksie',
      mnoga: 'Auspeksy',
    }
  },
  {
    id: 'tm-3',
    englishTerm: 'Vox',
    polishTerm: 'Woks',
    category: 'Technologia i Maszyny',
    notes: 'Imperialna łączność radiowa (np. "przez woks", "kanał woksowy").',
    declension: {
      mianownik: 'Woks',
      dopelniacz: 'Woksa',
      celownik: 'Woksowi',
      biernik: 'Woks',
      narzednik: 'Woksem',
      miejscownik: 'Woksie',
    }
  },
  {
    id: 'tm-4',
    englishTerm: 'Cogitator',
    polishTerm: 'Kogitator',
    category: 'Technologia i Maszyny',
    notes: 'Imperialny komputer mechaniczny / bio-elektroniczny.',
    declension: {
      mianownik: 'Kogitator',
      dopelniacz: 'Kogitatora',
      celownik: 'Kogitatorowi',
      biernik: 'Kogitator',
      narzednik: 'Kogitatorem',
      miejscownik: 'Kogitatorze',
      mnoga: 'Kogitatory',
    }
  },
  {
    id: 'tm-5',
    englishTerm: 'Gene-seed',
    polishTerm: 'Ziarno genowe',
    category: 'Technologia i Maszyny',
    notes: 'Materiał genetyczny niezbędny do kreacji nowych Kosmicznych Marines.',
    declension: {
      mianownik: 'Ziarno genowe',
      dopelniacz: 'Ziarna genowego',
      celownik: 'Ziarnu genowemu',
      biernik: 'Ziarno genowe',
      narzednik: 'Ziarnem genowym',
      miejscownik: 'Ziarnie genowym',
    }
  },
  {
    id: 'tm-6',
    englishTerm: 'Progenoid Gland',
    polishTerm: 'Gruczoł progenoidowy',
    category: 'Technologia i Maszyny',
    notes: 'Gruczoł rozwijający ziarno genowe u Astartes.',
    declension: {
      mianownik: 'Gruczoł progenoidowy',
      dopelniacz: 'Gruczołu progenoidowego',
      celownik: 'Gruczołowi progenoidowemu',
      biernik: 'Gruczoł progenoidowy',
      narzednik: 'Gruczołem progenoidowym',
      miejscownik: 'Gruczole progenoidowym',
      mnoga: 'Gruczoły progenoidowe',
    }
  },

  // Geografia i Światy
  {
    id: 'g-1',
    englishTerm: 'Hive World',
    polishTerm: 'Świat-Kopiec',
    category: 'Geografia i Światy',
    notes: 'Planeta gęsto zaludniona, pokryta gigantycznymi Miastami-Kopcami.',
    declension: {
      mianownik: 'Świat-Kopiec',
      dopelniacz: 'Świata-Kopca',
      celownik: 'Światu-Kopcowi',
      biernik: 'Świat-Kopiec',
      narzednik: 'Światem-Kopcem',
      miejscownik: 'Świecie-Kopcu',
      mnoga: 'Światy-Kopce',
    }
  },
  {
    id: 'g-2',
    englishTerm: 'Hive City',
    polishTerm: 'Miasto-Kopiec',
    category: 'Geografia i Światy',
    notes: 'Wielomiliardowa wieżowa metropolia.',
    declension: {
      mianownik: 'Miasto-Kopiec',
      dopelniacz: 'Miasta-Kopca',
      celownik: 'Miastu-Kopcowi',
      biernik: 'Miasto-Kopiec',
      narzednik: 'Miastem-Kopcem',
      miejscownik: 'Mieście-Kopcu',
      mnoga: 'Miasta-Kopce',
    }
  },
  {
    id: 'g-3',
    englishTerm: 'Forge World',
    polishTerm: 'Świat-Kuźnia',
    category: 'Geografia i Światy',
    notes: 'Planeta produkcyjna należąca bezpośrednio do Adeptus Mechanicus.',
    declension: {
      mianownik: 'Świat-Kuźnia',
      dopelniacz: 'Świata-Kuźni',
      celownik: 'Światu-Kuźni',
      biernik: 'Świat-Kuźnię',
      narzednik: 'Światem-Kuźnią',
      miejscownik: 'Świecie-Kuźni',
      mnoga: 'Światy-Kuźnie',
    }
  },
  {
    id: 'g-4',
    englishTerm: 'Death World',
    polishTerm: 'Świat Śmierci',
    category: 'Geografia i Światy',
    notes: 'Planeta o śmiertelnie niebezpiecznej florze, faunie lub klimacie (np. Catachan).'
  },
  {
    id: 'g-5',
    englishTerm: 'Segmentum Solar',
    polishTerm: 'Segmentum Solar',
    category: 'Geografia i Światy',
    notes: 'Centralny sektor galaktyczny Imperium z Terrą.',
    keepOriginal: true
  },
  {
    id: 'g-6',
    englishTerm: 'Eye of Terror',
    polishTerm: 'Oko Grozy',
    category: 'Geografia i Światy',
    notes: 'Gigantyczna wyrwa w rzeczywistości łącząca przestrzeń z Osnową.',
    declension: {
      mianownik: 'Oko Grozy',
      dopelniacz: 'Oka Grozy',
      celownik: 'Oku Grozy',
      biernik: 'Oko Grozy',
      narzednik: 'Okiem Grozy',
      miejscownik: 'Oku Grozy',
    }
  }
];
