import React from "react";

export default function MarkdownRenderer({ content = "" }) {
    if (!content) return null;

    // Split text into blocks (code blocks vs regular text)
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
        const textBefore = content.substring(lastIndex, match.index);
        if (textBefore) {
            elements.push({ type: "text", content: textBefore });
        }
        elements.push({
            type: "code",
            lang: match[1] || "text",
            content: match[2],
        });
        lastIndex = match.index + match[0].length;
    }

    const textAfter = content.substring(lastIndex);
    if (textAfter) {
        elements.push({ type: "text", content: textAfter });
    }

    // Format inline markdown (bold, italic, inline code)
    const formatInline = (text) => {
        const parts = [];
        let curr = text;

        // Replace bold **text**
        // Replace inline `code`
        const inlineRegex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
        let subLast = 0;
        let subMatch;

        while ((subMatch = inlineRegex.exec(curr)) !== null) {
            if (subMatch.index > subLast) {
                parts.push(curr.substring(subLast, subMatch.index));
            }

            const raw = subMatch[0];
            if (raw.startsWith("**") && raw.endsWith("**")) {
                parts.push(
                    <strong key={parts.length} className="font-semibold text-slate-900">
                        {raw.slice(2, -2)}
                    </strong>
                );
            } else if (raw.startsWith("`") && raw.endsWith("`")) {
                parts.push(
                    <code
                        key={parts.length}
                        className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-[#3275b3] border border-slate-200"
                    >
                        {raw.slice(1, -1)}
                    </code>
                );
            } else if (raw.startsWith("*") && raw.endsWith("*")) {
                parts.push(
                    <em key={parts.length} className="italic text-slate-800">
                        {raw.slice(1, -1)}
                    </em>
                );
            }

            subLast = subMatch.index + raw.length;
        }

        if (subLast < curr.length) {
            parts.push(curr.substring(subLast));
        }

        return parts.length > 0 ? parts : text;
    };

    const renderTextParagraphs = (rawText, blockIdx) => {
        const lines = rawText.split("\n");
        const rendered = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            if (trimmed.startsWith("### ")) {
                rendered.push(
                    <h4 key={`${blockIdx}-${i}`} className="mt-3 mb-1 text-sm font-bold text-slate-900">
                        {formatInline(trimmed.slice(4))}
                    </h4>
                );
            } else if (trimmed.startsWith("## ")) {
                rendered.push(
                    <h3 key={`${blockIdx}-${i}`} className="mt-4 mb-1.5 text-base font-bold text-slate-900">
                        {formatInline(trimmed.slice(3))}
                    </h3>
                );
            } else if (trimmed.startsWith("# ")) {
                rendered.push(
                    <h2 key={`${blockIdx}-${i}`} className="mt-4 mb-2 text-lg font-bold text-slate-900">
                        {formatInline(trimmed.slice(2))}
                    </h2>
                );
            } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                rendered.push(
                    <li key={`${blockIdx}-${i}`} className="ml-4 list-disc text-sm text-slate-700 leading-relaxed my-0.5">
                        {formatInline(trimmed.slice(2))}
                    </li>
                );
            } else if (/^\d+\.\s/.test(trimmed)) {
                rendered.push(
                    <li key={`${blockIdx}-${i}`} className="ml-4 list-decimal text-sm text-slate-700 leading-relaxed my-0.5">
                        {formatInline(trimmed.replace(/^\d+\.\s/, ""))}
                    </li>
                );
            } else if (trimmed === "") {
                rendered.push(<div key={`${blockIdx}-${i}`} className="h-2" />);
            } else {
                rendered.push(
                    <p key={`${blockIdx}-${i}`} className="text-sm text-slate-700 leading-relaxed mb-1">
                        {formatInline(line)}
                    </p>
                );
            }
        }

        return rendered;
    };

    return (
        <div className="space-y-2 text-slate-800 break-words">
            {elements.map((block, idx) => {
                if (block.type === "code") {
                    return (
                        <div key={idx} className="my-3 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-slate-100">
                            {block.lang && (
                                <div className="border-b border-slate-800 bg-slate-950/70 px-4 py-1 text-[11px] font-mono text-slate-400">
                                    {block.lang}
                                </div>
                            )}
                            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
                                <code>{block.content}</code>
                            </pre>
                        </div>
                    );
                }
                return <div key={idx}>{renderTextParagraphs(block.content, idx)}</div>;
            })}
        </div>
    );
}
