import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Clock3,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date) {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications/my");

      setNotifications(
        response.data.notifications || []
      );
    } catch (err) {
      console.error(
        "Failed to load notifications:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(
        `/notifications/${notificationId}/read`
      );

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update notification."
      );
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(
      (notification) => !notification.read
    );

    for (const notification of unread) {
      try {
        await api.patch(
          `/notifications/${notification._id}/read`
        );
      } catch (err) {
        console.error(
          "Failed to mark notification:",
          err
        );
      }
    }

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const generateDeadlineNotifications = async () => {
    try {
      setGenerating(true);
      setError("");

      await api.post(
        "/notifications/generate-deadline-notifications"
      );

      await loadNotifications();
    } catch (err) {
      console.error(
        "Failed to generate deadline notifications:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to generate deadline reminders."
      );
    } finally {
      setGenerating(false);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <div>
          <Link
            to="/dashboard"
            className="notifications-back-link"
          >
            ← Dashboard
          </Link>

          <div className="notifications-kicker">
            NOTIFICATION CENTER
          </div>

          <h1>Stay ahead of what matters.</h1>

          <p>
            Deadline reminders and important CampusLaunch
            updates, all in one place.
          </p>
        </div>

        <div className="notifications-header-actions">
          <button
            className="notifications-secondary-button"
            onClick={loadNotifications}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "notifications-spin"
                  : ""
              }
            />
            Refresh
          </button>

          {unreadCount > 0 && (
            <button
              className="notifications-primary-button"
              onClick={markAllAsRead}
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="notifications-error">
          {error}
        </div>
      )}

      <section className="notifications-summary">
        <div className="notifications-summary-icon">
          <Bell size={22} />
        </div>

        <div>
          <strong>
            {unreadCount} unread notification
            {unreadCount === 1 ? "" : "s"}
          </strong>

          <span>
            CampusLaunch keeps checking your tracked
            opportunities for important deadline signals.
          </span>
        </div>
      </section>

      <main className="notifications-content">
        <div className="notifications-section-heading">
          <div>
            <span>YOUR UPDATES</span>
            <h2>Recent notifications</h2>
          </div>
        </div>

        {loading ? (
          <div className="notifications-empty">
            <div className="notifications-loader" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notifications-empty">
            <div className="notifications-empty-icon">
              <Bell size={24} />
            </div>

            <h3>You're all caught up</h3>

            <p>
              Important deadline reminders will appear
              here when they are generated.
            </p>

            <button
              className="notifications-primary-button"
              onClick={generateDeadlineNotifications}
              disabled={generating}
            >
              <Clock3 size={16} />
              {generating
                ? "Checking deadlines..."
                : "Check deadlines"}
            </button>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <article
                key={notification._id}
                className={`notification-card ${
                  notification.read ? "read" : "unread"
                }`}
              >
                <div className="notification-icon">
                  {notification.title
                    ?.toLowerCase()
                    .includes("deadline") ? (
                    <Clock3 size={19} />
                  ) : (
                    <Bell size={19} />
                  )}
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <h3>{notification.title}</h3>

                    {!notification.read && (
                      <span className="notification-new">
                        NEW
                      </span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <div className="notification-meta">
                    <span>
                      {formatDate(
                        notification.createdAt
                      )}
                    </span>

                    <span>
                      {formatTime(
                        notification.createdAt
                      )}
                    </span>
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.read ? (
                    <button
                      onClick={() =>
                        markAsRead(
                          notification._id
                        )
                      }
                    >
                      <Check size={15} />
                      Mark read
                    </button>
                  ) : (
                    <span className="notification-read">
                      <ShieldCheck size={15} />
                      Read
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="notifications-footer-action">
            <button
              className="notifications-secondary-button"
              onClick={generateDeadlineNotifications}
              disabled={generating}
            >
              <Clock3 size={16} />

              {generating
                ? "Checking deadlines..."
                : "Check for new deadline reminders"}

              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;