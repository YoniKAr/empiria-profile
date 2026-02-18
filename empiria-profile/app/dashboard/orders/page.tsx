import { auth0 } from "@/lib/auth0";
import { getUserOrders } from "@/lib/data";
import { formatDate, formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Receipt, Calendar } from "lucide-react";

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  refunded: "bg-blue-50 text-blue-600",
  cancelled: "bg-red-50 text-red-600",
};

export default async function OrdersPage() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) redirect("/auth/login");

  const orders = await getUserOrders(session.user.sub);

  return (
    <div>
      <h1 className="text-2xl font-bold">Order History</h1>
      <p className="mt-1 text-gray-500">{orders.length} orders</p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <Receipt className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">No orders yet.</p>
          <a
            href={process.env.NEXT_PUBLIC_SHOP_URL ?? "https://shop.empiriaindia.com"}
            className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Browse Events
          </a>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{order.event?.title ?? "Unknown Event"}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ordered {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {formatCurrency(Number(order.total_amount), order.currency)}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      statusStyles[order.status] ?? "bg-gray-100"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Line items */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Items
                  </p>
                  <div className="mt-2 space-y-1">
                    {order.order_items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700">
                          {item.tier?.name ?? "Ticket"} × {item.quantity}
                        </span>
                        <span className="text-gray-500">
                          {formatCurrency(Number(item.subtotal), order.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event date & venue */}
              {order.event && (
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(order.event.start_at)}
                  </span>
                  {order.event.city && <span>· {order.event.city}</span>}
                </div>
              )}

              {order.stripe_payment_intent_id && (
                <p className="mt-2 text-xs text-gray-400">
                  Payment: {order.stripe_payment_intent_id}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
