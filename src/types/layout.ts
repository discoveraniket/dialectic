export type ActivityBarItem = 
  | 'explorer' 
  | 'search' 
  | 'source-control' 
  | 'extensions'
  | 'settings';

export interface EditorTab {
  id: string;
  title: string;
  isDirty?: boolean;
}

export interface WorkspaceFolder {
  name: string;
  path: string;
  files: Array<{ name: string; isDir?: boolean }>;
}
