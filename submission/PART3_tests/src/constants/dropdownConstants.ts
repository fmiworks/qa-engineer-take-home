// dropdownConstants.ts

export const pickRandomOption = <T>(options: T[]): T =>
  options[Math.floor(Math.random() * options.length)];


export const site = [
  'Melbourne General Hospital',
  'Sunrise Aged Care',
  'Bayside Primary School',
];

export const priority = [
  'Low',
  'Medium',
  'High',
  'Critical'
];

export const source = [
  'Adhoc Request',
  'Planned Job',
];