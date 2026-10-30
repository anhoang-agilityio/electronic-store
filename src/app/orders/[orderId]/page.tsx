import { OrderDetail } from '@/features/order/components/order-detail';

type OrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ placed?: string }>;
};

export default async function OrderDetailPage({
  params,
  searchParams,
}: OrderDetailPageProps) {
  const { orderId } = await params;
  const { placed } = await searchParams;

  return <OrderDetail orderId={orderId} placed={placed === '1'} />;
}
