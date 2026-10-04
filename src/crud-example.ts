import { eq } from 'drizzle-orm';
import { index } from './db/index.js';
import { demoUsers } from './db/schema/index.js';

async function main() {
  let createdUserId: number | undefined;

  try {
    console.log('Performing CRUD operations...');

    const [newUser] = await index
      .insert(demoUsers)
      .values({
        name: 'Admin User',
        email: `admin-${Date.now()}@example.com`,
      })
      .returning();

    if (!newUser) {
      throw new Error('Failed to create user');
    }
    createdUserId = newUser.id;
    console.log('CREATE:', newUser);

    const [foundUser] = await index
      .select()
      .from(demoUsers)
      .where(eq(demoUsers.id, newUser.id));
    console.log('READ:', foundUser);

    const [updatedUser] = await index
      .update(demoUsers)
      .set({ name: 'Super Admin' })
      .where(eq(demoUsers.id, newUser.id))
      .returning();

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }
    console.log('UPDATE:', updatedUser);

    await index.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
    createdUserId = undefined;
    console.log('DELETE: User deleted.');
    console.log('CRUD operations completed successfully.');
  } catch (error) {
    console.error('Error performing CRUD operations:', error);
    process.exitCode = 1;
  } finally {
    if (createdUserId !== undefined) {
      try {
        await index.delete(demoUsers).where(eq(demoUsers.id, createdUserId));
      } catch (error) {
        console.error('Failed to clean up the example user:', error);
        process.exitCode = 1;
      }
    }
  }
}

await main();
