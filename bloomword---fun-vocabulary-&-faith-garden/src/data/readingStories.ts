import { ReadingStory } from '../types';

export const INITIAL_STORIES: ReadingStory[] = [
  {
    id: 'story-1',
    title: 'The Secret Ribbon Garden',
    subtitle: 'A tale of perseverance, friendship, and gentle care',
    theme: 'Perseverance & Kindness',
    icon: '🌸',
    passage: `Every afternoon after school, Clara carried a small watering can to the edge of the stone terrace. There, nestled behind overgrown ivy, was a hidden corner she called her secret sanctuary. 

Last spring, the patch had looked barren and dry. Her older brother warned her that nothing delicate could survive the chilly winds. But Clara possessed remarkable perseverance. She carefully weeded the soil, planted tiny fragile seedlings, and tied soft pink ribbons to wooden stakes to support the young stems.

As weeks passed with daily sunshine and water, the blossoms began to flourish into fragrant, radiant peonies and lavender. Whenever a friend visited feeling down, Clara would generously pluck a blossom and tie it with a satin ribbon. Clara learned that true beauty comes from patient love and dedication.`,
    vocabularyFocus: ['sanctuary', 'perseverance', 'fragile', 'flourish', 'radiant'],
    completed: true,
    bestScore: 100,
    questions: [
      {
        id: 'q1-1',
        question: 'What motivated Clara to keep caring for the garden even when her brother doubted her?',
        options: ['Her remarkable perseverance', 'She wanted to sell flowers for coins', 'She was forced to do garden chores', 'She wanted to hide from school'],
        correctIndex: 0,
        explanation: 'Clara showed perseverance by continuing to work hard even when it was difficult.'
      },
      {
        id: 'q1-2',
        question: 'Why did Clara tie soft pink ribbons to the wooden stakes?',
        options: ['To identify each flower type', 'To support the young fragile stems against the wind', 'To scare away birds', 'Because she had extra ribbons to throw away'],
        correctIndex: 1,
        explanation: 'She used the ribbons to protect and support the fragile stems so they could grow safely.'
      },
      {
        id: 'q1-3',
        question: 'In the story, what does the word "sanctuary" mean for Clara?',
        options: ['A noisy playground', 'A peaceful, safe place to rest and care for flowers', 'A dark basement', 'A busy marketplace'],
        correctIndex: 1,
        explanation: 'A sanctuary is a safe, peaceful shelter where Clara felt calm and happy.'
      },
      {
        id: 'q1-4',
        question: 'What happened when Clara’s friends visited feeling sad or down?',
        options: ['She asked them to leave', 'She generously shared a flower tied with ribbon to cheer them up', 'She ignored them', 'She complained about the weeds'],
        correctIndex: 1,
        explanation: 'Clara was generous and compassionate, sharing the beauty of her garden to brighten their day.'
      }
    ]
  },
  {
    id: 'story-2',
    title: 'Lily and the Luminous Lantern',
    subtitle: 'A journey of curiosity and courageous steps',
    theme: 'Courage & Curiosity',
    icon: '✨',
    passage: `Deep inside the whispering pine forest, evening shadows always grew quickly. Ten-year-old Lily felt her heart beat fast whenever the sun began to sink. Yet tonight, her little white puppy, Mochi, had wandered toward the meadow path chasing a glowing blue moth.

Lily did not hesitate for long. Driven by love for her puppy and a bright spark of curiosity, she grabbed the antique glass lantern resting on the porch. Inside the glass glowed a tiny fairy light that cast a soft, luminous circle on the dirt trail.

Taking courageous steps into the dim woods, Lily called out gently: "Mochi, shalom, come here buddy!" Soon, two fluffy white ears poked out from behind a wild rosebush. Mochi ran into her arms, wagging his tail. Clutching the puppy close, Lily felt a deep wave of gratitude. She realized that courage doesn’t mean never feeling afraid—it means moving forward with love anyway.`,
    vocabularyFocus: ['hesitate', 'curiosity', 'luminous', 'courageous', 'gratitude'],
    completed: false,
    questions: [
      {
        id: 'q2-1',
        question: 'Why did Lily venture into the woods even though she felt nervous about the dark?',
        options: ['She was searching for her lost puppy Mochi', 'She was playing hide and seek with friends', 'She wanted to sleep in a tent', 'She lost her notebook'],
        correctIndex: 0,
        explanation: 'Lily stepped out bravely because she loved her puppy and wanted to ensure he was safe.'
      },
      {
        id: 'q2-2',
        question: 'What does the word "luminous" describe in the story?',
        options: ['The barking sound of the dog', 'The soft glowing light cast by the lantern', 'The chilly evening temperature', 'The heavy wooden porch'],
        correctIndex: 1,
        explanation: 'Luminous means giving off light or glowing brightly.'
      },
      {
        id: 'q2-3',
        question: 'What did Lily learn about what it means to be "courageous"?',
        options: ['It means never ever being scared', 'It means moving forward with love even when you feel nervous', 'It means shouting very loudly', 'It means never asking for help'],
        correctIndex: 1,
        explanation: 'Being courageous means doing what is right and loving even when facing fear.'
      },
      {
        id: 'q2-4',
        question: 'How did Lily feel once she held Mochi safely in her arms?',
        options: ['She felt deep gratitude', 'She felt furious and angry', 'She felt bored and sleepy', 'She wanted to run away'],
        correctIndex: 0,
        explanation: 'Lily was filled with gratitude and thankfulness that Mochi was safe.'
      }
    ]
  },
  {
    id: 'story-3',
    title: 'The Resilient Meadow Song',
    subtitle: 'Finding harmony and grace after a summer storm',
    theme: 'Resilience & Harmony',
    icon: '🌷',
    passage: `A sudden summer thunderstorm had swept across Willow Creek. Strong gusts of wind whipped through the orchard, and heavy raindrops bent the tall sunflowers down toward the mud. 

Inside the cottage, Hannah watched through the window with concern. But by late afternoon, the dark storm clouds parted, leaving a double rainbow arched across the pale pink horizon. When Hannah stepped outside, she noticed something extraordinary. The bent sunflowers were already lifting their golden faces toward the sun. They were remarkably resilient.

A family of songbirds settled in the maple branches, singing in a harmonious chorus. The cool breeze smelled of fresh earth and rain-washed clover. Hannah smiled as she remembered the Bible verse about grace being renewed every morning. Just like nature bounces back after the rain, every day offers a fresh chance to bloom again.`,
    vocabularyFocus: ['extraordinary', 'resilient', 'harmonious', 'compassion', 'beautiful'],
    completed: false,
    questions: [
      {
        id: 'q3-1',
        question: 'What happened to the sunflowers during the thunderstorm?',
        options: ['They were bent down toward the ground by heavy rain', 'They flew away in the wind', 'They turned completely blue', 'They turned into trees'],
        correctIndex: 0,
        explanation: 'The storm bent the flowers down, but they were resilient and rose again afterwards.'
      },
      {
        id: 'q3-2',
        question: 'What made the sunflowers "resilient"?',
        options: ['They withered away and never came back', 'They stood back up and recovered quickly after the storm passed', 'They had thorns on their leaves', 'They were planted in stone'],
        correctIndex: 1,
        explanation: 'Resilient means able to recover quickly and bounce back after a difficulty!'
      },
      {
        id: 'q3-3',
        question: 'What does "harmonious" tell us about how the songbirds sang?',
        options: ['They made a loud, screeching racket', 'Their notes blended together in a pleasing, sweet tune', 'Only one bird was allowed to make noise', 'They were arguing with each other'],
        correctIndex: 1,
        explanation: 'Harmonious describes sounds that blend together in sweet agreement and beauty.'
      }
    ]
  }
];
