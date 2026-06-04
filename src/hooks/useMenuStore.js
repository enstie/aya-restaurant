import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useMenuStore() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });
        
      if (data && !error) {
        setMenuItems(data);
      } else {
        console.error('Failed to fetch menu:', error);
      }
      setLoading(false);
    }
    
    fetchMenu();

    const channel = supabase.channel('public:menu_items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, (payload) => {
         if (payload.eventType === 'INSERT') {
           setMenuItems(prev => [...prev, payload.new]);
         } else if (payload.eventType === 'UPDATE') {
           setMenuItems(prev => prev.map(item => item.id === payload.new.id ? payload.new : item));
         } else if (payload.eventType === 'DELETE') {
           setMenuItems(prev => prev.filter(item => item.id !== payload.old.id));
         }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateMenuItem = useCallback(async (id, updates) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    const { error } = await supabase.from('menu_items').update(updates).eq('id', id);
    if (error) console.error('Failed to update menu item:', error);
  }, []);

  const addMenuItem = useCallback(async (newItem) => {
    // Basic optimistic update
    setMenuItems(prev => [...prev, newItem]);
    const { error } = await supabase.from('menu_items').insert([newItem]);
    if (error) console.error('Failed to add menu item:', error);
  }, []);

  const deleteMenuItem = useCallback(async (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) console.error('Failed to delete menu item:', error);
  }, []);

  return { menuItems, loading, updateMenuItem, addMenuItem, deleteMenuItem };
}
