export type ActivityBarItem = 
  | 'explorer' 
  | 'search' 
  | 'source-control' 
  | 'run-debug'
  | 'extensions'
  | 'settings';

export interface EditorTab {
  id: string;
  title: string;
  content?: string;
  isDirty?: boolean;
}

export interface WorkspaceFolder {
  name: string;
  path: string;
  files: Array<{ name: string; isDir?: boolean }>;
}
