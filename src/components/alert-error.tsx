import { AlertTriangle } from 'lucide-react'

interface AlertErrorProps {
  errorMessage: string | undefined
}

export function AlertError({ errorMessage }: AlertErrorProps) {
  if (errorMessage) {
    return (
      <div className="w-max p-4 rounded-md bg-red-100 text-red-700 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        <span>{errorMessage}</span>
      </div>
    )
  }
}
