import React from 'react'
import { createPortal } from 'react-dom'
import { Button } from './button'

function ConfirmDialog({
  open,
  title = 'Confirm',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'destructive'
}) {
  if (!open) return null

  const dialog = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md rounded-xl bg-white p-5 sm:p-6 shadow-xl max-h-[90vh] overflow-auto">
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{description}</p>
          )}
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
          <Button variant="outline" onClick={onCancel} className="px-5 w-full sm:w-auto">
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} className="px-5 w-full sm:w-auto">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )

  return createPortal(dialog, document.body)
}

export default ConfirmDialog


