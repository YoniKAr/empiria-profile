import Link from "next/link";
import { HelpCircle, Mail, MessageCircle, FileText, ChevronDown } from "lucide-react";

const faqs = [
    {
        q: "How do I get my ticket after purchasing?",
        a: "Your tickets appear instantly in your dashboard under 'My Schedule'. You'll also receive a confirmation email with your ticket details.",
    },
    {
        q: "Can I transfer my ticket to someone else?",
        a: "Ticket transfers are currently managed by the event organizer. Please contact the organizer directly or reach out to our support team.",
    },
    {
        q: "What happens if an event is cancelled?",
        a: "If an event is cancelled, you'll be notified by email and a refund will be processed automatically to your original payment method within 5–10 business days.",
    },
    {
        q: "How do I update my profile information?",
        a: "Visit your Profile Settings page from the top-right avatar menu. You can update your name and profile picture there.",
    },
    {
        q: "Can I get a refund for my ticket?",
        a: "Refund policies vary by event. Please check the event page for the organizer's refund policy, or contact our support team for assistance.",
    },
    {
        q: "How do I change my password?",
        a: "Go to Profile Settings and click 'Send Password Reset Email'. Note: If you signed in with Google, your password is managed by Google.",
    },
];

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-card">
            {/* Header */}
            <div className="border-b border-border px-8 py-6 bg-card">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Find answers or get in touch</p>
                    </div>
                    <Link href="/dashboard" className="text-sm text-empiria-orange hover:underline font-medium">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-8 py-10 space-y-10">

                {/* Contact cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <a
                        href="mailto:support@empiriaindia.com"
                        className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center hover:border-empiria-orange transition-colors"
                    >
                        <div className="flex size-11 items-center justify-center rounded-full bg-orange-50 text-empiria-orange group-hover:bg-empiria-orange group-hover:text-white transition-colors">
                            <Mail className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Email Us</p>
                            <p className="text-xs text-muted-foreground mt-0.5">support@empiriaindia.com</p>
                        </div>
                    </a>
                    <a
                        href="https://shop.empiriaindia.com/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center hover:border-empiria-orange transition-colors"
                    >
                        <div className="flex size-11 items-center justify-center rounded-full bg-orange-50 text-empiria-orange group-hover:bg-empiria-orange group-hover:text-white transition-colors">
                            <MessageCircle className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Live Chat</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Available Mon–Fri, 9am–6pm</p>
                        </div>
                    </a>
                    <a
                        href="https://shop.empiriaindia.com/faq"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center hover:border-empiria-orange transition-colors"
                    >
                        <div className="flex size-11 items-center justify-center rounded-full bg-orange-50 text-empiria-orange group-hover:bg-empiria-orange group-hover:text-white transition-colors">
                            <FileText className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Documentation</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Browse all help articles</p>
                        </div>
                    </a>
                </div>

                {/* FAQ */}
                <div>
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <HelpCircle className="size-5 text-empiria-orange" />
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <details
                                key={i}
                                className="group rounded-xl border border-border bg-card overflow-hidden"
                            >
                                <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-foreground hover:bg-muted/50 transition-colors list-none">
                                    {faq.q}
                                    <ChevronDown className="size-4 text-muted-foreground shrink-0 ml-4 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
