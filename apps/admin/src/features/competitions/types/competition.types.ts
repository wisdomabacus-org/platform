
import { Database } from '@platform/database';

export type CompetitionStatus = 'draft' | 'published' | 'upcoming' | 'ongoing' | 'completed' | 'archived';

export type Competition = Database['public']['Tables']['competitions']['Row'];
export type CompetitionInsert = Database['public']['Tables']['competitions']['Insert'];
export type CompetitionUpdate = Database['public']['Tables']['competitions']['Update'];

export interface CompetitionFilters {
  status?: string[];
  search?: string;
  season?: string;
}
