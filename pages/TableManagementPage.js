class TableManagementPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Login Locators
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');

    // Page Header & Navigation
    this.pageTitle = page.locator('text=Table Management').first();
    this.navTableManagement = page.locator('a[href*="table-management"]');
    this.addTableBtn = page.locator('button.tm-add, button:has-text("Add Table")');

    // Master Dialogs buttons
    this.floorsBtn = page.locator('button.tm-btn-master:has-text("Floors")');
    this.sectionsBtn = page.locator('button.tm-btn-master:has-text("Sections")');
    this.shapesBtn = page.locator('button.tm-btn-master:has-text("Shapes")');

    // Filter controls
    this.searchInput = page.locator('input[placeholder*="Search tables"]');
    this.floorFilterDropdown = page.locator('button.nice-select-trigger').first();
    this.statusChips = {
      all: page.locator('button.status-chip:has-text("All Tables")'),
      available: page.locator('button.status-chip:has-text("Available")'),
      occupied: page.locator('button.status-chip:has-text("Occupied")'),
      reserved: page.locator('button.status-chip:has-text("Reserved")'),
      hold: page.locator('button.status-chip:has-text("Hold")'),
    };

    // Modal Overlays & Form Elements
    this.modalOverlay = page.locator('.modal-ov');
    this.tableIdentifierInput = page.locator('.modal-ov input[placeholder*="e.g., T1"]');
    this.capacityInput = page.locator('.modal-ov input[type="number"]').first();
    this.displayOrderInput = page.locator('.modal-ov input[type="number"]').nth(1);
    this.notesTextarea = page.locator('.modal-ov textarea[placeholder*="notes" i]');
    this.bulkCreateCheckbox = page.locator('.modal-ov input[type="checkbox"]').first();
    this.emailQrCheckbox = page.locator('.modal-ov input[type="checkbox"]').nth(1);
    
    // Modal action buttons
    this.createBtn = page.locator('.modal-ov button:has-text("Create"), .modal-ov button.modal-save');
    this.updateBtn = page.locator('.modal-ov button:has-text("Update"), .modal-ov button.modal-save');
    this.cancelBtn = page.locator('.modal-ov button:has-text("Cancel"), .modal-ov button.modal-cancel');
    this.closeModalBtn = page.locator('.modal-ov button.modal-x');

    // Table Cards & Actions
    this.qrButtons = page.locator('button.top-act-btn.qr');
    this.editButtons = page.locator('button.top-act-btn.edit');
    this.deleteButtons = page.locator('button.top-act-btn.del');
    this.availableStatusBtns = page.locator('button.ts-btn.available');
    this.occupiedStatusBtns = page.locator('button.ts-btn.occupied');
    this.reservedStatusBtns = page.locator('button.ts-btn.reserved');
    this.holdStatusBtns = page.locator('button.ts-btn.maintenance');
  }

  async login(email = process.env.OWNER_EMAIL || 'anicafeqr@gmail.com', password = process.env.OWNER_PASSWORD || '123456') {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');

    if (await this.emailInput.isVisible()) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
    }
  }

  async navigateToTableManagement() {
    await this.page.goto('/owner/table-management');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async openAddTableModal() {
    await this.addTableBtn.click();
    await this.page.waitForTimeout(500);
  }

  async createFullTable({ identifier, capacity = 4, displayOrder = 1, notes = 'VIP Window Seat' }) {
    await this.openAddTableModal();
    
    // 1. Fill Table Identifier
    await this.tableIdentifierInput.fill(identifier);

    // 2. Fill Seating Capacity
    if (await this.capacityInput.isVisible()) {
      await this.capacityInput.fill(String(capacity));
    }

    // 3. Select Dropdowns (Shape, Floor, Section, Status)
    const selectTriggers = this.modalOverlay.locator('button.nice-select-trigger');
    const triggerCount = await selectTriggers.count();
    if (triggerCount > 0) {
      // Shape dropdown
      await selectTriggers.nth(0).click();
      await this.page.waitForTimeout(300);
      const option = this.page.locator('.nice-select-option, li, div[role="option"]').filter({ hasText: /Square|Round|Circle/i }).first();
      if (await option.isVisible()) {
        await option.click();
      } else {
        await selectTriggers.nth(0).click();
      }
    }

    // 4. Fill Display Order
    if (await this.displayOrderInput.isVisible()) {
      await this.displayOrderInput.fill(String(displayOrder));
    }

    // 5. Fill Notes Textarea
    if (await this.notesTextarea.isVisible()) {
      await this.notesTextarea.fill(notes);
    }

    // 6. Click Create
    await this.createBtn.click();
    await this.page.waitForTimeout(1500);
  }

  async editTable(identifier, newCapacity = 8, newNotes = 'Updated via automation') {
    // Find card with table identifier and click its edit button
    const card = this.page.locator('div').filter({ hasText: new RegExp(`^${identifier}`) }).first();
    const editBtn = card.locator('button.top-act-btn.edit').or(this.editButtons.first());
    await editBtn.click();
    await this.page.waitForTimeout(800);

    // Update capacity & notes
    if (await this.capacityInput.isVisible()) {
      await this.capacityInput.fill(String(newCapacity));
    }
    if (await this.notesTextarea.isVisible()) {
      await this.notesTextarea.fill(newNotes);
    }

    // Click Update
    await this.updateBtn.click();
    await this.page.waitForTimeout(1500);
  }

  async searchTable(query) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(600);
  }

  async clearSearch() {
    await this.searchInput.fill('');
    await this.page.waitForTimeout(400);
  }
}

module.exports = { TableManagementPage };
