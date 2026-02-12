from playwright.sync_api import sync_playwright
import os
import json

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    cwd = os.getcwd()

    # 1. Visit Landing Page to trigger Seed
    print("Visiting Landing Page...")
    page.goto(f"file://{cwd}/index.html")
    page.wait_for_timeout(1000) # Wait for seed/render
    page.screenshot(path="verification/landing_final.png")

    # Check if module list has items
    module_cards = page.locator("#moduleList .card").count()
    print(f"Module cards on Landing: {module_cards}")

    # 2. Visit Admin Page as Admin
    print("Visiting Admin Page...")
    page.evaluate("window.localStorage.setItem(\"training_current_user_id\", \"admin\")")
    page.reload()
    page.goto(f"file://{cwd}/admin.html")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/admin_final.png")

    # Check Stats
    stats_text = page.locator("#adminStats").inner_text()
    print(f"Stats Text: {stats_text}")

    # Check for Difficulty Input (attached)
    if page.locator("#courseDifficulty").count() > 0:
        print("Course Difficulty input exists.")

    # Check for Duration Input (attached)
    if page.locator("#lessonDuration").count() > 0:
        print("Lesson Duration input exists.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
