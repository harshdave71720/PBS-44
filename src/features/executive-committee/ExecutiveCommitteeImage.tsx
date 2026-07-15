"use client"

import Image from "next/image"
import { useMemo, useState } from "react"

interface ExecutiveCommitteeImageProps {
  imageKey: string
  name: string
  priority?: boolean
}

const FALLBACK_IMAGE_SRC = "/members/placeholder-avatar.svg"

export function ExecutiveCommitteeImage({
  imageKey,
  name,
  priority = false,
}: ExecutiveCommitteeImageProps) {
  const initialSrc = useMemo(() => `/members/${imageKey}.jpg`, [imageKey])
  const [src, setSrc] = useState(initialSrc)

  return (
    <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-[#C8A24A]/40 bg-[#FFF9EF] shadow-md">
      <Image
        src={src}
        alt={name}
        fill
        priority={priority}
        sizes="144px"
        className="object-cover"
        onError={() => {
          if (src !== FALLBACK_IMAGE_SRC) {
            setSrc(FALLBACK_IMAGE_SRC)
          }
        }}
      />
    </div>
  )
}

