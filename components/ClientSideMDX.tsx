// components/ClientSideMDX.tsx
'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ClientSideMDXProps {
  source: MDXRemoteSerializeResult;
}

const ClientSideMDX: React.FC<ClientSideMDXProps> = ({ source }) => {
  return (
    <div className="prose prose-lg mx-auto">
      <MDXRemote
        {...source}
        components={{
          img: ({ src, alt }) => (
            <Zoom>
              <img src={src} alt={alt} className="cursor-zoom-in" />
            </Zoom>
          ),
          h2: ({ children }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-');
            return <h2 id={id}>{children}</h2>;
          },
          h3: ({ children }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-');
            return <h3 id={id}>{children}</h3>;
          },
        }}
      />
    </div>
  );
};

export default ClientSideMDX;
