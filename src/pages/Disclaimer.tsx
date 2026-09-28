import { LegalLayout } from "../components/legal/LegalLayout";
import { LegalSection } from "../components/legal/LegalSection";
import { LegalP } from "../components/legal/LegalList";
import { LegalList } from "../components/legal/LegalList";

export function Disclaimer() {
  return (
    <LegalLayout
      eyebrow="Disclaimer"
      title="Medical & Career Decision-Support Disclaimer | Branchly"
      seoTitle="Medical & Career Decision-Support Disclaimer | Branchly"
      lastUpdated="3 February 2026"
      intro="Please read this before interpreting any result. It explains what Branchly does, what it does not do, and how to use it responsibly."
    >
      <LegalSection heading="Decision support, not a directive">
        <LegalP>
          Branchly provides informational decision support and does not determine which
          specialty a user should choose. Results reflect the user's stated preferences
          through a structured model — they are a starting point for further research, not a
          directive.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Not career advice">
        <LegalP>
          Branchly is not a career counsellor NotesMediaEditor is not a person, and nothing on
          this site constitutes professional career advice. If you are weighing a major
          decision, talk with mentors, faculty, practitioners, and qualified advisors.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Not medical advice">
        <LegalP>
          Branchly makes no medical determinationsans no recommendation about your ability,
          fitness, or readiness for any specialty, training role, or workplace. It does not
          diagnose or evaluate you as a person or a professional.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Not an objective ranking">
        <LegalList
          items={[
            "Results reflect the preferences you stated, weighted by a structured model kept deliberately simple and explainable.",
            "They are not an objective ranking of specialties, and are not a measurement of you.",
            "Answers you are unsure about pull results toward neutral — staying broad is a valid, honest outcome.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="Experience varies">
        <LegalP>
          Training quality, duty hours, patient populations, and working conditions vary
          substantially between institutions, states, and practice settings. What is reported
          online or in condensed summaries may not match what you experience. Institutional
          reality is your best source of truth.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Community-sourced content">
        <LegalP>
          Some evidence entries are scaffolded or drawn from community and resident
          discussions. These are labelled with their source type and confidence level on the
          Sources page credentials. They are shared for transparency and are not presented as
          universal facts. Treat them as starting points, not conclusions.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Your responsibility">
        <LegalP>
          The final decision is yours. Do not make a career decision solely on the output of
          this tool. Use it to narrow your thinking, then verify through your own research,
          conversations with people in the field, and qualified advice where appropriate.
          Explore. Compare. Decide for yourself.
        </LegalP>
      </LegalSection>
    </LegalLayout>
  );
}
