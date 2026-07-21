export const ROLE = {
    ADMIN: "admin",
    USER: "customer"
};

export const BOOKING_STATUS = {
    PENDING_PAYMENT: "pending_payment",
    AWAITING_VERIFICATION: "awaiting_verification",
    CONFIRMED: "confirmed",
    ACTIVE: "active",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
};

export const PENALTY = {
    LATE_FEE_PER_INTERVAL: 2000,
    INTERVAL_MINUTES: 15
};

export const APP_CONFIG = {
    DEADLINE_HOUR: "09:00:00+07:00", // 09:00 WIB
};
