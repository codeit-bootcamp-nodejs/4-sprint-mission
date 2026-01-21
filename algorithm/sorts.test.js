const { selectionSort, insertionSort, mergeSort, quickSort } = require('./sorts');

// 테스트 헬퍼 함수
function testSort(sortName, sortFunction, isInPlace) {
  console.log(`\n<<<< ${sortName} >>>>`);

  // 테스트 케이스 1: 일반적인 경우
  const test1 = [5, 3, 8, 4, 2];
  console.log('테스트 1 - 원본:', JSON.stringify(test1));

  if (isInPlace) {
    sortFunction(test1);
    console.log('정렬 후:', JSON.stringify(test1));
    console.log('결과:', JSON.stringify(test1) === JSON.stringify([2, 3, 4, 5, 8]) ? '✅ 통과' : '❌ 실패');
  } else {
    const sorted1 = sortFunction(test1);
    console.log('정렬 결과:', JSON.stringify(sorted1));
    console.log('원본 유지:', JSON.stringify(test1) === JSON.stringify([5, 3, 8, 4, 2]) ? '✅ 통과' : '❌ 실패');
    console.log('정렬 정확성:', JSON.stringify(sorted1) === JSON.stringify([2, 3, 4, 5, 8]) ? '✅ 통과' : '❌ 실패');
  }

  // 테스트 케이스 2: 이미 정렬된 경우
  const test2 = [1, 2, 3, 4, 5];
  console.log('\n테스트 2 - 이미 정렬됨:', JSON.stringify(test2));

  if (isInPlace) {
    sortFunction(test2);
    console.log('정렬 후:', JSON.stringify(test2));
    console.log('결과:', JSON.stringify(test2) === JSON.stringify([1, 2, 3, 4, 5]) ? '✅ 통과' : '❌ 실패');
  } else {
    const sorted2 = sortFunction(test2);
    console.log('정렬 결과:', JSON.stringify(sorted2));
    console.log('결과:', JSON.stringify(sorted2) === JSON.stringify([1, 2, 3, 4, 5]) ? '✅ 통과' : '❌ 실패');
  }

  // 테스트 케이스 3: 역순 정렬된 경우
  const test3 = [5, 4, 3, 2, 1];
  console.log('\n테스트 3 - 역순:', JSON.stringify(test3));

  if (isInPlace) {
    sortFunction(test3);
    console.log('정렬 후:', JSON.stringify(test3));
    console.log('결과:', JSON.stringify(test3) === JSON.stringify([1, 2, 3, 4, 5]) ? '✅ 통과' : '❌ 실패');
  } else {
    const sorted3 = sortFunction(test3);
    console.log('정렬 결과:', JSON.stringify(sorted3));
    console.log('결과:', JSON.stringify(sorted3) === JSON.stringify([1, 2, 3, 4, 5]) ? '✅ 통과' : '❌ 실패');
  }

  // 테스트 케이스 4: 중복 값이 있는 경우
  const test4 = [3, 1, 4, 1, 5, 9, 2, 6];
  console.log('\n테스트 4 - 중복 값:', JSON.stringify(test4));

  if (isInPlace) {
    sortFunction(test4);
    console.log('정렬 후:', JSON.stringify(test4));
    console.log('결과:', JSON.stringify(test4) === JSON.stringify([1, 1, 2, 3, 4, 5, 6, 9]) ? '✅ 통과' : '❌ 실패');
  } else {
    const sorted4 = sortFunction(test4);
    console.log('정렬 결과:', JSON.stringify(sorted4));
    console.log('결과:', JSON.stringify(sorted4) === JSON.stringify([1, 1, 2, 3, 4, 5, 6, 9]) ? '✅ 통과' : '❌ 실패');
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 정렬 알고리즘 테스트');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 각 정렬 알고리즘 테스트
testSort('선택 정렬', selectionSort, true);
testSort('삽입 정렬', insertionSort, true);
testSort('병합 정렬', mergeSort, false);
testSort('퀵 정렬', quickSort, true);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ 모든 테스트 완료!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
