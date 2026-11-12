import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import { BookOpenCheck, Bot, CloudUpload, Download, GraduationCap, Layers, ShieldCheck, Sprout } from 'lucide-react';
import { baseOptions } from '@/lib/layout.shared';
import { releasesUrl, siteUrl } from '@/lib/shared';

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
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(40rem_20rem_at_15%_10%,var(--yb-pink),transparent),radial-gradient(40rem_20rem_at_85%_0%,var(--yb-blue),transparent),radial-gradient(30rem_20rem_at_50%_100%,var(--yb-yellow),transparent)]"
          />
          <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center md:py-28">
            <img src="/logo.svg" alt="" width={112} height={112} className="mb-8 size-28" />
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">An IDE for education</h1>
            <p className="mb-8 max-w-2xl text-lg text-fd-muted-foreground md:text-xl">
              Give students exactly the tools each exercise calls for, and hand out and collect assignments without a
              single zip file.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/docs"
                className="rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
              >
                Read the docs
              </Link>
              <a
                href={releasesUrl}
                className="inline-flex items-center gap-2 rounded-full border bg-fd-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent"
              >
                <Download className="size-4" />
                Download
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-4 py-16">
          <h2 className="mb-2 text-2xl font-semibold">Why Yukibana?</h2>
          <p className="mb-10 max-w-3xl text-fd-muted-foreground">
            Professional IDEs are built to make experts fast. For a beginner, the same help can do the thinking for
            them, and the setup can take the first week. Yukibana puts fruitful friction back where it helps learning,
            and removes the sterile friction that does not.{' '}
            <Link to="/docs/why" className="font-medium text-fd-foreground underline underline-offset-4">
              Read more
            </Link>
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border bg-fd-card p-5">
                <Icon className="mb-3 size-5 text-fd-primary" />
                <h3 className="mb-1 font-medium">{title}</h3>
                <p className="text-sm text-fd-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t bg-fd-secondary/40">
          <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-16 md:grid-cols-2">
            <Link
              to="/docs/getting-started/students"
              className="rounded-xl border bg-fd-card p-6 transition-colors hover:bg-fd-accent"
            >
              <GraduationCap className="mb-3 size-6 text-fd-primary" />
              <h3 className="mb-1 text-lg font-medium">I am a student</h3>
              <p className="text-sm text-fd-muted-foreground">
                Open an exercise from the cloud, work on it, and hand it in.
              </p>
            </Link>
            <Link
              to="/docs/getting-started/teachers"
              className="rounded-xl border bg-fd-card p-6 transition-colors hover:bg-fd-accent"
            >
              <BookOpenCheck className="mb-3 size-6 text-fd-primary" />
              <h3 className="mb-1 text-lg font-medium">I am a teacher</h3>
              <p className="text-sm text-fd-muted-foreground">
                Turn a course repository into an exercise, set its dates, and collect submissions ready to grade.
              </p>
            </Link>
          </div>
        </section>

        <footer className="border-t px-4 py-8 text-center text-sm text-fd-muted-foreground">
          Yukibana is open source and developed at the{' '}
          <a href="https://www.hevs.ch/" className="underline underline-offset-4">
            HES-SO Valais/Wallis
          </a>
          .
        </footer>
      </main>
    </HomeLayout>
  );
}
