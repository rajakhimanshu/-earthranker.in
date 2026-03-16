export const famousProfiles = [
  {
    name: 'Elon Musk',
    emoji: '🚀',
    fact: 'Left-handed, green eyes, O- blood, and taught himself to code at age 10.',
    traits: {
      handedness: 'Left',
      eyeColor: 'Green',
      bloodType: 'O-',
      education: "Bachelor's degree"
    }
  },
  {
    name: 'Albert Einstein',
    emoji: '🧠',
    fact: 'Right-handed, brown eyes, A- blood, and held a PhD in physics.',
    traits: {
      handedness: 'Right',
      eyeColor: 'Brown',
      bloodType: 'A-',
      education: 'Doctorate / PhD'
    }
  },
  {
    name: 'Marie Curie',
    emoji: '🔬',
    fact: 'Right-handed, gray eyes, A+ blood. First woman to win a Nobel Prize.',
    traits: {
      handedness: 'Right',
      eyeColor: 'Gray',
      bloodType: 'A+',
      education: 'Doctorate / PhD'
    }
  },
  {
    name: 'Nikola Tesla',
    emoji: '⚡',
    fact: 'Right-handed, blue eyes. Dropped out of college but revolutionized electricity.',
    traits: {
      handedness: 'Right',
      eyeColor: 'Blue',
      education: 'Some college'
    }
  },
  {
    name: 'Leonardo da Vinci',
    emoji: '🎨',
    fact: 'Ambidextrous, hazel eyes, self-taught polymath of the Renaissance.',
    traits: {
      handedness: 'Ambidextrous',
      eyeColor: 'Hazel',
      education: 'No formal education'
    }
  },
  {
    name: 'Cleopatra',
    emoji: '👑',
    fact: 'Right-handed, brown eyes. Highly educated in philosophy and languages.',
    traits: {
      handedness: 'Right',
      eyeColor: 'Brown',
      education: "Master's degree"
    }
  },
  {
    name: 'Barack Obama',
    emoji: '🏛️',
    fact: 'Left-handed, brown eyes, AB blood. Graduated from Harvard Law (Professional Degree).',
    traits: {
      handedness: 'Left',
      eyeColor: 'Brown',
      bloodType: 'AB+', // Using AB+ as a stand-in for AB
      education: 'Doctorate / PhD'
    }
  },
  {
    name: 'Bill Gates',
    emoji: '💻',
    fact: 'Left-handed, blue eyes, O+ blood. Famous Harvard dropout.',
    traits: {
      handedness: 'Left',
      eyeColor: 'Blue',
      bloodType: 'O+',
      education: 'Some college'
    }
  },
  {
    name: 'Serena Williams',
    emoji: '🎾',
    fact: 'Right-handed, brown eyes. Revolutionized women\'s tennis.',
    traits: {
      handedness: 'Right',
      eyeColor: 'Brown',
      bloodType: 'O+',
      education: 'High school'
    }
  },
  {
    name: 'Marilyn Monroe',
    emoji: '🌟',
    fact: 'Left-handed, blue eyes. An iconic figure of the 20th century.',
    traits: {
      handedness: 'Left',
      eyeColor: 'Blue',
      bloodType: 'AB-',
      education: 'High school'
    }
  }
];

// --- TEST CODE (can be removed later) ---
/*
import { calculateScore } from './rarityData.js';
console.log("--- Famous Profiles Score Test ---");
famousProfiles.forEach(p => {
  const result = calculateScore(p.traits);
  console.log(`${p.name}: Score = ${result.score}, Tier = ${result.rarityTier}, 1-in-${result.oneIn}`);
});
*/
