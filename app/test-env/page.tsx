'use client';

export default function TestEnvPage() {
  const envVars = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(envVars, null, 2)}</pre>
      <div className="mt-4">
        <h2 className="font-bold">Status:</h2>
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <span className="font-mono">{key}:</span>
            <span className={value ? 'text-green-600' : 'text-red-600'}>
              {value ? '✅ Found' : '❌ Missing'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
