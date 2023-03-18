import { Order, OrderProducts, OrderStore } from "../order";
import { User, UserStore } from "../user";
import { Product, ProductStore } from "../product";

const orderStore = new OrderStore()
const userStore = new UserStore()
const productStore = new ProductStore()

describe("Order Model", () => {
    describe("Tests methods existence", () => {
        it('should have an index method', () => {
            expect(orderStore.index).toBeDefined();
        });
        it('should have an create method', () => {
            expect(orderStore.create).toBeDefined();
        });
        it('should have an read method', () => {
            expect(orderStore.show).toBeDefined();
        });
        it('should have an update method', () => {
            expect(orderStore.update).toBeDefined();
        });
        it('should have an delete method', () => {
            expect(orderStore.delete).toBeDefined();
        });
    });

    beforeAll(async () => {
        const testUser = {
            firstName: 'Max',
            lastName: 'Mustermann',
            password: 'password',
        }
        const user: User = await userStore.create(testUser)
        const testProduct: Product = {
            id: 1,
            name: 'pizza',
            price: 42
        }
        const product: Product = await productStore.create(testProduct)
    })

    afterAll(async () => {
        await userStore.delete(1)
        await productStore.delete(1)
        await orderStore.delete(1)
    })

    const pizza: OrderProducts = {
        product_id: 1,
        quantity: 1,
    }
    const burger: OrderProducts = {
        product_id: 1,
        quantity: 1,
    }
    const testOrder: Order = {
        products: [pizza],
        user_id: 1,
        status: false
    }
    const testUpdateOrder: Order = {
        products: [burger],
        user_id: 2,
        status: true
    }

    it('should create a new order', async () => {
        const order = await orderStore.create(testOrder);
        expect(order).toEqual(testOrder);
    });

    describe("Tests methods", () => {
        
        beforeAll(async () => {
            const order = await orderStore.create(testOrder);
        })

        afterAll(async () => {
            await orderStore.delete(1);
        })
        
        it('should return a list of orders', async () => {
        const result = await orderStore.index();
        expect(result).toEqual([testOrder]);
        });
    
        it('should return the correct order', async () => {
        const result = await orderStore.show(1);
        expect(result).toEqual(testOrder);
        });

        it('should update the order', async () => {
        const result = await orderStore.update(1, testUpdateOrder);
        expect(result).toEqual(testUpdateOrder);
        });

        it('should remove the order', async () => {
        orderStore.delete(1);
        const result = await orderStore.index()
        expect(result).toEqual([]);
        });
    });
}); 