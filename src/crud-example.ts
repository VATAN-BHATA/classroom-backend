import { eq } from 'drizzle-orm';
import { db } from './db/index.js';
import { departments } from './db/schema/index.js';

async function main() {
  let createdUserId: number | undefined;

  try {
    console.log('Performing CRUD operations...');

    const [newDepartment] = await db
      .insert(departments)
      .values({
        code: `EXAMPLE-${Date.now()}`,
        name: 'Example Department',
        description: 'Temporary record created by the CRUD example',
      })
      .returning();

    if (!newDepartment) {
      throw new Error('Failed to create department');
    }
    createdUserId = newDepartment.id;
    console.log('CREATE:', newDepartment);

    const [foundDepartment] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, newDepartment.id));
    console.log('READ:', foundDepartment);

    const [updatedDepartment] = await db
      .update(departments)
      .set({ name: 'Updated Example Department' })
      .where(eq(departments.id, newDepartment.id))
      .returning();

    if (!updatedDepartment) {
      throw new Error('Failed to update department');
    }
    console.log('UPDATE:', updatedDepartment);

    await db.delete(departments).where(eq(departments.id, newDepartment.id));
    createdUserId = undefined;
    console.log('DELETE: Department deleted.');
    console.log('CRUD operations completed successfully.');
  } catch (error) {
    console.error('Error performing CRUD operations:', error);
    process.exitCode = 1;
  } finally {
    if (createdUserId !== undefined) {
      try {
        await db.delete(departments).where(eq(departments.id, createdUserId));
      } catch (error) {
        console.error('Failed to clean up the example user:', error);
        process.exitCode = 1;
      }
    }
  }
}

await main();
