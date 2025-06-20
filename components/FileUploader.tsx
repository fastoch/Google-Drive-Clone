"use client" // it has to be a client component since we're using a hook

import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'  // shadcn library used for styling the button
import { getFileType } from '@/lib/utils'
import Image from 'next/image'

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;  // optional
}

const FileUploader = ({ownerId, accountId, className}: Props) => {
  // to keep track of the files that are being uploaded
  const [files, setFiles] = useState<File[]>([]);  // type is an array of files, and initial state is an empty array

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

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
          })}
        </ul>
      )}

      { isDragActive 
        ? <p>Drop the files here ...</p> 
        : <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default FileUploader