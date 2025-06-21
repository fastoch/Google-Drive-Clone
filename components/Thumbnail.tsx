import Image from 'next/image';
import React from 'react'
import { getFileIcon, cn } from '@/lib/utils';

interface Props {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;  // regular className if file is not an image
}

const Thumbnail = ({ type, extension, url='', imageClassName, className}: Props) => {
const isImage = type === 'image' && extension !== 'svg';  // svg files may not render well in a thumbnail

  return (
    <figure className={cn('thumbnail', className)}>
      <Image 
        src={isImage ? url : getFileIcon(extension, type)} 
        alt="thumbnail" 
        width={100} height={100} 
        className={cn(
          'size-8 object-contain',  // apply these classes to any file
          imageClassName,           
          isImage && 'thumbnail-image')}  // apply this class to image files only
      />
    </figure>
  )
}

export default Thumbnail