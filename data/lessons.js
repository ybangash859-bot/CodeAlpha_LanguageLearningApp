// Lesson data: languages > categories > flashcards
// Each flashcard has: word (target language), translation (English), pronunciation

export const LANGUAGES = [
  {
    id: 'spanish',
    name: 'Spanish',
    flag: '🇪🇸',
    categories: [
      {
        id: 'vocabulary',
        name: 'Vocabulary',
        cards: [
          { id: 'sp-v1', word: 'Hola', translation: 'Hello', pronunciation: 'OH-lah' },
          { id: 'sp-v2', word: 'Gracias', translation: 'Thank you', pronunciation: 'GRAH-see-ahs' },
          { id: 'sp-v3', word: 'Agua', translation: 'Water', pronunciation: 'AH-gwah' },
          { id: 'sp-v4', word: 'Comida', translation: 'Food', pronunciation: 'ko-MEE-dah' },
          { id: 'sp-v5', word: 'Amigo', translation: 'Friend', pronunciation: 'ah-MEE-go' },
          { id: 'sp-v6', word: 'Casa', translation: 'House', pronunciation: 'KAH-sah' },
        ],
      },
      {
        id: 'phrases',
        name: 'Phrases',
        cards: [
          { id: 'sp-p1', word: '¿Cómo estás?', translation: 'How are you?', pronunciation: 'KOH-mo es-TAHS' },
          { id: 'sp-p2', word: 'Buenos días', translation: 'Good morning', pronunciation: 'BWAY-nos DEE-ahs' },
          { id: 'sp-p3', word: 'Mucho gusto', translation: 'Nice to meet you', pronunciation: 'MOO-cho GOOS-toh' },
          { id: 'sp-p4', word: '¿Dónde está?', translation: 'Where is it?', pronunciation: 'DOHN-day es-TAH' },
        ],
      },
      {
        id: 'grammar',
        name: 'Grammar',
        cards: [
          { id: 'sp-g1', word: 'Yo soy / Yo estoy', translation: 'I am (permanent / temporary)', pronunciation: 'yo soy / yo es-TOY' },
          { id: 'sp-g2', word: 'El / La', translation: 'The (masculine / feminine)', pronunciation: 'el / lah' },
          { id: 'sp-g3', word: 'Tener que + verb', translation: 'To have to (do something)', pronunciation: 'ten-EHR keh' },
        ],
      },
    ],
  },
  {
    id: 'french',
    name: 'French',
    flag: '🇫🇷',
    categories: [
      {
        id: 'vocabulary',
        name: 'Vocabulary',
        cards: [
          { id: 'fr-v1', word: 'Bonjour', translation: 'Hello', pronunciation: 'bon-ZHOOR' },
          { id: 'fr-v2', word: 'Merci', translation: 'Thank you', pronunciation: 'mehr-SEE' },
          { id: 'fr-v3', word: 'Eau', translation: 'Water', pronunciation: 'oh' },
          { id: 'fr-v4', word: 'Nourriture', translation: 'Food', pronunciation: 'noo-ree-TOOR' },
          { id: 'fr-v5', word: 'Ami', translation: 'Friend', pronunciation: 'ah-MEE' },
          { id: 'fr-v6', word: 'Maison', translation: 'House', pronunciation: 'may-ZOHN' },
        ],
      },
      {
        id: 'phrases',
        name: 'Phrases',
        cards: [
          { id: 'fr-p1', word: 'Comment ça va?', translation: 'How are you?', pronunciation: 'ko-mahn sah vah' },
          { id: 'fr-p2', word: 'Bonne journée', translation: 'Have a good day', pronunciation: 'bun zhoor-NAY' },
          { id: 'fr-p3', word: 'Enchanté', translation: 'Nice to meet you', pronunciation: 'ahn-shahn-TAY' },
          { id: 'fr-p4', word: 'Où est...?', translation: 'Where is...?', pronunciation: 'oo eh' },
        ],
      },
      {
        id: 'grammar',
        name: 'Grammar',
        cards: [
          { id: 'fr-g1', word: 'Je suis', translation: 'I am', pronunciation: 'zhuh swee' },
          { id: 'fr-g2', word: 'Le / La', translation: 'The (masculine / feminine)', pronunciation: 'luh / lah' },
          { id: 'fr-g3', word: 'Il faut + verb', translation: 'It is necessary to (do something)', pronunciation: 'eel foh' },
        ],
      },
    ],
  },
];
