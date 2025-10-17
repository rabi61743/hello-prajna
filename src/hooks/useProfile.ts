import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar_url?: string;
  }) => {
    try {
      const { error } = await supabase.rpc('update_user_profile', {
        p_first_name: updates.first_name || null,
        p_last_name: updates.last_name || null,
        p_phone: updates.phone || null,
        p_avatar_url: updates.avatar_url || null,
      });

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });

      await fetchProfile();
      return { error: null };
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: err.message,
      });
      return { error: err };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully',
      });

      return { error: null };
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Password update failed',
        description: err.message,
      });
      return { error: err };
    }
  };

  const deleteAccount = async () => {
    try {
      const { error } = await supabase.rpc('delete_user_account');

      if (error) throw error;

      // Sign out after deleting account
      await supabase.auth.signOut();

      toast({
        title: 'Account deleted',
        description: 'Your account has been permanently deleted',
      });

      return { error: null };
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Account deletion failed',
        description: err.message,
      });
      return { error: err };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updatePassword,
    deleteAccount,
    refetch: fetchProfile,
  };
}
