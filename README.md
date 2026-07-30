# CodeAlpha_LanguageLearningApp

An interactive React Native (Expo) language learning app built as part of the **CodeAlpha App Development Internship**.

## ✨ Features
- Choose a language to learn (Spanish, French — easy to add more in `data/lessons.js`).
- Lessons organized into categories: **Vocabulary**, **Phrases**, and **Grammar**.
- Flashcard-based lessons with word, translation, and pronunciation. Tap a card to reveal the answer; navigate with Previous/Next.
- Multiple-choice quiz mode for every category to test your progress, with instant correct/wrong feedback.
- Progress tracking (lessons completed + best quiz scores) saved locally with `AsyncStorage`.
- Clean, minimal, card-based UI.

## 🛠️ Tech Stack
- React Native
- Expo
- @react-native-async-storage/async-storage

## 🚀 How to Run
1. Install [Node.js](https://nodejs.org) and Expo CLI:
   ```bash
   npm install -g expo-cli
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npx expo start
   ```
4. Scan the QR code with the **Expo Go** app (Android/iOS) or press `w` to run in a browser.

## 📁 Project Structure
```
CodeAlpha_LanguageLearningApp/
├── App.js               # Main app (Home, Category, Lesson, Quiz screens)
├── data/
│   └── lessons.js        # Language, category, and flashcard data
├── app.json              # Expo app configuration
├── babel.config.js        # Babel configuration
├── package.json           # Dependencies
└── README.md
```

## ✅ Task Requirements Covered
- [x] Learn new words/phrases in a selected language
- [x] Daily lessons/flashcards with translations and pronunciations
- [x] Quizzes/practice tests to check learning progress
- [x] Clean, intuitive UI with categories (vocabulary, phrases, grammar)
- [x] Learning data stored locally (AsyncStorage)

---
Built for **CodeAlpha App Development Internship** — Task 4: Language Learning App
