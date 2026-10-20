import './globals.css';
export const metadata = { title: 'StudySpark — Your AI study space', description: 'Turn lecture notes into clear summaries, flashcards and custom practice exams.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html> }
