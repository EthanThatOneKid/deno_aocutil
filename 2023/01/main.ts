import * as aocutil from "aocutil/aocutil.ts";

const digitNames = {
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
  "nine": 9,
};

if (import.meta.main) {
  const input = aocutil.readFile("./2023/1/input");
  const sum = input.split("\n").reduce((acc, line) => {
    for (const segment of line.split(" ")) {
      const calibration = getCalibration2(segment);
      acc += calibration;
    }

    return acc;
  }, 0);

  console.log(sum);
}

function getCalibration2(text: string): number {
  const digitNameLeft = findDigitNameLeft(text);
  const digitNameRight = findDigitNameRight(text);
  const digitLeft = findDigitLeft(text);
  const digitRight = findDigitRight(text);
  const left = getLeft(digitNameLeft, digitLeft);
  const right = getRight(digitNameRight, digitRight);
  if (left.index === -1 && right.index === -1) {
    return 0;
  }

  if (left.index === -1) {
    return right.value;
  }

  if (right.index === -1) {
    return left.value;
  }

  return Number(String(left.value) + String(right.value));
}

function getRight(
  v1: {
    value: number;
    index: number;
  } | undefined,
  v2: {
    value: number;
    index: number;
  } | undefined,
): {
  value: number;
  index: number;
} {
  if (v1 && v2) {
    if (v1.index > v2.index) {
      return v1;
    }

    return v2;
  }

  if (v1) {
    return v1;
  }

  if (v2) {
    return v2;
  }

  throw new Error("No right digit found");
}

function getLeft(
  v1: {
    value: number;
    index: number;
  } | undefined,
  v2: {
    value: number;
    index: number;
  } | undefined,
): {
  value: number;
  index: number;
} {
  if (v1 && v2) {
    if (v1.index < v2.index) {
      return v1;
    }

    return v2;
  }

  if (v1) {
    return v1;
  }

  if (v2) {
    return v2;
  }

  throw new Error("No left digit found");
}

function findDigitNameLeft(
  text: string,
): { value: number; index: number } | undefined {
  const [digitNameIndex, digitNameValue] = Object.keys(digitNames).reduce(
    ([currDigitNameIndex, currValue], key) => {
      const index = text.indexOf(key);
      if (
        index !== -1 &&
        (index < currDigitNameIndex || currDigitNameIndex === -1)
      ) {
        return [index, key];
      }

      return [currDigitNameIndex, currValue];
    },
    [-1, ""] as [number, string],
  );

  if (digitNameIndex !== -1) {
    return {
      value: Number(digitNames[digitNameValue]),
      index: digitNameIndex,
    };
  }
}

function findDigitNameRight(
  text: string,
): { value: number; index: number } | undefined {
  const [digitNameIndex, digitNameValue] = Object.keys(digitNames).reduce(
    ([currDigitNameIndex, currValue], key) => {
      const index = text.lastIndexOf(key);
      if (index !== -1 && index > currDigitNameIndex) {
        return [index, key];
      }

      return [currDigitNameIndex, currValue];
    },
    [-1, ""] as [number, string],
  );

  if (digitNameIndex !== -1) {
    return {
      value: Number(digitNames[digitNameValue]),
      index: digitNameIndex,
    };
  }
}

function findDigitLeft(
  text: string,
): { value: number; index: number } | undefined {
  let digit: string | undefined;
  let digitIndex = -1;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (isDigit(char)) {
      digit = char;
      digitIndex = i;
      break;
    }
  }

  if (digitIndex !== -1) {
    return {
      value: Number(digit),
      index: digitIndex,
    };
  }
}

function findDigitRight(
  text: string,
): { value: number; index: number } | undefined {
  let digit: string | undefined;
  let digitIndex = -1;
  for (let i = text.length - 1; i >= 0; i--) {
    const char = text[i];
    if (isDigit(char)) {
      digit = char;
      digitIndex = i;
      break;
    }
  }

  if (digitIndex !== -1) {
    return {
      value: Number(digit),
      index: digitIndex,
    };
  }
}

// Digit not including 0.
function isDigit(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 49 && code <= 57;
}
