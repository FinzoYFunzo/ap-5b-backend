**Setup**

1. Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

   # Application
   PORT=3000
   NODE_ENV=development
   ```

2. **Database Setup**: Create a PostgreSQL user and database:

   ```bash
   # Create the database user
   psql -U postgres -c "CREATE USER <username> WITH PASSWORD <password>;"

   # Create the database
   psql -U postgres -c "CREATE DATABASE <dbname>;"


3. **Generate Prisma Client**:
   
   Run any pending migratrion with:
   
   ```bash
   npx prisma migrate deploy
   ```

   If the Prisma client has never been generated or if changes were made to the `schema.prisma` file, you must generate or regenerate the Prisma client:

   ```bash
   npx prisma generate
   ```