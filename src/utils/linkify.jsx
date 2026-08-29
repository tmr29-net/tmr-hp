import React from 'react';

export function renderWithLinks(text) {
  if (!text) return null;
  // URLにマッチする正規表現
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={index} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sky-500 underline hover:text-sky-600 break-all"
        >
          {part}
        </a>
      );
    }
    // 改行コードを <br /> に変換しつつテキストを返す
    return part.split('\n').map((line, i, arr) => (
      <React.Fragment key={`${index}-${i}`}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  });
}