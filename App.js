import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGES } from './data/lessons';

const PROGRESS_KEY = '@language_learning_progress';

// Screens: 'home' -> 'category' -> 'lesson' | 'quiz'
export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [progress, setProgress] = useState({}); // { "lang-category": { completed: true, bestScore: 3 } }

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(PROGRESS_KEY);
      if (stored) setProgress(JSON.parse(stored));
    } catch (e) {
      console.log('Error loading progress', e);
    }
  };

  const saveProgress = async (updated) => {
    try {
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
      setProgress(updated);
    } catch (e) {
      console.log('Error saving progress', e);
    }
  };

  const markLessonComplete = (langId, catId) => {
    const key = `${langId}-${catId}`;
    const updated = {
      ...progress,
      [key]: { ...(progress[key] || {}), completed: true },
    };
    saveProgress(updated);
  };

  const recordQuizScore = (langId, catId, score, total) => {
    const key = `${langId}-${catId}`;
    const existing = progress[key] || {};
    const bestScore = Math.max(existing.bestScore || 0, score);
    const updated = {
      ...progress,
      [key]: { ...existing, bestScore, total },
    };
    saveProgress(updated);
  };

  const goHome = () => {
    setScreen('home');
    setSelectedLanguage(null);
    setSelectedCategory(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      {screen === 'home' && (
        <HomeScreen
          progress={progress}
          onSelectLanguage={(lang) => {
            setSelectedLanguage(lang);
            setScreen('category');
          }}
        />
      )}
      {screen === 'category' && selectedLanguage && (
        <CategoryScreen
          language={selectedLanguage}
          progress={progress}
          onBack={() => setScreen('home')}
          onSelectCategory={(cat, mode) => {
            setSelectedCategory(cat);
            setScreen(mode);
          }}
        />
      )}
      {screen === 'lesson' && selectedLanguage && selectedCategory && (
        <LessonScreen
          language={selectedLanguage}
          category={selectedCategory}
          onBack={() => setScreen('category')}
          onComplete={() => markLessonComplete(selectedLanguage.id, selectedCategory.id)}
        />
      )}
      {screen === 'quiz' && selectedLanguage && selectedCategory && (
        <QuizScreen
          language={selectedLanguage}
          category={selectedCategory}
          onBack={() => setScreen('category')}
          onFinish={(score, total) =>
            recordQuizScore(selectedLanguage.id, selectedCategory.id, score, total)
          }
        />
      )}
    </SafeAreaView>
  );
}

