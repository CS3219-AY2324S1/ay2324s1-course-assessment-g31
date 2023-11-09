import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "react";

import {
  Notification,
  NotificationContext,
} from "../context/NotificationContext";
import Toast from "./Toast";

function Notifications() {
  const { notifications } = useContext(NotificationContext);

  function generateNotification(noti: Notification) {
    switch (noti.type) {
      case "error":
        return (
          <Toast
            icon={
              <XCircleIcon
                className="h-6 w-6 text-red-400"
                aria-hidden="true"
              />
            }
            title="Error"
            description={noti.message}
          />
        );

      case "success":
        return (
          <Toast
            icon={
              <CheckCircleIcon
                className="h-6 w-6 text-green-400"
                aria-hidden="true"
              />
            }
            title="Error"
            description={noti.message}
          />
        );

      case "info":
        return (
          <Toast
            icon={
              <InformationCircleIcon
                className="h-6 w-6 text-blue-400"
                aria-hidden="true"
              />
            }
            title="Error"
            description={noti.message}
          />
        );

      default:
        return (
          <Toast
            icon={
              <InformationCircleIcon
                className="h-6 w-6 text-blue-400"
                aria-hidden="true"
              />
            }
            title="Error"
            description={noti.message}
          />
        );
    }
  }

  return <>{notifications.map((noti) => generateNotification(noti))}</>;
}

export default Notifications;
