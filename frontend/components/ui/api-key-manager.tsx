"use client";
import React, { useState, useEffect } from 'react';

export const ApiKeyManager: React.FC = () => {
    const [apiKey, setApiKey] = useState<string>('');

    useEffect(() => {
        const stored = localStorage.getItem('apiKey');
        if (stored) setApiKey(stored);
    }, []);

    const generateKey = () => {
        const newKey = crypto.randomUUID();
        localStorage.setItem('apiKey', newKey);
        setApiKey(newKey);
    };

    const copyKey = async () => {
        try {
            await navigator.clipboard.writeText(apiKey);
        } catch (e) {
            console.error('Copy failed', e);
        }
    };

    return (
        <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-2">API Key</h3>
            {apiKey ? (
                <div className="flex items-center space-x-2">
                    <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">{apiKey}</code>
                    <button onClick={copyKey} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        Copy
                    </button>
                </div>
            ) : (
                <button onClick={generateKey} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">
                    Generate API Key
                </button>
            )}
        </div>
    );
};