// ---------------- HOME SCREEN ----------------
function HomeScreen({ progress, onSelectLanguage }) {
  const totalCompleted = Object.values(progress).filter((p) => p.completed).length;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🌍 Language Learning</Text>
      <Text style={styles.subHeader}>
        Lessons completed so far: {totalCompleted}
      </Text>
      <Text style={styles.sectionTitle}>Choose a language</Text>
      {LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.id}
          style={styles.languageCard}
          onPress={() => onSelectLanguage(lang)}
        >
          <Text style={styles.languageFlag}>{lang.flag}</Text>
          <Text style={styles.languageName}>{lang.name}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ---------------- CATEGORY SCREEN ----------------
function CategoryScreen({ language, progress, onBack, onSelectCategory }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>
        {language.flag} {language.name}
      </Text>
      <Text style={styles.sectionTitle}>Categories</Text>
      {language.categories.map((cat) => {
        const key = `${language.id}-${cat.id}`;
        const catProgress = progress[key] || {};
        return (
          <View key={cat.id} style={styles.categoryCard}>
            <View style={styles.categoryHeaderRow}>
              <Text style={styles.categoryName}>{cat.name}</Text>
              {catProgress.completed && <Text style={styles.doneBadge}>✓ Done</Text>}
            </View>
            <Text style={styles.categoryMeta}>{cat.cards.length} cards</Text>
            {catProgress.bestScore !== undefined && (
              <Text style={styles.categoryMeta}>
                Best quiz score: {catProgress.bestScore}/{catProgress.total}
              </Text>
            )}
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.smallButton, styles.lessonButton]}
                onPress={() => onSelectCategory(cat, 'lesson')}
              >
                <Text style={styles.smallButtonText}>Study Flashcards</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, styles.quizButton]}
                onPress={() => onSelectCategory(cat, 'quiz')}
              >
                <Text style={styles.smallButtonText}>Take Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

// ---------------- LESSON (FLASHCARD) SCREEN ----------------
function LessonScreen({ language, category, onBack, onComplete }) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const cards = category.cards;
  const card = cards[index];

  const handleNext = () => {
    setShowAnswer(false);
    if (index < cards.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
      onBack();
    }
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    if (index > 0) setIndex(index - 1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{category.name}</Text>
      <Text style={styles.progressText}>
        Card {index + 1} of {cards.length}
      </Text>

      <TouchableOpacity
        style={styles.flashcard}
        onPress={() => setShowAnswer(!showAnswer)}
        activeOpacity={0.9}
      >
        <Text style={styles.flashcardWord}>{card.word}</Text>
        {showAnswer ? (
          <View style={styles.flashcardAnswerBox}>
            <Text style={styles.flashcardTranslation}>{card.translation}</Text>
            <Text style={styles.flashcardPronunciation}>/{card.pronunciation}/</Text>
          </View>
        ) : (
          <Text style={styles.tapHint}>Tap to show answer</Text>
        )}
      </TouchableOpacity>

      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, index === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={index === 0}
        >
          <Text style={styles.navButtonText}>‹ Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <Text style={styles.navButtonText}>
            {index === cards.length - 1 ? 'Finish' : 'Next ›'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------- QUIZ SCREEN ----------------
function buildQuizQuestions(category, allCards) {
  // Multiple choice: correct translation + 3 random wrong translations
  return category.cards.map((card) => {
    const wrongOptions = allCards
      .filter((c) => c.id !== card.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.translation);
    const options = [...wrongOptions, card.translation].sort(() => Math.random() - 0.5);
    return { question: card.word, correctAnswer: card.translation, options };
  });
}

function QuizScreen({ language, category, onBack, onFinish }) {
  const allCards = language.categories.flatMap((c) => c.cards);
  const [questions] = useState(() => buildQuizQuestions(category, allCards));
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[qIndex];

  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);
    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (qIndex < questions.length - 1) {
        setQIndex(qIndex + 1);
        setSelected(null);
      } else {
        setFinished(true);
        onFinish(score + (isCorrect ? 1 : 0), questions.length);
      }
    }, 700);
  };

  if (finished) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Quiz Complete! 🎉</Text>
        <Text style={styles.resultScore}>
          {score} / {questions.length}
        </Text>
        <Text style={styles.resultText}>
          {score === questions.length
            ? 'Perfect score! Great job!'
            : 'Keep practicing to improve your score.'}
        </Text>
        <TouchableOpacity style={styles.navButton} onPress={onBack}>
          <Text style={styles.navButtonText}>Back to Categories</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{category.name} Quiz</Text>
      <Text style={styles.progressText}>
        Question {qIndex + 1} of {questions.length}
      </Text>
      <Text style={styles.quizQuestion}>
        What does "{currentQuestion.question}" mean?
      </Text>
      {currentQuestion.options.map((option) => {
        const isSelected = selected === option;
        const isCorrectOption = option === currentQuestion.correctAnswer;
        let optionStyle = styles.optionButton;
        if (selected) {
          if (isCorrectOption) optionStyle = [styles.optionButton, styles.optionCorrect];
          else if (isSelected) optionStyle = [styles.optionButton, styles.optionWrong];
        }
        return (
          <TouchableOpacity
            key={option}
            style={optionStyle}
            onPress={() => handleSelect(option)}
            disabled={!!selected}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FA' },
  container: { flexGrow: 1, padding: 20, paddingTop: 20 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#212121', marginBottom: 8 },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#444', marginBottom: 10 },
  backButton: { marginBottom: 12 },
  backButtonText: { color: '#2196F3', fontSize: 15, fontWeight: '600' },

  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  languageFlag: { fontSize: 28, marginRight: 12 },
  languageName: { fontSize: 18, fontWeight: '600', color: '#333', flex: 1 },
  chevron: { fontSize: 22, color: '#BBB' },

  categoryCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryName: { fontSize: 17, fontWeight: '600', color: '#333' },
  doneBadge: { color: '#4CAF50', fontWeight: '600', fontSize: 13 },
  categoryMeta: { fontSize: 12, color: '#888', marginTop: 4 },
  row: { flexDirection: 'row', marginTop: 12 },
  smallButton: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginRight: 8 },
  lessonButton: { backgroundColor: '#2196F3' },
  quizButton: { backgroundColor: '#FF9800', marginRight: 0 },
  smallButtonText: { color: '#FFF', fontWeight: '600', fontSize: 13 },

  progressText: { fontSize: 13, color: '#888', marginBottom: 16 },
  flashcard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  flashcardWord: { fontSize: 30, fontWeight: 'bold', color: '#212121', textAlign: 'center' },
  tapHint: { marginTop: 20, color: '#AAA', fontSize: 13 },
  flashcardAnswerBox: { marginTop: 20, alignItems: 'center' },
  flashcardTranslation: { fontSize: 22, color: '#2196F3', fontWeight: '600' },
  flashcardPronunciation: { fontSize: 15, color: '#888', marginTop: 6, fontStyle: 'italic' },

  navRow: { flexDirection: 'row', justifyContent: 'space-between' },
  navButton: {
    flex: 1,
    backgroundColor: '#212121',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  navButtonDisabled: { backgroundColor: '#CCC' },
  navButtonText: { color: '#FFF', fontWeight: '600', fontSize: 15 },

  quizQuestion: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 20, textAlign: 'center' },
  optionButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionCorrect: { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' },
  optionWrong: { backgroundColor: '#FFEBEE', borderColor: '#E53935' },
  optionText: { fontSize: 16, color: '#333', textAlign: 'center' },

  resultScore: { fontSize: 48, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginVertical: 20 },
  resultText: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 30 },
});
