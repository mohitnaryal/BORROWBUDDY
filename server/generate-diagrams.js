const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const DIAGRAMS_DIR = 'C:/Users/Mohit/.gemini/antigravity/scratch/BorrowBuddy/BorrowBuddy_Report/Project_Diagrams';

if (!fs.existsSync(DIAGRAMS_DIR)) {
  fs.mkdirSync(DIAGRAMS_DIR, { recursive: true });
}

// Diagram Definitions with clean professional SVG/HTML rendering
const diagrams = [
  {
    filename: '01_System_Architecture_Diagram.png',
    title: 'Figure 4.1: BorrowBuddy Three-Tier System Architecture',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #f8fafc; color: #0f172a; width: 1100px;">
        <h2 style="text-align: center; color: #0f172a; margin-bottom: 24px; font-size: 24px; font-weight: 800;">
          BorrowBuddy 3-Tier System Architecture Diagram
        </h2>
        
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Tier 1: Client Layer -->
          <div style="background: white; border: 2px solid #3b82f6; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="font-size: 14px; font-weight: bold; color: #2563eb; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
              Tier 1: Client Presentation Layer (Single Page Application - React 19 + Vite)
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center;">
              <div style="background: #eff6ff; padding: 14px; border-radius: 12px; border: 1px solid #bfdbfe; font-size: 13px; font-weight: 600;">
                React Router DOM v7<br><span style="font-size: 11px; color: #64748b; font-weight: normal;">SPA Client Routing & Guards</span>
              </div>
              <div style="background: #eff6ff; padding: 14px; border-radius: 12px; border: 1px solid #bfdbfe; font-size: 13px; font-weight: 600;">
                Tailwind CSS v3<br><span style="font-size: 11px; color: #64748b; font-weight: normal;">Responsive Navy/Emerald Theme</span>
              </div>
              <div style="background: #eff6ff; padding: 14px; border-radius: 12px; border: 1px solid #bfdbfe; font-size: 13px; font-weight: 600;">
                Context API State<br><span style="font-size: 11px; color: #64748b; font-weight: normal;">AuthContext & Token Persistence</span>
              </div>
              <div style="background: #eff6ff; padding: 14px; border-radius: 12px; border: 1px solid #bfdbfe; font-size: 13px; font-weight: 600;">
                Axios HTTP Service<br><span style="font-size: 11px; color: #64748b; font-weight: normal;">JWT Interceptors & Error Handler</span>
              </div>
            </div>
          </div>

          <!-- Network Arrow -->
          <div style="text-align: center; color: #64748b; font-weight: bold; font-size: 12px;">
            ▲ RESTful JSON APIs / HTTPS / Authorization: Bearer JWT Token ▼
          </div>

          <!-- Tier 2: Backend API Layer -->
          <div style="background: white; border: 2px solid #10b981; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="font-size: 14px; font-weight: bold; color: #059669; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
              Tier 2: Business Logic & API Layer (Node.js v22 + Express.js v4)
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center;">
              <div style="background: #ecfdf5; padding: 14px; border-radius: 12px; border: 1px solid #a7f3d0; font-size: 13px; font-weight: 600;">
                Auth & Security<br><span style="font-size: 11px; color: #64748b; font-weight: normal;">JWT, bcryptjs, RateLimiter</span>
              </div>
              <div style="background: #ecfdf5; padding: 14px; border-radius: 12px; border: 1px solid #a7f3d0; font-size: 13px; font-weight: 600;">
                Catalog & Search<br><span style="font-size: 11px; color: #64748b; font-weight: normal;">Full-Text Search & Filters</span>
              </div>
              <div style="background: #ecfdf5; padding: 14px; border-radius: 12px; border: 1px solid #a7f3d0; font-size: 13px; font-weight: 600;">
                Borrow Workflow<br><span style="font-size: 11px; color: #64748b; font-weight: normal;">Date Conflict Engine & Handover</span>
              </div>
              <div style="background: #ecfdf5; padding: 14px; border-radius: 12px; border: 1px solid #a7f3d0; font-size: 13px; font-weight: 600;">
                Trust & Passports<br><span style="font-size: 11px; color: #64748b; font-weight: normal;">Provenance Ledger & Ratings</span>
              </div>
            </div>
          </div>

          <!-- Database Arrow -->
          <div style="text-align: center; color: #64748b; font-weight: bold; font-size: 12px;">
            ▲ Mongoose ODM Queries / Indexes / Aggregations / Schema Validations ▼
          </div>

          <!-- Tier 3: Data Tier -->
          <div style="background: white; border: 2px solid #8b5cf6; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="font-size: 14px; font-weight: bold; color: #7c3aed; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
              Tier 3: Database & Persistence Layer (MongoDB v8.0)
            </div>
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; text-align: center;">
              <div style="background: #f5f3ff; padding: 12px; border-radius: 12px; border: 1px solid #ddd6fe; font-size: 12px; font-weight: bold;">
                Users Collection<br><span style="font-size: 10px; color: #64748b; font-weight: normal;">Profiles, Ratings, Roles</span>
              </div>
              <div style="background: #f5f3ff; padding: 12px; border-radius: 12px; border: 1px solid #ddd6fe; font-size: 12px; font-weight: bold;">
                Items Collection<br><span style="font-size: 10px; color: #64748b; font-weight: normal;">Catalog, Photos, Rules</span>
              </div>
              <div style="background: #f5f3ff; padding: 12px; border-radius: 12px; border: 1px solid #ddd6fe; font-size: 12px; font-weight: bold;">
                Requests Collection<br><span style="font-size: 10px; color: #64748b; font-weight: normal;">Dates, Status, Messages</span>
              </div>
              <div style="background: #f5f3ff; padding: 12px; border-radius: 12px; border: 1px solid #ddd6fe; font-size: 12px; font-weight: bold;">
                Transactions Store<br><span style="font-size: 10px; color: #64748b; font-weight: normal;">Handover & Return Audit</span>
              </div>
              <div style="background: #f5f3ff; padding: 12px; border-radius: 12px; border: 1px solid #ddd6fe; font-size: 12px; font-weight: bold;">
                Reviews Store<br><span style="font-size: 10px; color: #64748b; font-weight: normal;">Two-Way Ratings & Tags</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  },
  {
    filename: '02_Use_Case_Diagram.png',
    title: 'Figure 4.2: BorrowBuddy Use Case Diagram',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background: #ffffff; color: #0f172a; width: 1100px;">
        <h2 style="text-align: center; color: #0f172a; margin-bottom: 20px; font-size: 22px; font-weight: 800;">
          BorrowBuddy Unified Use Case Diagram
        </h2>
        
        <div style="display: flex; justify-content: space-between; align-items: stretch; gap: 20px;">
          <!-- Left Actor: Borrower -->
          <div style="width: 200px; background: #f0fdf4; border: 2px solid #10b981; border-radius: 16px; padding: 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="font-size: 40px; margin-bottom: 8px;">👤</div>
            <div style="font-size: 16px; font-weight: bold; color: #065f46;">Borrower / Member</div>
            <p style="font-size: 11px; color: #047857; margin-top: 8px;">College student, PG resident, or local community seeker</p>
          </div>

          <!-- Middle: System Boundary & Use Cases -->
          <div style="flex: 1; border: 2px dashed #94a3b8; border-radius: 20px; padding: 24px; background: #f8fafc;">
            <div style="text-align: center; font-size: 12px; font-weight: bold; color: #64748b; margin-bottom: 16px; text-transform: uppercase;">
              BorrowBuddy System Boundary
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-01: Browse & Filter Item Catalog
              </div>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-02: Register & Authenticate (JWT)
              </div>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-03: Submit Borrowing Request & Dates
              </div>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-04: List & Manage Idle Items
              </div>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-05: Inspect Borrowing Passport
              </div>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-06: Approve / Decline Requests
              </div>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-07: Confirm Item Handover
              </div>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-08: Signal Item Return
              </div>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-09: Confirm Return & Audit Damage
              </div>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-10: Submit Two-Way Star Reviews
              </div>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-11: Track Real-Time Dashboard KPIs
              </div>
              <div style="background: white; border: 1px solid #cbd5e1; border-radius: 24px; padding: 10px 16px; font-size: 12px; font-weight: 600; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                UC-12: Update Profile & Location Hub
              </div>
            </div>
          </div>

          <!-- Right Actor: Owner -->
          <div style="width: 200px; background: #eff6ff; border: 2px solid #3b82f6; border-radius: 16px; padding: 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="font-size: 40px; margin-bottom: 8px;">🤝</div>
            <div style="font-size: 16px; font-weight: bold; color: #1e40af;">Item Owner / Lender</div>
            <p style="font-size: 11px; color: #2563eb; margin-top: 8px;">Owner of tools, equipment, camping tents, or textbooks</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    filename: '03_Data_Flow_Diagram_Level_0.png',
    title: 'Figure 4.3: Data Flow Diagram (Level 0 - Context Diagram)',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #ffffff; color: #0f172a; width: 1100px;">
        <h2 style="text-align: center; color: #0f172a; margin-bottom: 30px; font-size: 22px; font-weight: 800;">
          Level 0 Context Data Flow Diagram (DFD)
        </h2>

        <div style="display: flex; align-items: center; justify-content: space-between; gap: 30px;">
          <!-- Entity: Borrower -->
          <div style="width: 220px; background: #f1f5f9; border: 2px solid #475569; border-radius: 12px; padding: 24px; text-align: center;">
            <div style="font-size: 16px; font-weight: bold; color: #1e293b;">[External Entity]<br>Borrower / Member</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 8px;">Requests items, schedules dates, confirms handover, signals returns, leaves ratings</div>
          </div>

          <!-- Arrows Left -->
          <div style="flex: 1; font-size: 11px; color: #334155; line-height: 1.8;">
            <div style="border-bottom: 2px solid #0f172a; padding-bottom: 2px; text-align: center;">
              Search queries, Borrow requests, Return signals, Reviews ➔
            </div>
            <div style="border-top: 2px solid #059669; padding-top: 2px; text-align: center; color: #059669;">
              ◄ Available catalog, Approvals, Handover verification, Passports
            </div>
          </div>

          <!-- Core System Bubble -->
          <div style="width: 260px; height: 260px; border-radius: 50%; background: #0f172a; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);">
            <div style="font-size: 12px; font-weight: bold; color: #34d399; letter-spacing: 1px;">0.0</div>
            <div style="font-size: 18px; font-weight: 800; margin: 6px 0;">BorrowBuddy Platform System</div>
            <div style="font-size: 10px; color: #94a3b8; max-width: 180px;">Centralized Item Sharing, Date Conflict Arbitration & Passport Provenance Engine</div>
          </div>

          <!-- Arrows Right -->
          <div style="flex: 1; font-size: 11px; color: #334155; line-height: 1.8;">
            <div style="border-bottom: 2px solid #059669; padding-bottom: 2px; text-align: center; color: #059669;">
              ◄ Request notifications, Handover prompts, Return audit data
            </div>
            <div style="border-top: 2px solid #0f172a; padding-top: 2px; text-align: center;">
              Item listings, Approval decisions, Return confirmations, Ratings ➔
            </div>
          </div>

          <!-- Entity: Owner -->
          <div style="width: 220px; background: #f1f5f9; border: 2px solid #475569; border-radius: 12px; padding: 24px; text-align: center;">
            <div style="font-size: 16px; font-weight: bold; color: #1e293b;">[External Entity]<br>Item Owner / Lender</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 8px;">Lists idle assets, sets prices/rules, approves requests, audits condition, leaves borrower feedback</div>
          </div>
        </div>
      </div>
    `,
  },
  {
    filename: '04_Data_Flow_Diagram_Level_1.png',
    title: 'Figure 4.4: Data Flow Diagram (Level 1 - Functional Decomposition)',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background: #f8fafc; color: #0f172a; width: 1100px;">
        <h2 style="text-align: center; color: #0f172a; margin-bottom: 24px; font-size: 22px; font-weight: 800;">
          Level 1 Data Flow Diagram (DFD) — Process Decomposition
        </h2>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
          <!-- Process 1 -->
          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 11px; font-weight: bold; color: #2563eb;">PROCESS 1.0</div>
            <div style="font-size: 14px; font-weight: bold; margin: 4px 0;">User Authentication</div>
            <p style="font-size: 11px; color: #64748b;">Registers user, hashes password (bcrypt), issues JWT token, sets session state.</p>
            <div style="font-size: 10px; font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; margin-top: 8px;">
              ⇄ D1: Users DataStore
            </div>
          </div>

          <!-- Process 2 -->
          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 11px; font-weight: bold; color: #059669;">PROCESS 2.0</div>
            <div style="font-size: 14px; font-weight: bold; margin: 4px 0;">Item Catalog Management</div>
            <p style="font-size: 11px; color: #64748b;">Handles item listings, photo uploads (Multer), text indexing, category & city filters.</p>
            <div style="font-size: 10px; font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; margin-top: 8px;">
              ⇄ D2: Items DataStore
            </div>
          </div>

          <!-- Process 3 -->
          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 11px; font-weight: bold; color: #d97706;">PROCESS 3.0</div>
            <div style="font-size: 14px; font-weight: bold; margin: 4px 0;">Borrow Request & Conflict Engine</div>
            <p style="font-size: 11px; color: #64748b;">Calculates duration/pricing, blocks overlapping dates, handles owner approval/rejection.</p>
            <div style="font-size: 10px; font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; margin-top: 8px;">
              ⇄ D3: BorrowRequests Store
            </div>
          </div>

          <!-- Process 4 -->
          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 11px; font-weight: bold; color: #7c3aed;">PROCESS 4.0</div>
            <div style="font-size: 14px; font-weight: bold; margin: 4px 0;">Transaction & Handover Lifecycle</div>
            <p style="font-size: 11px; color: #64748b;">Creates active transaction agreement, confirms handover, sets status to Borrowed.</p>
            <div style="font-size: 10px; font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; margin-top: 8px;">
              ⇄ D4: Transactions Store
            </div>
          </div>

          <!-- Process 5 -->
          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 11px; font-weight: bold; color: #e11d48;">PROCESS 5.0</div>
            <div style="font-size: 14px; font-weight: bold; margin: 4px 0;">Return Confirmation & Damage Audit</div>
            <p style="font-size: 11px; color: #64748b;">Signals return, logs actual return date, records damage notes, resets item availability.</p>
            <div style="font-size: 10px; font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; margin-top: 8px;">
              ⇄ D4: Transactions & D2: Items
            </div>
          </div>

          <!-- Process 6 -->
          <div style="background: white; border: 1px solid #cbd5e1; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 11px; font-weight: bold; color: #0891b2;">PROCESS 6.0</div>
            <div style="font-size: 14px; font-weight: bold; margin: 4px 0;">Passport Provenance & Reviews</div>
            <p style="font-size: 11px; color: #64748b;">Enforces two-way reviews, computes trust score (0-100), builds immutable passport ledger.</p>
            <div style="font-size: 10px; font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; margin-top: 8px;">
              ⇄ D5: Reviews & D2: Passports
            </div>
          </div>
        </div>
      </div>
    `,
  },
  {
    filename: '05_Entity_Relationship_Diagram.png',
    title: 'Figure 4.5: BorrowBuddy Entity-Relationship Diagram (ERD)',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background: #ffffff; color: #0f172a; width: 1100px;">
        <h2 style="text-align: center; color: #0f172a; margin-bottom: 24px; font-size: 22px; font-weight: 800;">
          BorrowBuddy Relational Entity-Relationship (ER) Diagram
        </h2>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <!-- Entity: USER -->
          <div style="border: 2px solid #3b82f6; border-radius: 12px; overflow: hidden;">
            <div style="background: #3b82f6; color: white; padding: 8px 12px; font-weight: bold; font-size: 13px;">
              ENTITY: USER
            </div>
            <div style="padding: 10px; font-size: 11px; font-family: monospace; background: #f8fafc; line-height: 1.6;">
              <strong>PK _id</strong>: ObjectId<br>
              name: String<br>
              email: String [UNIQUE]<br>
              password: String [HASHED]<br>
              phone: String<br>
              city: String<br>
              locality: String<br>
              rating: Number [1.0-5.0]<br>
              totalReviews: Number<br>
              role: 'user' | 'admin'<br>
              createdAt, updatedAt
            </div>
          </div>

          <!-- Entity: ITEM -->
          <div style="border: 2px solid #10b981; border-radius: 12px; overflow: hidden;">
            <div style="background: #10b981; color: white; padding: 8px 12px; font-weight: bold; font-size: 13px;">
              ENTITY: ITEM
            </div>
            <div style="padding: 10px; font-size: 11px; font-family: monospace; background: #f8fafc; line-height: 1.6;">
              <strong>PK _id</strong>: ObjectId<br>
              title: String<br>
              description: String<br>
              category: String [Enum]<br>
              condition: String<br>
              images: [String]<br>
              <strong>FK owner</strong>: ObjectId (User)<br>
              city, locality: String<br>
              pricePerDay: Number<br>
              securityDeposit: Number<br>
              borrowingRules: String<br>
              isAvailable: Boolean<br>
              totalBorrows: Number<br>
              damageReportsCount: Number
            </div>
          </div>

          <!-- Entity: BORROW_REQUEST -->
          <div style="border: 2px solid #d97706; border-radius: 12px; overflow: hidden;">
            <div style="background: #d97706; color: white; padding: 8px 12px; font-weight: bold; font-size: 13px;">
              ENTITY: BORROW_REQUEST
            </div>
            <div style="padding: 10px; font-size: 11px; font-family: monospace; background: #f8fafc; line-height: 1.6;">
              <strong>PK _id</strong>: ObjectId<br>
              <strong>FK item</strong>: ObjectId (Item)<br>
              <strong>FK borrower</strong>: ObjectId (User)<br>
              <strong>FK owner</strong>: ObjectId (User)<br>
              startDate, endDate: Date<br>
              totalDays: Number<br>
              estimatedPrice: Number<br>
              message: String<br>
              status: Enum (Pending, Approved, Rejected, Cancelled)<br>
              rejectionReason: String<br>
              createdAt, updatedAt
            </div>
          </div>

          <!-- Entity: TRANSACTION -->
          <div style="border: 2px solid #7c3aed; border-radius: 12px; overflow: hidden; grid-column: span 2;">
            <div style="background: #7c3aed; color: white; padding: 8px 12px; font-weight: bold; font-size: 13px;">
              ENTITY: TRANSACTION (Active Borrow Agreement)
            </div>
            <div style="padding: 10px; font-size: 11px; font-family: monospace; background: #f8fafc; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; line-height: 1.6;">
              <div>
                <strong>PK _id</strong>: ObjectId<br>
                <strong>FK request</strong>: ObjectId [UNIQUE]<br>
                <strong>FK item</strong>: ObjectId (Item)<br>
                <strong>FK borrower</strong>: ObjectId (User)<br>
                <strong>FK owner</strong>: ObjectId (User)<br>
                startDate, endDate: Date<br>
                status: Approved | Borrowed | Return Requested | Completed
              </div>
              <div>
                handoverDate: Date<br>
                handoverConfirmedByOwner: Boolean<br>
                handoverConfirmedByBorrower: Boolean<br>
                actualReturnDate: Date<br>
                returnConfirmedByOwner: Boolean<br>
                isReturnedOnTime: Boolean<br>
                damageReported: Boolean<br>
                damageNotes: String
              </div>
            </div>
          </div>

          <!-- Entity: REVIEW -->
          <div style="border: 2px solid #e11d48; border-radius: 12px; overflow: hidden;">
            <div style="background: #e11d48; color: white; padding: 8px 12px; font-weight: bold; font-size: 13px;">
              ENTITY: REVIEW
            </div>
            <div style="padding: 10px; font-size: 11px; font-family: monospace; background: #f8fafc; line-height: 1.6;">
              <strong>PK _id</strong>: ObjectId<br>
              <strong>FK transaction</strong>: ObjectId<br>
              <strong>FK item</strong>: ObjectId (Item)<br>
              <strong>FK reviewer</strong>: ObjectId (User)<br>
              <strong>FK reviewee</strong>: ObjectId (User)<br>
              role: 'borrower_to_owner' | 'owner_to_borrower'<br>
              rating: Number [1-5]<br>
              comment: String<br>
              tags: [String]<br>
              [INDEX: { transaction: 1, reviewer: 1 } UNIQUE]
            </div>
          </div>
        </div>

        <div style="margin-top: 16px; padding: 10px; background: #f1f5f9; border-radius: 8px; font-size: 11px; color: #475569; text-align: center;">
          Cardinalities: User 1:M Item (Owns) • User 1:M BorrowRequest (Requests) • Item 1:M BorrowRequest (Requested For) • BorrowRequest 1:1 Transaction (Transitions Into) • Transaction 1:2 Review (Two-Way Reviews)
        </div>
      </div>
    `,
  },
  {
    filename: '06_Borrowing_Lifecycle_State_Diagram.png',
    title: 'Figure 4.6: Borrowing Request & Transaction Lifecycle State Machine',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background: #f8fafc; color: #0f172a; width: 1100px;">
        <h2 style="text-align: center; color: #0f172a; margin-bottom: 24px; font-size: 22px; font-weight: 800;">
          BorrowBuddy Request & Transaction Lifecycle State Machine
        </h2>

        <div style="display: flex; flex-direction: column; gap: 16px; align-items: center;">
          <!-- Row 1: Request States -->
          <div style="display: flex; align-items: center; gap: 16px; width: 100%; justify-content: center;">
            <div style="background: #f1f5f9; border: 2px solid #64748b; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: bold;">
              1. Item Discovered
            </div>
            <div style="color: #64748b; font-weight: bold;">➔</div>
            <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: bold; color: #b45309;">
              2. State: PENDING<br><span style="font-size: 10px; font-weight: normal;">Overlap Check Verified</span>
            </div>
            <div style="color: #64748b; font-weight: bold;">➔</div>
            <div style="background: #dbeafe; border: 2px solid #3b82f6; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: bold; color: #1d4ed8;">
              3. State: APPROVED<br><span style="font-size: 10px; font-weight: normal;">Transaction Initialized</span>
            </div>
          </div>

          <!-- Down Branch -->
          <div style="display: flex; gap: 60px; font-size: 11px; color: #dc2626;">
            <div>↓ Borrower cancels / Owner declines (State: REJECTED / CANCELLED)</div>
          </div>

          <!-- Row 2: Transaction Execution States -->
          <div style="display: flex; align-items: center; gap: 16px; width: 100%; justify-content: center;">
            <div style="background: #e0e7ff; border: 2px solid #6366f1; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: bold; color: #4338ca;">
              4. State: BORROWED<br><span style="font-size: 10px; font-weight: normal;">Handover Confirmed, Item Unavailable</span>
            </div>
            <div style="color: #64748b; font-weight: bold;">➔</div>
            <div style="background: #f3e8ff; border: 2px solid #a855f7; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: bold; color: #7e22ce;">
              5. State: RETURN REQUESTED<br><span style="font-size: 10px; font-weight: normal;">Borrower Signals Handback</span>
            </div>
            <div style="color: #64748b; font-weight: bold;">➔</div>
            <div style="background: #d1fae5; border: 2px solid #10b981; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: bold; color: #047857;">
              6. State: COMPLETED<br><span style="font-size: 10px; font-weight: normal;">Owner Return Verified, Damage Audited</span>
            </div>
          </div>

          <!-- Row 3: Post-Transaction Trust Updates -->
          <div style="display: flex; align-items: center; gap: 20px; margin-top: 10px;">
            <div style="background: white; border: 2px solid #0f172a; padding: 12px 24px; border-radius: 14px; text-align: center; font-size: 12px;">
              <strong style="color: #0f172a;">Borrowing Passport Updated</strong><br>
              <span style="font-size: 11px; color: #64748b;">Increment totalBorrows, log on-time return rate, update damage record, recalculate Trust Score</span>
            </div>
            <div style="background: white; border: 2px solid #0f172a; padding: 12px 24px; border-radius: 14px; text-align: center; font-size: 12px;">
              <strong style="color: #0f172a;">Two-Way Reviews Published</strong><br>
              <span style="font-size: 11px; color: #64748b;">Borrower rates Owner & Item • Owner rates Borrower • Recalculate member average stars</span>
            </div>
          </div>
        </div>
      </div>
    `,
  },
];

async function generateAllDiagrams() {
  console.log('Generating high-resolution technical diagrams via Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--window-size=1200,800'],
  });

  const page = await browser.newPage();

  for (const d of diagrams) {
    console.log(`Rendering ${d.filename}...`);
    await page.setContent(d.html, { waitUntil: 'load' });
    const content = await page.$('div');
    if (content) {
      const outPath = path.join(DIAGRAMS_DIR, d.filename);
      await content.screenshot({ path: outPath, omitBackground: false });
      console.log(`✅ Saved: ${d.filename}`);
    }
  }

  await browser.close();
  console.log('🎉 ALL TECHNICAL DIAGRAMS GENERATED SUCCESSFULLY!');
}

generateAllDiagrams();
