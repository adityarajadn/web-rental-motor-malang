import { supabase } from '@/lib/supabase';
import { ROLE } from '@/constants';

export const AuthService = {
    async login(email: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error || !data) {
            throw new Error('Email belum terdaftar atau terjadi kesalahan jaringan.');
        }

        return data;
    },

    async register(name: string, email: string, phone: string, password_hash: string) {
        const { data, error } = await supabase
            .from('users')
            .insert({
                name,
                email,
                phone,
                password_hash,
                role: ROLE.USER
            })
            .select()
            .single();
        
        if (error || !data) {
            throw new Error('Gagal mendaftar: ' + (error?.message || 'Unknown error'));
        }

        return data;
    }
};
