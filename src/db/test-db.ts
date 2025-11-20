import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const startPostgresTestDb = async () => {
  const container = await new PostgreSqlContainer('postgres:17')
    .withDatabase('evently_test_db')
    .withUsername('test_user')
    .withPassword('test_password')
    .start();

  const schemaPath = path.join(__dirname, 'schema');

  // instancia db DO POSTGRES DO CONTAINER
  const db = drizzle(container.getConnectionUri(), { schema });

  // cria tabelas antes dos testes rodarem
  execSync(
    `npx drizzle-kit push --dialect=postgresql --schema="${schemaPath}" --url="${container.getConnectionUri()}"`,
    { stdio: 'inherit' }
  );

  return { container, db };
};
