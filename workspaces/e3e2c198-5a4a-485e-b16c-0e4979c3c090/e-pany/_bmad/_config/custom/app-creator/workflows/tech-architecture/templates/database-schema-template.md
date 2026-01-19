# Database Schema Template

## Table Definition Format

### Basic Table

```sql
CREATE TABLE table_name (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    -- other columns
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_table_user_id ON table_name(user_id);
```

### Column Options

- `PRIMARY KEY`: Unique identifier
- `UNIQUE`: No duplicates allowed
- `NOT NULL`: Must have a value
- `DEFAULT value`: Default value if not provided
- `REFERENCES table(column)`: Foreign key constraint
- `ON DELETE CASCADE`: Auto-delete related records
- `ON DELETE SET NULL`: Set to NULL on delete

### Data Types

| PostgreSQL Type | Description | Example |
|----------------|-------------|---------|
| `UUID` | Unique identifier | `gen_random_uuid()` |
| `VARCHAR(n)` | Variable text | `VARCHAR(255)` |
| `TEXT` | Unlimited text | Article content |
| `INTEGER` | Whole number | `42` |
| `BIGINT` | Large whole number | `123456789` |
| `DECIMAL(p,s)` | Decimal number | `DECIMAL(10,2)` |
| `BOOLEAN` | True/false | `true` |
| `TIMESTAMP` | Date/time | `NOW()` |
| `DATE` | Date only | `2024-01-07` |
| `JSONB` | JSON data | `{"key":"value"}` |
| `ENUM` | Enumerated values | `ENUM('a', 'b', 'c')` |

### Index Types

```sql
-- B-tree index (default)
CREATE INDEX idx_table_column ON table_name(column);

-- Unique index
CREATE UNIQUE INDEX idx_table_email ON table_name(email);

-- Composite index
CREATE INDEX idx_table_user_status ON table_name(user_id, status);

-- GIN index (for JSONB)
CREATE INDEX idx_table_data ON table_name USING GIN(data);
```

### Migration Template

```sql
-- Migration: create_table_name
-- Created: 2024-01-07

-- Create table
CREATE TABLE table_name (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- columns
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_table_user_id ON table_name(user_id);

-- Optionally, insert seed data
-- INSERT INTO table_name (id, ...) VALUES (...);
```

### MongoDB Collection Template

```javascript
// Collection schema
collectionName: {
  _id: ObjectId,
  userId: ObjectId, // Reference to users collection
  // other fields
  createdAt: Date,
  updatedAt: Date
}

// Create indexes
db.collectionName.createIndex({ userId: 1 })
db.collectionName.createIndex({ email: 1 }, { unique: true })

// Validation rules
db.createCollection("collectionName", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "name"],
      properties: {
        userId: { bsonType: "objectId" },
        name: { bsonType: "string" }
      }
    }
  }
})
```
