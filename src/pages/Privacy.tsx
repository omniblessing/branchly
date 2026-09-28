import { LegalLayout } from "../components/legal/LegalLayout";
import { LegalSection } from "../components/legal/LegalSection";
import { LegalP } from "../components/legal/LegalList";
import { LegalList } from "../components/legal/LegalList";

const COMPARE_KEY = "pgbc-compare-v1";

export function Privacy() {
  return (
    <LegalLayout
      eyebrow="Privacy Policy"
      title="Privacy Policy | Branchly"
      seoTitle="Privacy Policy | Branchly"
      lastUpdated="3 February 2026"
      intro="This page explains, in plain language, what Branchly does and does not do with your data. It is written to match the actual behaviour of this application — nothing here claims more than what is built."
    >
      <LegalSection heading="The short version">
        <LegalP>
          Branchly is a decision-support tool that runs entirely in your browser. It does not
          have accounts, does not run a server for your answers, does not use cookies, does
          not track you across sites, and does not share or sell your data to anyone. Your
          discovery answers are processed client-side and are never transmitted.
        </LegalP>
      </LegalSection>

      <LegalSection heading="What we collect">
        <LegalP>Branchly collects the minimum needed for the tool to work:</LegalP>
        <LegalList
          items={[
            "Your answers to the discovery questions, held only in memory for the current session. They are not stored on disk and not sent anywhere.",
            "The set of specialties you pin for comparison, stored locally on your device under the key \u201C" + COMPARE_KEY + "\u201D so your compare selection survives a refresh. This never leaves your device.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="What we do not do">
        <LegalList
          items={[
            "No accounts, sign-ins, or profiles stored on our side.",
            "No cookies, web beacons, or cross-site trackers.",
            "No analytics, advertising identifiers, or third-party data sharing.",
            "Your answers are not uploaded to any server.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="Where your data lives">
        <LegalP>
          Everything stays on your device. The only persistent storage is the local compare
          selection (key <code className="mono-label text-ink-500">{COMPARE_KEY}</code>) in
          your browser's localStorage. Clearing your browser data, or clicking
          \u201CRestart\u201D in the app, removes it. No copy exists on our servers because no
          server stores it.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Fonts and external requests">
        <LegalP>
          The app loads its typeface (Google Fonts) from a public CDN. That request may send
          your IP address and screen information to the font provider, as is standard for any
          website loading web fonts. No other external requests are made by the app.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Children and minors">
        <LegalP>
          Branchly is a general decision-support tool and is not directed at children under 13.
          Because there are no accounts or data collection, we do not knowingly obtain
          personal information from minors.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <LegalP>
          If the way the app handles data ever changes, this policy will be updated and the
          \u201CLast updated\u201D date above revised. Since Branchly is client-side, any
          change to data handling ships with the app itself and is visible here immediately.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Contact">
        <LegalP>
          Questions about this privacy policy or your data? Reach us at{" "}
          <a
            href="mailto:[CONTACT EMAIL]"
            className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-900"
          >
            [CONTACT EMAIL]
          </a>
          . Please note this is a placeholder — replace it before public launch.
        </LegalP>
      </LegalSection>
    </LegalLayout>
  );
}
