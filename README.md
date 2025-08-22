## Project Structure: Monorepo for Simplicity & Developer Experience

- **Developer productivity** — both apps share the same `.env` file and configurations.
- **Tighter integration** — GraphQL schema and shared logic are more easily maintained.
- **Simpler local development** — a unified workspace reduces overhead.

## Bonus Features

### 1. OTP Verification on Registration

To reduce fake or invalid email registrations, an **OTP-based verification system** was implemented during user registration. Once a user registers, an OTP is sent to their email address and must be verified before full access is granted.

- OTP is generated and emailed using Laravel Mailables.
- OTPs are time-limited for added security.

This improves **security** and ensures only **valid emails** are used during signup.

### 2. Centralized Roles & Permissions

A robust **role-based access control (RBAC)** system is integrated using:

- **Laravel Sanctum** for API authentication.
- **Spatie Laravel Permission** for defining and managing roles and permissions.
- Middleware-enforced access to pages, APIs, and features.
- Centralized role/permission management UI built in the frontend on users page.

### 3. Search, filter by status, drag-and-drop and responsive ui.

- Search bar on the admin side on table view
- Can filter by status like pending, completed or filter by priority(low, medium, high)
- Kanban style drag and drop.

### 4. Realtime update with websockets

- Kanban realtime updates via websockets
---

### Setup Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/maktezi/laravel-vue.git
   
    cd laravel-vue
    ```

2. Install the backend dependencies:
    ```bash
    composer install
    ```

3. Copy the example environment file and set up environment variables:
    ```bash
    cp .env.example .env && php artisan key:generate && php artisan otp:generate-key
    ```

4. Set up the database configuration in the `.env` file and run migration and seeders:
    ```bash
    php artisan migrate --seed
    ```

5. Install the frontend dependencies:
    ```bash
    bun install
    ```

6. Start the Nuxt.js development server and Laravel server:
    ```bash
    bun start
    ```

7. Open your browser and navigate to `http://localhost:3000` & `http://localhost:8000` for the front-end and back-end respectively

8. To run cron job:
    ```bash
    php artisan schedule:run
    ```
   This ensures all scheduled tasks run automatically based on their defined schedule.

## Generating GraphQL Types
To generate the GraphQL types, run the following command:

```bash
  bun codegen
```

## Unit Testing
```bash
  php artisan migrate --env=testing
```
```bash
  php artisan test --env=testing
```

### Testing API performance

```bash
  bun api:test
```

## API Documentation

This project uses [GraphQL](https://graphql.org/) via Laravel Lighthouse.

## Interactive Playground
Test all GraphQL queries here: - [http://localhost:8000/graphiql](http://localhost:8000/graphiql)

### Postman Collection
GraphQL API requests (auth) sample in Postman below.

### Login Step-by-Step in Postman
#### 1. Method & URL

- **Method**: `POST`
- **URL**: `http://localhost:8000/graphql`

#### 2. Headers

| Key            | Value              |
|----------------|--------------------|
| Content-Type   | application/json   |


#### 3. Body

- Go to the **Body** tab
- Choose **raw**
- Set format to **JSON**
- Paste the following:

```json
{
  "query": "mutation { login(email: \"admin@mail.com\", password: \"admin1234\") { user { id name } token } }"
}
```

If the credentials are correct, you will receive a JSON response like this:
```json
{
  "data": {
    "login": {
      "user": {
        "id": "1",
        "name": "Super Admin"
      },
      "token": "1|sampletoken1232324234"
    }
  }
}

```

### Tasks queries and mutation Step-by-Step in Postman
```json
{
  "query": "query tasksPaginate($first: Int!, $page: Int) { tasksPaginate(first: $first, page: $page) { data { id title status priority } paginatorInfo { currentPage lastPage perPage total } } }",
  "variables": {
    "first": 10,
    "page": 1
  }
}

```
Task result
```json
{
    "data": {
        "tasksPaginate": {
            "data": [
                {
                    "id": "1",
                    "title": "Testing 1",
                    "status": "PENDING",
                    "priority": "HIGH"
                },
                {
                    "id": "2",
                    "title": "Testing 2",
                    "status": "PENDING",
                    "priority": "LOW"
                }
            ],
            "paginatorInfo": {
                "currentPage": 1,
                "lastPage": 1,
                "perPage": 10,
                "total": 2
            }
        }
    }
}
```
