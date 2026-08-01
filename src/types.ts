export type Page =
  | 'home' | 'minecraft' | 'discord' | 'store' | 'status' | 'knowledgebase'
  | 'client' | 'support' | 'contact' | 'about'
  | 'terms' | 'privacy' | 'refund' | 'aup' | 'panel' | 'admin';

export interface NavigateProps {
  navigate: (page: Page) => void;
}
