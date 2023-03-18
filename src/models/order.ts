import client from "../database";

export interface OrderProducts {
    product_id: number;
    quantity: number;
}

export interface Order {
    products: OrderProducts[];
    user_id: number;
    status: boolean;
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {

            const orderSql = 'SELECT * FROM orders'
            const orderProductsSql = 'SELECT product_id, quantity FROM order_products WHERE order_id={$1}'
            // @ts-ignore
            const conn = await Client.connect()
            const orderResult = await conn.query(orderSql)
            const orders = []
            for (const order of orderResult.rows) {
                const orderProductResult = await conn.query(orderProductsSql, [order.id])
                orders.push({
                    ...order,
                    products: orderProductResult,
                  });
            }
            conn.release()
            return orders
        } catch (err) {
          throw new Error(`Could not get orders. Error: ${err}`)
        }
      }
    
      async show(id: string): Promise<Order> {
        try {
            const orderSql = 'SELECT * FROM orders WHERE id={$1}'
            const orderProductsSql = 'SELECT product_id, quantity FROM order_products WHERE order_id={$1}'
            // @ts-ignore
            const conn = await Client.connect()
            const orderResult = await conn.query(orderSql)
            const order = orderResult.rows[0]
            const orderProductResult = await conn.query(orderProductsSql, [order.id])
            const orderProducts = {
                ...order,
                products: orderProductResult.rows
            };
            conn.release()
            return orderProducts
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`)
        }
      }
    
      async create(order: Order): Promise<Order> {
          try {
            const orderSql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *'
            const orderProductsSql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *'
            // @ts-ignore
            const conn = await Client.connect()
            const orderResult = await conn.query(orderSql, [order.user_id, order.status])
            const newOrder = orderResult.rows[0]
            const products = []
            for (const product of order.products) {
                const orderProductResult = await conn.query(orderProductsSql, [newOrder.id, product.product_id, product.quantity])
                products.push(orderProductResult.rows[0])
            }
            const orderProducts = {
                ...orderResult[0],
                products: products
            };
            conn.release()
            return orderProducts
          } catch (err) {
              throw new Error(`Could not add new order for the user ${order.user_id}. Error: ${err}`)
          }
      }
    
      async delete(id: number): Promise<Order> {
          try {
            const orderSql = 'DELETE FROM orders WHERE id=($1)'
            const orderProductsSql = 'DELETE FROM orders_products WHERE order_id=($1)'
            // @ts-ignore
            const conn = await Client.connect()
            const orderProductsResult = await conn.query(orderSql, [id])
            const orderResult = await conn.query(orderSql, [id])
            conn.release()
            return orderResult.rows[0]
          } catch (err) {
              throw new Error(`Could not delete Order ${id}. Error: ${err}`)
          }
      }
    
      async update(id: number, newOrderData: Order): Promise<Order> {
        try {
          const orderSql = 'UPDATE orders SET status=($1) WHERE id=($2) RETURNING *'
          const orderProductsSql = 'UPDATE orders_products SET product_id=($1), quantity=($2) WHERE order_id=($3) RETURNING product_id, quantity'
          const conn = await client.connect()
          const orderResult = await conn.query(orderSql, [newOrderData.status, id])
          const order = orderResult.rows[0]
          const products = []
          for (const product of newOrderData.products) {
              const orderProductResult = await conn.query(orderProductsSql, [product.product_id, product.quantity, order.id])
              products.push(orderProductResult.rows[0])
          }
          const orderProducts = {
              ...order,
              products: products
          };
          conn.release();
          return orderProducts;
        } catch (err) {
          throw new Error(`Could not update product ${name}. ${err}`);
        }
      }
}