"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { db } from "@/lib/firebase";
import { offers } from "@/lib/site";

const VPN_MAX_SLOTS = 10;

type Stats = {
  vpnClaimed: number;
  canvaTotal: number;
};

type Credentials = {
  vpn_user?: string;
  vpn_pass?: string;
  canva_link?: string;
};

type ClaimResult =
  | { kind: "vpn"; username: string; password: string }
  | { kind: "canva"; link: string }
  | { kind: "soldout"; message: string }
  | null;

export function OffersSection() {
  const [activeOfferIndex, setActiveOfferIndex] = useState<number | null>(null);
  const [tasks, setTasks] = useState({ yt: false, fb: false });
  const [step, setStep] = useState<"tasks" | "loading" | "access">("tasks");
  const [stats, setStats] = useState<Stats>({ vpnClaimed: 0, canvaTotal: 0 });
  const [credentials, setCredentials] = useState<Credentials>({});
  const [dataReady, setDataReady] = useState(false);
  const [claimResult, setClaimResult] = useState<ClaimResult>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const activeOffer = activeOfferIndex !== null ? offers[activeOfferIndex] : null;
  const canVerify = tasks.yt && tasks.fb;

  const statsRef = useMemo(() => doc(db, "config", "stats"), []);
  const credentialsRef = useMemo(() => doc(db, "config", "credentials"), []);

  const loadFirestoreData = useCallback(async () => {
    try {
      const statsSnap = await getDoc(statsRef);

      if (statsSnap.exists()) {
        const data = statsSnap.data();
        setStats({
          vpnClaimed: Number(data.vpnClaimed ?? 0),
          canvaTotal: Number(data.canvaTotal ?? 0),
        });
      } else {
        await setDoc(statsRef, {
          vpnClaimed: 0,
          canvaTotal: 0,
          canvaLastClaimed: serverTimestamp(),
          vpnLastClaimed: serverTimestamp(),
          ytClicks: 0,
        });
        setStats({ vpnClaimed: 0, canvaTotal: 0 });
      }

      const credentialsSnap = await getDoc(credentialsRef);
      if (credentialsSnap.exists()) {
        setCredentials(credentialsSnap.data() as Credentials);
      }
    } finally {
      setDataReady(true);
    }
  }, [credentialsRef, statsRef]);

  useEffect(() => {
    void loadFirestoreData();
  }, [loadFirestoreData]);

  const openOfferModal = (index: number) => {
    setActiveOfferIndex(index);
    setTasks({ yt: false, fb: false });
    setStep("tasks");
    setClaimResult(null);
    setClaimError(null);
  };

  const closeModal = () => {
    setActiveOfferIndex(null);
    setTasks({ yt: false, fb: false });
    setStep("tasks");
    setClaimResult(null);
    setClaimError(null);
  };

  useEffect(() => {
    if (!activeOffer) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeOffer]);

  const markTaskDone = (task: "yt" | "fb") => {
    setTasks((previous) => ({ ...previous, [task]: true }));
  };

  const handleTaskOpen = (task: "yt" | "fb") => {
    if (task === "yt") {
      window.open("https://m.youtube.com/@mdakashislam1s", "_blank", "noopener,noreferrer");
    } else {
      window.open("https://www.facebook.com/mdakashislam1s", "_blank", "noopener,noreferrer");
    }
    markTaskDone(task);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setClaimError("Copy failed. Please copy manually.");
    }
  };

  const handleClaim = async () => {
    if (!activeOffer || !canVerify) return;

    setClaimError(null);
    setStep("loading");

    try {
      if (activeOffer.status === "limited") {
        if (stats.vpnClaimed >= VPN_MAX_SLOTS) {
          setClaimResult({ kind: "soldout", message: "All 10 VPN slots are already claimed." });
          setStep("access");
          return;
        }

        await updateDoc(statsRef, {
          vpnClaimed: increment(1),
          vpnLastClaimed: serverTimestamp(),
        });

        const nextClaimed = stats.vpnClaimed + 1;
        setStats((previous) => ({ ...previous, vpnClaimed: nextClaimed }));

        const credentialsSnap = await getDoc(credentialsRef);
        const freshCredentials = credentialsSnap.exists()
          ? (credentialsSnap.data() as Credentials)
          : credentials;
        setCredentials(freshCredentials);

        setClaimResult({
          kind: "vpn",
          username: freshCredentials.vpn_user ?? "Not configured",
          password: freshCredentials.vpn_pass ?? "Not configured",
        });
      } else {
        await updateDoc(statsRef, {
          canvaTotal: increment(1),
          canvaLastClaimed: serverTimestamp(),
        });

        setStats((previous) => ({ ...previous, canvaTotal: previous.canvaTotal + 1 }));

        const credentialsSnap = await getDoc(credentialsRef);
        const freshCredentials = credentialsSnap.exists()
          ? (credentialsSnap.data() as Credentials)
          : credentials;
        setCredentials(freshCredentials);

        setClaimResult({
          kind: "canva",
          link: freshCredentials.canva_link ?? "https://canva.com",
        });
      }

      setStep("access");
    } catch {
      setClaimError("Claim failed. Please try again.");
      setStep("tasks");
    }
  };

  return (
    <>
      <Container id="offers" className="py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Offers"
            title="Free trial offers"
            description="Choose your offer and unlock it after completing two quick social steps."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {offers.map((offer, index) => (
            <Reveal key={offer.title} delay={index * 0.08}>
              <article className="site-card site-card-hover group h-full p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-white">{offer.title}</h3>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      offer.status === "always"
                        ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                        : "border-gold-300/40 bg-gold-500/10 text-gold-300"
                    }`}
                  >
                    {offer.statusLabel}
                  </span>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-zinc-300">{offer.description}</p>

                <div className="surface-outline mb-4 rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">Availability</p>
                  <p className="mt-1 text-sm font-medium text-zinc-200">
                    {offer.status === "limited"
                      ? `${Math.max(VPN_MAX_SLOTS - stats.vpnClaimed, 0)} / ${VPN_MAX_SLOTS} slots left`
                      : offer.availability}
                  </p>
                </div>

                {offer.status === "limited" ? (
                  <div className="mb-4">
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="gold-gradient h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((stats.vpnClaimed / VPN_MAX_SLOTS) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">{stats.vpnClaimed} claimed so far</p>
                  </div>
                ) : null}

                <ul className="mb-6 space-y-2">
                  {offer.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => openOfferModal(index)}
                  disabled={!dataReady || (offer.status === "limited" && stats.vpnClaimed >= VPN_MAX_SLOTS)}
                  className="gold-button inline-flex w-full items-center justify-center"
                >
                  {offer.status === "limited" && stats.vpnClaimed >= VPN_MAX_SLOTS ? "VPN Slots Filled" : "Get Free Offer"}
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>

      {activeOffer ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="site-card w-full max-w-md p-6 shadow-2xl shadow-black/70">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gold-300">Claim {activeOffer.title}</p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  {step === "tasks" ? "Unlock in 2 quick steps" : "Offer unlocked"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:text-white"
                aria-label="Close offer popup"
              >
                ✕
              </button>
            </div>

            {step === "tasks" ? (
              <>
                  <div className="surface-outline mb-5 rounded-xl p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gold-200">Complete 2 quick steps</p>
                    <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-zinc-300">
                      {Number(tasks.yt) + Number(tasks.fb)}/2 done
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-300">
                    Open both channels below, then tap Verify & Claim to get your free trial access.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className={`rounded-xl border p-4 ${tasks.yt ? "border-emerald-400/30 bg-emerald-500/10" : "border-white/10 bg-white/5"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-zinc-200">1</span>
                        <p className="text-sm text-zinc-100">Subscribe to YouTube channel</p>
                      </div>
                      <span className={`text-xs font-semibold ${tasks.yt ? "text-emerald-300" : "text-zinc-400"}`}>
                        {tasks.yt ? "Done" : "Required"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTaskOpen("yt")}
                      className="mt-3 inline-flex rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-200 transition-colors hover:border-gold-300/50 hover:text-gold-200"
                    >
                      Open YouTube
                    </button>
                  </div>

                  <div className={`rounded-xl border p-4 ${tasks.fb ? "border-emerald-400/30 bg-emerald-500/10" : "border-white/10 bg-white/5"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-zinc-200">2</span>
                        <p className="text-sm text-zinc-100">Follow Facebook page</p>
                      </div>
                      <span className={`text-xs font-semibold ${tasks.fb ? "text-emerald-300" : "text-zinc-400"}`}>
                        {tasks.fb ? "Done" : "Required"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTaskOpen("fb")}
                      className="mt-3 inline-flex rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-200 transition-colors hover:border-gold-300/50 hover:text-gold-200"
                    >
                      Open Facebook
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handleClaim()}
                  disabled={!canVerify}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-emerald-500/90 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Verify & Claim
                </button>
              </>
            ) : step === "loading" ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-gold-300" />
                <p className="text-sm text-zinc-300">Checking your claim and preparing access...</p>
              </div>
            ) : (
              <>
                {claimResult?.kind === "soldout" ? (
                  <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4">
                    <p className="text-sm font-medium text-rose-200">{claimResult.message}</p>
                  </div>
                ) : null}

                {claimResult?.kind === "vpn" ? (
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-300">VPN credentials generated from Firebase:</p>
                    <div className="surface-outline rounded-xl p-3">
                      <p className="text-xs uppercase tracking-wide text-zinc-400">Username</p>
                      <p className="mt-1 text-sm font-medium text-zinc-100">{claimResult.username}</p>
                      <button
                        type="button"
                        onClick={() => void copyText(claimResult.username)}
                        className="mt-2 rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-200"
                      >
                        Copy Username
                      </button>
                    </div>
                    <div className="surface-outline rounded-xl p-3">
                      <p className="text-xs uppercase tracking-wide text-zinc-400">Password</p>
                      <p className="mt-1 text-sm font-medium text-zinc-100">{claimResult.password}</p>
                      <button
                        type="button"
                        onClick={() => void copyText(claimResult.password)}
                        className="mt-2 rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-200"
                      >
                        Copy Password
                      </button>
                    </div>
                  </div>
                ) : null}

                {claimResult?.kind === "canva" ? (
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-300">Your Canva invitation link is ready:</p>
                    <a
                      href={claimResult.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gold-button inline-flex w-full items-center justify-center"
                    >
                      Open Canva Invitation
                    </a>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-4 py-3 text-sm text-zinc-200 transition-colors hover:border-gold-300/40 hover:text-gold-200"
                >
                  Done
                </button>
              </>
            )}

            {claimError ? <p className="mt-4 text-sm text-rose-300">{claimError}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
