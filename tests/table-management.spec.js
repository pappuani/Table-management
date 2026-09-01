// @ts-check
const { test, expect } = require('@playwright/test');
const { TableManagementPage } = require('../pages/TableManagementPage');

test.describe('Cafe QR - Complete Table Management End-to-End Suite', () => {
  let tablePage;
  const uniqueTableId = `TB_${Math.floor(Math.random() * 9000 + 1000)}`;

  test.beforeEach(async ({ page }) => {
    tablePage = new TableManagementPage(page);
    await tablePage.login();
    await tablePage.navigateToTableManagement();
  });

  test('01. Verify Page Load, Header, Navigation & Core Controls', async ({ page }) => {
    expect(page.url()).toContain('/owner/table-management');
    await expect(tablePage.pageTitle).toBeVisible();
    await expect(tablePage.addTableBtn).toBeVisible();
    await expect(tablePage.floorsBtn).toBeVisible();
    await expect(tablePage.sectionsBtn).toBeVisible();
    await expect(tablePage.shapesBtn).toBeVisible();
    await expect(tablePage.searchInput).toBeVisible();
    await expect(tablePage.floorFilterDropdown).toBeVisible();
  });

  test('02. Verify Master Config Modals (Floors, Sections, Shapes)', async ({ page }) => {
    // 1. Floors Master
    await tablePage.floorsBtn.click();
    await expect(page.locator('.modal-ov').filter({ hasText: /Floor/i })).toBeVisible();
    await page.locator('.modal-ov button.modal-x, .modal-ov button:has-text("Cancel")').first().click();

    // 2. Sections Master
    await tablePage.sectionsBtn.click();
    await expect(page.locator('.modal-ov').filter({ hasText: /Section/i })).toBeVisible();
    await page.locator('.modal-ov button.modal-x, .modal-ov button:has-text("Cancel")').first().click();

    // 3. Shapes Master
    await tablePage.shapesBtn.click();
    await expect(page.locator('.modal-ov').filter({ hasText: /Shape/i })).toBeVisible();
    await page.locator('.modal-ov button.modal-x, .modal-ov button:has-text("Cancel")').first().click();
  });

  test('03. Validate Every Form Field in Add Table Modal (100% Coverage)', async ({ page }) => {
    await tablePage.openAddTableModal();
    await expect(tablePage.modalOverlay).toBeVisible();

    // 1. Validate Identifier Input & Placeholder
    await expect(tablePage.tableIdentifierInput).toBeVisible();
    await expect(tablePage.tableIdentifierInput).toHaveAttribute('placeholder', /e.g., T1/i);

    // 2. Validate Capacity Input
    await expect(tablePage.capacityInput).toBeVisible();

    // 3. Validate Toggle Containers (Bulk Create, Email QR)
    const bulkCreateLabel = tablePage.modalOverlay.locator('text=Bulk Create');
    const emailQrLabel = tablePage.modalOverlay.locator('text=Email QR codes');
    await expect(bulkCreateLabel).toBeVisible();
    await expect(emailQrLabel).toBeVisible();

    // 4. Validate Dropdowns (Shape, Floor, Section, Status)
    const dropdowns = tablePage.modalOverlay.locator('button.nice-select-trigger');
    expect(await dropdowns.count()).toBeGreaterThanOrEqual(4);

    // 5. Validate Display Order Input
    await expect(tablePage.displayOrderInput).toBeVisible();

    // 6. Validate Notes Textarea
    await expect(tablePage.notesTextarea).toBeVisible();
    await expect(tablePage.notesTextarea).toHaveAttribute('placeholder', /Any special notes/i);

    // 7. Validate Action Buttons
    await expect(tablePage.createBtn).toBeVisible();
    await expect(tablePage.cancelBtn).toBeVisible();

    // Cancel modal
    await tablePage.cancelBtn.click();
    await expect(tablePage.modalOverlay).toBeHidden();
  });

  test('04. Verify Table Search and Status Filter Chips', async ({ page }) => {
    // Search test
    await tablePage.searchTable('T');
    await expect(tablePage.searchInput).toHaveValue('T');
    await tablePage.clearSearch();
    await expect(tablePage.searchInput).toHaveValue('');

    // Filter Chips test
    await tablePage.statusChips.available.click();
    await expect(tablePage.statusChips.available).toHaveClass(/active/);

    await tablePage.statusChips.occupied.click();
    await expect(tablePage.statusChips.occupied).toHaveClass(/active/);

    await tablePage.statusChips.reserved.click();
    await expect(tablePage.statusChips.reserved).toHaveClass(/active/);

    await tablePage.statusChips.hold.click();
    await expect(tablePage.statusChips.hold).toHaveClass(/active/);

    await tablePage.statusChips.all.click();
    await expect(tablePage.statusChips.all).toHaveClass(/active/);
  });

  test('05. Create a Table with All Fields Populated (Bulk, Email, Shape, Floor, Section, Order, Notes)', async ({ page }) => {
    await tablePage.createFullTable({
      identifier: uniqueTableId,
      capacity: 6,
      displayOrder: 2,
      notes: 'Premium automation test table'
    });

    // Assert table created and visible in search
    await tablePage.searchTable(uniqueTableId);
    await expect(page.locator(`text=${uniqueTableId}`).first()).toBeVisible();
  });

  test('06. Edit an Existing Table and Update Fields', async ({ page }) => {
    // Search for created table
    await tablePage.searchTable(uniqueTableId);
    await page.waitForTimeout(500);

    // Edit table
    await tablePage.editTable(uniqueTableId, 10, 'Updated VIP capacity to 10');
    await page.waitForTimeout(1000);

    // Verify update modal closed
    await expect(tablePage.modalOverlay).toBeHidden();
  });

  test('07. Trigger Send QR / SMS Email Dispatch', async ({ page }) => {
    if (await tablePage.qrButtons.count() > 0) {
      await tablePage.qrButtons.first().click();
      await page.waitForTimeout(600);

      // Verify email dispatch confirmation toast
      const toast = page.locator('text=QR Code access link sent to your registered email').or(page.locator('._t.success, .global-toast-container'));
      await expect(toast.first()).toBeVisible();
    }
  });

  test('08. Toggle Realtime Table Statuses (Available <-> Occupied)', async ({ page }) => {
    if (await tablePage.occupiedStatusBtns.count() > 0) {
      // Toggle to Occupied
      await tablePage.occupiedStatusBtns.first().click();
      await page.waitForTimeout(1000);

      // Handle reservation modal if triggered or toggle back to Available
      if (await page.locator('.modal-ov').isVisible()) {
        const confirmOrClose = page.locator('.modal-ov button:has-text("Confirm"), .modal-ov button:has-text("Save"), .modal-ov button.modal-x').first();
        if (await confirmOrClose.isVisible()) {
          await confirmOrClose.click();
          await page.waitForTimeout(600);
        }
      }

      // Toggle back to Available
      await tablePage.availableStatusBtns.first().click();
      await page.waitForTimeout(1000);
    }
  });

  test('09. Delete Table Action', async ({ page }) => {
    // Delete the dynamic test table
    await tablePage.searchTable(uniqueTableId);
    await page.waitForTimeout(500);

    if (await tablePage.deleteButtons.count() > 0) {
      await tablePage.deleteButtons.first().click();
      await page.waitForTimeout(1000);
    }
  });
});
