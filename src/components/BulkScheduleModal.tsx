import React, { useState } from 'react';
import { ScheduledPostItem } from '../types/workflow';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Play,
  FileText,
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';

interface BulkScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkAdd: (newPosts: ScheduledPostItem[]) => void;
}

const SAMPLE_CSV = `title,caption,media_url,tags,scheduled_time,platforms
"How to Auto-Post to 3 Platforms with n8n","Stop manually copy-pasting your videos. Here is the full automated architecture.","https://storage.googleapis.com/omnichannel-media-cdn/videos/batch_01.mp4","n8n;automation;growth","Tomorrow at 9:00 AM EST","tiktok,youtube,instagram"
"3 Video Hook Formulas that Tripled Our Views","The first 3 seconds decide everything on Shorts, TikTok, and Reels.","https://storage.googleapis.com/omnichannel-media-cdn/videos/batch_02.mp4","hooks;algorithm;creators","Tomorrow at 1:00 PM EST","tiktok,youtube,instagram"
"Solving Meta Instagram Reels Transcoding Delays","Why container polling is mandatory in Meta Graph API v21.","https://storage.googleapis.com/omnichannel-media-cdn/videos/batch_03.mp4","metagraph;developer;api","Tomorrow at 5:00 PM EST","tiktok,youtube,instagram"
"YouTube Shorts 10k Quota System Explained","How each video upload costs 1600 units and how to space your queue.","https://storage.googleapis.com/omnichannel-media-cdn/videos/batch_04.mp4","youtube;shorts;quota","In 2 days at 9:00 AM EST","youtube,tiktok"
"The 2026 Growth Engineer Tech Stack","The essential automation tools for modern organic content distribution.","https://storage.googleapis.com/omnichannel-media-cdn/videos/batch_05.mp4","techstack;growth;engineering","In 2 days at 1:00 PM EST","tiktok,youtube,instagram"`;

export const BulkScheduleModal: React.FC<BulkScheduleModalProps> = ({
  isOpen,
  onClose,
  onBulkAdd,
}) => {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [parsedRows, setParsedRows] = useState<ScheduledPostItem[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');

  if (!isOpen) return null;

  // CSV parsing logic supporting quoted fields
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const handleParse = (textToParse: string) => {
    setParseError(null);
    try {
      const lines = textToParse
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length < 2) {
        setParseError('CSV must include a header row and at least one data row.');
        setParsedRows([]);
        return;
      }

      // Check header
      const header = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/['"]/g, ''));
      const titleIdx = header.indexOf('title');
      const captionIdx = header.indexOf('caption');
      const mediaIdx = header.indexOf('media_url');
      const tagsIdx = header.indexOf('tags');
      const timeIdx = header.indexOf('scheduled_time');
      const platIdx = header.indexOf('platforms');

      if (titleIdx === -1) {
        setParseError('CSV must contain a "title" column header.');
        setParsedRows([]);
        return;
      }

      const rows: ScheduledPostItem[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (cols.length < 2) continue;

        const title = cols[titleIdx] || `Batch Post #${i}`;
        const caption = captionIdx !== -1 && cols[captionIdx] ? cols[captionIdx] : 'Distributed automatically via n8n.';
        const mediaUrl =
          mediaIdx !== -1 && cols[mediaIdx]
            ? cols[mediaIdx]
            : 'https://storage.googleapis.com/omnichannel-media-cdn/videos/demo.mp4';
        
        let tags: string[] = ['automation', 'n8n', 'growth'];
        if (tagsIdx !== -1 && cols[tagsIdx]) {
          tags = cols[tagsIdx].split(/[;, ]/).filter((t) => t.trim().length > 0);
        }

        const scheduledTime =
          timeIdx !== -1 && cols[timeIdx]
            ? cols[timeIdx]
            : `Scheduled Queue #${i}`;

        let platforms: ('tiktok' | 'youtube' | 'instagram')[] = ['tiktok', 'youtube', 'instagram'];
        if (platIdx !== -1 && cols[platIdx]) {
          const rawPlats = cols[platIdx].toLowerCase();
          const pList: ('tiktok' | 'youtube' | 'instagram')[] = [];
          if (rawPlats.includes('tiktok')) pList.push('tiktok');
          if (rawPlats.includes('youtube')) pList.push('youtube');
          if (rawPlats.includes('instagram')) pList.push('instagram');
          if (pList.length > 0) platforms = pList;
        }

        rows.push({
          id: `bulk_${Date.now()}_${i}`,
          title,
          caption,
          mediaUrl,
          tags,
          scheduledTime,
          status: 'SCHEDULED',
          platforms,
        });
      }

      setParsedRows(rows);
    } catch (err: any) {
      setParseError('Failed to parse CSV: ' + err.message);
      setParsedRows([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      handleParse(content);
    };
    reader.readAsText(file);
  };

  const handleCommit = () => {
    if (parsedRows.length === 0) return;
    onBulkAdd(parsedRows);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#0f1422] border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bulk Schedule Content Queue</h3>
              <p className="text-xs text-slate-400">
                Import and schedule multiple posts across TikTok, YouTube, and Instagram from CSV
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('paste')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'paste'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Paste CSV Text
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Upload .CSV File
              </button>
            </div>

            <button
              onClick={() => {
                setCsvText(SAMPLE_CSV);
                handleParse(SAMPLE_CSV);
              }}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer ml-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Load 5-Post Sample Batch</span>
            </button>
          </div>

          <button
            onClick={() => handleParse(csvText)}
            className="px-3.5 py-1 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Parse & Validate
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'paste' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Expected CSV Columns: <code className="text-amber-300 font-mono">title, caption, media_url, tags, scheduled_time, platforms</code></span>
              </div>
              <textarea
                rows={7}
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  handleParse(e.target.value);
                }}
                placeholder="Paste CSV rows here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-rose-500 leading-relaxed"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center space-y-3 bg-slate-950/40">
              <Upload className="w-8 h-8 text-slate-500 mx-auto" />
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Select a .CSV file from your computer
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Must include title, caption, media_url, and scheduled_time columns
                </p>
              </div>
              <label className="inline-block px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg cursor-pointer transition-colors shadow-sm">
                <span>Choose File</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {parseError && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Validated Rows to Schedule ({parsedRows.length})
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All rows formatted
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
              {parsedRows.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No valid rows parsed yet. Paste CSV data above or click "Load 5-Post Sample Batch".
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono text-[10px] sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Post Title</th>
                      <th className="py-2.5 px-3">Scheduled Window</th>
                      <th className="py-2.5 px-3">Platforms</th>
                      <th className="py-2.5 px-3">Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {parsedRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-3 max-w-xs truncate text-slate-200 font-sans font-medium">
                          {row.title}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                          {row.scheduledTime}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            {row.platforms.map((p) => (
                              <span
                                key={p}
                                className={`text-[9px] px-1 rounded uppercase font-bold ${
                                  p === 'tiktok'
                                    ? 'text-[#25F4EE] bg-[#25F4EE]/10'
                                    : p === 'youtube'
                                    ? 'text-red-400 bg-red-500/10'
                                    : 'text-pink-400 bg-pink-500/10'
                                }`}
                              >
                                {p === 'tiktok' ? 'TT' : p === 'youtube' ? 'YT' : 'IG'}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-emerald-400 whitespace-nowrap">
                          Ready
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="h-16 px-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            {parsedRows.length} Posts will be added to the Active Schedule Queue
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleCommit}
              disabled={parsedRows.length === 0}
              className={`px-5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-md transition-all ${
                parsedRows.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Schedule All {parsedRows.length} Posts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
