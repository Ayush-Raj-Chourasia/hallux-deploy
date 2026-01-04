"use client";
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const ApiPlayground: React.FC = () => {
    const [endpoint, setEndpoint] = useState('/api/demo');
    const [method, setMethod] = useState('POST');
    const [headers, setHeaders] = useState('Content-Type: application/json');
    const [body, setBody] = useState('{\n  "message": "Hello"\n}');
    const [response, setResponse] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const parseHeaders = () => {
        const headerObj: Record<string, string> = {};
        headers.split('\n').forEach(line => {
            const [key, ...rest] = line.split(':');
            if (key && rest.length) {
                headerObj[key.trim()] = rest.join(':').trim();
            }
        });
        return headerObj;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(endpoint, {
                method,
                headers: parseHeaders(),
                body: method !== 'GET' ? body : undefined,
            });
            const text = await res.text();
            setResponse(text);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">API Playground</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium">Endpoint</label>
                    <input
                        type="text"
                        value={endpoint}
                        onChange={e => setEndpoint(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">Method</label>
                    <select
                        value={method}
                        onChange={e => setMethod(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>DELETE</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block font-medium">Headers (one per line)</label>
                    <textarea
                        rows={3}
                        value={headers}
                        onChange={e => setHeaders(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                {method !== 'GET' && (
                    <div className="col-span-2">
                        <label className="block font-medium">Body (JSON)</label>
                        <textarea
                            rows={5}
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            className="w-full p-2 border rounded font-mono"
                        />
                    </div>
                )}
            </div>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                {loading ? 'Sending...' : 'Send Request'}
            </button>
            {error && <p className="text-red-500">Error: {error}</p>}
            {response && (
                <div>
                    <h3 className="font-medium mt-4">Response</h3>
                    <SyntaxHighlighter language="json" style={materialLight} className="rounded">
                        {response}
                    </SyntaxHighlighter>
                </div>
            )}
        </div>
    );
};
