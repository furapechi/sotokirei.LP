"use client";

import { useEffect, useMemo, useState } from "react";
import { ServiceButtons } from "@/components/ServiceButtons";
import { QuoteModal } from "@/components/QuoteModal";
import { ContactForm } from "@/components/ContactForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BeforeAfter } from "@/components/BeforeAfter";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [service, setService] = useState<string | null>(null);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      try {
        const { data } = await supabase
          .from("works")
          .select("before_images, after_images, status, created_at")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(1);
        if (data && data.length) {
          const w = data[0] as { before_images: string[] | null; after_images: string[] | null };
          setBeforeUrl(w.before_images?.[0] ?? null);
          setAfterUrl(w.after_images?.[0] ?? null);
        }
      } catch {}
    })();
  }, [supabase]);
  return (
    <div className="min-h-screen py-16 flex flex-col items-center gap-10">
      <section className="w-full text-center space-y-5">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">草刈・草むしり・伐採・剪定</h1>
        <p className="text-slate-600 text-lg">最短30秒で概算がわかる、透明で早いお見積り</p>
      </section>

      <section className="w-full flex flex-col items-center gap-6">
        <ServiceButtons onSelect={setService} />
        <div id="quote">
          <QuoteModal serviceSlug={service} />
        </div>
      </section>

      {/* 比較スライダー（ファーストビュー直下） */}
      <section className="w-full mt-6 sm:mt-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center">Before / After</h2>
        <div className="max-w-4xl mx-auto">
          <BeforeAfter
            beforeUrl={
              beforeUrl ||
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop"
            }
            afterUrl={
              afterUrl ||
              "https://images.unsplash.com/photo-1457410129867-5999af49daf7?q=80&w=1600&auto=format&fit=crop"
            }
            alt="施工前後の比較"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full mt-10">
        <div className="rounded-xl border bg-white p-6 shadow-sm card-hover">
          <h3 className="font-semibold mb-2">明朗会計</h3>
          <p className="text-sm text-slate-600">m²単価ベースでわかりやすく、追加料金も事前提示。</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm card-hover">
          <h3 className="font-semibold mb-2">即時対応</h3>
          <p className="text-sm text-slate-600">お急ぎ案件も柔軟に。最短スケジュールをご提案。</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm card-hover">
          <h3 className="font-semibold mb-2">安心品質</h3>
          <p className="text-sm text-slate-600">プロの職人が丁寧に作業。アフターも万全。</p>
        </div>
      </section>

      <section className="w-full grid md:grid-cols-2 gap-8 mt-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">よくある質問</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>見積は無料ですか？</AccordionTrigger>
              <AccordionContent>はい、現地調査・お見積は無料です。</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>最短いつ来てもらえますか？</AccordionTrigger>
              <AccordionContent>状況により当日〜3日以内のご案内が可能です。</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>対応エリアは？</AccordionTrigger>
              <AccordionContent>○○市・周辺エリアに対応しています。遠方もご相談ください。</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="space-y-4" id="contact">
          <h2 className="text-2xl font-bold">お問い合わせ</h2>
          <ContactForm
            defaultService={service}
            defaultArea={null}
            defaultPrice={null}
          />
        </div>
      </section>
    </div>
  );
}
