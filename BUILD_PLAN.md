# GlobeTrotter: 20-Hour Hackathon Build Plan (Revised Pivot)

This document dictates the revised technical strategy for the GlobeTrotter prototype. We are pivoting to a unified Next.js architecture to ensure rapid, stable development and meet the hackathon deadline.

## 1. Technical Approach & Stack (Pivoted)

-   **Framework:** **Next.js (App Router)**. This will serve as our full-stack solution, handling both the frontend and the backend via API Routes.
    -   **Why:** This unified approach simplifies our stack, eliminates cross-origin issues, and leverages the powerful, integrated features of Next.js for maximum development speed.
-   **Language:** **TypeScript**.
-   **Database:** **PostgreSQL**, hosted on **Supabase**.
    -   **Why:** While a custom backend was initially planned, debugging infrastructure issues has proven too time-consuming. Supabase provides a reliable, managed PostgreSQL database that we can connect to instantly, allowing us to focus on building features.
-   **ORM:** **Prisma**.
    -   **Why:** Remains the best choice for type-safe database access and schema management.
-   **Authentication:** **NextAuth.js**.
    -   **Why:** It is the industry standard for authentication in Next.js applications. It provides a secure, robust, and easy-to-implement solution for handling user sessions and credentials.
-   **UI:** **Tailwind CSS** with **Shadcn/UI**.

## 2. Database Schema (`prisma/schema.prisma`)

The schema remains largely the same, but will now live in the root of our Next.js application.

```prisma
// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }

// generator client {
//   provider = "prisma-client-js"
// }

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  trips         Trip[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model Trip {
  id          String    @id @default(cuid())
  name        String
  description String?
  startDate   DateTime
  endDate     DateTime
  isPublic    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  stops       Stop[]
}

model Stop {
  id        String     @id @default(cuid())
  startDate DateTime
  endDate   DateTime
  notes     String?
  tripId    String
  trip      Trip       @relation(fields: [tripId], references: [id], onDelete: Cascade)
  cityId    String
  city      City       @relation(fields: [cityId], references: [id])
  activities Activity[]
}

model City {
  id          String   @id @default(cuid())
  name        String
  country     String
  description String?
  imageUrl    String?
  stops       Stop[]
}

model Activity {
  id          String   @id @default(cuid())
  name        String
  description String?
  startTime   DateTime
  cost        Decimal  @default(0) @db.Decimal(10, 2)
  stopId      String
  stop        Stop     @relation(fields: [stopId], references: [id], onDelete: Cascade)
}
```

## 3. Folder Structure

We will now work entirely within the `client` directory, which will be renamed to `app`.

```
/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   └── trips/route.ts
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── auth.ts
│   └── ...
└── ...
```

## 4. Revised Build Timeline

**Phase 1: Project Reset & Re-Configuration (3 Hours)**
-   **Hour 1:** Cleanup & Supabase Setup.
    -   Rename `client` to `app`.
    -   Create a new Supabase project and get the PostgreSQL connection string.
-   **Hour 2:** Prisma & NextAuth Setup.
    -   `npm install prisma next-auth @auth/prisma-adapter`.
    -   `npx prisma init`. Update `.env` with the Supabase URL.
    -   Update `schema.prisma` with the NextAuth-compatible schema.
    -   Run `npx prisma migrate dev --name init-nextauth`.
-   **Hour 3:** Implement NextAuth.
    -   Create the `[...nextauth]/route.ts` handler.
    -   Configure the `CredentialsProvider` for email/password login.
    -   Wrap the root layout with the `SessionProvider`.

**Phase 2: Core Features (Remaining Time)**
-   **Hours 4-8:** Auth UI & Trips API.
    -   Refactor the `AuthForm` to use the NextAuth `signIn` function.
    -   Create the `/api/trips` API route with `POST` and `GET` handlers.
    -   Secure the API route by checking for a valid session.
-   **Hours 9-14:** Trips UI.
    -   Build the dashboard page to list trips.
    -   Build the "Create New Trip" form.
-   **Hours 15-18:** Itinerary & Polish.
    -   Build the itinerary view page.
    -   Implement the logic for adding stops and activities.
-   **Hours 19-20:** Final Testing & Demo Prep.

---

## The Exact First Development Step

**Objective:** Reset the project structure.

1.  Rename the `globetrotter-app/client` directory to `globetrotter-app/app`.
2.  Move the `PERFORMANCE_REVIEW_NOTES.txt` and `BUILD_PLAN.md` files inside the `globetrotter-app` directory for better organization.
