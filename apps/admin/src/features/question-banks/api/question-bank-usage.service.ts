import { supabase } from '@/lib/supabase';
import { extractErrorMessage } from '@/lib/error-handler';

export interface QuestionBankUsage {
  competitions: {
    id: string;
    title: string;
    season: string;
    status: string;
    grades: number[];
  }[];
  mockTests: {
    id: string;
    title: string;
    difficulty: string;
    isPublished: boolean;
    grades: number[];
  }[];
  totalAssignments: number;
}

export const questionBankUsageService = {
  /**
   * Get all places where a question bank is assigned (competitions and mock tests)
   */
  getUsage: async (questionBankId: string): Promise<QuestionBankUsage> => {
    // Get competitions using this question bank
    const { data: competitionAssignments, error: compError } = await supabase
      .from('competition_question_banks')
      .select(`
        grades,
        competitions!competition_id(id, title, season, status)
      `)
      .eq('question_bank_id', questionBankId);

    if (compError) {
      console.error('Error fetching competition assignments:', compError);
      throw new Error(extractErrorMessage(compError));
    }

    // Get mock tests using this question bank
    const { data: mockTestAssignments, error: mockError } = await supabase
      .from('mock_test_question_banks')
      .select(`
        grades,
        mock_tests!mock_test_id(id, title, difficulty, is_published)
      `)
      .eq('question_bank_id', questionBankId);

    if (mockError) {
      console.error('Error fetching mock test assignments:', mockError);
      throw new Error(extractErrorMessage(mockError));
    }

    // Map competitions
    const competitions = (competitionAssignments || []).map((a: any) => ({
      id: a.competitions?.id || '',
      title: a.competitions?.title || 'Unknown Competition',
      season: a.competitions?.season || '',
      status: a.competitions?.status || 'draft',
      grades: a.grades || [],
    })).filter(c => c.id); // Filter out any empty entries

    // Map mock tests
    const mockTests = (mockTestAssignments || []).map((a: any) => ({
      id: a.mock_tests?.id || '',
      title: a.mock_tests?.title || 'Unknown Mock Test',
      difficulty: a.mock_tests?.difficulty || 'Beginner',
      isPublished: a.mock_tests?.is_published || false,
      grades: a.grades || [],
    })).filter(m => m.id); // Filter out any empty entries

    return {
      competitions,
      mockTests,
      totalAssignments: competitions.length + mockTests.length,
    };
  },

  /**
   * Check if a question bank can be safely deleted
   * Returns false if it's assigned to any competitions or mock tests
   */
  canDelete: async (questionBankId: string): Promise<{ canDelete: boolean; reason?: string }> => {
    const usage = await questionBankUsageService.getUsage(questionBankId);
    
    if (usage.totalAssignments > 0) {
      const compCount = usage.competitions.length;
      const mockCount = usage.mockTests.length;
      
      let reason = 'This question bank is currently assigned to: ';
      const items: string[] = [];
      
      if (compCount > 0) {
        items.push(`${compCount} competition${compCount > 1 ? 's' : ''}`);
      }
      if (mockCount > 0) {
        items.push(`${mockCount} mock test${mockCount > 1 ? 's' : ''}`);
      }
      
      reason += items.join(' and ');
      reason += '. Please unassign it before deleting.';
      
      return { canDelete: false, reason };
    }
    
    return { canDelete: true };
  },

  /**
   * Get statistics about question bank usage
   */
  getUsageStats: async () => {
    const { data, error } = await supabase
      .from('question_banks')
      .select('id, title');

    if (error) {
      console.error('Error fetching question banks:', error);
      throw new Error(extractErrorMessage(error));
    }

    const banks = data || [];
    const stats: { 
      id: string; 
      title: string; 
      competitionCount: number; 
      mockTestCount: number;
      totalUsage: number;
    }[] = [];

    for (const bank of banks) {
      const usage = await questionBankUsageService.getUsage(bank.id);
      stats.push({
        id: bank.id,
        title: bank.title,
        competitionCount: usage.competitions.length,
        mockTestCount: usage.mockTests.length,
        totalUsage: usage.totalAssignments,
      });
    }

    return stats.sort((a, b) => b.totalUsage - a.totalUsage);
  },
};
