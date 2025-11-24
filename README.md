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

## 3. Local Testing
1. Run the React app (`npm start` or `npm run dev`).
2. Visit the URL with the ID you seeded: `http://localhost:5173/?id=TAG_001` (Port may vary).
3. Since status is "New", you should see the Activation Form.

## 4. Hosting on GitHub Pages (CRITICAL)
**You cannot just upload the source files. You must build the app.**

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Check Config**: 
   Ensure `vite.config.ts` has `base: '/lost-and-found/'` (matches your repo name).
3. **Build**:
   ```bash
   npm run build
   ```
   *This creates a `dist` folder.*
4. **Deploy**:
   There are two ways to deploy:
   
   **Method A (Manual - Easiest for beginners)**:
   - Install the `gh-pages` tool: `npm install gh-pages --save-dev`
   - Add this to your `package.json` under "scripts":
     ```json
     "deploy": "gh-pages -d dist"
     ```
   - Run: `npm run build && npm run deploy`

   **Method B (GitHub Actions)**:
   - Push your code to GitHub.
   - Go to Settings > Pages.
   - Source: **GitHub Actions**.
   - Select "Static HTML" or "Vite" workflow if available.

### Troubleshooting: Blank Screen or Spinner Stuck
If you see a spinner that never stops:
1. **Did you build?** Browsers cannot run `.tsx` files. You must deploy the `dist` folder, not the `src` folder.
2. **Check URL**: Ensure you are visiting `https://username.github.io/lost-and-found/`.
3. **Check Base Path**: Open `vite.config.ts` and verify `base: '/lost-and-found/'` matches your repo name.
