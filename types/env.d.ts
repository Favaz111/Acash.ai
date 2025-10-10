/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    // Firebase Configuration
    readonly NEXT_PUBLIC_FIREBASE_API_KEY: string;
    readonly NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    readonly NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    readonly NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    readonly NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly NEXT_PUBLIC_FIREBASE_APP_ID: string;

    // App Configuration
    readonly NEXT_PUBLIC_APP_URL: string;
    readonly NEXT_PUBLIC_APP_VERSION?: string;

    // Analytics & Tracking
    readonly NEXT_PUBLIC_GA_MEASUREMENT_ID: string;

    // Monitoring & Error Tracking
    readonly NEXT_PUBLIC_SENTRY_DSN?: string;
    readonly NEXT_PUBLIC_ERROR_TRACKING_ENABLED?: string;
    readonly NEXT_PUBLIC_MONITORING_ENABLED?: string;
    readonly NEXT_PUBLIC_TRACK_CONSOLE_ERRORS?: string;

    // External APIs
    readonly NEXT_PUBLIC_EXCHANGE_API_KEY?: string;

    // Node Environment
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}
