#!/usr/bin/env node
/**
 * 从 test.md 读取 retDataList，生成扁平化表格数据（CSV + Markdown）
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const inputPath = join(root, 'test.md');
const outCsv = join(root, 'retDataList-table.csv');
const outMd = join(root, 'retDataList-table-full.md');

const raw = readFileSync(inputPath, 'utf-8');
const data = JSON.parse(raw);
const list = data.retDataList || [];

function escapeCsv(val) {
  if (val == null) return '';
  const s = String(val);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function flattenRow(item) {
  const ch = item.channel || {};
  return {
    videoId: item.videoId ?? '',
    videoTitle: item.videoTitle ?? '',
    pubTime: item.pubTime ?? '',
    views: item.views ?? '',
    likes: item.likes ?? '',
    comments: item.comments ?? '',
    shares: item.shares ?? '',
    collects: item.collects ?? '',
    thumbnails: item.thumbnails ?? '',
    viewFollowers: item.viewFollowers ?? '',
    channelId: ch.id ?? '',
    channelName: ch.name ?? '',
    channelAvatar: ch.avatar ?? '',
    channelFollowers: ch.followers ?? '',
    channelAlias: ch.alias ?? '',
    hasEmail: ch.hasEmail ?? '',
    hasWhatsapp: ch.hasWhatsapp ?? '',
    isVideo: item.isVideo ?? '',
    isPromote: item.isPromote ?? '',
    isAd: item.isAd ?? '',
    isEcVideo: item.isEcVideo ?? '',
    relatedVideosCount: Array.isArray(item.relatedVideos) ? item.relatedVideos.length : 0,
  };
}

const rows = list.map(flattenRow);
const headers = Object.keys(rows[0] || {});

// CSV
const csvLines = [headers.join(',')];
for (const row of rows) {
  csvLines.push(headers.map((h) => escapeCsv(row[h])).join(','));
}
writeFileSync(outCsv, '\uFEFF' + csvLines.join('\n'), 'utf-8'); // BOM for Excel

// Markdown table (limit width for title/url columns in md)
const mdHeaders = headers;
const sep = '|' + mdHeaders.map(() => '---').join('|') + '|';
const mdRows = rows.map((row) =>
  '|' + mdHeaders.map((h) => String(row[h] ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')).join('|') + '|'
);
const mdContent = [
  '# retDataList 完整表格数据',
  '',
  `共 **${rows.length}** 条记录。`,
  '',
  '|' + mdHeaders.join('|') + '|',
  sep,
  ...mdRows,
  '',
].join('\n');
writeFileSync(outMd, mdContent, 'utf-8');

console.log(`Done: ${rows.length} rows -> ${outCsv}, ${outMd}`);
