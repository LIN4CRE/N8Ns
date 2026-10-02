# Contributing to n8n Social OmniFlow

Thank you for your interest in improving **n8n Social OmniFlow**! We welcome contributions to our automated workflow suite, visual simulator studio, and analytics engine.

---

## 🛠️ Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/LIN4CRE/N8Ns.git
   cd N8Ns
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to preview changes in real time.

4. **Typecheck & Build Validation:**
   ```bash
   npm run lint
   npm run build
   ```

---

## 📦 Modifying Workflows

If you modify or enhance any n8n workflow definitions in `src/data/n8nWorkflows.ts`:
1. Ensure node IDs and connections remain valid.
2. Run the export script to update the standalone JSON files in `workflows/`:
   ```bash
   npx tsx scripts/export-workflows.ts
   ```
3. Test importing the exported JSON into a live n8n instance to ensure no broken connections or missing parameters.

---

## 🔒 Security Best Practices
- **NEVER commit API tokens, OAuth secrets, client IDs, or personal webhook URLs.**
- Always use environment variables and n8n credentials system (`credentials` references).

---

## 💬 Submitting Pull Requests
1. Create a feature branch: `git checkout -b feature/my-new-feature`
2. Commit your changes: `git commit -m 'feat: add Threads API distribution node'`
3. Push to your branch: `git push origin feature/my-new-feature`
4. Open a Pull Request on GitHub using our PR template.
