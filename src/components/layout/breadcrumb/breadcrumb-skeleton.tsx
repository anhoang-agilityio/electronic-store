import { ChevronRight } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';

export function BreadcrumbSkeleton() {
  return (
    <Breadcrumb className="px-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Skeleton className="h-4 w-12" />
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="text-gray-300" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <Skeleton className="h-4 w-16" />
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="text-gray-300" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <Skeleton className="h-4 w-24" />
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
