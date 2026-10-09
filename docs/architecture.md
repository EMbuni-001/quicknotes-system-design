

#### Architecture 

# QuickNotes Architecture

## 1. Requirements
- **Functional:** Users can create, read, update, and delete notes. Users can tag notes.
- **Non-Functional:** High availability (99.9%), low latency (<200ms for reads), secure (authentication), and scalable to 1 million users.

## 2. Load Estimates (1 Million Users)
Using the back-of-the-envelope rules (1 day ≈ 100,000 seconds):
- **DAU:** 20% of 1,000,000 = 200,000 users/day.
- **Writes:** 200,000 users × 5 notes/day = 1,000,000 writes/day ≈ **10 writes/sec** (Peak: **50 writes/sec**).
- **Reads:** 200,000 users × 20 loads/day = 4,000,000 reads/day ≈ **40 reads/sec** (Peak: **200 reads/sec**).
- **Storage:** 1,000,000 notes × 500 bytes = 500 MB/day ≈ **180 GB/year**.
*Conclusion:* The system is read-heavy (4x more reads than writes).

## 3. Architecture Diagram
```text
                          ┌─────────┐
           ┌─────────────>│   DNS   │  
           │              └─────────┘
  ┌────────┴──────┐  static files   ┌──────────────────────┐
  │ Browser /     │ ──────────────> │ CDN (HTML, CSS, JS)  │
  │ mobile client │                 └──────────────────────┘
  └────────┬──────┘
           │ API calls (HTTPS, JSON)
           v
    ┌───────────────┐
    │ Load Balancer │
    └──────┬────────┘
      ┌────┴─────┬──────────┐
      v          v          v
   ┌───────┐  ┌───────┐  ┌───────┐      ┌──────────────┐
   │ App 1 │  │ App 2 │  │ App 3 │─────>│ Cache (Redis)│
   └───┬───┘  └───┬───┘  └───┬───┘      └──────────────┘
       │ writes   │ reads    │ jobs
       v          v          v
   ┌─────────┐ ┌──────────┐ ┌───────┐    ┌──────────────────┐
   │ Primary │>| Read     │ │ Queue │───>│ Worker           │
   │   DB    │ | replicas │ └───────┘    │ (e.g., sends emails)
   └─────────┘ └──────────┘              └──────────────────┘

## Component Explanations 
- **CDN:** Solves high latency for static files by serving the front-end from edge servers close to the user.
- **Load Balancer:** Solves the single point of failure and bottleneck by distributing API traffic across multiple healthy app servers.
- **App Servers (Stateless):** Solve the need for horizontal scalability; because they hold no user state in memory, any server can handle any request.
- **Cache (Redis):** Solves database overload by storing frequently accessed note lists in fast memory.
- **Primary Database:** Solves the need for a single, consistent source of truth for all write operations.
- **Read Replicas:** Solve the read-heavy bottleneck by copying data from the primary and handling the high volume of feed view queries.
- **Message Queue & Worker:** Solve the problem of slow background tasks (like sending welcome emails) blocking the user's request.

## Request Flows 
**GET /notes:**
- Request hits Load Balancer -> routed to App Server.
- App Server checks Redis cache for notes:user:1.
- If Cache Hit: Returns data immediately (~1ms). If Miss: Queries Read Replica, saves to Redis, returns data.

**POST /notes:**
- Request hits Load Balancer -> routed to App Server.
- App Server validates data and writes to the Primary Database.
- App Server deletes notes:user:1 from Redis (invalidation) to prevent stale data.
- Returns 201 created to the user.


## Trade-offs 
- **Trade-off 1: Speed vs. Freshness.** Using a cache and read replicas makes the app incredibly fast, but a user might see a note they just deleted for a few extra seconds (eventual consistency). For a notes app, this slight staleness is an acceptable trade-off for massive speed gains.
- **Trade-off 2: Simplicity vs. Scalability.** Starting with a single server is simple, but adding Load Balancers, Caches, and Replicas adds operational complexity. We accept this complexity because it is required to handle 1 million users.
- **Avoiding SPOF.** We avoid Single Points of Failure by using a Load Balancer (if one app server dies, traffic routes to others), stateless app servers (no data is lost if a server crashes), and Database Replication (if the primary DB dies, a replica can be promoted).

