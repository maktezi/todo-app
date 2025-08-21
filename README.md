### Docker Setup *(Optional)*
If you prefer using Docker:

1. Clone the repository:
    ```bash
    git clone https://github.com/maktezi/laravel-vue.git
   
    cd laravel-vue
    ```
2. Copy the `.env.example` file and generate the application key and OTP key:
    ```bash
    cp .env.example .env
    php artisan key:generate
    php artisan otp:generate-key
    ```

3. Build and start the Docker containers:
    ```bash
    docker compose up -d --build
    ```

4. Run database migrations and seeders:
    ```bash
    docker compose exec backend php artisan migrate:fresh --seed
    ```

5. Access the frontend at `http://localhost:3000` and the backend at `http://localhost:8000`.

---

### Manual Setup
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
    php artisan migrate:fresh --seed
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
   For production, add the following to your system's crontab to run the scheduler every minute:
    ```bash
    * * * * * cd /path-to-app && php artisan schedule:run >> /dev/null 2>&1
    ```
   This ensures all scheduled tasks run automatically based on their defined schedule.

## Generating GraphQL Types
To generate the GraphQL types, run the following command:

```bash
  bun codegen
```

## Unit Testing
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

[Download Postman Collection](./docs/TaskManagerGraphQL.postman_collection.json)

### Examples

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
                    "title": "asd asd as d",
                    "status": "PENDING",
                    "priority": "HIGH"
                },
                {
                    "id": "2",
                    "title": "asd asd as",
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
