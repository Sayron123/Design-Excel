"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image that recovers from a failed load instead of showing a broken picture: it asks the
 * image optimizer once more, then falls back to the original file in /public.
 */
export function RetryImage({ alt, onError, unoptimized, ...props }: ImageProps) {
  const [attempt, setAttempt] = useState(0);
  return (
    <Image
      key={attempt}
      {...props}
      alt={alt}
      unoptimized={unoptimized || attempt >= 2}
      onError={(e) => {
        if (attempt < 2) setAttempt((a) => a + 1);
        onError?.(e);
      }}
    />
  );
}
