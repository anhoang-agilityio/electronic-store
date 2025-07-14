'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export type ConfirmationDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function ConfirmationDialog({
  open,
  title = 'Confirmation',
  description = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  disabled = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onCancel?.();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading || disabled}
            type="button"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading || disabled}
            type="button"
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
