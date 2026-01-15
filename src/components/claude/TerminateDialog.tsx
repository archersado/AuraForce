/**
 * Terminate Dialog Component
 *
 * Confirmation dialog for session termination to prevent accidental stops.
 */

'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TerminateDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TerminateDialog({ open, onConfirm, onCancel }: TerminateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-900">
            Stop Session?
          </DialogTitle>
          <DialogDescription className="text-red-700">
            Are you sure you want to terminate this Claude Code session? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors font-medium"
          >
            Stop Session
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
