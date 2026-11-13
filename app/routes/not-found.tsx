import { Link } from 'react-router';
import { SiteHeader } from '@/components/site-header';

export function meta() {
  return [{ title: 'Not Found' }];
}

export default function NotFound() {
  return (
    <>
      <SiteHeader float />
      <main className="yk-empty flex-1 content-center">
        <h1 className="m-0 text-2xl">Page not found</h1>
        <p>There is nothing at this address. It may have moved.</p>
        <Link to="/docs" className="yk-btn yk-btn--primary">
          Open the docs
        </Link>
      </main>
    </>
  );
}
