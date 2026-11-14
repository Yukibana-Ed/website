import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { RootProvider } from 'fumadocs-ui/provider/react-router';
import { themeBoot } from '@yukibana/design/theme';
import type { Route } from './+types/root';
import './app.css';
import NotFound from './routes/not-found';
import StaticSearchDialog from './components/search';
import { LEGACY_THEME_KEY } from './components/theme-switch';

/**
 * The theme chosen in the docs' sidebar, applied before anything paints so a page never flashes the other scheme. It
 * is the design system's (@yukibana/design/theme): one cookie shared by every site under yukibana.dev, which sets
 * data-theme on <html> and turns on the matching theme-color below.
 */
const bootScript = themeBoot(LEGACY_THEME_KEY);

export const links: Route.LinksFunction = () => [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="yk-root" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#f5f7fa" media="(prefers-color-scheme: light)" data-scheme="light" />
        <meta name="theme-color" content="#0b0e15" media="(prefers-color-scheme: dark)" data-scheme="dark" />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        {/* Fumadocs' theme provider (next-themes) is off: it keeps the choice in this origin's localStorage, which the
            cloud cannot read. The sidebar's switch is our own (components/theme-switch). */}
        <RootProvider search={{ SearchDialog: StaticSearchDialog }} theme={{ enabled: false }}>
          {children}
        </RootProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFound />;
    message = 'Error';
    details = error.statusText;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 w-full max-w-[1400px] mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
