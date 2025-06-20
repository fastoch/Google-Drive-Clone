"use client" // it has to be a client component since we're using a hook

import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl } from '@/lib/utils'  // shadcn library used for styling the button
import { getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from './Thumbnail'

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;  // optional
}

const FileUploader = ({ownerId, accountId, className}: Props) => {
  // to keep track of the files that are being uploaded
  const [files, setFiles] = useState<File[]>([]);  // type = array of files, and initial state = empty array

  // callback function that updates our component’s state with files provided by the user
  const onDrop = useCallback (async (acceptedFiles: File[]) => {  
    setFiles(acceptedFiles); // updates the state with the new files that have been dropped
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      {/* the button is a custom component from the shadcn/ui library */}
      <Button type="button" className={cn('uploader-button', className)} >
        <Image src="/assets/icons/upload.svg" alt="upload" width={24} height={24} />
        <p>Upload</p>
      </Button>
      
      {/* if files are being uploaded */}
      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);  // getFileType is defined in the utils.ts file
            return (
              <li key={`${file.name}-${index}`} className='uploader-preview-items'>
                <div className='flex items-center gap-3'>
                  {/* custom component that renders a preview of the file we're uploading */}
                  <Thumbnail    
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}  // convertFileToUrl is defined in the utils.ts file
                  /> 
                </div>
              </li>
            )
          })}
        </ul>
      )}

      { isDragActive 
        ? <p>Drop the files here ...</p> 
        : <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  );
}

export default FileUploader