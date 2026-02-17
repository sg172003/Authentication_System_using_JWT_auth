import { useEffect } from "react"

import { cn } from "@/lib/utils"

function ToastMessage({
  open,
  message,
  type = "info",
  onClose,
  duration = 4000
}) {
  useEffect(() => {
    if (!open || duration <= 0) {
      return
    }

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [open, onClose, duration])

  if (!open || !message) {
    return null
  }

  const typeClasses = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-slate-200 bg-white text-slate-900"
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        role="alert"
        className={cn(
          "pointer-events-auto w-full max-w-md rounded-lg border px-4 py-3 shadow-lg",
          typeClasses[type] ?? typeClasses.info
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium">{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded px-2 py-0.5 text-xs font-semibold opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close notification"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ToastMessage
