import { Link } from 'react-router';
import { BookOpenCheck, Bot, CloudUpload, GraduationCap, Layers, ShieldCheck, Sprout } from 'lucide-react';
import { defaultHero, HeroSwitcher, useHeroVariant } from '@/components/hero/hero-switcher';
import { heroVariants } from '@/components/hero/variants';
import { SiteHeader } from '@/components/site-header';
import { siteUrl } from '@/lib/shared';

const description =
  'Yukibana is an IDE for education. Teachers choose, exercise by exercise, which tools students see, and hand out and collect assignments through Yukibana Cloud.';

export function meta() {
  return [
    { title: 'Yukibana: an IDE for education' },
    { name: 'description', content: description },
    { property: 'og:title', content: 'Yukibana: an IDE for education' },
    { property: 'og:description', content: description },
    { property: 'og:image', content: `${siteUrl}/og/docs/image.webp` },
    { tagName: 'link', rel: 'canonical', href: `${siteUrl}/` },
  ];
}

const features = [
  {
    icon: Sprout,
    title: 'Features that grow with the course',
    body: 'Start from a text editor and a run button. Turn on error underlines, code suggestions or AI assistance when the course is ready for them.',
  },
  {
    icon: Layers,
    title: 'Simple setup',
    body: 'One installer. Each exercise opens from a link, with its instructions, the right files, a real build and its tests.',
  },
  {
    icon: Bot,
    title: 'AI on your terms',
    body: 'AI assistance is a switch the teacher holds, per exercise. Yukibana does not decide how your course uses AI; it lets you decide.',
  },
  {
    icon: CloudUpload,
    title: 'Hand-in is a button',
    body: 'Students submit from the toolbar and see exactly which files are sent. Late work is accepted and marked, never lost.',
  },
  {
    icon: ShieldCheck,
    title: 'Hidden tests, protected files',
    body: 'Hidden tests never reach students. Read-only files are put back at grading time, and every change to them is reported.',
  },
  {
    icon: BookOpenCheck,
    title: 'Publish from Git',
    body: 'An exercise is a repository with a yukibana.json. Publish it with the CLI, or on every push with the GitHub Action.',
  },
];

export default function Home() {
  const hero = useHeroVariant();
  const { Hero } = heroVariants.find((v) => v.id === hero.id) ?? heroVariants.find((v) => v.id === defaultHero)!;
  return (
    <>
      <SiteHeader float />
      <main className="flex flex-1 flex-col">
        <Hero />

        <section className="mx-auto w-full max-w-(--landing-width) px-4 py-16">
          <h2 className="mb-2 text-(length:--yk-font-size-xl)">Why Yukibana?</h2>
          <p className="mb-10 max-w-3xl text-(--yk-soft)">
            Professional IDEs are built to make experts fast. For a beginner, the same help can do the thinking for
            them, and the setup can take the first week. Yukibana puts fruitful friction back where it helps learning,
            and removes the sterile friction that does not. <Link to="/docs/why">Read more</Link>
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-(--yk-radius-lg) border border-(--yk-line) bg-(--yk-surface) p-5">
                <Icon className="mb-3 size-5 text-(--yk-soft)" strokeWidth={1.5} aria-hidden />
                <h3 className="mb-1 text-base">{title}</h3>
                <p className="text-sm text-(--yk-soft)">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-(--yk-line)">
          <div className="mx-auto grid w-full max-w-(--landing-width) gap-4 px-4 py-16 md:grid-cols-2">
            <Link
              to="/docs/getting-started/students"
              className="rounded-(--yk-radius-lg) border border-(--yk-line) bg-(--yk-surface) p-6 transition-colors duration-(--yk-motion-fast) hover:bg-(--yk-sunken)"
            >
              <GraduationCap className="mb-3 size-6 text-(--yk-soft)" strokeWidth={1.5} aria-hidden />
              <h3 className="mb-1 text-lg">I am a student</h3>
              <p className="text-sm text-(--yk-soft)">Open an exercise from the cloud, work on it, and hand it in.</p>
            </Link>
            <Link
              to="/docs/getting-started/teachers"
              className="rounded-(--yk-radius-lg) border border-(--yk-line) bg-(--yk-surface) p-6 transition-colors duration-(--yk-motion-fast) hover:bg-(--yk-sunken)"
            >
              <BookOpenCheck className="mb-3 size-6 text-(--yk-soft)" strokeWidth={1.5} aria-hidden />
              <h3 className="mb-1 text-lg">I am a teacher</h3>
              <p className="text-sm text-(--yk-soft)">
                Turn a course repository into an exercise, set its dates, and collect submissions ready to grade.
              </p>
            </Link>
          </div>
        </section>
      </main>
      {/* After <main>, so it is the page's footer landmark (contentinfo). */}
      <footer className="border-t border-(--yk-line) px-4 py-8 text-center text-sm text-(--yk-soft)">
        Yukibana is open source and developed at the <a href="https://www.hevs.ch/">HES-SO Valais/Wallis</a>.
      </footer>
      {hero.switcher && <HeroSwitcher current={hero.id} onChoose={hero.choose} />}
    </>
  );
}
