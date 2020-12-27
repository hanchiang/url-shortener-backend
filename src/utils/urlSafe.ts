const base62Characters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];

/**
 * Replace '+' and '/' with any of the base62 characters
 * Remove any non-alphanumeric characters
 * @param b64
 */
export const urlSafe = (b64: string) => {
  const randomChar =
    base62Characters[Math.floor(Math.random() * base62Characters.length)];
  const randomChar2 =
    base62Characters[Math.floor(Math.random() * base62Characters.length)];
  return b64
    .replace(/\+/g, randomChar)
    .replace(/\//g, randomChar2)
    .replace(/[^a-zA-Z0-9]/g, '');
};
