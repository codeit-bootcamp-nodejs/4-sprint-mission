import express from 'express'
import { PrismaClient } from '@prisma/client'
import { CreateProduct,PatchProduct} from '.../validate.js' // 유효성 검사 가져오기

const prisma = new PrismaClient // 클래스라서 new 키워드로 인스턴스를 만듦

const app = express()
app.use(express.json()) // use 사용으로 모든 핸들러 실행 전 실행 됨

const productRouter = express.Router() // 라우트 생성


productRouter.route('/') // 라우트
    // 1. 상품 등록 API (name, description, price, tags를 입력하여 상품을 등록)
    .post( async(req,res) => { //create 메소드는 비동기 작업  -> async/await 사용
        try{ // 유효성 검사를 위한 try catch문
            const newProductData = CreateProduct.safeParse(req.body); // zod 사용해서 정의한 함수로 유효성 검사 및 할당
            // parse: Zod 라이브러리 함수, 데이터의 유효성을 검사 -> 성공하면 그 데이터를 반환하는 역할
            
            const product = await prisma.product.create({  // 선언은 res.json(product) 같은 곳에 활용, prisma.모델명.메서드명()
                data: newProductData
            })
            res.status(201).json(product) //생성 시 201 상태 코드, 등록한 게시글 내용 전달
        } catch (error) { // 유효성 검사 실패 시,  // error : try 문에서 발생한 에러를 전달 받은 값
            if (error instanceof z.ZodError) { // 만약 try에서 전달 받은 error가 유효성 검사에서 실패한 경우라면
                 // z.ZodError: Zod가 유효성 검사 실패 시 자동으로 생성하는 오류 클래스의 이름,  instanceof: 왼쪽의 객체가 오른쪽의 클래스로부터 만들어졌니? true라면, 요청 데이터의 유효성 검사에서 문제가 생긴 것
                res.status(400).json({ error: error.errors}) // error.errors : 여러 개의 오류 메시지 목록을 클라이언트에게 전달하기 위해 사용
            } else { // 유효성 이외의 모든 에러
                res.status(500).json({message: '서버 오류가 발생했습니다.'})
            }
        }   
    })

    // 2. 상품 목록 조회 API 
    /* id, name, price, createdAt를 조회
    offset 방식의 페이지네이션 기능을 포함
    최신순(recent)으로 정렬
    name, description에 포함된 단어로 검색 가능*/
    .get(async(req,res) => {
        const { offset = 0, order = 'recent', keyword = ''} = req.query
        let orderBy // 조건에 따라 값이 바뀌는 정렬 기준을 저장
        switch (order) {
            case 'old' :
                orderBy = { createdAt: 'asc'} // 정렬 방식을 orderBy에 할당
                break
            case 'recent':
                orderBy = { createdAt: 'desc'}
        }

        const where = { //필터링 조건을 담을 객체 (Prisma의 where 옵션에 사용됨) 
            OR: [ // 아래 조건들 중 "하나라도 참이면" 결과에 포함시킴
                { name: { // 상품 이름 필드
                    contains: keyword,  // contains: 문자열 안에 포함되어 있는지 검사 , name에 keyword(검색어)를 포함하고 있으면 true
                    mode: 'insensitive' // mode: 대소문자 구분 옵션 ( 'default' or 'insensitive' )
                    } 
                },
                { description: { // 상품 설명 필드
                    contains: keyword, //  description에 keyword가 포함되어 있으면 true
                    mode: 'insensitive'//  대소문자 무시하고 검색
                    } 
                }
            ]
        };

        const products = await prisma.product.findMany({
            where, // 조건 필터링 
            skip: offset, // 앞에 몇 개 건너뛸지
            take: 10,
            orderBy,// 정렬
            select: { // 특정 필드만 골라서 조회
                id: true,
                name: true,
                price: true,
                createdAt: true,
            }
        })
        res.status(200).json(products);
    })


  

productRouter.route('/:id')
    // 3. 상품 상세 조회 API (id, name, description, price, tags, createdAt를 조회)
    .get(async(req,res) => {
        const { id } = req.params // 리퀘스트 URL 파라미터에서 id 추출 (구조분해)

        const product = await prisma.product.findUnique({
            where: { id }, // 해당 id의 게시글을 조회
            select: {  //모델에서 필요한 필드만 선택
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                createdAt: true
            }
        })

        if (!product) { // 유효성 검사 : 만약 게시글을 찾을 수 없다면 (실행결과가 없다면)
            return res.status(404).json({message: '해당 상품을 찾을 수 없습니다.'})
        }
        res.status(200).json(product);
    })

    // 4. 상품 수정 API (PATCH 메서드를 사용)
    .patch(async(req,res) => { 
        const { id } = req.params

        try{
            const updateProductData = PatchProduct.parse(req.body)

            const Product = await prisma.product.update({
                where: { id },
                data: updateProductData,
            });
        res.status(200).json(Product) // 수정된 상품내용을 클라이언트에게 전달
        } catch (error) { 
            if (error instanceof z.ZodError) {
                res.status(404).json({message: "해당 상품을 찾을 수 없습니다."})
            } else {
                res.status(500).json({ message : '서버 오류가 발생했거나 상품을 찾을 수 없습니다.'})
            }
        }   
    })

    // 5. 상품 삭제 API
    .delete(async(req,res) => {
        const { id } = req.params
        
        try{
            await prisma.product.delete({
                where: { id },
            })
            res.status(204).json({message: '성공적으로 삭제 되었습니다.'}); // 삭제 성공
        } catch (error) {
            res.status(404).json({ message: "해당 상품을 찾을 수 없습니다."})
        }
    });


app.use('/proudcts',productRouter)

  app.listen(3000, () => {
        console.log(`${PORT}에서 서버 실행 중`)
    })


export default productRouter