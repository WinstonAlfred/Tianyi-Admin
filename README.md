# Shipment Management System: Backend Operations

This document provides an overview of how our Next.js 14 application handles CRUD (Create, Read, Update, Delete) operations for the shipment management system using Prisma ORM.

## Overview

Our application manages three main entities:
- Details (presumably customer or shipment details)
- Ships
- Shipments

Other than using Cloudinary API to store some files such as images/pdf, here I decided leverage Prisma ORM to interact directly with the database from our Next.js application.

## Project Structure

```
.
├── .env
├── .eslintrc.json
├── .gitignore
├── app
|   ├── api
|   |   ├── shipment
|   |   |   ├── document
|   |   |        └──route.ts
│   ├── details
│   │   ├── create
│   │   │   └── page.tsx
│   │   ├── edit
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── ship
│   │   ├── create
│   │   │   └── page.tsx
│   │   ├── edit
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   └── page.tsx
│   └── shipment
│       ├── create
│       │   └── page.tsx
│       ├── edit
│       │   └── [id]
│       │       └── page.tsx
│       └── page.tsx
├── components
│   ├── buttons.tsx
│   ├── create_form
│   │   ├── create-details.tsx
│   │   ├── create-ship.tsx
│   │   └── create-shipment.tsx
│   ├── edit_form
│   │   ├── edit-details.tsx
│   │   ├── edit-ship.tsx
│   │   └── edit-shipment.tsx
│   ├── pagination.tsx
│   ├── search.tsx
│   ├── skeleton
│   │   ├── detailSkeleton.tsx
│   │   └── shipmentSkeleton.tsx
│   └── table
│       ├── ClientRow.tsx
│       ├── details-table.tsx
│       ├── ship-table.tsx
│       └── shipment-table.tsx
├── lib
│   ├── action
│   │   ├── detailAction.tsx
│   │   ├── shipAction.tsx
│   │   └── shipmentAction.tsx
│   ├── get
│   │   ├── getDetails.ts
│   │   ├── getShip.ts
│   │   └── getShipment.ts
│   ├── prisma.ts
│   └── utils.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma
│   ├── migrations
│   │   ├── 20240731035717_init
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── public
│   └── logo.png
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## CRUD Operations

### Create

- Creation forms are located in `components/create_form/`
- Creation logic is implemented in `lib/action/` files (e.g., `detailAction.tsx`)
- New records are created using Prisma's `create` method

### Read

- Reading data is handled by functions in `lib/get/` (e.g., `getDetails.ts`)
- These functions use Prisma's `findMany`, `findUnique`, or similar methods to fetch data
- Data is displayed using components in `components/table/`

### Update

- Edit forms are located in `components/edit_form/`
- Update logic is implemented in `lib/action/` files
- Existing records are updated using Prisma's `update` method

### Delete

- Delete operations are likely handled in the action files in `lib/action/`
- Records are deleted using Prisma's `delete` method

## Key Files

- `prisma/schema.prisma`: Defines the data model and database schema
- `lib/prisma.ts`: Contains the Prisma client instance used throughout the application
- `lib/utils.ts`: Contain utility functions for data handling or formatting

## Data Flow

1. User interacts with the UI (e.g., submits a form, clicks a button)
2. The corresponding action in `lib/action/` is triggered
3. The action function uses Prisma client to perform the database operation
4. Data is fetched or updated in the database
5. The UI is updated to reflect the changes (likely using Next.js server components or client-side state management)

## Advantages of This Approach

1. **Simplicity**: No need to maintain a separate API server
2. **Type Safety**: Prisma provides type-safe database queries
3. **Performance**: Direct database queries can be more efficient than going through an API layer
4. **Consistency**: Database schema, application models, and TypeScript types are all derived from the Prisma schema

## Considerations

- Ensure proper error handling and validation in action functions
- Implement appropriate authentication and authorization checks
- Consider implementing database transactions for complex operations
- Regularly update Prisma and run migrations to keep the database schema in sync

## Future Enhancements

- Implement real-time updates using websockets or server-sent events
- Add caching layer for frequently accessed data
- Implement soft delete for better data recovery options

This README provides an overview of how CRUD operations are handled in your shipment management system. You may want to expand on specific sections or add more details based on your implementation.
