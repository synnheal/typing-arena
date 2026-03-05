export interface Quote {
  text: string;
  author: string;
  language: "en" | "fr";
}

export const QUOTES: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", language: "en" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", language: "en" },
  { text: "Life is what happens when you are busy making other plans.", author: "John Lennon", language: "en" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", language: "en" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", language: "en" },
  { text: "Everything you can imagine is real if you believe in it.", author: "Pablo Picasso", language: "en" },
  { text: "The best revenge is massive success in everything you pursue.", author: "Frank Sinatra", language: "en" },
  { text: "What we think we become so choose your thoughts wisely.", author: "Buddha", language: "en" },
  { text: "La vie est un mystere qu il faut vivre et non un probleme a resoudre.", author: "Gandhi", language: "fr" },
  { text: "Le courage est pas absence de peur mais la capacite de la vaincre.", author: "Nelson Mandela", language: "fr" },
  { text: "La simplicite est la sophistication supreme dans tous les domaines.", author: "Leonard de Vinci", language: "fr" },
  { text: "Il faut viser la lune car meme en cas de echec on atterrit parmi les etoiles.", author: "Oscar Wilde", language: "fr" },
  { text: "Le seul vrai voyage ce est pas de chercher de nouveaux paysages mais de avoir de nouveaux yeux.", author: "Marcel Proust", language: "fr" },
  { text: "On ne voit bien que avec le coeur car essentiel est invisible pour les yeux.", author: "Antoine de Saint-Exupery", language: "fr" },
  { text: "La connaissance est la seule chose qui augmente quand on la partage avec les autres.", author: "Socrate", language: "fr" },
  { text: "Le bonheur est pas une destination mais une facon de voyager chaque jour.", author: "Margaret Lee Runbeck", language: "fr" },
];
