/**
 * CodeEditor Test Examples
 *
 * Sample code snippets for testing the code editor
 * across different languages
 */

export const testExamples = {
  javascript: `// JavaScript Example
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('World');

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="counter">
      <h1>Hello, {name}!</h1>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default Counter;

// Utility function
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

// Class example
class Calculator {
  constructor() {
    this.history = [];
  }

  add(a, b) {
    const result = a + b;
    this.history.push({ op: 'add', a, b, result });
    return result;
  }

  subtract(a, b) {
    const result = a - b;
    this.history.push({ op: 'subtract', a, b, result });
    return result;
  }
}
`,

  typescript: `// TypeScript Example
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

type UserRole = User['role'];

abstract class AbstractService {
  protected config: Record<string, unknown>;

  constructor(config: Record<string, unknown>) {
    this.config = config;
  }

  abstract initialize(): Promise<void>;
}

class UserService extends AbstractService {
  private users: Map<number, User>;

  constructor(config: Record<string, unknown>) {
    super(config);
    this.users = new Map();
  }

  async initialize(): Promise<void> {
    console.log('Initializing UserService...');
  }

  async getUser(id: number): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      id: Date.now(),
      createdAt: new Date(),
      ...data
    };
    this.users.set(user.id, user);
    return user;
  }
}

// Generic function
function transform<T, U>(
  items: T[],
  mapper: (item: T) => U
): U[] {
  return items.map(mapper);
}

// Usage
const numbers = [1, 2, 3, 4, 5];
const doubled = transform(numbers, n => n * 2);
`,

  python: `# Python Example
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
from datetime import datetime

@dataclass
class User:
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

class UserService:
    def __init__(self, db_connection: Any):
        self.db = db_connection
        self._cache: Dict[int, User] = {}

    async def get_user(self, user_id: int) -> Optional[User]:
        """Retrieve a user by ID."""
        if user_id in self._cache:
            return self._cache[user_id]

        user_data = await self._fetch_from_db(user_id)
        if user_data:
            user = User(**user_data)
            self._cache[user_id] = user
            return user
        return None

    async def create_user(
        self,
        name: str,
        email: str,
        role: str = 'user'
    ) -> User:
        """Create a new user."""
        user = User(
            id=self._generate_id(),
            name=name,
            email=email,
            role=role,
            created_at=datetime.utcnow()
        )
        await self._save_to_db(user)
        self._cache[user.id] = user
        return user

    def _generate_id(self) -> int:
        return int(datetime.utcnow().timestamp() * 1000)

    async def _fetch_from_db(self, user_id: int) -> Optional[Dict]:
        # This would fetch from actual database
        return None

    async def _save_to_db(self, user: User) -> None:
        # This would save to actual database
        pass

# Decorator example
def logged(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@logged
def add(a: int, b: int) -> int:
    return a + b
`,

  java: `// Java Example
import java.util.*;
import java.util.concurrent.*;
import java.time.LocalDateTime;

public class UserService {
    private final Map<Integer, User> userCache;
    private final DatabaseConnection dbConnection;
    private final ExecutorService executorService;

    public UserService(DatabaseConnection dbConnection) {
        this.dbConnection = dbConnection;
        this.userCache = new ConcurrentHashMap<>();
        this.executorService = Executors.newCachedThreadPool();
    }

    public CompletableFuture<User> getUserAsync(int userId) {
        return CompletableFuture.supplyAsync(() -> {
            return getUser(userId);
        }, executorService);
    }

    public User getUser(int userId) {
        // Check cache first
        User cachedUser = userCache.get(userId);
        if (cachedUser != null) {
            return cachedUser;
        }

        // Fetch from database
        User user = dbConnection.fetchUser(userId);
        if (user != null) {
            userCache.put(userId, user);
        }
        return user;
    }

    public User createUser(String name, String email, UserRole role) {
        User user = new User();
        user.setId(UUID.randomUUID().hashCode());
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setCreatedAt(LocalDateTime.now());

        dbConnection.saveUser(user);
        userCache.put(user.getId(), user);

        return user;
    }
}

class User {
    private int id;
    private String name;
    private String email;
    private UserRole role;
    private LocalDateTime createdAt;

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

enum UserRole {
    ADMIN,
    USER,
    GUEST
}
`,

  go: `// Go Example
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

type User struct {
	ID        int       \`json:"id"\`
	Name      string    \`json:"name"\`
	Email     string    \`json:"email"\`
	Role      string    \`json:"role"\`
	CreatedAt time.Time \`json:"created_at"\`
}

type UserService struct {
	users  map[int]*User
	mu     sync.RWMutex
	dbConn *DatabaseConnection
}

func NewUserService(dbConn *DatabaseConnection) *UserService {
	return &UserService{
		users:  make(map[int]*User),
		dbConn: dbConn,
	}
}

func (s *UserService) GetUser(ctx context.Context, userID int) (*User, error) {
	s.mu.RLock()
	user, exists := s.users[userID]
	s.mu.RUnlock()

	if exists {
		return user, nil
	}

	user, err := s.dbConn.FetchUser(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	if user != nil {
		s.mu.Lock()
		s.users[userID] = user
		s.mu.Unlock()
	}

	return user, nil
}

func (s *UserService) CreateUser(ctx context.Context, name, email, role string) (*User, error) {
	user := &User{
		ID:        int(time.Now().UnixNano()),
		Name:      name,
		Email:     email,
		Role:      role,
		CreatedAt: time.Now(),
	}

	if err := s.dbConn.SaveUser(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to save user: %w", err)
	}

	s.mu.Lock()
	s.users[user.ID] = user
	s.mu.Unlock()

	return user, nil
}

func (s *UserService) HandleGetUser(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("id")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	// Parse user ID (simplified)
	// In production, do proper validation

	ctx := r.Context()

	// Get user
	// user, err := s.GetUser(ctx, parsedID)

	// Return response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "User endpoint",
	})
}

func main() {
	fmt.Println("Starting server...")
}
`,

  rust: `// Rust Example
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: i64,
    pub name: String,
    pub email: String,
    pub role: UserRole,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UserRole {
    Admin,
    User,
    Guest,
}

pub struct UserService {
    users: Arc<RwLock<HashMap<i64, User>>>,
    db_connection: Arc<dyn DatabaseConnection>,
}

impl UserService {
    pub fn new(db_connection: Arc<dyn DatabaseConnection>) -> Self {
        UserService {
            users: Arc::new(RwLock::new(HashMap::new())),
            db_connection,
        }
    }

    pub async fn get_user(&self, user_id: i64) -> Result<Option<User>, UserServiceError> {
        // Try to get from cache
        {
            let users = self.users.read().map_err(|e| UserServiceError::LockError(e.to_string()))?;
            if let Some(user) = users.get(&user_id) {
                return Ok(Some(user.clone()));
            }
        }

        // Fetch from database
        match self.db_connection.fetch_user(user_id).await {
            Ok(Some(user)) => {
                // Cache the user
                let mut users = self.users.write().map_err(|e| UserServiceError::LockError(e.to_string()))?;
                users.insert(user.id, user.clone());
                Ok(Some(user))
            }
            Ok(None) => Ok(None),
            Err(e) => Err(UserServiceError::DatabaseError(e.to_string())),
        }
    }

    pub async fn create_user(
        &self,
        name: String,
        email: String,
        role: UserRole,
    ) -> Result<User, UserServiceError> {
        let user = User {
            id: Utc::now().timestamp_millis(),
            name,
            email,
            role,
            created_at: Utc::now(),
        };

        self.db_connection
            .save_user(&user)
            .await
            .map_err(|e| UserServiceError::DatabaseError(e.to_string()))?;

        // Cache the user
        let mut users = self.users.write().map_err(|e| UserServiceError::LockError(e.to_string()))?;
        users.insert(user.id, user.clone());

        Ok(user)
    }
}

#[derive(Debug)]
pub enum UserServiceError {
    UserNotFound,
    DatabaseError(String),
    LockError(String),
    ValidationError(String),
}

pub trait DatabaseConnection: Send + Sync {
    async fn fetch_user(&self, user_id: i64) -> Result<Option<User>, Box<dyn std::error::Error>>;
    async fn save_user(&self, user: &User) -> Result<(), Box<dyn std::error::Error>>;
}
`,

  sql: `-- SQL Example
-- Create Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Insert Sample Data
INSERT INTO users (name, email, role)
VALUES
    ('John Doe', 'john@example.com', 'admin'),
    ('Jane Smith', 'jane@example.com', 'user'),
    ('Bob Johnson', 'bob@example.com', 'guest');

-- Complex Query with JOINs
SELECT
    u.id,
    u.name,
    u.email,
    u.role,
    COUNT(o.id) AS order_count,
    SUM(o.total_amount) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name, u.email, u.role
HAVING COUNT(o.id) >= 1
ORDER BY total_spent DESC
LIMIT 10;

-- Common Table Expression (CTE)
WITH user_stats AS (
    SELECT
        user_id,
        COUNT(*) as order_count,
        AVG(total_amount) as avg_order_value
    FROM orders
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_id
)
SELECT
    u.name,
    u.email,
    us.order_count,
    us.avg_order_value
FROM user_stats us
JOIN users u ON us.user_id = u.id
ORDER BY us.order_count DESC;
`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Editor Examples</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Code Editor Gallery</h1>
            <nav class="nav">
                <a href="#home" class="nav-link active">Home</a>
                <a href="#examples" class="nav-link">Examples</a>
                <a href="#docs" class="nav-link">Documentation</a>
            </nav>
        </header>

        <main class="main">
            <section id="home" class="section">
                <h2>Welcome to the Code Editor</h2>
                <p>A powerful code editor with syntax highlighting for 20+ languages.</p>
                <div class="features">
                    <div class="feature">
                        <h3>Features</h3>
                        <ul>
                            <li>Syntax highlighting</li>
                            <li>Code completion</li>
                            <li>Multiple cursors</li>
                            <li>Code folding</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="examples" class="section">
                <h2>Supported Languages</h2>
                <div class="language-grid">
                    <div class="language-card">
                        <h3>JavaScript</h3>
                        <div class="code-snippet">
                            <code>const greeting = "Hello, World!";</code>
                        </div>
                    </div>
                    <div class="language-card">
                        <h3>Python</h3>
                        <div class="code-snippet">
                            <code>print("Hello, World!")</code>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer class="footer">
            <p>&copy; 2024 AuraForce. All rights reserved.</p>
        </footer>
    </div>

    <script src="main.js"></script>
</body>
</html>
`,

  json: `{
  "project": {
    "name": "AuraForce",
    "version": "1.0.0",
    "description": "A modern code editor platform",
    "repository": {
      "type": "git",
      "url": "https://github.com/auraforce/code-editor"
    },
    "license": "MIT",
    "features": [
      "syntax-highlighting",
      "code-completion",
      "multiple-cursors",
      "code-folding",
      "themes"
    ],
    "supportedLanguages": [
      {
        "name": "JavaScript",
        "extensions": ["js", "jsx", "mjs", "cjs"],
        "parser": "@codemirror/lang-javascript"
      },
      {
        "name": "TypeScript",
        "extensions": ["ts", "tsx", "mts", "cts"],
        "parser": "@codemirror/lang-javascript"
      },
      {
        "name": "Python",
        "extensions": ["py", "pyw"],
        "parser": "@codemirror/lang-python"
      }
    ],
    "theme": {
      "default": "dark",
      "available": ["light", "dark", "one-dark", "github-light"]
    },
    "editor": {
      "fontSize": 14,
      "lineHeight": 1.6,
      "tabSize": 2,
      "lineNumbers": true,
      "wordWrap": false,
      "minimap": true
    }
  }
}
`,

  yaml: `# Configuration File
project:
  name: AuraForce
  version: 1.0.0
  description: A modern code editor platform

# Language configurations
languages:
  javascript:
    extensions:
      - js
      - jsx
      - mjs
      - cjs
    parser: "@codemirror/lang-javascript"
    keywords:
      - const
      - let
      - var
      - function
      - class

  python:
    extensions:
      - py
      - pyw
    parser: "@codemirror/lang-python"
    keywords:
      - def
      - class
      - import
      - from
      - async
      - await

# Editor settings
editor:
  general:
    fontSize: 14
    lineHeight: 1.6
    tabSize: 2
    indentUnit: 2

  features:
    lineNumbers: true
    codeFolding: true
    minimap: true
    bracketMatching: true
    highlightSelectionMatches: true

  theme:
    default: dark
    available:
      - name: light
        colors:
          background: "#ffffff"
          foreground: "#000000"
      - name: dark
        colors:
          background: "#1e1e1e"
          foreground: "#e0e0e0"

# Autocompletion settings
autocompletion:
  enable: true
  activateOnTyping: true
  maxRenderedOptions: 10
  delay: 50
`,

  shell: `#!/bin/bash

# Code Editor Setup Script
set -e

echo "Setting up AuraForce Code Editor..."

# Configuration variables
PROJECT_DIR="/opt/auraforce"
BACKUP_DIR="/var/backups/auraforce"

# Function to create backup
create_backup() {
    local timestamp=backup_date
    local backup_path="backup_path"

    echo "Creating backup..."
    mkdir -p backup_path
    echo "Backup completed"
}

# Function to install dependencies
install_dependencies() {
    echo "Installing dependencies..."

    if command -v apt-get &> /dev/null; then
        apt-get update
        apt-get install -y nodejs npm build-essential git
    elif command -v yum &> /dev/null; then
        yum update -y
        yum install -y nodejs npm git gcc
    else
        echo "Unsupported package manager"
        exit 1
    fi

    echo "Dependencies installed successfully"
}

# Function to setup the project
setup_project() {
    echo "Setting up project..."
    cd project_dir
    npm install
    npm run build
    echo "Project setup completed successfully"
}

# Main execution
main() {
    case option in
        backup)
            create_backup
            ;;
        install)
            install_dependencies
            ;;
        setup)
            install_dependencies
            setup_project
            ;;
        *)
            echo "Usage: script_name {backup|install|setup}"
            exit 1
            ;;
    esac
}

main
`,
};

export default testExamples;
