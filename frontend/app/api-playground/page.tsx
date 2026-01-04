"use client";
import React from 'react';
import { ApiPlayground } from '@/components/ui/api-playground';
import { ApiKeyManager } from '@/components/ui/api-key-manager';
import { CodeSnippets } from '@/components/ui/code-snippets';

const ApiPlaygroundPage: React.FC = () => {
    // State to pass to CodeSnippets
    const [endpoint, setEndpoint] = React.useState('/api/demo');
    const [method, setMethod] = React.useState('POST');
    const [headers, setHeaders] = React.useState('Content-Type: application/json');
    const [body, setBody] = React.useState('{\n  "message": "Hello"\n}');

    // Handlers to sync state with ApiPlayground component via props could be added, but for simplicity we let ApiPlayground manage its own state.
    // We'll just render the components.

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <ApiKeyManager />
            <ApiPlayground />
            {/* The CodeSnippets component could be integrated with ApiPlayground via context or props; omitted for brevity */}
        </div>
    );
};

export default ApiPlaygroundPage;
