import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials missing. Using localStorage fallback.');
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ═══════════════════════════════════════
// USER FUNCTIONS
// ═══════════════════════════════════════

export async function registerUser(username, password) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

    if (existing) return { error: 'Username already taken. Try a different one or login.' };

    const { data, error } = await supabase
        .from('users')
        .insert([{ username, password_hash: password, role: 'user' }])
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function loginUser(username, password) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error || !data) return { error: 'Account not found. Please sign up first.' };
    if (data.password_hash !== password) return { error: 'Incorrect password. Please try again.' };

    return { data };
}

// ═══════════════════════════════════════
// CHAT HISTORY FUNCTIONS
// ═══════════════════════════════════════

export async function getUserId(username) {
    if (!supabase) return null;
    const { data } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();
    return data?.id || null;
}

export async function loadConversations(userId) {
    if (!supabase || !userId) return [];
    const { data } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
    return data || [];
}

export async function saveConversation(userId, conversationId, title, messages) {
    if (!supabase || !userId) return null;

    const { data: existing } = await supabase
        .from('chat_history')
        .select('id')
        .eq('user_id', userId)
        .eq('conversation_id', conversationId)
        .single();

    if (existing) {
        const { data } = await supabase
            .from('chat_history')
            .update({ title, messages, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
            .select()
            .single();
        return data;
    } else {
        const { data } = await supabase
            .from('chat_history')
            .insert([{ user_id: userId, conversation_id: conversationId, title, messages }])
            .select()
            .single();
        return data;
    }
}

export async function deleteConversation(userId, conversationId) {
    if (!supabase || !userId) return;
    await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', userId)
        .eq('conversation_id', conversationId);
}

// ═══════════════════════════════════════
// FEEDBACK FUNCTIONS
// ═══════════════════════════════════════

export async function submitFeedback(userId, username, rating, category, feedbackText) {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('feedbacks')
        .insert([{ user_id: userId, username, rating, category, feedback_text: feedbackText }])
        .select()
        .single();
    if (error) console.error('Feedback submit error:', error);
    return data;
}

export async function loadAllFeedbacks() {
    if (!supabase) return [];
    const { data } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });
    return data || [];
}

export async function deleteFeedback(feedbackId) {
    if (!supabase) return;
    await supabase.from('feedbacks').delete().eq('id', feedbackId);
}

export async function addReplyToFeedback(feedbackId, replyObj) {
    if (!supabase) return;
    const { data: fb } = await supabase
        .from('feedbacks')
        .select('replies')
        .eq('id', feedbackId)
        .single();

    if (!fb) return;
    const updatedReplies = [...(fb.replies || []), replyObj];
    await supabase
        .from('feedbacks')
        .update({ replies: updatedReplies })
        .eq('id', feedbackId);
}

// ═══════════════════════════════════════
// UPLOADED DATA FUNCTIONS
// ═══════════════════════════════════════

export async function saveUploadedFile(userId, filename, fileType, fileSize) {
    if (!supabase || !userId) return null;
    const { data } = await supabase
        .from('uploaded_data')
        .insert([{ user_id: userId, filename, file_type: fileType, file_size: fileSize }])
        .select()
        .single();
    return data;
}

export async function loadUploadedFiles(userId) {
    if (!supabase || !userId) return [];
    const { data } = await supabase
        .from('uploaded_data')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    return data || [];
}
