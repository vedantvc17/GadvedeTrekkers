import { useEffect, useRef, useState } from "react";
import { getAlerts, getSeenAlertIds, markAlertSeen } from "../data/notificationStorage";

function WebsiteNotificationBridge() {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );
  const lastSeenRef = useRef(new Set(getSeenAlertIds()));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const requestPermission = async () => {
      if (typeof Notification === "undefined") return;
      if (Notification.permission === "default") {
        const next = await Notification.requestPermission();
        setPermission(next);
      } else {
        setPermission(Notification.permission);
      }
    };

    requestPermission();

    const run = () => {
      const alerts = getAlerts();
      const seen = new Set(getSeenAlertIds());
      lastSeenRef.current = seen;

      alerts
        .slice()
        .reverse()
        .forEach((alert) => {
          if (seen.has(alert.id)) return;
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification(alert.title, {
              body: alert.message,
              tag: alert.id,
            });
          }
          markAlertSeen(alert.id);
        });
    };

    run();
    const interval = window.setInterval(run, 3000);
    window.addEventListener("storage", run);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", run);
    };
  }, []);

  return permission === "denied" ? null : null;
}

export default WebsiteNotificationBridge;
