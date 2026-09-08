import { BibleWord } from '../types';

export const INITIAL_BIBLE_WORDS: BibleWord[] = [
  {
    id: 'b-1',
    word: 'Shalom',
    pronunciation: 'shah-LOHM',
    childDefinition: 'A warm Hebrew greeting and blessing that means peace, wholeness, safety, and being filled with God’s calm love in your heart.',
    scriptureReference: 'Numbers 6:24-26',
    scriptureVerse: 'The Lord bless you and keep you; the Lord make his face shine on you... and give you shalom (peace).',
    realLifeExample: 'When you feel nervous before a spelling bee, taking a deep breath and praying for Shalom helps your heart feel calm, safe, and happy.',
    mastered: false,
    timesPracticed: 2,
    correctCount: 2,
    lastPracticedDate: new Date().toISOString().split('T')[0],
    quickChallenges: [
      {
        id: 'sc-1',
        question: 'What is the main meaning of the beautiful word "Shalom"?',
        options: ['Being busy and loud', 'Peace, wholeness, and calmness in God', 'Winning a contest', 'A type of musical horn'],
        correctIndex: 1,
        explanation: 'Shalom means true peace and completeness from God!'
      },
      {
        id: 'sc-2',
        question: 'From which language does the word "Shalom" originate?',
        options: ['Hebrew', 'Latin', 'Greek', 'French'],
        correctIndex: 0,
        explanation: 'Shalom is a beloved Hebrew word used for greetings and blessings.'
      }
    ]
  },
  {
    id: 'b-2',
    word: 'Grace',
    pronunciation: 'GRAYSS',
    childDefinition: 'God’s generous, unconditional love and unearned favor given to us freely, even when we make mistakes.',
    scriptureReference: 'Ephesians 2:8',
    scriptureVerse: 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.',
    realLifeExample: 'When your friend accidentally spills juice on your drawing, and instead of getting upset you forgive her with a smile—you are showing grace.',
    mastered: true,
    timesPracticed: 3,
    correctCount: 3,
    lastPracticedDate: new Date().toISOString().split('T')[0],
    quickChallenges: [
      {
        id: 'gc-1',
        question: 'Grace is best described as:',
        options: ['A free gift of loving favor we do not have to earn', 'A ribbon you win for running fast', 'A strict set of classroom rules', 'Paying money for a toy'],
        correctIndex: 0,
        explanation: 'Grace is God’s unconditional, unearned love given freely like a magnificent gift!'
      }
    ]
  },
  {
    id: 'b-3',
    word: 'Faith',
    pronunciation: 'FAYTH',
    childDefinition: 'Trusting and believing in God with all your heart, even when you cannot see what is coming next.',
    scriptureReference: 'Hebrews 11:1',
    scriptureVerse: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
    realLifeExample: 'Just like you trust a sturdy bridge to hold you when walking across, faith means trusting that God is always watching over you.',
    mastered: false,
    timesPracticed: 1,
    correctCount: 1,
    lastPracticedDate: new Date().toISOString().split('T')[0],
    quickChallenges: [
      {
        id: 'fc-1',
        question: 'What does having faith mean?',
        options: ['Only believing what you can touch right now', 'Trusting in God with complete confidence and love', 'Waiting for bad things to happen', 'Never trying new things'],
        correctIndex: 1,
        explanation: 'Faith means holding onto confidence and trusting God with all your heart.'
      }
    ]
  },
  {
    id: 'b-4',
    word: 'Hallelujah',
    pronunciation: 'hah-lay-LOO-yah',
    childDefinition: 'A joyful shout or song of celebration that means "Praise the Lord!" with happiness.',
    scriptureReference: 'Psalm 150:6',
    scriptureVerse: 'Let everything that has breath praise the Lord. Hallelujah!',
    realLifeExample: 'Singing with your friends in choir with hands clapping in celebration is singing hallelujah.',
    mastered: false,
    timesPracticed: 1,
    correctCount: 1,
    lastPracticedDate: null,
    quickChallenges: [
      {
        id: 'hc-1',
        question: 'What does the cheerful word "Hallelujah" mean?',
        options: ['Be very quiet', 'Praise the Lord!', 'Good night and sweet dreams', 'Let us go home'],
        correctIndex: 1,
        explanation: 'Hallelujah is a wonderful shout of praise and gratitude to God!'
      }
    ]
  },
  {
    id: 'b-5',
    word: 'Covenant',
    pronunciation: 'KUHV-uh-nuhnt',
    childDefinition: 'A sacred, unbreakable promise of love and faithfulness between God and His people.',
    scriptureReference: 'Genesis 9:13',
    scriptureVerse: 'I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth.',
    realLifeExample: 'When God painted the brilliant rainbow across the sky after the rain, He gave us a reminder of His covenant promise never to forget us.',
    mastered: false,
    timesPracticed: 0,
    correctCount: 0,
    lastPracticedDate: null,
    quickChallenges: [
      {
        id: 'cc-1',
        question: 'What is a covenant in the Bible?',
        options: ['A temporary agreement that is easily broken', 'A sacred, loving, and lasting promise', 'A kind of ship', 'A type of coin'],
        correctIndex: 1,
        explanation: 'A covenant is a deep, unbreakable promise of commitment and love.'
      }
    ]
  },
  {
    id: 'b-6',
    word: 'Mercy',
    pronunciation: 'MUR-see',
    childDefinition: 'Kindness, gentle compassion, and forgiveness shown to someone when they need help or when they made a mistake.',
    scriptureReference: 'Lamentations 3:22-23',
    scriptureVerse: 'Because of the Lord’s great love we are not consumed, for his compassions never fail. They are new every morning.',
    realLifeExample: 'If your puppy chews your favorite bow, giving him a gentle pat and teaching him patiently instead of yelling is showing mercy.',
    mastered: false,
    timesPracticed: 1,
    correctCount: 1,
    lastPracticedDate: null,
    quickChallenges: [
      {
        id: 'mc-1',
        question: 'When do we show mercy to others?',
        options: ['When we show gentle forgiveness and tender care', 'When we ignore people who need help', 'When we demand everything go our way', 'Only on birthdays'],
        correctIndex: 0,
        explanation: 'Mercy is showing tender forgiveness and kind help to others!'
      }
    ]
  },
  {
    id: 'b-7',
    word: 'Wisdom',
    pronunciation: 'WIZ-duhm',
    childDefinition: 'Having good sense, understanding what is right, and using your knowledge to make kind and loving choices.',
    scriptureReference: 'Proverbs 3:13',
    scriptureVerse: 'Blessed is the one who finds wisdom, and the one who gains understanding.',
    realLifeExample: 'Choosing to do your reading practice before watching videos is an example of using wisdom!',
    mastered: false,
    timesPracticed: 2,
    correctCount: 2,
    lastPracticedDate: new Date().toISOString().split('T')[0],
    quickChallenges: [
      {
        id: 'wc-1',
        question: 'Wisdom is more than just knowing facts. What else is it?',
        options: ['Using understanding to make good, loving choices', 'Knowing how to run the fastest', 'Having the most toys', 'Staying up very late'],
        correctIndex: 0,
        explanation: 'Wisdom helps you choose the right and kindest path in life!'
      }
    ]
  },
  {
    id: 'b-8',
    word: 'Amen',
    pronunciation: 'ah-MEN (or ay-MEN)',
    childDefinition: 'A word of heartfelt agreement said at the end of prayers that means "Truly, let it be so!"',
    scriptureReference: 'Revelation 22:20',
    scriptureVerse: 'He who testifies to these things says, "Yes, I am coming soon." Amen. Come, Lord Jesus.',
    realLifeExample: 'When your family finishes thanking God at dinner and you say "Amen," you are agreeing with your whole heart.',
    mastered: false,
    timesPracticed: 0,
    correctCount: 0,
    lastPracticedDate: null,
    quickChallenges: [
      {
        id: 'ac-1',
        question: 'Why do we say "Amen" at the conclusion of a prayer?',
        options: ['To signify "Truly, so be it!" in sincere agreement', 'Because the timer is ringing', 'To announce dinner is ready', 'As a secret code'],
        correctIndex: 0,
        explanation: 'Amen means "So be it" and shows that our hearts agree!'
      }
    ]
  }
];
