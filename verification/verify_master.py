from playwright.sync_api import sync_playwright
import os
def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    cwd = os.getcwd()

    # Check Landing Page
    print("Checking Landing Page...")
    page.goto(f"file://{cwd}/index.html")
    page.screenshot(path="verification/landing_page_updated.png")

    # Check if seed modules are rendered
    modules = page.locator(".card").count()
    if modules > 0:
        print(f"Modules found: {modules}")
    else:
        print("No modules found. Seed data might not have initialized or filter is active.")

    # Check Admin Page (Requires role switch or default access)
    # The default seed sets user as "user", so we might get redirected if not handled.
    # Our app.js handles role switching via localStorage.
    # Let"s simulate admin access by setting localStorage

    print("Simulating Admin Access...")
    page.evaluate("window.localStorage.setItem(\"training_current_user_id\", \"admin\")")
    page.goto(f"file://{cwd}/admin.html")
    page.screenshot(path="verification/admin_page_updated.png")

    # Check for new inputs
    if page.is_visible("#courseDifficulty"):
        print("Course Difficulty input visible.")
    else:
        print("Course Difficulty input NOT visible.")

    if page.is_visible("#lessonDuration"):
        print("Lesson Duration input visible.")
    else:
        print("Lesson Duration input NOT visible.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
