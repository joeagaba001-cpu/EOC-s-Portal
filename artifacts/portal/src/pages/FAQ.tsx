import { PublicLayout } from "@/components/layout/PublicLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";

const faqs = [
  {
    q: "Is the training really free?",
    a: "Yes! All training programs offered by the Elizabeth Onyaole Okwori Memorial Foundation are completely free of charge. Our mission is to empower the less privileged and youth of Nigeria with no financial barrier."
  },
  {
    q: "Who is eligible to apply?",
    a: "The programs are open to all Nigerians, especially women, young adults, and less privileged individuals who desire to learn professional catering and bakery skills. No prior experience is required."
  },
  {
    q: "Where is the training held?",
    a: "Training takes place at our facility located at No. 25, David Stone Street, Otukpo, Nigeria. Please contact us on WhatsApp (0812 299 0636) for current training schedules and venue details."
  },
  {
    q: "How do I register?",
    a: "Registration is done entirely online on this portal. Click 'Register Free', create an account, then select your preferred training skills. You will receive a confirmation once your application is reviewed."
  },
  {
    q: "What programs are available?",
    a: "We offer training in Bread Making, Cake Baking & Decoration, Pastry Making, Food Packaging, Event Catering, Dessert Production, Beverage Production, and more. Visit our Programs page for the full list."
  },
  {
    q: "Will I receive a certificate?",
    a: "Yes. Participants who successfully complete their training program receive an official certificate from the Elizabeth Onyaole Okwori Memorial Foundation."
  },
  {
    q: "How long do the programs last?",
    a: "Program duration varies by skill type. Most courses run between 4 to 12 weeks. Specific durations are communicated during the enrollment process and orientation."
  },
  {
    q: "Can organisations sponsor or partner with the Foundation?",
    a: "Absolutely. We welcome donations, grants, and partnerships from individuals, corporate bodies, associations, and charitable organisations in Nigeria and internationally. Visit our Sponsorship page to apply."
  },
  {
    q: "How can I apply for a fund disbursement?",
    a: "Participants facing financial difficulties may apply for support through the Beneficiary Fund Request page. Applications are reviewed by our NGO Officers and disbursed to qualified applicants."
  },
  {
    q: "How do I contact the Foundation?",
    a: "You can reach us by phone (0803 451 4674, 0913 209 4696, 0810 393 8592), WhatsApp (0812 299 0636), or email (odehonyema97@gmail.com). You can also visit us at No. 25, David Stone Street, Otukpo."
  },
];

export default function FAQ() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-16 mb-12">
          <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">Help Centre</p>
          <h1 className="text-5xl font-serif font-bold text-primary leading-tight mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our foundation, free training programs, and how to get involved.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3 mb-16">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 overflow-hidden">
              <AccordionTrigger className="text-left font-semibold text-gray-900 py-5 hover:no-underline hover:text-primary">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="bg-primary rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-3">Still have questions?</h2>
          <p className="text-primary-foreground/70 mb-6">Contact us directly — we're happy to help.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/2348122990636" target="_blank" rel="noopener noreferrer"
              className="bg-green-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-600 transition-colors">
              Chat on WhatsApp
            </a>
            <Link href="/contact" className="bg-secondary text-secondary-foreground font-semibold px-6 py-3 rounded-full hover:bg-secondary/90 transition-colors">
              Contact Page
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
