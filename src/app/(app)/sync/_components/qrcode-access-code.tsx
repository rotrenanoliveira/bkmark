'use client'

import { useQRCode } from 'next-qrcode'

interface AccessCodeQrCodeProps {
  syncUrl: string
}

export function AccessCodeQrCode({ syncUrl }: AccessCodeQrCodeProps) {
  const { SVG } = useQRCode()

  return (
    <div className="flex items-center justify-center">
      <SVG text={syncUrl} options={{ margin: 1, width: 128, color: { dark: '#000000', light: '#ffffff' } }} />
    </div>
  )
}
