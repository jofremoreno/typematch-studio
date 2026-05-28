import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TypeMatch Studio — Typography pairing with design logic" },
      {
        name: "description",
        content:
          "Analyze free typefaces and build pairings based on contrast, legibility, hierarchy and context. No random matches.",
      },
      { name: "author", content: "TypeMatch Studio" },
      { property: "og:title", content: "TypeMatch Studio" },
      {
        property: "og:description",
        content:
          "A professional analysis and pairing tool for free typefaces. Built on local typographic attributes, not random generators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?" +
          [
            "family=Inter:wght@300;400;500;600;700",
            "family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400",
            "family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400",
            "family=Roboto:wght@300;400;500;700",
            "family=IBM+Plex+Sans:wght@300;400;500;600",
            "family=Space+Grotesk:wght@400;500;600;700",
            "family=DM+Sans:wght@400;500;700",
            "family=Montserrat:wght@400;500;600;700",
            "family=Work+Sans:wght@400;500;600;700",
            "family=Manrope:wght@400;500;600;700",
            "family=Archivo:wght@400;500;600;700",
            "family=Public+Sans:wght@400;500;600;700",
            "family=Source+Serif+4:wght@400;500;600;700",
            "family=Libre+Baskerville:ital,wght@0,400;0,700;1,400",
            "family=Merriweather:wght@400;700",
            "family=Lora:ital,wght@0,400;0,500;0,600;1,400",
            "family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,700",
            "family=IBM+Plex+Mono:wght@400;500;600",
            "family=Space+Mono:wght@400;700",
            "family=JetBrains+Mono:wght@400;500;700",
            "family=Roboto+Mono:wght@400;500;700",
            "family=Bebas+Neue&family=Archivo+Black&family=Oswald:wght@400;500;700&family=Anton",
          ].join("&") +
          "&display=swap",
      },
    ],
    scripts: [
      {
        children: `(function(){try{var t=localStorage.getItem('tm-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
