'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const addressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  title: z.string().optional(),
  tag: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export type AddressFormProps = {
  initialValues?: AddressFormValues;
  onSubmit: (values: AddressFormValues) => void;
  onCancel: () => void;
  submitText?: string;
};

export function AddressForm({
  initialValues,
  onSubmit,
  onCancel,
  submitText = 'Save',
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValues ?? {
      address: '',
      phone: '',
      title: '',
      tag: '',
    },
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="address" className="mb-1">
          Address
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address"
          {...register('address')}
          placeholder="Enter address"
        />
        {errors.address && (
          <p className="text-xs text-destructive mt-1">
            {errors.address.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="phone" className="mb-1">
          Phone
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone"
          {...register('phone')}
          placeholder="Enter phone number"
        />
        {errors.phone && (
          <p className="text-xs text-destructive mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="title" className="mb-1">
          Title
        </Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g. Home, Office"
        />
        {errors.title && (
          <p className="text-xs text-destructive mt-1">
            {errors.title.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="tag" className="mb-1">
          Tag
        </Label>
        <Input id="tag" {...register('tag')} placeholder="e.g. Default" />
        {errors.tag && (
          <p className="text-xs text-destructive mt-1">{errors.tag.message}</p>
        )}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitText}</Button>
      </DialogFooter>
    </form>
  );
}
