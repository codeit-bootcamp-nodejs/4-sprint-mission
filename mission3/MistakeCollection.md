from pathlib import Path

# from pathlib import Path

# 오류 정리 내용을 마크다운 텍스트로 저장
markdown_text = """
# 2025-08-07 오류/실수 정리

## 1. ❌ `router.create` 오타
- 문제: `router.create('/', ...)`는 Express에 존재하지 않음
- 해결: `router.post('/', ...)`로 수정 필요

---

## 2. ❌ 잘못된 validate import 경로
- 문제: `import { validate } from '../middlewares/validate.js';` 했지만, 실제 위치는 `../../middlewares/validate.js`
- 해결: 상위 디렉토리 정확히 파악 후 상대 경로 수정

---

## 3. ❌ validateQuery 다중 스키마 인자 처리
- 문제: `validateQuery(paginationSchema, sortSchema)` → 사용 방식에 따라 오류 가능성 있음
- 해결: 하나의 통합 schema 객체로 validate 하도록 수정하거나, 미들웨어 수정 필요

---

## 4. ❌ 오타
- 파일명 오타: `aritcle.validate.schema.js` → `article.validate.schema.js`
- 모듈 이름이나 경로 철자 주의

---

## 5. ❌ 모듈 경로 불일치로 인한 `ERR_MODULE_NOT_FOUND`
- 문제: 디렉토리 구조를 정확히 인식하지 못해 상대 경로 잘못 설정
- 해결:
  - 현재 파일 위치 기준으로 `../../middlewares/validate.js` 같은 정확한 상대 경로 사용
  - VSCode에서 `우클릭 > 경로 복사` 기능 추천

---

## 💡 팁
- 파일 구조를 확실히 인식하고, 상대 경로에 대해 혼동하지 않도록 구조도 간단히 그려보자.
- 자주 쓰는 미들웨어는 `middlewares/` 같은 공통 디렉토리에 두고, 모듈 경로 재사용하자.
- 오타가 생각보다 자주 발생하니, 자동 완성 기능 적극 활용하기!
"""

# 파일 경로 설정 및 저장
file_path = Path("/mnt/data/2025-08-07_오류정리.txt")
file_path.write_text(markdown_text.strip(), encoding="utf-8")
file_path.name

# 2025-08-08 오류/실수 정리

## foreign key constraint violated in deleting product
 해당문제는 RDBM에서 자주 발생하는 문제임. 
 문제점: 삭제 시도 후에도 데이터가 제거되지 않았다.

    - 자식이 누군지 부모가 누군지 정확히 알아야 하며, 부모나 자식둘중 하나만 사라지면 둘다 데이터는 남아있는 상태가 되어버림(관계성만 사라짐) -> 참조의 무결성이 사라졌다는 말임.
    
    - 해결 on delete casade 쓰면 완전 제거...

    ```bash
    invalid `prisma.product.delete()` invocation:


    Foreign key constraint violated on the constraint: `ProductTag_productId_fkey`
        at ri.handleRequestError (/Users/juno/codeit/Mission3/node_modules/@prisma/client/runtime/library.js:121:7459)
        at ri.handleAndLogRequestError (/Users/juno/codeit/Mission3/node_modules/@prisma/client/runtime/library.js:121:6784)
        at ri.request (/Users/juno/codeit/Mission3/node_modules/@prisma/client/runtime/library.js:121:6491)
        at async l (/Users/juno/codeit/Mission3/node_modules/@prisma/client/runtime/library.js:130:9812)
        at async deletedProduct (file:///Users/juno/codeit/Mission3/API/product/product.controller.js:96:5) {
    code: 'P2003',
    meta: { modelName: 'Product', constraint: 'ProductTag_productId_fkey' },
    clientVersion: '6.13.0'
    ```

## tag => productTag (테이블 관계 오해)

- 문제 : tag와 product는 부모/ product tag는 저 둘의 자식임.. (관계를 명확히)

`
## field 명명 확실히..
- 스키마와 validation field명과 다른경우 있음. 정확히 확인


## Cascade (! CASECADE || !CASCADE || !Casecade)
```bash
    Error parsing attribute "@relation": Invalid referential action: `CASCADE`
    -->  prisma/schema/product.prisma:20
```
- 철자 확인

## Node.js and express is for the reader..

Node.js랑 express 는 읽기전용인 getter 임 그래서 수정이 불가능하므로 setter함수를 써주던가 req.querry.data 이렇게 써줘야함

```bash
TypeError: Cannot set property query of #<IncomingMessage> which has only a getter
    at file:///Users/juno/codeit/Mission3/middlewares/validate.js:16:13
    at Layer.handleRequest (/Users/juno/node_modules/router/lib/layer.js:152:17)
    at next (/Users/juno/node_modules/router/lib/route.js:157:13)
    at Route.dispatch (/Users/juno/node_modules/router/lib/route.js:117:3)
    at handle (/Users/juno/node_modules/router/index.js:435:11)
    at Layer.handleRequest (/Users/juno/node_modules/router/lib/layer.js:152:17)
    at /Users/juno/node_modules/router/index.js:295:15
    at processParams (/Users/juno/node_modules/router/index.js:582:12)
    at next (/Users/juno/node_modules/router/index.js:291:5)
    at Function.handle (/Users/juno/node_modules/router/index.js:186:3)
```
## 프리스마 메소드 내엔 무조건 객체

무조건 외부에서 받아온 parameter를 객체로 내보내야 함..
return prisma.comment.findUnique({id});

## Argument `_ref` is missing.

API에서 레퍼렌스에러가  const whereCondition = keyword ?에서 오류 발생 ... 그이유는 contains안에 name field 혹은 content 필드에서 속성값을 받아야 하는데 실수로 객체값을 받아버렸음. 그래서 객체로 바꿔서 해결.


