import { User, UserStore } from "../user";

const store = new UserStore()

describe("User Model", () => {
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
        it('should have an authentication method', () => {
            expect(store.authenticate).toBeDefined();
        });
    });

    const firstName = 'Max';
    const lastName = 'Mustermann';
    const password = 'password';
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        password: password,
    }
    const testUser = {
        id: 1,
        firstName: firstName,
        lastName: lastName,
        password: password,
    }
    const updatedUser = {
        firstName: 'Mara',
        lastName: 'Musterfrau',
        password: '1234',
    }
    const testUpdatedUser = {
        id: 1,
        firstName: firstName,
        lastName: lastName,
        password: password,
    }
    

    describe("Tests methods", () => {
        it('should create a new user', async () => {
            const user = await store.create(newUser);
            expect(user).toEqual(testUser);
        });
        
          it('should return a list of users', async () => {
            await store.create(newUser);
            const result = await store.index();
            expect(result).toEqual([testUser]);
          });
        
          it('should return the correct user', async () => {
            await store.create(newUser);
            const result = await store.show(1);
            expect(result).toEqual(testUser);
          });

          it('should update the user', async () => {
            await store.create(newUser);
            const result = await store.update(1, updatedUser);
            expect(result).toEqual(testUpdatedUser);
          });
        
          it('should remove the user', async () => {
            await store.create(newUser);
            store.delete(1);
            const result = await store.index()
            expect(result).toEqual([]);
          });

          it('authenticate the user', async () => {
            await store.create(newUser);
            const result = await store.authenticate(firstName, lastName, password)
            expect(result).toEqual(testUser);
          });
    });
}); 