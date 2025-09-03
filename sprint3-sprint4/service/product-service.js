


export class productService{

    getProducts = async(data) => {

        const {sort, skip, take, searchName, searchDescription} = data;
        let orderBy ;

        if (sort === 'oldest'){        
            orderBy = {createdAt : 'desc'};
        }else if (sort == 'recent'){
            orderBy = {createdAt : 'asc'};
        }else{
            orderBy = {createdAt : 'desc'};
        }

        const product = await prisma.product.findMany({
                skip,
                take,
                where: {
                    AND:[
                        searchName? {name: {contains : searchName}} : undefined,
                        searchDescription? {content: {contains : searchDescription}} : undefined
                    ].filter(Boolean)
                },
                orderBy
            });
        return product
    }

    
}

export default new productService;