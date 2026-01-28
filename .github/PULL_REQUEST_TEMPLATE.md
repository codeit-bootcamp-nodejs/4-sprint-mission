## Mission 12: 정렬 알고리즘 구현

### 요구사항
#### 기본
- [x] 선택 정렬(Selection Sort) 구현
- [x] 삽입 정렬(Insertion Sort) 구현
- [x] 병합 정렬(Merge Sort) 구현
- [x] 퀵 정렬(Quick Sort) 구현

### 주요 변경사항
- `selectionSort()`: 최솟값을 찾아 앞에서부터 정렬하는 선택 정렬 알고리즘 구현
- `insertionSort()`: 정렬된 부분과 비교하며 삽입하는 삽입 정렬 알고리즘 구현
- `mergeSort()` & `merge()`: 분할 정복 방식의 병합 정렬 알고리즘 구현
- `quickSort()` & `partition()`: 피벗 기준으로 분할하는 퀵 정렬 알고리즘 구현
- 4가지 정렬 알고리즘 각각에 대한 테스트 케이스 작성 및 결과 출력

---

## Mission 13: 자료 구조 및 힙 정렬 구현

### 요구사항
#### 기본
- [x] 링크드 리스트 (LinkedList) 구현
- [x] 이중 링크드 리스트 (DoublyLinkedList) 구현
- [x] 큐 (Queue) 구현
- [x] 스택 (Stack) 구현
- [x] 이진 탐색 트리 (BinarySearchTree) 구현
- [x] 힙 정렬 (Heapsort) 구현

### 주요 변경사항
#### 자료 구조
- `LinkedList`: 노드 추가, 탐색, 중간 삽입/삭제 기능이 있는 단일 연결 리스트 구현
- `DoublyLinkedList`: 양방향 탐색 및 삽입/삭제가 가능한 이중 연결 리스트 구현
- `Queue`: FIFO 방식의 큐 자료구조 구현
- `Stack`: LIFO 방식의 스택 자료구조 구현
- `BinarySearchTree`: 값의 삽입, 검색, 삭제가 가능한 이진 탐색 트리 구현

#### 알고리즘
- `heapsort()`: 최대 힙(Max Heap)을 구성하여 배열을 정렬하는 힙 정렬 알고리즘 구현 (`sorts.js`에 추가)

---

## 멘토에게
- 정렬 알고리즘은 `sorts.js`에, 자료 구조는 각각의 클래스 파일(`LinkedList.js` 등)로 분리하여 구현했습니다.
- 코드 리뷰를 통해 개선할 부분이 있다면 피드백 부탁드립니다.
