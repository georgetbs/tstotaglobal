// components/ClientSideMDX.tsx

'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import React from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface ClientSideMDXProps {
  source: MDXRemoteSerializeResult
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
        }}
      />
    </div>
  )
}

export default ClientSideMDX
