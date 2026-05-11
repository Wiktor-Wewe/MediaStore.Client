# MediaStore Client

Angular frontend application for the MediaStore product catalog API.

The application allows users to browse products, view product details, and lets authenticated administrators manage products, administrator accounts, and registration settings.

---

## Features

### Products

- Paginated product list
- Product filtering by search phrase and price range
- Product sorting
- Product details page
- Product image preview
- Multilingual product descriptions
- Description language fallback handled by the API
- Product creation for administrators
- Product deletion for administrators

### Authentication

- Administrator login
- JWT access token handling
- Authenticated routes
- Admin-only UI sections
- Automatic token usage through HTTP interceptor
- Logout
- Prevention of accessing login/register pages while authenticated

### Administration

- Administrator list with pagination
- Administrator filtering by email and status
- Administrator sorting
- Pending administrator approval
- Administrator deletion
- Registration settings preview
- Enable/disable administrator registration

### Internationalization

- Runtime language switching
- Supported languages:
  - Polish (`pl`)
  - English (`en`)
  - German (`de`)
  - Czech (`cs`)
- UI translations handled by Transloco
- Backend error codes translated on the frontend

---

## Tech Stack

- Angular 21
- TypeScript
- Node.js 24
- npm 11
- Standalone Components
- Angular Signals
- Angular new control flow syntax: `@if`, `@for`
- Reactive Forms
- Angular Router
- Functional Guards
- Functional HTTP Interceptor
- Transloco
- SCSS

---

## Architecture

The project uses a feature-based structure.

Example structure:

```text
src/app/
  core/
    api/
    auth/

  shared/
    components/
    pipes/
    utils/

  features/
    auth/
    admin/
    products/
```

### Main ideas

- `core` contains application-wide infrastructure such as API models, authentication, interceptors, and guards.
- `shared` contains reusable UI components, pipes, and utilities.
- `features` contains business-specific areas such as products, authentication, and administration.
- Components are standalone and do not require Angular modules.
- UI state is handled with Angular Signals where it keeps the code simple and readable.

---

## Requirements

This project was developed using:

- Node.js 24.15.0
- npm 11.12.1
- Angular CLI 21.2.10
- Angular 21.2.12

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the application

```bash
ng serve
```

The application should be available at:

```text
http://localhost:4200
```

---

## API Configuration

The frontend communicates with the MediaStore API.

The API base URL is configured in:

```text
src/app/core/api/api.config.ts
```

Example:

```ts
export const API_BASE_URL = "https://localhost:7001/api";
```

Update this value if your backend runs on a different port.

The backend must allow CORS for:

```text
http://localhost:4200
```

---

## Authentication

The application uses JWT authentication.

After a successful login, the access token is stored in browser local storage under:

```text
media_store_access_token
```

The token is automatically attached to API requests by an HTTP interceptor:

```http
Authorization: Bearer <token>
```

The authenticated user state and admin role are derived from JWT claims.

---

## Default Administrator Account

The default administrator account is created by the backend.

```text
Email: admin@mediastore.local
Password: Admin123!
```

Use this account to log in and access administrator features.

---

## Routing

Main routes:

```text
/products
/products/:id
/login
/register
/admin/users
```

### Route access

- `/products` is public
- `/products/:id` is public
- `/login` is available only for guests
- `/register` is available only for guests
- `/admin/users` requires an authenticated administrator

---

## Internationalization

The application uses Transloco for runtime translations.

Translation files are located in:

```text
public/i18n/
  pl.json
  en.json
  de.json
  cs.json
```

Supported languages:

```text
pl, en, de, cs
```

The active language can be changed at runtime by the language switcher in the header.

---

## Backend Error Translation

The backend returns stable error codes, for example:

```text
Error.Product.Code.Required
Error.Auth.InvalidCredentials
```

The frontend translates these errors using Transloco.

Error codes are converted to lowercase and resolved as translation keys:

```text
Error.Product.Code.Required
```

becomes:

```text
error.product.code.required
```

Example translation structure:

```json
{
  "error": {
    "product": {
      "code": {
        "required": "Product code is required."
      }
    }
  }
}
```

---

## Product Details and Descriptions

The product details page loads full product data from the API:

```text
GET /api/products/{id}?language=<activeLanguage>
```

The API returns the description in the requested language.

If the description is missing, fallback is handled by the backend:

```text
requested language -> English -> first available description
```

---

## Available Scripts

### Start development server

```bash
ng serve
```

### Build

```bash
ng build
```

---

## Design Decisions

### Standalone Components

The application uses Angular standalone components instead of NgModules. This keeps the project simpler and follows modern Angular practices.

### Signals

Angular Signals are used for local UI state such as loading indicators, current filters, product lists, selected language-related state, and error messages.

### Functional Guards and Interceptors

Functional guards and interceptors are used instead of class-based implementations. This keeps authentication and authorization logic compact and aligned with modern Angular APIs.

### Transloco

Transloco is used for runtime internationalization. It allows switching languages without rebuilding or reloading the application.

### Feature-Based Structure

Code is grouped by business feature instead of only by technical type. This makes the project easier to navigate and extend.

---

## Possible Future Improvements

- More advanced form validation messages
- Unit tests for services, guards, and pipes
- E2E tests
- Better empty states and loading skeletons
- Image upload support
- Refresh token handling
- More granular permissions
- Product editing
- Better accessibility improvements
- Environment-based API configuration
- Docker support
