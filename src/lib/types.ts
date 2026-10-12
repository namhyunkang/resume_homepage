export type Lang = "en" | "ko";
export type L<T = string> = { en: T; ko: T };

export type CaseNotes = {
  symptom: string;
  trace: string;
  fix: string;
  result: string;
};

export type Project = {
  id: string; // URL slug
  order: number;
  co: L;
  year: string;
  period: L;
  title: L;
  summary: L;
  tags: string[];
  built: L<string[]>;
  caseNotes: L<CaseNotes> | null;
  createdAt: string;
  updatedAt: string;
};

export type Visibility = "public" | "private";

export type Memo = {
  id: string;
  projectId: string | null; // null = general note, not tied to a project
  visibility: Visibility;
  title: string;
  body: string; // light markdown
  createdAt: string;
  updatedAt: string;
};

export type DB = {
  version: 1;
  projects: Project[];
  memos: Memo[];
};

/**
 * What a page is allowed to see of a memo.
 * For visitors, private memos arrive with `redacted: true` and NO title/body —
 * only the date, a sequence number and a rough size. The text never leaves the server.
 */
export type MemoView = {
  id: string;
  seq: number;
  projectId: string | null;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
  words: number;
  redacted: boolean;
  title?: string;
  body?: string;
};
