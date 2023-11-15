import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface NotificationProviderProps {
  children: ReactNode;
}

export interface Notification {
  type: "info" | "error" | "success";
  message: string;
}

interface NotificationContextType {
  notifications: Notification[];
  removeNotification(idx: number): void;
  addNotification(noti: Notification): void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  removeNotification: (_idx) => {},
  addNotification: (_noti: Notification) => {},
});

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState([] as Notification[]);

  const removeNotification = useCallback(
    (targetIdx: number) => {
      setNotifications(notifications.filter((_curr, idx) => idx !== targetIdx));
    },
    [notifications],
  );

  const addNotification = useCallback(
    (noti: Notification) => {
      setNotifications([...notifications, noti]);
    },
    [notifications, setNotifications],
  );

  const value = useMemo(
    () => ({ notifications, removeNotification, addNotification }),
    [notifications, removeNotification, addNotification],
  );

  useEffect(() => {
    if (notifications.length === 0) return () => {};
    let intervalId: any;
    if (notifications.length > 0) {
      intervalId = setInterval(() => {
        setNotifications(notifications.filter((_v, idx) => idx > 0));
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [notifications]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
