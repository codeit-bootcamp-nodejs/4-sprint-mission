import { describe, expect, test, beforeAll, beforeEach, afterEach, it } from '@jest/globals';
import mockData from './product.json' with { type: 'json' };
import mockMethod from './__mock__/prisma.js';
import { ProductService } from '../src/service/user.service.ts/product.service.js';
import { PrismaClient } from '@prisma/client';
import { WebsocketService } from '../src/socket/socket.js';
import type { productDTO } from '../src/dto/product.dto.js';
import type { CommentCreateDTO } from '../src/dto/comment.dto.js';
import { Helper } from '../src/helper/helper.js';
import { NotificationService } from '../src/service/user.service.ts/notification.service.js';
const helper = new Helper()
const helperMock: {
  findProductById: jest.Mock<
    Promise<{ id: number; name: string; description: string | null; price: number; ownerId: number; createdAt: Date; updatedAt: Date } | null>,
    [number]
  >
} = {
  findProductById: jest.fn(),
};
jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: mockMethod,
}));

describe("ProductService",() => {
    let productService :ProductService;
    let wssMock: Partial<WebsocketService>;
    helperMock

    beforeEach(() => {
        jest.clearAllMocks()
    })//-> 초기화

    beforeAll(async() => {
    wssMock ={
          broadcast: jest.fn(),
        //emit: jest.fn(), // emit도 mock해주는게 안전
    }
    helper 
    helperMock.findProductById = jest.fn();
    productService = new ProductService (mockMethod  as unknown as PrismaClient ,wssMock as unknown as WebsocketService, helperMock as unknown as Helper, NotificationService as unknown as NotificationService);
    }); // -> 초기 데이터 값


    it("access products susccessfully", async() => {
        // debug: confirm mock is set
        const productsArray = [mockData.product1, mockData.product2]

        const query = {take: 10, page: 1, keyword:"test"}
        //  set return value
        mockMethod.product.findMany.mockResolvedValue(productsArray)
        
        //  call service function
        const result = await productService.accessListProduct(query)
        //  validation

        expect(mockMethod.product.findMany).toHaveBeenCalledTimes(1)
        expect(mockMethod.product.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                skip: 0,
                take: 10,
                where: expect.objectContaining({
                OR: [
                    { name: { contains: "test" } },
                    { description: { contains: "test" } },
                 ],
                }),
                include: expect.objectContaining({
                    comment: true,
                    productTags: expect.objectContaining({
                        include: { tag: true },
                    }),
                }),
            }))
        //  debug result
        })

    it("access a product successfully",async() => {
       // debug: confirm mock is set
       const { product1 } = mockData;

       // set return value
        mockMethod.product.findUnique.mockResolvedValue(product1);

        //call service function
        const result =await  productService.accessProduct(1)

        // validation
        expect(mockMethod.product.findUnique).toHaveBeenCalledTimes(1)

       // debug result
       expect(result).toEqual(product1);
    })

    it ("created a product successfully", async() => {
        // set return value
        const mockCommentDTO ={
            id: 1,
            name: "UserNickname",   // 유저 닉네임
            content: "This is a test comment",
            type: "MARKET",
            title: "완전 대박",
            createdAt: new Date("2025-01-25"),
            updatedAt: new Date("2025-01-25"),
            ownerId: 1,
            productId: 1,
            articleId: 0,  
        } as CommentCreateDTO

       const mockProductDTO: productDTO = {
            id:11,
            name: "Test Product2",
            description: "This is a test product",
            price: 1000,
            ownerId:1,
            comment:[mockCommentDTO],
            productTags: [1], // 태그 ID
        };
        
        mockMethod.user.findUnique.mockResolvedValue({ id: 1 })
        mockMethod.product.create.mockImplementation(async(args) => ({
            ...args.data,
        }))

        //call service function
        const result = await productService.createProduct(1, mockProductDTO)
        
        // validation
        expect(mockMethod.product.create).toHaveBeenCalledTimes(1)
        // debug result
        expect(result).toHaveProperty("name", "Test Product2");
        expect(result).toHaveProperty("ownerId", 1);
    })


    it("updated a product successfully", async()=>{
        // set Mockdata
        const {product1} = mockData;
        const mockProductDTO: productDTO = {
            id:1,
            name: "Test Product2",
            description: "This is a test product",
            price: 10000,
            ownerId:1,
            productTags: [1], // 태그 ID
        };
    
        // set return value
        helperMock.findProductById.mockResolvedValue({
            id: 1,
            name: "Old Product",
            description: "Old desc",
            price: 5000,
            ownerId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        mockMethod.product.update.mockImplementation(async(args) => ({
            ...args.data
        }))

        //call service function
        const result = await productService.modifyProduct(1,mockProductDTO)
        // debug result
        expect(result).toHaveProperty("name","Test Product2")
        expect(result).toHaveProperty("description","This is a test product")
    })
})

