/**
 * useOrderStore
 * Persists all restaurant orders to localStorage.
 * Cross-tab sync via the `storage` event — changes on one tab
 * (e.g. guest's walk-in device) immediately appear on another
 * (e.g. the kitchen display monitor).
 *
 * Order shape:
 * {
 *   id: string,           // e.g. "AYA-3847"
 *   placedAt: string,     // ISO timestamp
 *   items: Array<{ id, name, price, qty }>,
 *   subtotal: number,
 *   serviceCharge: number,
 *   total: number,
 *   status: 'confirmed' | 'preparing' | 'ready' | 'served',
 *   tableNote: string,    // optional free-text (future use)
 * }
 */

import { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { supabase } from '../lib/supabase';

function mapOrderFromDB(o) {
  return {
    ...o,
    placedAt: o.placed_at,
    serviceCharge: o.service_charge,
    tableNumber: o.table_number,
    guestName: o.guest_name,
  };
}

export function useOrderStore() {
  const [orders, setOrders] = useState([]);

  // Fetch initial orders and subscribe to real-time changes
  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('placed_at', { ascending: false });
        
      if (data && !error) {
        setOrders(data.map(mapOrderFromDB));
      } else if (error) {
        console.error('Error fetching orders:', error);
      }
    }
    
    fetchOrders();

    const channel = supabase.channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
         if (payload.eventType === 'INSERT') {
           setOrders(prev => {
             const exists = prev.find(o => o.id === payload.new.id);
             if (exists) return prev; // Avoid duplicate from optimistic update
             const newOrders = [mapOrderFromDB(payload.new), ...prev];
             return newOrders.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
           });
         } else if (payload.eventType === 'UPDATE') {
           setOrders(prev => prev.map(o => o.id === payload.new.id ? mapOrderFromDB(payload.new) : o));
         } else if (payload.eventType === 'DELETE') {
           setOrders(prev => prev.filter(o => o.id !== payload.old.id));
         }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /** Place a new order — called from WalkInPage */
  const placeOrder = useCallback(async (orderData) => {
    // Sanitize free-text fields
    const safeGuestName = DOMPurify.sanitize(orderData.guestName || '');
    const safeAllergies = DOMPurify.sanitize(orderData.allergies || '');

    const dbOrder = {
      id: orderData.id,
      items: orderData.items,
      subtotal: orderData.subtotal,
      service_charge: orderData.serviceCharge,
      total: orderData.total,
      table_number: orderData.tableNumber,
      guest_name: safeGuestName,
      mobile: orderData.mobile,
      allergies: safeAllergies,
      status: 'confirmed',
      placed_at: new Date().toISOString()
    };
    
    // Optimistic update for immediate UI response
    const tempOrder = mapOrderFromDB(dbOrder);
    setOrders(prev => [tempOrder, ...prev]);

    const { error } = await supabase.from('orders').insert([dbOrder]);
    if (error) console.error('Failed to place order:', error);
    
    return tempOrder;
  }, []);

  /** Advance an order's status */
  const updateStatus = useCallback(async (orderId, newStatus) => {
    let previousOrderState = null;
    
    setOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      if (order) previousOrderState = { ...order };
      
      // Optimistic update
      return prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    });
    
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);
      
    if (error) {
      console.error('Failed to update status:', error);
      alert("Failed to update order. Are you logged in or online?");
      if (previousOrderState) {
        setOrders(prev => prev.map(o => o.id === orderId ? previousOrderState : o));
      }
    }
  }, []);

  /** Hard-delete an order (archive/dismiss) */
  const deleteOrder = useCallback(async (orderId) => {
    let deletedOrder = null;
    
    setOrders(prev => {
      deletedOrder = prev.find(o => o.id === orderId);
      // Optimistic update
      return prev.filter(o => o.id !== orderId);
    });
    
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    
    if (error) {
      console.error('Failed to delete order:', error);
      alert("Failed to dismiss order. Are you logged in or online?");
      if (deletedOrder) {
        setOrders(prev => [deletedOrder, ...prev].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)));
      }
    }
  }, []);

  /** Clear all served orders (end-of-day cleanup) */
  const clearServed = useCallback(async () => {
    let servedOrders = [];
    
    setOrders(prev => {
      servedOrders = prev.filter(o => o.status === 'served');
      // Optimistic update
      return prev.filter(o => o.status !== 'served');
    });
    
    const { error } = await supabase.from('orders').delete().eq('status', 'served');
    
    if (error) {
      console.error('Failed to clear served orders:', error);
      alert("Failed to clear orders. Are you logged in or online?");
      if (servedOrders.length > 0) {
        setOrders(prev => [...prev, ...servedOrders].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)));
      }
    }
  }, []);

  return { orders, placeOrder, updateStatus, deleteOrder, clearServed };
}

// Status metadata — single source for both KDS and walk-in
export const STATUS_CONFIG = {
  confirmed: {
    label: 'Confirmed',
    next: 'preparing',
    nextLabel: 'Start Preparing',
    color: '#C8883A',        // amber
    bg: '#FDF3E7',
    border: '#E8C898',
  },
  preparing: {
    label: 'Preparing',
    next: 'ready',
    nextLabel: 'Mark as Ready',
    color: '#2563EB',        // blue
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  ready: {
    label: 'Ready',
    next: 'served',
    nextLabel: 'Mark as Served',
    color: '#16A34A',        // green
    bg: '#F0FDF4',
    border: '#BBF7D0',
  },
  served: {
    label: 'Served',
    next: null,
    nextLabel: null,
    color: '#6B7280',        // gray
    bg: '#F9FAFB',
    border: '#E5E7EB',
  },
};

export const STATUS_ORDER = ['confirmed', 'preparing', 'ready', 'served'];
