'use client'

import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FileCode,
  File,
} from 'lucide-react'

const ICON_MAP: Record<string, typeof FileText> = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  svg: FileImage,
  md: FileCode,
  txt: FileCode,
}

interface DocumentIconProps {
  fileType: string
  className?: string
}

export function DocumentIcon({ fileType, className = 'h-5 w-5' }: DocumentIconProps) {
  const Icon = ICON_MAP[fileType.toLowerCase()] ?? File
  return <Icon className={className} data-testid={`doc-icon-${fileType}`} />
}
