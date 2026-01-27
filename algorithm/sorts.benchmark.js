const {
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
} = require('./sorts');

/** 랜덤 배열 생성 (Fisher-Yates 셔플) */
function generateRandomArray(size) {
  // 0 ~ size-1 순차 배열 생성
  const arr = Array.from({ length: size }, (_, i) => i);

  // Fisher-Yates 셔플 - 중복 없는 완전 랜덤 배열
  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/** 시간 측정 (ms 단위) */
function measureTime(sortFn, arr, inPlace) {
  const input = [...arr];

  const start = process.hrtime.bigint();

  if (inPlace) {
    // in-place 정렬: 원본 배열 직접 수정
    sortFn(input);
  } else {
    // 새 배열 반환하는 정렬: 반환값 생성 시간 포함
    const result = sortFn(input);
    void result; // 반환값 사용 안 함을 명시
  }

  const end = process.hrtime.bigint();
  return Number(end - start) / 1_000_000; // 나노초 → 밀리초
}

/** 정렬 벤치마크 (평균값 반환) */
function benchmarkSort({ name, sortFn, inPlace, complexity }, size, repeat = 5) {
  // JIT 워밍업 1회 (결과 버림)
  const warmupData = generateRandomArray(size);
  measureTime(sortFn, warmupData, inPlace);

  // 실제 측정
  let total = 0;
  for (let i = 0; i < repeat; i++) {
    const data = generateRandomArray(size);
    total += measureTime(sortFn, data, inPlace);
  }

  const avg = total / repeat;
  return { name, size, avg, complexity };
}

/** 결과 테이블 출력 */
function printResults(results) {
  console.log('\n┌──────────┬────────┬──────────┬────────────┐');
  console.log('│ 정렬 알고리즘 │   크기   │ 평균 시간  │ 시간 복잡도  │');
  console.log('├──────────┼────────┼──────────┼────────────┤');

  results.forEach(({ name, size, avg, complexity }) => {
    const avgStr = avg < 1 ? `${avg.toFixed(3)}ms` : `${avg.toFixed(2)}ms`;
    console.log(
      `│ ${name.padEnd(8)} │ ${size.toString().padStart(6)} │ ${avgStr.padStart(8)} │ ${complexity.padEnd(10)} │`
    );
  });

  console.log('└──────────┴────────┴──────────┴────────────┘');
}

/** 테스트 대상 정의 */
const sorts = [
  { name: '선택 정렬', sortFn: selectionSort, inPlace: true, complexity: 'O(n²)' },
  { name: '삽입 정렬', sortFn: insertionSort, inPlace: true, complexity: 'O(n²)' },
  { name: '병합 정렬', sortFn: mergeSort, inPlace: false, complexity: 'O(n log n)' },
  { name: '퀵 정렬', sortFn: quickSort, inPlace: true, complexity: 'O(n log n)' },
  { name: '힙 정렬', sortFn: heapSort, inPlace: true, complexity: 'O(n log n)' },
];

/** 실행 */
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('⏱  정렬 알고리즘 성능 벤치마크');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n📊 측정 조건:');
console.log('   - JIT 워밍업 1회 후 측정');
console.log('   - 각 크기별 5회 반복 평균값');
console.log('   - Fisher-Yates 셔플 (중복 없는 랜덤 배열)');
console.log('   - process.hrtime.bigint() 사용');

const sizes = [1000, 5000, 10000];
const allResults = [];

sizes.forEach((size) => {
  console.log(`\n🔄 n = ${size} 측정 중...`);

  sorts.forEach((sort) => {
    const result = benchmarkSort(sort, size);
    allResults.push(result);
  });
});

printResults(allResults);

console.log('\n💡 분석:');
console.log('   - O(n²) 알고리즘: 입력 크기 증가 시 실행 시간이 제곱으로 증가');
console.log('   - O(n log n) 알고리즘: 입력 크기 증가 시 완만하게 증가');
console.log('   - 실제 측정값은 하드웨어/Node 버전에 따라 변동 가능');
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
