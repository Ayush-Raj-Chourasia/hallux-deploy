import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeSnippetsProps {
    endpoint: string;
    method: string;
    headers: string;
    body: string;
}

export const CodeSnippets: React.FC<CodeSnippetsProps> = ({ endpoint, method, headers, body }) => {
    const headerLines = headers
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .join('\n');

    const pythonSnippet = `import requests\n\nurl = "${endpoint}"\nheaders = {\n${headerLines.replace(/: /g, ': "').replace(/$/g, '",')}
}\n\n${method !== 'GET' ? `data = ${body}` : ''}\n\nresponse = requests.${method.toLowerCase()}(url, headers=headers${method !== 'GET' ? ', json=data' : ''})\nprint(response.text)`;

    const jsSnippet = `fetch('${endpoint}', {\n  method: '${method}',\n  headers: {\n${headerLines.replace(/: /g, ': "').replace(/$/g, '",')}
  },\n  ${method !== 'GET' ? `body: JSON.stringify(${body}),` : ''}\n})\n  .then(res => res.text())\n  .then(console.log)\n  .catch(console.error);`;

    const curlSnippet = `curl -X ${method} '${endpoint}' \
${headerLines.replace(/: /g, " -H '") + "'"}\n${method !== 'GET' ? ` -d '${body}'` : ''}`;

    return (
        <div className="space-y-4 p-4">
            <h3 className="text-lg font-medium">Code Snippets</h3>
            <div>
                <h4 className="font-semibold">Python</h4>
                <SyntaxHighlighter language="python" style={materialLight} className="rounded">
                    {pythonSnippet}
                </SyntaxHighlighter>
            </div>
            <div>
                <h4 className="font-semibold">JavaScript (fetch)</h4>
                <SyntaxHighlighter language="javascript" style={materialLight} className="rounded">
                    {jsSnippet}
                </SyntaxHighlighter>
            </div>
            <div>
                <h4 className="font-semibold">cURL</h4>
                <SyntaxHighlighter language="bash" style={materialLight} className="rounded">
                    {curlSnippet}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};
