import type { Metadata } from 'next'
import '../index.css'
 
export const metadata: Metadata = {
  title: 'Metah Viz',
  description: 'Web site created with Next.js.',
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <html lang="en">
        
        <body>
          <div id="root">{children}</div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

        </body>
      </html>

    )
  }


