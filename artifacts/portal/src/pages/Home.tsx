import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
              <img className="h-10 w-auto" src={`${import.meta.env.BASE_URL}logo.svg`} alt="EOC" />
              <span className="font-serif font-semibold text-primary text-xl hidden sm:block">Elizabeth Okwori's Confectionery</span>
            </Link>
          </div>
          <div className="flex gap-x-6">
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">About</Link>
            <Link href="/programs" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Programs</Link>
            <Link href="/sign-in" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Log in</Link>
            <Link href="/sign-up" className="text-sm font-medium bg-secondary text-secondary-foreground px-4 py-2 rounded-full hover:bg-secondary/90 transition-colors">Register</Link>
          </div>
        </nav>
      </header>

      <main>
        <div className="relative isolate pt-24 bg-accent/30 pb-20">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
              <h1 className="max-w-lg text-5xl font-serif font-bold tracking-tight text-primary sm:text-7xl">
                Master the Art of Culinary Excellence
              </h1>
              <p className="mt-8 text-lg font-medium text-muted-foreground sm:text-xl/8">
                Empowering individuals through professional vocational catering training. Join our prestigious programs and transform your passion into a thriving career.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link href="/sign-up" className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all">
                  Apply for Enrollment
                </Link>
                <Link href="/programs" className="text-sm/6 font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
                  View Programs <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="mt-16 sm:mt-24 lg:mt-0 lg:shrink-0 lg:flex-grow">
               <div className="aspect-[4/3] rounded-2xl bg-muted overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground italic font-serif">
                     [Hero Image]
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
