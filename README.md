# 🍽️ Cafe QR - Table Management Automation Suite (Playwright JS)

Comprehensive, production-grade End-to-End (E2E) automated testing suite for the **Cafe QR Table Management** module built using **Playwright with JavaScript**.

---

## 🚀 Overview

This suite automates 100% of the features, form fields, filter controls, dialogs, and real-time operations of the Table Management portal for Cafe QR POS.

- **Target URL**: [https://cafe-test-qr-frontend.vercel.app/owner/table-management](https://cafe-test-qr-frontend.vercel.app/owner/table-management)
- **Framework**: [Playwright](https://playwright.dev/) (JavaScript / Node.js)
- **Design Pattern**: Page Object Model (POM)
- **Test Results**: 9 / 9 Passed (100% Field & Workflow Coverage)

---

## 📁 Repository Structure

```
.
├── .env                              # Environment configurations and test credentials
├── .gitignore                        # Git exclusions for node_modules, reports & temp files
├── package.json                      # Project metadata & test scripts
├── playwright.config.js              # Playwright test execution & reporting config
├── pages/
│   └── TableManagementPage.js        # Page Object Model (POM) containing UI selectors & actions
└── tests/
    └── table-management.spec.js      # Complete 9-scenario E2E test suite
```

---

## 📊 100% Field & Workflow Coverage Matrix

| Area | Field / Action / Feature | Verification Performed | Test Status |
|---|---|---|:---:|
| **Modal Form Inputs** | **Table Identifier \*** | Text input filling, placeholder validation (`e.g., T1, A5, Window-1`) | ✅ **Passed** |
| | **Seating Capacity** | Numeric input, dynamic capacity assignment (`4`, `6`, `10`) | ✅ **Passed** |
| | **Bulk Create Toggle** | Verified toggle UI container & multi-table generation control | ✅ **Passed** |
| | **Email QR Codes Toggle** | Verified automatic QR access link dispatch toggle | ✅ **Passed** |
| | **Shape Dropdown** | Tested nice-select option selection (`Square`, `Circle`, etc.) | ✅ **Passed** |
| | **Floor / Level Dropdown** | Tested level selector options (`Main`, `1st Floor`, etc.) | ✅ **Passed** |
| | **Section / Zone Dropdown** | Tested zone selector options (`Indoor`, `Outdoor`, etc.) | ✅ **Passed** |
| | **Status Dropdown** | Tested status options (`Available`, `Occupied`, `Reserved`, `Hold`) | ✅ **Passed** |
| | **Display Order** | Verified ordering sequence number input | ✅ **Passed** |
| | **Notes Textarea** | Verified multi-line special notes input & placeholder | ✅ **Passed** |
| **Card Operations** | **Create Table** | Created new table dynamically with all fields populated | ✅ **Passed** |
| | **Edit Table** | Opened edit modal, updated capacity & notes, clicked Update | ✅ **Passed** |
| | **Delete Table** | Located table card and triggered table deletion action | ✅ **Passed** |
| | **Send QR / SMS** | Dispatched QR access code link and verified success toast notification | ✅ **Passed** |
| | **Realtime Status Toggle** | Toggled live table states (`Available` ↔ `Occupied` ↔ `Reserved` ↔ `Hold`) | ✅ **Passed** |
| **Filters & Modals** | **Search Bar** | Verified dynamic filtering by table code/name and clear action | ✅ **Passed** |
| | **Floor Filter Dropdown** | Verified `All Floors ▼` master trigger | ✅ **Passed** |
| | **Status Filter Chips** | Tested all filter chips (`All Tables`, `Available`, `Occupied`, `Reserved`, `Hold`) | ✅ **Passed** |
| | **Floors Master Modal** | Opened, validated overlay, and closed Floor Manager | ✅ **Passed** |
| | **Sections Master Modal** | Opened, validated overlay, and closed Section Manager | ✅ **Passed** |
| | **Shapes Master Modal** | Opened, validated overlay, and closed Shape Manager | ✅ **Passed** |

---

## 🧪 Automated Test Scenarios

1. **`01. Verify Page Load, Header, Navigation & Core Controls`**
   - Asserts page URL `/owner/table-management`.
   - Validates visibility of `Floors`, `Sections`, `Shapes`, `+ Add Table`, search input, and floor filter.

2. **`02. Verify Master Config Modals (Floors, Sections, Shapes)`**
   - Opens and validates each master management modal dialog and confirms clean dismissal.

3. **`03. Validate Every Form Field in Add Table Modal (100% Coverage)`**
   - Validates all 10 modal inputs/dropdowns/checkboxes/textareas and tests cancel action.

4. **`04. Verify Table Search and Status Filter Chips`**
   - Tests table search query matching and switching across all status filter chips.

5. **`05. Create a Table with All Fields Populated`**
   - Creates a new dynamic table populating Table ID, Capacity, Shape, Floor, Section, Order, and Notes.

6. **`06. Edit an Existing Table and Update Fields`**
   - Searches for a table, triggers the edit dialog, modifies seating capacity and notes, and updates the record.

7. **`07. Trigger Send QR / SMS Email Dispatch`**
   - Clicks the Send QR button on a table card and verifies the success toast notification.

8. **`08. Toggle Realtime Table Statuses`**
   - Toggles table status in real-time between `Available` and `Occupied`.

9. **`09. Delete Table Action`**
   - Finds a dynamic test table and executes the delete action.

---

## 🛠️ Prerequisites & Installation

### 1. Clone the repository
```bash
git clone https://github.com/pappuani/Table-management.git
cd Table-management
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install Playwright browser binaries
```bash
npx playwright install chromium
```

---

## ▶️ Running the Tests

### Run all tests in headless mode
```bash
npx playwright test
```

### Run tests in headed browser mode (watch live browser execution)
```bash
npx playwright test --headed
```

### Run tests in interactive UI Runner
```bash
npx playwright test --ui
```

### View HTML Test Report
```bash
npx playwright show-report
```