import { useLocale } from "@/components/home/locale";

export function ReviewMarquee() {
  const { t } = useLocale();
  return (
    <section className="cl-marquee" aria-label={t.reviews[0]?.name}>
      <div className="cl-marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy}>
            {t.reviews.map((review) => (
              <li key={`${copy}-${review.name}`}>
                <blockquote>{review.quote}</blockquote>
                <cite>{review.name}</cite>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
