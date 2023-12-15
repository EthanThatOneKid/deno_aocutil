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

interface InitializationSequence<T> {
  steps: T[];
}

function parseInitializationSequence(
  input: string,
): InitializationSequence<Step> {
  const steps = input.replace(/\,/g, " ").split(/\s+/);
  return { steps };
}

function sumHashes(steps: Step[]): number {
  return steps.reduce((acc, step) => acc + hash(step), 0);
}

export function sumHashesFromInput(input: string): number {
  const sequence = parseInitializationSequence(input);
  return sumHashes(sequence.steps);
}

enum Operator {
  DASH = "-",
  EQUALS = "=",
}

interface DashStep {
  label: string;
  operator: Operator.DASH;
}

interface EqualsStep {
  label: string;
  operator: Operator.EQUALS;
  focalLength: number;
}

type Step2 = DashStep | EqualsStep;

function parseStep2(raw: string): Step2 {
  const [label, operator, focalLength] = raw.split(/(\-|\=)/);
  switch (operator) {
    case Operator.DASH: {
      return { label, operator };
    }

    case Operator.EQUALS: {
      return { label, operator, focalLength: Number(focalLength) };
    }

    default: {
      throw new Error(`Invalid step: '${raw}'`);
    }
  }
}

function parseInitializationSequence2(
  input: string,
): InitializationSequence<Step2> {
  const steps = input.replace(/\,/g, " ").split(/\s+/).filter((s) => s);
  return { steps: steps.map((raw) => parseStep2(raw)) };
}

function boxesFrom(steps: Step2[]): BoxMap {
  const boxes = new Map<number, EqualsStep[]>();
  for (const step of steps) {
    switch (step.operator) {
      case Operator.DASH: {
        const boxNumber = hash(step.label);
        const box = boxes.get(boxNumber);
        if (box?.some((s) => s.label === step.label)) {
          boxes.set(boxNumber, box.filter((s) => s.label !== step.label));
        }

        break;
      }

      case Operator.EQUALS: {
        const boxNumber = hash(step.label);
        const box = boxes.get(boxNumber) ?? [];
        const slotNumber = box?.findIndex((s) => s.label === step.label);
        if (slotNumber !== -1) {
          box[slotNumber] = step;
        } else {
          box.push(step);
        }

        boxes.set(boxNumber, box);
        break;
      }

      default: {
        throw new Error("Invalid operator");
      }
    }
  }

  return boxes;
}

function focusingPower(
  boxNumber: number,
  slotNumber: number,
  focalLength: number,
): number {
  return (boxNumber + 1) * (slotNumber + 1) * focalLength;
}

type BoxMap = Map<number, EqualsStep[]>;

function sumFocusingPower(steps: Step2[]): number {
  const boxes = boxesFrom(steps);

  let sum = 0;
  for (const [boxNumber, box] of boxes) {
    for (let slotNumber = 0; slotNumber < box.length; slotNumber++) {
      const step = box[slotNumber];
      const power = focusingPower(boxNumber, slotNumber, step.focalLength);
      sum += power;
    }
  }

  return sum;
}

export function sumFocusingPowerFromInput(input: string): number {
  const sequence = parseInitializationSequence2(input);
  return sumFocusingPower(sequence.steps);
}
