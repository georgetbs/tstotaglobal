'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ClientSideMDXProps {
  source: MDXRemoteSerializeResult;
}

export default function ClientSideMDX({ source }: ClientSideMDXProps) {
  return (
    <div className="prose prose-lg dark:prose-invert mx-auto 
                    prose-headings:text-primary dark:prose-headings:text-gray-100
                    prose-p:text-gray-800 dark:prose-p:text-gray-300
                    prose-strong:text-primary dark:prose-strong:text-gray-100
                    prose-a:text-blue-600 hover:prose-a:text-blue-500 
                    dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300
                    prose-code:text-primary dark:prose-code:text-gray-100
                    prose-code:bg-gray-200 dark:prose-code:bg-gray-800
                    prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
                    prose-ol:text-gray-800 dark:prose-ol:text-gray-300
                    prose-ul:text-gray-800 dark:prose-ul:text-gray-300
                    prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-400
                    prose-blockquote:border-primary dark:prose-blockquote:border-gray-700">
      <MDXRemote
        {...source}
        components={{
          img: ({ src, alt }) => (
            <Zoom>
              {/* Убедитесь, что изображения всегда имеют alt-текст */}
              <img src={src} alt={alt} className="cursor-zoom-in dark:brightness-90 dark:contrast-125" />
            </Zoom>
          ),
          h2: ({ children }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-');
            return <h2 id={id} className="text-primary dark:text-gray-100">{children}</h2>;
          },
          h3: ({ children }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-');
            return <h3 id={id} className="text-primary dark:text-gray-100">{children}</h3>;
          },
        }}
      />
    </div>
  );
}
