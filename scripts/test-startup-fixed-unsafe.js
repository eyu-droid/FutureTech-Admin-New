const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

function castBigIntToString(data) {
  // same idea as CastBigIntFromJson in the repo
  return JSON.parse(JSON.stringify(data, (k, v) => (typeof v === 'bigint' ? v.toString() : v)));
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const sqlPath = path.join(__dirname, '..', 'prisma', 'sql', 'startupSubmissionById.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    const entryId = 3223;
    // prisma.$queryRawUnsafe executes the SQL text and binds the parameter(s)
    const res = await prisma.$queryRawUnsafe(sql, entryId);

    console.log('Prisma raw query (unsafe) result for entry_id =', entryId);
    console.log(JSON.stringify(castBigIntToString(res), null, 2));
  } catch (err) {
    console.error('Error executing Prisma query (unsafe):', err && err.stack ? err.stack : err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
