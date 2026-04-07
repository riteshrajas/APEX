import { performance } from "perf_hooks";

// Current implementation
function cosineSimilarityOld(left: Map<string, number>, right: Map<string, number>): number {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (const value of left.values()) {
    leftMagnitude += value * value;
  }

  for (const value of right.values()) {
    rightMagnitude += value * value;
  }

  for (const [token, value] of left.entries()) {
    const rightValue = right.get(token) || 0;
    dot += value * rightValue;
  }

  const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
  if (denominator === 0) {
    return 0;
  }

  return dot / denominator;
}

// Optimized implementation
function cosineSimilarityNew(left: Map<string, number>, right: Map<string, number>): number {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (const [token, leftValue] of left.entries()) {
    leftMagnitude += leftValue * leftValue;
    const rightValue = right.get(token);
    if (rightValue !== undefined) {
      dot += leftValue * rightValue;
    }
  }

  for (const rightValue of right.values()) {
    rightMagnitude += rightValue * rightValue;
  }

  const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
  if (denominator === 0) {
    return 0;
  }

  return dot / denominator;
}

// Generate test data
const left = new Map<string, number>();
const right = new Map<string, number>();

for (let i = 0; i < 1000; i++) {
  left.set(`token_${i}`, Math.random() * 10);
  if (i % 2 === 0) {
    right.set(`token_${i}`, Math.random() * 10);
  } else {
    right.set(`token_other_${i}`, Math.random() * 10);
  }
}

function runBenchmark(name: string, fn: (l: Map<string, number>, r: Map<string, number>) => number) {
  // Warm up
  for (let i = 0; i < 10000; i++) {
    fn(left, right);
  }

  const start = performance.now();
  for (let i = 0; i < 100000; i++) {
    fn(left, right);
  }
  const end = performance.now();
  console.log(`${name}: ${end - start} ms`);
}

runBenchmark('Old', cosineSimilarityOld);
runBenchmark('New', cosineSimilarityNew);
