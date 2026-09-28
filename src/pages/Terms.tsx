import { LegalLayout } from "../components/legal/LegalLayout";
import { LegalSection } from "../components/legal/LegalSection";
import { LegalP } from "../components/legal/LegalList";
import { LegalList } from "../components/legal/LegalList";

export function Terms() {
  return (
    <LegalLayout
      eyebrow="Terms of Use"
      title="Terms of Use | Branchly"
      seoTitle="Terms of Use | Branchly"
      lastUpdated="3 February 2026"
      intro="These terms govern your use of Branchly, a client-side decision-support tool. By using the app you agree to them. Please read them before starting."
    >
      <LegalSection heading="1. What Branchly is">
        <LegalP>
          Branchly is an informational decision-support tool that helps you explore
          postgraduate (PG) branches based on your own answers. It is not medical advice, not
          career counselling, and not a determination of what you should choose. The final
          decision is yours.
        </LegalP>
      </LegalSection>

      <LegalSection heading="2. Acceptance of terms">
        <LegalP>
          By accessing or using Branchly, you accept these terms. If you do not agree, please
          do not use the app.
        </LegalP>
      </LegalSection>

      <LegalSection heading="3. Eligibility">
        <LegalP>
          Branchly is intended for use by individuals considering postgraduate specialisation,
          typically medical graduates and students. There are no accounts and no age
          verification; you are responsible for ensuring you comply with any requirements
          that apply to you.
        </LegalP>
      </LegalSection>

      <LegalSection heading="4. You own your answers">
        <LegalP>
          Your answers remain yours. They are processed only in your browser during the
          current session, and the only stored item is a local compare selection that never
          leaves your device. Branchly does not assert any ownership over your inputs.
        </LegalP>
      </LegalSection>

      <LegalSection heading="5. Acceptable use">
        <LegalList
          items={[
            "Use Branchly for lawful, non-commercial purposes.",
            "Do not attempt to reverse-engineer, misrepresent, or interfere with the tool's functioning.",
            "Do not use Branchly to make a high-stakes career decision without independent research, mentorship, and qualified advice where appropriate.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="6. Results are not guarantees">
        <LegalP>
          Results are a structured reflection of the preferences you stated. They are not an
          objective ranking, a prediction of career success, or a guarantee of fit. Real-world
          training conditions and outcomes vary substantially by institution, state, and
          practice setting. Do not rely on Branchly as the sole basis for a decision.
        </LegalP>
      </LegalSection>

      <LegalSection heading="7. No warranty">
        <LegalP>
          The app is provided \u201Cas is\u201D and \u201Cas available\u201D, without
          warranties of any kind, express or implied. We do not warrant that the tool, its
          data, or its scoring model is complete, accurate, or fit for any particular purpose.
        </LegalP>
      </LegalSection>

      <LegalSection heading="8. Limitation of liability">
        <LegalP>
          To the fullest extent permitted by law, Branchly and its operators are not liable
          for any direct or indirect damages, including lost opportunities or consequences
          arising from decisions made with the aid of this tool. You use Branchly at your own
          discretion and assume responsibility for your choices.
        </LegalP>
      </LegalSection>

      <LegalSection heading="9. Intellectual property">
        <LegalP>
          The Branchly name, logo, brand assets, engine, scoring logic, and original content
          are owned by their respective rightsholders and may not be copied, redistributed, or
          reused without permission. Data entries drawn from external sources are attributed
          on the Sources page.
        </LegalP>
      </LegalSection>

      <LegalSection heading="10. Third-party content">
        <LegalP>
          Some content, including resident-experience and community-sourced summaries, is
          provided for transparency. It represents reported experience, not verified fact, and
          is labelled as such. We do not endorse any individual claim.
        </LegalP>
      </LegalSection>

      <LegalSection heading="11. Changes to these terms">
        <LegalP>
          We may update these terms as the app evolves. Continued use of Branchly after
          changes take effect constitutes acceptance of the revised terms.
        </LegalP>
      </LegalSection>

      <LegalSection heading="12. Governing law">
        <LegalP>
          These terms are governed by the laws of [STATE/COUNTRY], without regard to conflict
          of law principles. [LEGAL ENTITY NAME] — a placeholder to be replaced before launch.
        </LegalP>
      </LegalSection>

      <LegalSection heading="13. Contact">
        <LegalP>
          Questions about these terms? Contact us at{" "}
          <a
            href="mailto:[CONTACT EMAIL]"
            className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-900"
          >
            [CONTACT EMAIL]
          </a>
          . Placeholder — replace before public launch.
        </LegalP>
      </LegalSection>
    </LegalLayout>
  );
}
