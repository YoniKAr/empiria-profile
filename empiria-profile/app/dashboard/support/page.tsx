import { HelpCircle, Mail, MessageSquare, FileText } from "lucide-react";

const faqs = [
  {
    q: "How do I get a refund for a ticket?",
    a: "Refund policies are set by the event organizer. Contact the organizer directly through the event page, or reach out to us and we'll help facilitate.",
  },
  {
    q: "Where is my QR code / ticket?",
    a: "Go to My Tickets from the sidebar. Each valid ticket has a unique QR code that you'll need to show at the venue entrance.",
  },
  {
    q: "Can I transfer my ticket to someone else?",
    a: "Ticket transfers are not currently supported. Contact the event organizer for assistance.",
  },
  {
    q: "How do I update my email address?",
    a: "Your email is linked to your login provider (Google, GitHub, etc.). Update it there and it will sync on your next login.",
  },
  {
    q: "I was charged but didn't receive my ticket.",
    a: "Check your Order History page. If the order shows as completed but no ticket appears, contact us with your order ID and we'll investigate.",
  },
];

export default function SupportPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Support</h1>
      <p className="mt-1 text-gray-500">
        Need help? Check our FAQ or get in touch.
      </p>

      {/* Contact options */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <a
          href="mailto:support@elevsoft.com"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50"
        >
          <Mail className="h-8 w-8 text-indigo-600" />
          <div>
            <p className="font-medium">Email Us</p>
            <p className="text-sm text-gray-500">support@elevsoft.com</p>
          </div>
        </a>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 opacity-60">
          <MessageSquare className="h-8 w-8 text-gray-400" />
          <div>
            <p className="font-medium">Live Chat</p>
            <p className="text-sm text-gray-500">Coming soon</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 opacity-60">
          <FileText className="h-8 w-8 text-gray-400" />
          <div>
            <p className="font-medium">Help Center</p>
            <p className="text-sm text-gray-500">Coming soon</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-gray-200 bg-white"
            >
              <summary className="flex cursor-pointer items-center gap-3 p-5 font-medium">
                <HelpCircle className="h-5 w-5 shrink-0 text-indigo-500" />
                {faq.q}
              </summary>
              <p className="px-5 pb-5 pl-13 text-sm text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
