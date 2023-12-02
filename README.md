## Knex Commands

### Create Migration

```sh
npm run knex -- migrate:make migration_name
```

### Create Table

After creating the migration, you can create a table

```sh
npm run knex -- migrate:latest
```

### Rollback Migration

```sh
npm run knex -- migrate:rollback
```
