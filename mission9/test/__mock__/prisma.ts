const mockMethod = {
    user:{
        findUnique: jest.fn(),
        create:jest.fn(),
        update:jest.fn(),
        findFirst: jest.fn(),
        delete:jest.fn()
    },
    product:{
        findUnique: jest.fn(),
        create:jest.fn(),
        update:jest.fn(),
        delete:jest.fn(),
        findMany:jest.fn()
    },
    like:{
        findMany:jest.fn(),
        create:jest.fn(),
    },
    notification:{
        findUnique: jest.fn(),
        create:jest.fn(),
        update:jest.fn(),
        delete:jest.fn(),
        findMany:jest.fn()
    },
    comment:{
        findUnique: jest.fn(),
        create:jest.fn(),
        update:jest.fn(),
        delete:jest.fn(),
        findMany:jest.fn()
    },
    article : {
        findUnique: jest.fn(),
        create:jest.fn(),
        update:jest.fn(),
        delete:jest.fn(),
        findMany:jest.fn()
    }

}
export default mockMethod