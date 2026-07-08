# System Architecture Diagrams

This document contains the visual architecture diagrams for the **Uniport Hostel Portal** project. The diagrams are represented using **Mermaid.js** syntax and cover the Database Entity Relationship, System Classes/Interfaces, and the E2E Application Workflow.

---

## 1. Entity Relationship Diagram (ERD)

This diagram details the underlying database structure and data constraints, reflecting the `schema.prisma` configurations (supporting both MongoDB and the local JSON database).

```mermaid
erDiagram
    USER ||--o{ APPLICATION : "submits"
    HOSTEL ||--o{ APPLICATION : "receives"

    USER {
        string id PK "ObjectId"
        string fullName "Full Name"
        string matricNumber UK "Unique Matric Number"
        string email UK "Optional Unique Email"
        string phoneNumber "Phone Number"
        string password "Plaintext/Hashed Password"
        Campus campus "Enum: CHOBA | ABUJA | DELTA"
        Gender gender "Enum: MALE | FEMALE"
        Role role "Enum: STUDENT | ADMIN"
        datetime createdAt "Timestamp"
    }

    HOSTEL {
        string id PK "ObjectId"
        string name "Hostel Name"
        Campus campus "Enum: CHOBA | ABUJA | DELTA"
        Gender gender "Enum: MALE | FEMALE (Restriction)"
        float price "Yearly Rent Price"
        string description "Description of Amenities/Location"
        int totalRooms "Total Number of Rooms"
        int bedsPerRoom "Number of Beds per Room"
        int capacity "Calculated (rooms * beds)"
        string_array amenities "Array of features"
        datetime createdAt "Timestamp"
    }

    APPLICATION {
        string id PK "ObjectId"
        string studentId FK "References User.id"
        string hostelId FK "References Hostel.id"
        Status status "Enum: PENDING | APPROVED | REJECTED"
        boolean isPaid "Rent payment status"
        datetime createdAt "Timestamp"
    }
```

---

## 2. Class Relationship Diagram

This diagram represents the logical code relationships in the system, focusing on data structures and operations available on each entity.

```mermaid
classDiagram
    class User {
        +string id
        +string fullName
        +string matricNumber
        +string email
        +string phoneNumber
        +string password
        +Campus campus
        +Gender gender
        +Role role
        +DateTime createdAt
        +register(data) Task~User~
        +login(matricNumber, password) Task~User~
    }

    class Hostel {
        +string id
        +string name
        +Campus campus
        +Gender gender
        +float price
        +string description
        +int totalRooms
        +int bedsPerRoom
        +int capacity
        +string[] amenities
        +int occupied
        +DateTime createdAt
        +create(data) Task~Hostel~
        +update(id, data) Task~Hostel~
    }

    class Application {
        +string id
        +string studentId
        +string hostelId
        +Status status
        +boolean isPaid
        +DateTime createdAt
        +User student
        +Hostel hostel
        +apply(studentId, hostelId) Task~Application~
        +updateStatus(id, status) Task~Application~
        +pay(id) Task~Application~
    }

    User "1" --* "many" Application : submits
    Hostel "1" --* "many" Application : allocates
```

---

## 3. Sequence Diagram (Hostel Application Lifecycle)

This sequence diagram illustrates the lifecycle of a student applying for a hostel, the backend validation, approval by an admin, and final simulated payment.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    actor Admin
    participant Frontend as Next.js UI (Client)
    participant AuthAPI as API (/api/auth/*)
    participant HostelsAPI as API (/api/hostels)
    participant AppsAPI as API (/api/applications/*)
    participant DB as Database

    %% Step 1: Authentication Flow
    rect rgb(240, 248, 255)
        note right of Student: Authentication Flow
        Student->>Frontend: Input matricNumber & password
        Frontend->>AuthAPI: POST /api/auth/login
        AuthAPI->>DB: Query User matching matricNumber
        DB-->>AuthAPI: Return User details
        AuthAPI-->>Frontend: Set session cookie & Return User response
        Frontend-->>Student: Redirect to Dashboard
    end

    %% Step 2: Search Hostels
    rect rgb(245, 255, 250)
        note right of Student: Hostel Discovery & Filtering
        Student->>Frontend: Select Campus & Filter Parameters
        Frontend->>HostelsAPI: GET /api/hostels?campus=X&gender=Y
        HostelsAPI->>DB: Fetch matching Hostels
        DB-->>HostelsAPI: Return list of Hostels
        HostelsAPI-->>Frontend: Return Hostels (with computed occupied count)
        Frontend-->>Student: Display Hostels with availability status
    end

    %% Step 3: Application Submission
    rect rgb(255, 250, 240)
        note right of Student: Submission & Backend Rules Validation
        Student->>Frontend: Click "Apply Now" for Hostel
        Frontend->>AppsAPI: POST /api/applications { hostelId }
        AppsAPI->>DB: Fetch Student & Hostel profiles
        DB-->>AppsAPI: Return Student & Hostel data
        AppsAPI->>AppsAPI: Rule Check: Gender must match
        AppsAPI->>AppsAPI: Rule Check: Hostel must have capacity
        AppsAPI->>DB: Rule Check: Validate active application limit (max 1 active)
        DB-->>AppsAPI: Return existing applications
        AppsAPI->>DB: Create new Application (status: PENDING)
        DB-->>AppsAPI: Return created Application
        AppsAPI-->>Frontend: Return Success Message
        Frontend-->>Student: Show application status as "PENDING"
    end

    %% Step 4: Admin Verification & Status Update
    rect rgb(255, 240, 245)
        note right of Admin: Admin Verification & Approval
        Admin->>Frontend: Load Admin Dashboard
        Frontend->>AppsAPI: GET /api/applications
        AppsAPI->>DB: Fetch all applications
        DB-->>AppsAPI: Return list of applications (including relationships)
        AppsAPI-->>Frontend: Return applications list
        Frontend-->>Admin: Display pending applications
        Admin->>Frontend: Click "Approve"
        Frontend->>AppsAPI: PUT /api/applications/[id] { status: APPROVED }
        AppsAPI->>DB: Confirm hostel occupied < capacity
        DB-->>AppsAPI: Return current counts
        AppsAPI->>DB: Update Application status to APPROVED
        DB-->>AppsAPI: Return updated Application
        AppsAPI-->>Frontend: Return status change success
        Frontend-->>Admin: Refresh dashboard list
    end

    %% Step 5: Rent Payment Simulation
    rect rgb(240, 255, 240)
        note right of Student: Payment Completion
        Student->>Frontend: View status "APPROVED" on Dashboard
        Student->>Frontend: Click "Pay Rent"
        Frontend->>AppsAPI: PUT /api/applications/[id] { pay: true }
        AppsAPI->>DB: Update Application status (isPaid: true)
        DB-->>AppsAPI: Return updated Application
        AppsAPI-->>Frontend: Return payment confirmation
        Frontend-->>Student: Render "PAID" badge & Allocation Slip
    end
```
