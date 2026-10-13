export * from './auth.js';
export * from './department.js';
export * from './subject.js';

import {
  integer,
  jsonb,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { subjects } from './subject.js';
import { user } from './auth.js';

export const classStatusEnum = pgEnum('class_status', ['active', 'inactive', 'archived']);

export const classes = pgTable(
  'classes',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    subjectId: integer('subject_id')
      .notNull()
      .references(() => subjects.id, { onDelete: 'cascade' }),
    teacherId: text('teacher_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    inviteCode: varchar('invite_code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    bannerCldPubId: text('banner_cld_pub_id'),
    bannerUrl: text('banner_url'),
    capacity: integer('capacity').default(50).notNull(),
    description: text('description'),
    status: classStatusEnum('status').default('active').notNull(),
    schedules: jsonb('schedules').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('classes_subject_id_idx').on(table.subjectId),
    index('classes_teacher_id_idx').on(table.teacherId),
  ],
);

export const enrollments = pgTable(
  'enrollments',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    studentId: text('student_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    classId: integer('class_id')
      .notNull()
      .references(() => classes.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('enrollments_student_id_idx').on(table.studentId),
    index('enrollments_class_id_idx').on(table.classId),
    uniqueIndex('enrollments_student_class_unique').on(
      table.studentId,
      table.classId,
    ),
  ],
);
