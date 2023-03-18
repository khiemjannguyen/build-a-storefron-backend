// @ts-ignore
import client from "../database";

export interface Product {
    id: number;
    name: string;
    price: number;
}

export class ProductStore {

    async create(product: Product): Promise<Product> {
        try {
          const sql = 'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *'
          // @ts-ignore
          const conn = await Client.connect()
          const result = await conn.query(sql, [product.name, product.price])
          conn.release()
          return result.rows[0]
        } catch (err) {
            throw new Error(`Could not add new Product ${product.name}. Error: ${err}`)
        }
    }

    async index(): Promise<Product[]> {
        try {
          // @ts-ignore
          const conn = await Client.connect()
          const sql = 'SELECT * FROM products'
          const result = await conn.query(sql)
          conn.release()
          return result.rows 
        } catch (err) {
          throw new Error(`Could not get products. Error: ${err}`)
        }
      }
    
    async show(id: number): Promise<Product> {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)'
            // @ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find Product ${id}. Error: ${err}`)
        }
    }

    async update(id: number, newProductData: Product): Promise<Product> {
        try {
            const sql =
                'UPDATE products SET name=($1), price=($2) WHERE id=($3) RETURNING *';
            // @ts-ignore
            const connection = await client.connect();
            const result = await connection.query(sql, [newProductData.name, newProductData.price, id]);
            connection.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update product ${name}. ${err}`);
        }
      }
    
      async delete(id: number): Promise<Product> {
          try {
            const sql = 'DELETE FROM products WHERE id=($1)'
            // @ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
          } catch (err) {
              throw new Error(`Could not delete Product ${id}. Error: ${err}`)
          }
      }
    
      
}