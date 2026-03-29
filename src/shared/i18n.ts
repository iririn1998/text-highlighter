type Locale = 'ja' | 'en';

const translations = {
  ja: {
    popup: {
      subtitle: 'テキストをマーカーでハイライト',
      colorSelection: 'カラー選択',
      howToUse: '使い方',
      step1: 'テキストを選択して右クリック',
      step2: '「ハイライトを追加」をクリック',
      step3: '削除はダブルクリック',
    },
    colors: {
      yellow: '黄',
      green: '緑',
      red: '赤',
      blue: '青',
    },
    contextMenu: {
      addHighlight: 'ハイライトを追加',
    },
  },
  en: {
    popup: {
      subtitle: 'Highlight text with markers',
      colorSelection: 'Color Selection',
      howToUse: 'How to Use',
      step1: 'Select text and right-click',
      step2: 'Click "Add Highlight"',
      step3: 'Double-click to remove',
    },
    colors: {
      yellow: 'Yellow',
      green: 'Green',
      red: 'Red',
      blue: 'Blue',
    },
    contextMenu: {
      addHighlight: 'Add Highlight',
    },
  },
} as const;

type Translations = (typeof translations)[Locale];

const detectLocale = (): Locale => {
  const lang = navigator.language || 'en';
  return lang.startsWith('ja') ? 'ja' : 'en';
};

const detectedLocale = detectLocale();

export const getTranslations = (): Translations => {
  return translations[detectedLocale];
};

export const getLocale = (): Locale => {
  return detectedLocale;
};
