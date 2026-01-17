import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm"

export default function RYVMarkdown({ children }: { children: string }) {
    return <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            h1: ({ children }) => (
                <h1 className="mt-6 text-4xl font-semibold">
                    {children}
                </h1>
            ),
            h2: ({ children }) => (
                <h2 className="mt-6 text-2xl font-semibold">
                    {children}
                </h2>
            ),
            h3: ({ children }) => (
                <h3 className="mt-6 text-xl font-medium">
                    {children}
                </h3>
            ),
            p: ({ children }) => (
                <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
                    {children}
                </p>
            ),
            ul: ({ children }) => (
                <ul className="mt-4 list-disc list-inside text-gray-600 dark:text-gray-300">
                    {children}
                </ul>
            ),
            li: ({ children }) => (
                <li className="mt-1">
                    {children}
                </li>
            ),
            blockquote: ({ children }) => (
                <blockquote className="mt-6 border-l-4 border-indigo-500 pl-4 italic text-gray-400">
                    {children}
                </blockquote>
            ),
            a: ({ href, children }) => (
                <a
                    href={href}
                    className="text-indigo-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {children}
                </a>
            ),
            // code: ({ inline, children }) =>
            //     inline ? (
            //         <code className="rounded bg-gray-800 px-1 text-sm text-gray-200">
            //             {children}
            //         </code>
            //     ) : (
            //         <pre className="mt-6 rounded-lg bg-gray-800 p-4 overflow-x-auto">
            //             <code className="text-sm text-gray-200">{children}</code>
            //         </pre>
            //     ),
            hr: () => <hr className='mt-6 border-1 border-gray-300' />
        }}>
        {children}
    </ReactMarkdown>
}