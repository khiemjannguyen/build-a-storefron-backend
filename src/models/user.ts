// @ts-ignore
import client from '../database';
import bcrypt from 'bcrypt';

export interface BaseUser {
    firstName: string;
    lastName: string;
}

export interface AuthUser extends BaseUser {
  password: string;
}
export interface User extends AuthUser {
  id: number;
}

export class UserStore {
    async index(): Promise<User[]> {
        try {
          // @ts-ignore
          const conn = await client.connect()
          const sql = 'SELECT * FROM users'
          const result = await conn.query(sql)
          conn.release()
          return result.rows 
        } catch (err) {
          throw new Error(`Could not get users. Error: ${err}`)
        }
      }
    
      async show(id: number): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)'
            // @ts-ignore
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find User ${id}. Error: ${err}`)
        }
      }
    
      async create(user: AuthUser): Promise<User> {
          try {
            const sql = 'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *'
            const hash = bcrypt.hashSync( 
                user.password + process.env.PEPPER, 
                parseInt(process.env.SALT_ROUNDS as string))
            // @ts-ignore
            const conn = await client.connect()
            const result = await conn.query(sql, [user.firstName, user.lastName, user.password])
            conn.release()
            return result.rows[0]
          } catch (err) {
              throw new Error(`Could not add new user ${user.firstName} ${user.lastName}. Error: ${err}`)
          }
      }
    
      async delete(id: number): Promise<User> {
        try {
          const sql = 'DELETE FROM users WHERE id=($1)'
          // @ts-ignore
          const conn = await client.connect()
          const result = await conn.query(sql, [id])
          conn.release()
          return result.rows[0]
        } catch (err) {
            throw new Error(`Could not delete user ${id}. Error: ${err}`)
        }
      }

      async authenticate(firstName: string, lastName: string, password: string): Promise<User | null> {
        try {
            const sql = 'SELECT password FROM users WHERE firstName=($1) && lastName=($1)'
            // @ts-ignore
            const conn = await client.connect()
            const result = await conn.query(sql, [firstName, lastName])
            if(result.rows.length) {
              const user = result.rows[0]
              if (bcrypt.compareSync(password+process.env.PEPPER, user.password)) {
                return user
              }
            }
            conn.release()
            return null
        } catch (err) {
            throw new Error(`Could not find user ${firstName} ${lastName}. ${err}`);
        }
      }
    
      async update(id: number, newUserData: AuthUser): Promise<User|undefined> {
        try {
          const sql =
            'UPDATE users SET firstName=($1), lastName=($2), password=($3) WHERE id=($4) RETURNING *';
          // @ts-ignore
          const conn = await client.connect();
          if (await this.authenticate(newUserData.firstName, newUserData.lastName, newUserData.password)) {
            const result = await conn.query(sql, [newUserData.firstName, newUserData.lastName, newUserData.password,id]);
            conn.release();
            return result.rows[0]
          } else {
            console.error('Failed Authentication')
            return
          }
        } catch (err) {
          throw new Error(`Could not update user ${newUserData.firstName} ${newUserData.lastName}. ${err}`);
        }
      }
}