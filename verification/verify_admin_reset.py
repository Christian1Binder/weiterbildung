from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    cwd = os.getcwd()

    # 1. Go to Admin to Reset Data
    print("Visiting Admin Page...")
    page.goto(f"file://{cwd}/admin.html")
    page.wait_for_timeout(2000)

    # Locate Reset Button
    reset_btn = page.locator("button").filter(has_text="Reset & Reload All Data")
    if reset_btn.count() > 0:
        print("Reset Button Found. Clicking...")
        # Clicking might reload the page, which Playwright handles if we wait for navigation
        # But since it's a file:// reload, it might be tricky. Let's just click.
        reset_btn.click()
        page.wait_for_timeout(3000)
        print("Data Reset Triggered.")
    else:
        print("ERROR: Reset Button NOT Found in Admin.")
        return

    # 2. Go to Index to Check Content
    print("Visiting Dashboard...")
    page.goto(f"file://{cwd}/index.html")
    page.wait_for_timeout(2000)

    # Check for Search Bar
    search_input = page.locator("#searchInput")
    if search_input.count() > 0:
        print("Search Bar Found. Searching for 'ITIL'...")
        search_input.fill("ITIL")
        page.wait_for_timeout(1000)

        # Check if ITIL module is visible
        if page.get_by_text("IT-Servicemanagement").count() > 0:
            print("SUCCESS: ITIL Module Found via Search.")
            page.screenshot(path="verification/search_result.png")
        else:
            print("FAILURE: ITIL Module NOT Found after Search.")
    else:
        print("ERROR: Search Bar NOT Found.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
