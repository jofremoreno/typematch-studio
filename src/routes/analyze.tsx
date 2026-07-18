import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/typematch/header";
import { FontOverview } from "@/components/typematch/font-overview";
import { FontDetailNav } from "@/components/typematch/font-detail-nav";
import { FontSpecimenEditor } from "@/components/typematch/font-specimen-editor";
import { PairingRecommendations } from "@/components/typematch/pairing-recommendations";
import { PairingPreview } from "@/components/typematch/pairing-preview";
import { TechnicalDiagnosis } from "@/components/typematch/technical-diagnosis";
import { UsageFit } from "@/components/typematch/usage-fit";
import { ContrastBehaviour } from "@/components/typematch/contrast-behaviour";
import { LicenseSource } from "@/components/typematch/license-source";
import { FONTS, FONTS_BY_ID } from "@/data/fonts";
import { InlineFontComparison } from "@/components/typematch/inline-font-comparison";

const searchSchema = z.object({
  font: z.string().optional(),
  with: z.string().optional(),
});

export const Route = createFileRoute("/analyze")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Analyze typefaces — TypeMatch Studio" },
      {
        name: "description",
        content: "Inspect one typeface or compare two inside the TypeMatch analysis workspace.",
      },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const { font: fontId = "inter", with: companionId } = Route.useSearch();
  const font = FONTS_BY_ID[fontId] ?? FONTS[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-[1920px] px-5 pb-32 sm:px-8 lg:px-[5.75vw]">
        <article className="pt-12">
          <FontOverview font={font} />
          <FontDetailNav font={font} />
          <FontSpecimenEditor font={font} />
          <InlineFontComparison font={font} initialSecondaryId={companionId} />
          <div id="pairings" className="scroll-mt-36">
            <PairingRecommendations font={font} />
          </div>
          <div id="preview" className="scroll-mt-36">
            <PairingPreview font={font} />
          </div>
          <div id="diagnosis" className="scroll-mt-36">
            <TechnicalDiagnosis font={font} />
          </div>
          <div id="usage" className="scroll-mt-36">
            <UsageFit font={font} />
          </div>
          <ContrastBehaviour font={font} />
          <div id="license" className="scroll-mt-36">
            <LicenseSource font={font} />
          </div>
        </article>
      </main>
    </div>
  );
}
