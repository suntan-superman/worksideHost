/* eslint-disable */

import React, { createContext, useContext, useEffect, useState } from "react";
import io from 'socket.io-client';
import { toast } from 'react-toastify'; // or your preferred toast library

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Load persisted notifications on mount
    useEffect(() => {
        const stored = localStorage.getItem('notifications');
        if (stored) {
            const parsed = JSON.parse(stored);
            setNotifications(parsed);
            setUnreadCount(parsed.filter(n => !n.readAt).length);
        }
    }, []);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_BACKEND_URL);
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    // Handle socket events
    useEffect(() => {
        if (!socket) return;

        // Register user when socket connects
        socket.on('connect', () => {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                socket.emit('register_user', userEmail);
            }
        });

        // Handle incoming notifications
        socket.on('notification', async (notification) => {
            // Show toast
            toast(notification.message, {
                title: notification.title,
                type: notification.type || 'info'
            });

            // Store notification
            const newNotification = {
                ...notification,
                receivedAt: new Date().toISOString()
            };

            setNotifications(prev => {
                const updated = [newNotification, ...prev];
                localStorage.setItem('notifications', JSON.stringify(updated));
                return updated;
            });

            setUnreadCount(prev => prev + 1);

            // Send delivery confirmation
            if (notification.requireConfirmation) {
                socket.emit('notification_received', {
                    notificationId: notification.id,
                    email: localStorage.getItem('userEmail')
                });
            }
        });

        return () => {
            socket.off('notification');
            socket.off('connect');
        };
    }, [socket]);

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        setNotifications(prev => {
            const updated = prev.map(n => {
                if (n.id === notificationId && !n.readAt) {
                    return { ...n, readAt: new Date().toISOString() };
                }
                return n;
            });
            localStorage.setItem('notifications', JSON.stringify(updated));
            return updated;
        });

        setUnreadCount(prev => Math.max(0, prev - 1));

        // Inform server
        if (socket?.connected) {
            socket.emit('notification_read', {
                notificationId,
                email: localStorage.getItem('userEmail')
            });
        }
    };

    // Clear notifications
    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
        localStorage.setItem('notifications', JSON.stringify([]));
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            clearNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext); 