import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  DISTRIBUTION_WORKFLOW,
  ANALYTICS_WORKFLOW,
  UNIFIED_MASTER_WORKFLOW
} from '../src/data/n8nWorkflows.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workflowsDir = path.resolve(__dirname, '../workflows');
if (!fs.existsSync(workflowsDir)) {
  fs.mkdirSync(workflowsDir, { recursive: true });
}

const workflows = [
  {
    filename: '01-OmniChannel-Scheduled-Distribution.json',
    data: DISTRIBUTION_WORKFLOW
  },
  {
    filename: '02-Cross-Platform-Analytics-Harvester.json',
    data: ANALYTICS_WORKFLOW
  },
  {
    filename: '03-OmniFlow-Master-Loop.json',
    data: UNIFIED_MASTER_WORKFLOW
  }
];

for (const wf of workflows) {
  const filePath = path.join(workflowsDir, wf.filename);
  fs.writeFileSync(filePath, JSON.stringify(wf.data, null, 2), 'utf-8');
  console.log(`Exported workflow: ${wf.filename}`);
}

console.log('All n8n workflow JSON files exported successfully.');
