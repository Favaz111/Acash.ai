'use client';

import { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  HelpCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSuccess, showError } from '@/components/ui/toast';

const contactMethods = [
  {
    icon: Mail,
    title: 'البريد الإلكتروني',
    value: 'support@acash.ai',
    description: 'نرد خلال 24 ساعة',
    href: 'mailto:support@acash.ai',
  },
  {
    icon: MessageSquare,
    title: 'الدعم المباشر',
    value: 'قريباً',
    description: 'دردشة مباشرة مع فريق الدعم',
    href: '#',
    disabled: true,
  },
];

const faqs = [
  {
    question: 'هل Acash.ai مجاني؟',
    answer: 'نعم! نقدم أدوات مجانية قوية. كما نوفر أدوات متقدمة ضمن الباقة Premium بمزايا إضافية.',
  },
  {
    question: 'هل بياناتي آمنة؟',
    answer: 'نعم، نستخدم أعلى معايير الأمان والتشفير. بياناتك محمية ولا نشاركها مع أي طرف ثالث.',
  },
  {
    question: 'كيف يعمل التشخيص المالي؟',
    answer:
      'نطرح عليك أسئلة حول وضعك المالي، ثم نحلل إجاباتك باستخدام الذكاء الاصطناعي لنقدم لك تقييمًا وتوصيات مخصصة.',
  },
  {
    question: 'هل أحتاج خبرة مالية لاستخدام المنصة؟',
    answer:
      'لا على الإطلاق! صممنا Acash.ai ليكون بسيطًا ومفهومًا للجميع، بغض النظر عن مستوى خبرتك المالية.',
  },
];

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // TODO: Implement actual email sending logic
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(true);
      showSuccess('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      showError('فشل إرسال الرسالة. يرجى المحاولة مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-6">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">تواصل معنا</h1>
          <p className="text-xl text-gray-600">
            نحن هنا لمساعدتك. اترك لنا رسالة وسنرد عليك في أقرب وقت
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card
                key={index}
                className={`border-2 ${
                  method.disabled
                    ? 'opacity-60'
                    : 'hover:border-primary-trust transition-all cursor-pointer'
                }`}
              >
                <a
                  href={method.disabled ? undefined : method.href}
                  className={method.disabled ? 'pointer-events-none' : ''}
                >
                  <CardHeader>
                    <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-3">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-primary-trust">{method.value}</p>
                  </CardContent>
                </a>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>أرسل لنا رسالة</CardTitle>
              <CardDescription>املأ النموذج وسنتواصل معك خلال 24 ساعة</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">تم الإرسال بنجاح!</h3>
                  <p className="text-gray-600 mb-6">
                    شكراً لتواصلك معنا. سنرد على رسالتك في أقرب وقت ممكن.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    إرسال رسالة أخرى
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        الاسم
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="أدخل اسمك"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        البريد الإلكتروني
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@domain.com"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      الموضوع
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="عن ماذا تريد التحدث؟"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      الرسالة
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب رسالتك هنا..."
                      required
                      disabled={submitting}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-trust focus:border-transparent transition-all outline-none resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        جاري الإرسال...
                      </span>
                    ) : (
                      <>
                        <Send className="w-5 h-5 ml-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-primary-trust mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">أسئلة شائعة</h2>
            <p className="text-gray-600">ربما تجد إجابتك هنا</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تابعنا على وسائل التواصل</h3>
        <div className="flex justify-center gap-4">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-primary-trust hover:text-white flex items-center justify-center transition-all"
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
