export interface EmotionQuote {
  text: string;
  author: string;
}

export type EmotionType = "overwhelmed" | "anxious" | "sad" | "nervous" | "neutral" | "calm" | "energized";

export const emotionQuotes: Record<EmotionType, EmotionQuote[]> = {
  overwhelmed: [
    {
      text: "The best way to not feel hopeless is to get up and do something. Don't wait for good things to happen to you. If you go out and make some good things happen, you will fill the world with hope, you will fill yourself with hope.",
      author: "Barack Obama"
    },
    {
      text: "What's one thing you can let go of right now?",
      author: "Reflection prompt"
    },
    {
      text: "Sleep is the best meditation.",
      author: "Dalai Lama"
    },
    {
      text: "As a well-spent day brings happy sleep, so a life well spent brings happy death.",
      author: "Leonardo da Vinci"
    },
    {
      text: "We need time to defuse, to contemplate. Just as in sleep our brains relax and give us dreams, so at some time in the day we need to disconnect, reconnect, and look around us.",
      author: "Laurie Colwin"
    },
    {
      text: "We are living in a frenetic standstill – we move faster but get nowhere.",
      author: "Hartmut Rosa"
    },
    {
      text: "Society is not a mere sum of individuals; it is a system of active forces.",
      author: "Émile Durkheim"
    },
    {
      text: "The paradox of self-reference: a system observing itself observes something that observes itself.",
      author: "Niklas Luhmann"
    }
  ],
  anxious: [
    {
      text: "Courage is not the absence of fear, but mastery over it. Face your fears, and they lose their power.",
      author: "Mahatma Gandhi"
    },
    {
      text: "There would be no one to frighten you if you refuse to be afraid.",
      author: "Mahatma Gandhi"
    },
    {
      text: "It is weakness which breeds fear, and fear breeds distrust.",
      author: "Mahatma Gandhi"
    },
    {
      text: "My fear is my substance, and probably the best part of me.",
      author: "Franz Kafka"
    },
    {
      text: "Leaders are the ones who have the courage to go first, to put themselves at personal risk to open a path for others to follow.",
      author: "Simon Sinek"
    },
    {
      text: "From a real antagonist one gains boundless courage.",
      author: "Franz Kafka"
    },
    {
      text: "Courageous people do not fear forgiving for the sake of peace.",
      author: "Nelson Mandela"
    },
    {
      text: "Cowardice asks 'Is it safe?' Expediency asks 'Is it politic?' But Conscience asks 'Is it right?'",
      author: "Martin Luther King Jr."
    },
    {
      text: "Sapere aude! Dare to know! Have the courage to use your own understanding.",
      author: "Immanuel Kant"
    },
    {
      text: "Precariousness is coextensive with birth itself. It matters whether or not this infant being survives, and that its survival is dependent on what we call a social network of hands.",
      author: "Judith Butler"
    }
  ],
  sad: [
    {
      text: "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.",
      author: "Martin Luther King Jr."
    },
    {
      text: "Resentment is like drinking poison and then hoping it will kill your enemies.",
      author: "Nelson Mandela"
    },
    {
      text: "Forgiveness liberates the soul, it removes fear. That's why it's such a powerful weapon.",
      author: "Nelson Mandela"
    },
    {
      text: "Conquer anger by love, evil by good, greed by generosity, and lies by truth.",
      author: "Buddha"
    },
    {
      text: "The best bridge between despair and hope is a good night's sleep.",
      author: "E. Joseph Cossman"
    },
    {
      text: "A good laugh and a long sleep are the two best cures for anything.",
      author: "Irish Proverb"
    },
    {
      text: "Just think how many thoughts a blanket smothers while one lies alone in bed, and how many unhappy dreams it keeps warm.",
      author: "Franz Kafka"
    },
    {
      text: "The past has no power over the present moment.",
      author: "Eckhart Tolle"
    },
    {
      text: "Suffering needs time. It cannot survive in the now.",
      author: "Eckhart Tolle"
    },
    {
      text: "We are undone by each other – and if we're not, we're missing something.",
      author: "Judith Butler"
    },
    {
      text: "Without grievability, there is no life, or rather, there is something living that is other than life.",
      author: "Judith Butler"
    }
  ],
  nervous: [
    {
      text: "Change will not come if we wait for some other person, or if we wait for some other time. We are the ones we've been waiting for. We are the change that we seek.",
      author: "Barack Obama"
    },
    {
      text: "A change is brought about because ordinary people do extraordinary things.",
      author: "Barack Obama"
    },
    {
      text: "Non-violence is the highest form of courage. Face injustice with patience, resilience, and love, influencing hearts without harming anyone.",
      author: "Mahatma Gandhi"
    },
    {
      text: "The difference between what we do and what we are capable of can transform the world. Strive to maximize your potential daily.",
      author: "Mahatma Gandhi"
    },
    {
      text: "If your actions inspire others to dream more, learn more, do more and become more, you are a leader.",
      author: "Simon Sinek"
    },
    {
      text: "Leaders are the ones who have the courage to go first, to put themselves at personal risk to open a path for others to follow.",
      author: "Simon Sinek"
    },
    {
      text: "Politics is a strong and slow boring of hard boards.",
      author: "Max Weber"
    },
    {
      text: "Knowledge advances not by confirmation, but by falsification. A theory is scientific only if it can be proven wrong.",
      author: "Karl Popper"
    },
    {
      text: "The growth of knowledge consists in learning to be wrong in ever better ways.",
      author: "Karl Popper"
    }
  ],
  neutral: [
    {
      text: "People don't buy what you do; they buy why you do it.",
      author: "Simon Sinek"
    },
    {
      text: "Don't bend; don't water it down; don't try to make it logical; don't edit your own soul according to the fashion. Rather, follow your most intense obsessions.",
      author: "Franz Kafka"
    },
    {
      text: "In the fight between you and the world, back the world.",
      author: "Franz Kafka"
    },
    {
      text: "Man was born free, and he is everywhere in chains. Those who think themselves the masters of others are indeed greater slaves than they.",
      author: "Jean-Jacques Rousseau"
    },
    {
      text: "Liberty consists of doing anything which does not harm others: thus, the exercise of the natural rights of each man has only those borders which assure other members of the society the enjoyment of these same rights.",
      author: "Jean-Jacques Rousseau"
    },
    {
      text: "Resonance is a kind of relationship to the world, formed through affect and emotion, where subject and world are mutually affected and transformed.",
      author: "Hartmut Rosa"
    },
    {
      text: "History is the judge of the living. What happens is reasonable, for what is rational actualizes itself.",
      author: "Georg Wilhelm Friedrich Hegel"
    },
    {
      text: "The owl of Minerva spreads its wings only with the falling of the dusk.",
      author: "Georg Wilhelm Friedrich Hegel"
    },
    {
      text: "Systems can only change themselves – they are operationally closed but informationally open.",
      author: "Niklas Luhmann"
    },
    {
      text: "Act in such a way that you treat humanity, never merely as a means to an end.",
      author: "Immanuel Kant"
    },
    {
      text: "A society is well-ordered when its members share the same conception of justice.",
      author: "John Rawls"
    }
  ],
  calm: [
    {
      text: "Sleep is the golden chain that ties health and our bodies together.",
      author: "Thomas Dekker"
    },
    {
      text: "True silence is the rest of the mind, and is to the spirit what sleep is to the body, nourishment and refreshment.",
      author: "William Penn"
    },
    {
      text: "Learning to stand in somebody else's shoes, to see through their eyes, that's how peace begins. And it's up to you to make that happen. Empathy is a quality of character that can change the world.",
      author: "Barack Obama"
    },
    {
      text: "All of us share this world for but a brief moment in time. The question is whether we spend that time focused on what pushes us apart, or whether we commit ourselves to an effort — a sustained effort — to find common ground, to focus on the future we seek for our children, and to respect the dignity of all human beings.",
      author: "Barack Obama"
    },
    {
      text: "You will not be punished for your anger, you will be punished by your anger.",
      author: "Buddha"
    },
    {
      text: "Truth emerges through undistorted communication, where all participants have equal voice.",
      author: "Jürgen Habermas"
    },
    {
      text: "The public sphere is where citizens deliberate about common concerns – this is where democracy lives.",
      author: "Jürgen Habermas"
    },
    {
      text: "Justice requires that we make decisions as if we do not know our position in society.",
      author: "John Rawls"
    }
  ],
  energized: [
    {
      text: "By believing passionately in something that still does not exist, we create it. The nonexistent is whatever we have not sufficiently desired.",
      author: "Franz Kafka"
    },
    {
      text: "We achieve more when we chase the dream instead of the competition.",
      author: "Simon Sinek"
    },
    {
      text: "Holding onto anger is like drinking poison and expecting the other person to die.",
      author: "Attributed to Buddha"
    },
    {
      text: "For every minute you remain angry, you give up sixty seconds of peace of mind.",
      author: "Ralph Waldo Emerson"
    },
    {
      text: "Anger, when wisely used, is the fuel for courage.",
      author: "Modern wisdom"
    },
    {
      text: "When you channel anger, it becomes determination.",
      author: "Modern wisdom"
    },
    {
      text: "The protestant work ethic created the spirit of capitalism – but now the cage has become an iron cage of rationality.",
      author: "Max Weber"
    },
    {
      text: "Suicide is a social phenomenon, not an individual one – it happens when people lose social cohesion.",
      author: "Émile Durkheim"
    },
    {
      text: "Gender is not something that one is, it is something one does – a 'doing' rather than a 'being.'",
      author: "Judith Butler"
    },
    {
      text: "We lose ourselves in what we read, only to return to ourselves, transformed.",
      author: "Judith Butler"
    }
  ]
};

export const getRandomQuoteForEmotion = (emotion: EmotionType): EmotionQuote => {
  const quotes = emotionQuotes[emotion];
  return quotes[Math.floor(Math.random() * quotes.length)];
};
