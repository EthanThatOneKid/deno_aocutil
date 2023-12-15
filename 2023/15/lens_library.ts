function hash(step: string): number {
  let current = 0;
  for (const char of step) {
    const ascii = char.charCodeAt(0);
    current += ascii;
    current *= 17;
    current %= 256;
  }

  return current;
}

type Step = string;

interface InitializationSequence {
  steps: Step[];
}

function parseInitializationSequence(input: string): InitializationSequence {
  const steps = input.replace(/\,/g, " ").split(/\s+/);
  console.log(steps);
  return { steps };
}

function sumHashes(steps: Step[]): number {
  return steps.reduce((acc, step) => acc + hash(step), 0);
}

export function sumHashesFromInput(input: string): number {
  const sequence = parseInitializationSequence(input);
  return sumHashes(sequence.steps);
}
