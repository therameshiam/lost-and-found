# Scan To Return - Deployment Instructions

## 1. Google Sheets & Backend Setup
1. Go to Google Sheets and create a new sheet.
2. Go to **Extensions** > **Apps Script**.
3. Delete any code in the editor and paste the content of `backend/Code.js` (from the file list).
4. Save the project (Ctrl+S) and name it "ScanToReturn".
5. In the toolbar dropdown (where it says `myFunction` or `setup`), select `setup` and click **Run**.
   - Grant the necessary permissions.
   - This creates the "Tags" sheet with headers: `tag_id`, `status`, `item_name`, `owner_phone`, `timestamp`.
6. **Seed Data**: Manually add a row to test:
   - `tag_id`: `TAG_001`
   - `status`: `New`
   - Leave the rest blank.
7. Click **Deploy** (blue button top right) > **New deployment**.
   - **Select type**: Web app.
   - **Description**: v1.
   - **Execute as**: **Me** (your email).
   - **Who has access**: **Anyone** (This is crucial for the public to scan tags).
8. Click **Deploy**. Copy the **Web App URL**.

## 2. Frontend Configuration
1. Open `constants.ts` in the source code.
2. Replace `GOOGLE_SCRIPT_URL` with the Web App URL you just copied.

## 3. Testing
1. Run the React app (`npm start` or similar).
2. Visit the URL with the ID you seeded: `http://localhost:3000/?id=TAG_001`
3. Since status is "New", you should see the Activation Form.
4. Fill it out and submit.
5. The page should reload. Now the status is "Active", so you should see the "Owner Found" screen with the WhatsApp button.
6. Check your Google Sheet to see the data populated.

## 4. Hosting (GitHub Pages)
1. Build the React app (`npm run build`).
2. Deploy the `build` or `dist` folder to GitHub Pages.
