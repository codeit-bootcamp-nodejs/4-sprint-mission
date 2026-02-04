const {
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
} = require('./sorts');

/** 테스트 케이스 정의 */
const testCases = [
  {
    name: '일반 케이스',
    input: [5, 3, 8, 4, 2],
    expected: [2, 3, 4, 5, 8],
  },
  {
    name: '이미 정렬됨',
    input: [1, 2, 3, 4, 5],
    expected: [1, 2, 3, 4, 5],
  },
  {
    name: '역순',
    input: [5, 4, 3, 2, 1],
    expected: [1, 2, 3, 4, 5],
  },
  {
    name: '중복 값 포함',
    input: [3, 1, 4, 1, 5, 9, 2, 6],
    expected: [1, 1, 2, 3, 4, 5, 6, 9],
  },
];

/** 배열 비교 헬퍼 */
function isEqualArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** 단일 테스트 실행 */
function runTestCase(sortFn, isInPlace, { name, input, expected }) {
  const original = [...input];
  let result;

  if (isInPlace) {
    sortFn(input);
    result = input;
  } else {
    result = sortFn(input);
  }

  const sortedOk = isEqualArray(result, expected);
  const originalPreserved = isInPlace || isEqualArray(input, original);

  console.log(`\n  ${name}`);
  console.log(`  정렬 결과: ${sortedOk ? '✅ 통과' : '❌ 실패'}`);

  if (!sortedOk) {
    console.log('    기대값:', expected);
    console.log('    결과값:', result);
  }

  if (!isInPlace) {
    console.log(`  원본 유지: ${originalPreserved ? '✅ 통과' : '❌ 실패'}`);
    if (!originalPreserved) {
      console.log('    원본:', original);
      console.log('    현재:', input);
    }
  }

  return sortedOk && originalPreserved;
}

/** 정렬 알고리즘 테스트 */
function testSort(name, sortFn, isInPlace) {
  console.log(`\n<<<< ${name} >>>>`);

  let passCount = 0;
  testCases.forEach((testCase) => {
    if (runTestCase(sortFn, isInPlace, testCase)) {
      passCount++;
    }
  });

  console.log(`\n  결과: ${passCount}/${testCases.length} 통과`);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 정렬 알고리즘 테스트');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

testSort('선택 정렬', selectionSort, true);
testSort('삽입 정렬', insertionSort, true);
testSort('병합 정렬', mergeSort, false);
testSort('퀵 정렬', quickSort, true);
testSort('힙 정렬', heapSort, true);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ 모든 테스트 완료!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
