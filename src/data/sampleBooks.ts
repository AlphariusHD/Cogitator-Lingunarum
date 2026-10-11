import { BookProject } from '../types/wh40k';

export const SAMPLE_WH40K_BOOKS: BookProject[] = [
  {
    id: 'book-horus-rising',
    title: 'Horus Rising (Wyniesienie Horusa)',
    author: 'Dan Abnett',
    sourceLanguage: 'en',
    targetLanguage: 'pl',
    profile: 'OFFICIAL_PL',
    customGlossary: [],
    activeChapterId: 'ch-hr-1',
    chapters: [
      {
        id: 'ch-hr-1',
        title: 'Rozdział I: I was there the day Horus slew the Emperor',
        wordCountSource: 290,
        wordCountTranslated: 0,
        status: 'idle',
        sourceText: `I was there, the day Horus slew the Emperor.

It was a delicious phrase, and a lie. Yet people were to make much of it in the long years to come, long after the blood had dried and the ashes had settled.

The Emperor had come in splendor to the high court of the false ruler. He had offered brotherhood and peaceful compliance. In return, the false Emperor had laughed, calling him an usurper, and turned his weapons of heresy upon the Imperial delegations.

The Astartes of the Luna Wolves responded with swift and terrible fury. Captain Garviel Loken led the Tenth Company into the breach, their power armour gleaming pearl-white under the irradiated sun. Bolters barked in rhythmic, deafening cadence, tearing through the flesh of the enemy bodyguards. Chainswords roared with feral hunger as adamantium teeth ripped through ceramite plate. Above them, in the churning skies of the conquered world, Strike Cruisers and Battle Barges maintained orbital vigil, their Machine Spirits singing hymns of righteous compliance.

Behind Loken came the Warmaster himself. Horus Lupercal moved with god-like grace, the Talon of Horus crackling with pale lethal lightning. No mortal shield could withstand his wrath. The false Emperor fell upon his throne of blasphemy, his royal guards shattered like dry glass under the tread of the Emperor's greatest son.`,
        translatedText: ''
      },
      {
        id: 'ch-hr-2',
        title: 'Rozdział II: The Mournival and the Lodge',
        wordCountSource: 245,
        wordCountTranslated: 0,
        status: 'idle',
        sourceText: `Garviel Loken stood in the shadows of the embarkation deck, checking the seals on his Mark IV power armour. Beside him, Tarik Torgaddon grinned behind his scarred face, casually resting his heavy chainsword upon the deck plating.

"They say the Warmaster is convening the Mournival tonight, Garviel," Torgaddon murmured through the vox. "Aximand is already waiting. Abaddon will test your resolve with cold steel before you are granted entrance to the inner circle."

From the cavernous ceiling of the flagship Vengeful Spirit, servo-skulls drifted like silver spectres, their optical auspexes scanning the ranks of silent legionaries. In the far nave, tech-priests of the Adeptus Mechanicus chanted binary benedictions to the vessel's primary plasma reactors, anointing the coolant manifolds with sacred sanctified oils. Even here, at the peak of the Great Crusade, the presence of the Warp was a constant whisper beyond the Geller field.`,
        translatedText: ''
      }
    ]
  },
  {
    id: 'book-eisenhorn',
    title: 'Eisenhorn: Xenos',
    author: 'Dan Abnett',
    sourceLanguage: 'en',
    targetLanguage: 'pl',
    profile: 'OFFICIAL_PL',
    customGlossary: [],
    activeChapterId: 'ch-eis-1',
    chapters: [
      {
        id: 'ch-eis-1',
        title: 'Część I: Hub Sabis and the Sleeping Dead',
        wordCountSource: 275,
        wordCountTranslated: 0,
        status: 'idle',
        sourceText: `My name is Gregor Eisenhorn. I am an Inquisitor of the Ordo Xenos. 

I carry a rosette of gold that bears the seal of the Holy Inquisition and the three-pronged signature of the Emperor. It grants me absolute authority in all matters concerning the security of mankind, to requisition armies, burn worlds with Exterminatus, and condemn monarchs to silence.

The frost was thick on the cryo-tomb walls of Hub Sabis. Ice crunched beneath the heavy tread of my carapace boots. The air tasted of recycled ozone and chemical preservative. In my right hand, I carried my master-crafted bolt pistol; in my left, a power sword whose blade hummed with a lethargic electric hiss.

"Master Eisenhorn," voxed Midas Betancore from the gunship overhead. "Auspex readings indicate localized psychic interference near Vault Nine. The readings match Eyclone's signature."

"Acknowledged, Midas," I replied softly, drawing upon my own psychic discipline to erect a mental bastion. If Murdin Eyclone had unleashed an unbound daemon from the Warp into this frozen mortuary, twelve thousand hibernating citizens would perish before dawn.`,
        translatedText: ''
      }
    ]
  },
  {
    id: 'book-helsreach',
    title: 'Helsreach: Armageddon',
    author: 'Aaron Dembski-Bowden',
    sourceLanguage: 'en',
    targetLanguage: 'pl',
    profile: 'HIGH_GOTHIC',
    customGlossary: [],
    activeChapterId: 'ch-hels-1',
    chapters: [
      {
        id: 'ch-hels-1',
        title: 'Prologue: The Arrival of the Reclusiarch',
        wordCountSource: 260,
        wordCountTranslated: 0,
        status: 'idle',
        sourceText: `I am Merek Grimaldus, Reclusiarch of the Black Templars. 

I have sworn an oath upon the Bones of the Saint. I have kissed the edge of the Emperor's blade and promised High Marshal Helbrecht that Hive Helsreach shall not fall to the green tide while a single drop of blood flows through my second heart.

The skies of Armageddon burned with oily red smog. Millions of Ork war-skiffs hurtled down through the atmosphere like falling meteors, howling their crude battle-cry: "Waaagh!" Beneath us, the jagged spires of the hive city shuddered under tectonic artillery fire. 

The battle-brothers around me stood like obsidian statues. Their black power armour was inscribed with purity seals and parchment oaths of vengeance. Each held a consecrated bolter or two-handed chainsword. Across the vox-channel, the litany of hate sounded in unified chorus. 

"Never surrender," I barked into the vox, lifting the Crozius Arcanum high so the light of burning promethiam caught its winged skull. "We are the Emperor's wrath incarnate. We are his death given form."`,
        translatedText: ''
      }
    ]
  }
];
