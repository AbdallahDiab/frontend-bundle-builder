import type { ImgHTMLAttributes } from 'react'

type ProductImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
}

export function ProductImage({
  src,
  alt,
  className = '',
  ...props
}: ProductImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`block max-h-full max-w-full object-contain ${className}`.trim()}
      {...props}
    />
  )
}
