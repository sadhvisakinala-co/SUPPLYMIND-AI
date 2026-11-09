from pathlib import Path
root=Path('frontend')
p=root/'tailwind.config.ts'
s=p.read_text()
for a,b in {'#101719':'#0B3048','#162326':'#12394F','#213236':'#19455A','#26B7A3':'#B9F12F','#6E9293':'#90A9AF','#EBF4F3':'#F2F0E9','#A5B8B8':'#B8C9CC','#34494C':'#2E5063','#4BC59A':'#B9F12F','rgba(38, 183, 163,':'rgba(185, 241, 47,'}.items():s=s.replace(a,b)
s=s.replace('// Master Graphite & Electric Teal Theme','// Midnight Teal / Soft Pearl / Neon Lime. Legacy aliases preserve existing components.')
s=s.replace('colors: {','colors: {\n        midnight: "#0B3048",\n        deep: "#071F30",\n        pearl: "#F2F0E9",\n        lime: "#B9F12F",')
p.write_text(s)
# Styling-only replacements in existing JSX. All strings and handlers outside styling are retained.
for p in (root/'src').rglob('*.tsx'):
 s=p.read_text()
 for a,b in {'#209f8e':'#CBFA5B','#1d2d31':'#19455A','#425d61':'#67808C','#0b1012':'#071F30','#182022':'#0B3048','#172528':'#19455A','#1b2f2b':'#19455A','#172c23':'#12394F','#172b22':'#12394F','#101C1A':'#071F30','#FFC439':'#B9F12F','#f2b82c':'#CBFA5B'}.items():s=s.replace(a,b)
 s=s.replace('animate-ping','ambient-beacon').replace('animate-bounce','ambient-beacon')
 if p.name=='button.tsx':s=s.replace('inline-flex items-center','premium-button inline-flex items-center',1).replace('focus-visible:ring-offset-2','focus-visible:ring-offset-2 focus-visible:ring-offset-graphite')
 if p.name=='card.tsx':s=s.replace('rounded-xl border transition-all','premium-card rounded-2xl border transition-all')
 if p.name=='Navbar.tsx':
  s=s.replace('fixed top-0','landing-nav fixed top-0').replace('md:flex','xl:flex').replace('md:hidden','xl:hidden')
  s=s.replace('<nav className=', '<nav aria-label="Main navigation" className=')
 if p==root/'src/app/page.tsx':
  s=s.replace('className="min-h-screen','className="landing-page min-h-screen',1)
  s=s.replace('lg:grid-cols-12 gap-12 lg:gap-16 items-center','lg:grid-cols-12 gap-12 lg:gap-8 items-center',1)
  s=s.replace('lg:col-span-5 flex flex-col','hero-copy lg:col-span-6 flex flex-col',1)
  s=s.replace('font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl','hero-title font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl',1)
  s=s.replace('grid grid-cols-3 gap-6 pt-6','hero-metrics grid grid-cols-3 gap-6 pt-6',1)
  s=s.replace('lg:col-span-7 relative','hero-visual lg:col-span-6 relative',1)
  s=s.replace('relative rounded-2xl border border-border-subtle bg-charcoal/70 backdrop-blur-xl p-2 shadow-2xl','digital-twin-frame relative')
  s=s.replace('absolute bottom-4 left-4 right-4 flex items-center justify-between','scene-caption absolute bottom-4 left-4 right-4 flex items-center justify-between',1)
 if p==root/'src/app/(dashboard)/layout.tsx':
  s=s.replace('className="min-h-screen','className="console-shell min-h-screen',1)
  s=s.replace('fixed lg:static top-0 bottom-0','console-sidebar fixed lg:sticky lg:h-screen lg:overflow-y-auto top-0 bottom-0').replace('w-[250px]','w-[240px]')
  s=s.replace('<nav className=', '<nav aria-label="Console navigation" className=')
  s=s.replace('key={item.href}','key={item.href}\n                  aria-current={isActive ? "page" : undefined}')
  s=s.replace('className="p-6 sm:p-8 flex-1','className="console-content p-5 sm:p-8 xl:p-10 flex-1')
  s=s.replace('className="lg:hidden p-1 text','aria-label="Close navigation"\n              className="lg:hidden p-1 text')
  s=s.replace('className="lg:hidden p-1.5 text','aria-label="Open navigation"\n              className="lg:hidden p-1.5 text')
 if '/auth/' in str(p):s=s.replace('className="min-h-screen','className="auth-shell min-h-screen',1)
 if 'negotiations/page.tsx' in str(p):
  s=s.replace('grid grid-cols-1 lg:grid-cols-12 gap-6 items-start','negotiation-workspace grid grid-cols-1 lg:grid-cols-12 gap-6 items-start')
  s=s.replace('className={`flex flex-col max-w-lg','className={`message-reveal flex flex-col max-w-lg')
  s=s.replace('className="border-border-subtle p-5 space-y-5 font-mono text-xs"','className="economics-panel border-border-subtle p-5 space-y-5 font-mono text-xs"')
 p.write_text(s)
