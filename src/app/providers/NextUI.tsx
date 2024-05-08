// app/providers.tsx
'use client'

import { NextUIProvider } from "@nextui-org/system"

export function NextUI({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider className=" min-w-screen flex min-h-screen">
      <div className=" w-full">
        {children}
      </div>
    </NextUIProvider>
  )
}