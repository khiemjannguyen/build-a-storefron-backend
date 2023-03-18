import { Product, ProductStore } from "../product";

const store = new ProductStore()

describe("Product Model", () => {
    describe("Tests methods existence", () => {
        it('should have an index method', () => {
            expect(store.index).toBeDefined();
        });
        it('should have an create method', () => {
            expect(store.create).toBeDefined();
        });
        it('should have an read method', () => {
            expect(store.show).toBeDefined();
        });
        it('should have an update method', () => {
            expect(store.update).toBeDefined();
        });
        it('should have an delete method', () => {
            expect(store.delete).toBeDefined();
        });
    });

    const testProduct: Product = {
        id: 1,
        name: 'pizza',
        price: 42
    }
    const updatedProduct: Product = {
        id: 1,
        name: 'burger',
        price: 43
    }

    it('should create a new product', async () => {
        const product = await store.create(testProduct);
        expect(product).toEqual(testProduct);
        await store.delete(1)
    });

    describe("Tests methods", () => {
        
        beforeAll(async () => {
            await store.create(testProduct);
        })

        afterAll(async () => {
            await store.delete(1);
        })
        
        it('should return a list of products', async () => {
        const result = await store.index();
        expect(result).toEqual([testProduct]);
        });
    
        it('should return the correct product', async () => {
        const result = await store.show(1);
        expect(result).toEqual(testProduct);
        });

        it('should update the product', async () => {
        const result = await store.update(1, testProduct);
        expect(result).toEqual(updatedProduct);
        });

        it('should remove the product', async () => {
        store.delete(1);
        const result = await store.index()
        expect(result).toEqual([]);
        });
    });
}); 