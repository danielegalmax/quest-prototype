import React, { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  CircleCheckBig,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Compass,
  Crown,
  Flame,
  Footprints,
  Home,
  Image,
  Library,
  Map,
  Menu,
  MessageCircleQuestion,
  Mic,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Share2,
  Settings,
  ShoppingBag,
  Sparkles,
  Target,
  Trophy,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react'
import { dayBlocks, questsCompleted } from './data'

const navigation = [
  { id: 'today', label: 'Oggi', icon: Home },
  { id: 'room', label: 'La mia stanza', icon: Users },
  { id: 'discover', label: 'Scopri', icon: Compass },
  { id: 'recipes', label: 'Ricette', icon: Library },
  { id: 'market', label: 'Marketplace', icon: ShoppingBag },
]

const categories = [
  { name: 'Musica', icon: '♪', description: 'Suona, ascolta, ripeti', color: '#ccdcff' },
  { name: 'Benessere', icon: '◌', description: 'Rituali che fanno spazio', color: '#d8ead9' },
  { name: 'Movimento', icon: '↗', description: 'Un passo alla volta', color: '#ffe0c8' },
  { name: 'Cucina', icon: '⌁', description: 'Impara facendo', color: '#fff0b8' },
  { name: 'Lettura', icon: '⌑', description: 'Leggi e trattieni', color: '#e9deff' },
  { name: 'Creatività', icon: '✦', description: 'Dai forma alle idee', color: '#ffd6dd' },
]

const signalTypes = [
  { id: 'fire', label: 'Fiamma', help: 'Stai mantenendo il ritmo', icon: Flame, color: '#ff8b52' },
  { id: 'brick', label: 'Mattone', help: 'Costruisce qualcosa di solido', icon: Footprints, color: '#6a7cf5' },
  { id: 'map', label: 'Mappa', help: 'Il tuo percorso aiuta anche me', icon: Map, color: '#4c9c76' },
  { id: 'zap', label: 'Scossa', help: 'Questo mi ha sbloccato', icon: Zap, color: '#d69a00' },
  { id: 'vetta', label: 'Vetta', help: 'Celebra un percorso arrivato fino in fondo', icon: Trophy, color: '#b47916', free: true },
]

const standardSignalTypes = signalTypes.filter(signal => signal.id !== 'vetta')

const marketPaths = questsCompleted.filter(path => path.listing)

const listingTypeLabel = listing => {
  if (listing.type === 'consulenza') return 'Consulenza diretta'
  if (listing.type === 'risorsa') return 'Risorsa digitale'
  return listing.hasPrivateRoom ? 'Corso + stanza' : 'Corso'
}

const listingStatusLabel = listing => {
  if (listing.activationStatus === 'attiva') return 'Stanza attiva'
  if (listing.activationStatus === 'in_attesa') return 'In attesa di soglia'
  if (listing.activationStatus === 'esaurita') return 'Posti esauriti'
  return listing.type === 'risorsa' ? 'Disponibile subito' : 'Prenotabile'
}

const listingFormatLabel = listing => {
  if (listing.hasPrivateRoom) return '🏠 Stanza privata'
  if (listing.type === 'risorsa') return '⚪ Solo materiale'
  if (listing.hasLiveSessions) return '🎥 Sessione live'
  return '⚪ Senza stanza'
}

const verificationLabel = path => path.authorVerifiedVia === 'quest' ? 'Percorso verificato su Quest' : 'Credenziali verificate'

function Logo({ compact = false }) {
  return (
    <div className="logo" aria-label="Quest">
      <span className="logo-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {!compact && <span className="logo-word">quest<span>.</span></span>}
    </div>
  )
}

function Avatar({ initials, color = '#d8e0ff', size = 'md' }) {
  return <span className={`avatar avatar-${size}`} style={{ background: color }}>{initials}</span>
}

function ProgressRing({ value = 40, size = 64, stroke = 6, children }) {
  const radius = (size - stroke) / 2
  const circumference = radius * 2 * Math.PI
  return (
    <span className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} />
        <circle
          className="ring-value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (value / 100) * circumference}
        />
      </svg>
      <span>{children}</span>
    </span>
  )
}

function Sidebar({ activeView, setActiveView, onCreate, onProfile }) {
  return (
    <aside className="sidebar">
      <Logo />
      <nav className="side-nav" aria-label="Navigazione principale">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button className={activeView === id ? 'active' : ''} onClick={() => setActiveView(id)} key={id}>
            <Icon size={19} strokeWidth={2} />
            <span>{label}</span>
            {id === 'room' && <i>8</i>}
          </button>
        ))}
      </nav>
      <button className="create-button" onClick={onCreate}>
        <Plus size={19} /> Nuova Quest
      </button>
      <div className="side-spacer" />
      <button className={`profile-shortcut ${activeView === 'profile' ? 'active' : ''}`} onClick={onProfile}>
        <Avatar initials="AL" color="#ffcfbd" />
        <span><strong>Andrea L.</strong><small>Livello Costante</small></span>
        <MoreHorizontal size={18} />
      </button>
    </aside>
  )
}

function MobileTopbar({ setMenuOpen, onNotifications }) {
  return (
    <header className="mobile-topbar">
      <button className="icon-button" onClick={() => setMenuOpen(true)} aria-label="Apri menu"><Menu size={22} /></button>
      <Logo />
      <button className="icon-button notification-button" onClick={onNotifications} aria-label="Notifiche"><Bell size={21} /><span /></button>
    </header>
  )
}

function MobileNav({ activeView, setActiveView }) {
  return (
    <nav className="mobile-nav" aria-label="Navigazione mobile">
      {navigation.slice(0, 5).map(({ id, label, icon: Icon }) => (
        <button className={activeView === id ? 'active' : ''} onClick={() => setActiveView(id)} key={id}>
          <Icon size={20} /><span>{label === 'La mia stanza' ? 'Stanza' : label}</span>
        </button>
      ))}
    </nav>
  )
}

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  )
}

function PathVisual() {
  return (
    <div className="path-visual" aria-label="Giorno 12 di 30">
      <svg viewBox="0 0 760 140" preserveAspectRatio="none" aria-hidden="true">
        <path className="path-shadow" d="M8 100 C80 100 100 40 175 52 S280 124 362 91 S478 15 555 50 S652 123 752 57" />
        <path className="path-done" d="M8 100 C80 100 100 40 175 52 S280 124 362 91" />
      </svg>
      <span className="path-dot p1 done"><Check size={11} /></span>
      <span className="path-dot p2 done"><Check size={11} /></span>
      <span className="path-dot p3 current">12</span>
      <span className="path-dot p4" />
      <span className="path-dot p5"><Trophy size={13} /></span>
      <span className="path-label l1">INIZIO</span>
      <span className="path-label l2">OGGI</span>
      <span className="path-label l3">GIORNO 30</span>
    </div>
  )
}

function ActiveQuest({ onUpdate, onCheckIn, checkedIn }) {
  return (
    <section className="active-quest-card">
      <div className="active-quest-top">
        <div>
          <span className="eyebrow inverse">LA TUA QUEST ATTIVA</span>
          <h2>Imparare le basi<br />della chitarra</h2>
          <div className="quest-meta"><span>♪ Musica</span><span>Giorno 12 di 30</span><span>8 compagni</span></div>
        </div>
        <ProgressRing value={40} size={78} stroke={7}><strong>40%</strong></ProgressRing>
      </div>
      <PathVisual />
      <div className="active-quest-footer">
        <div className="prompt-copy"><Sparkles size={18} /><p><strong>Com’è andata oggi?</strong><span>Anche due righe tengono vivo il percorso.</span></p></div>
        <div className="button-row">
          <button className="button ghost-light" onClick={onCheckIn} disabled={checkedIn}>{checkedIn ? <><Check size={16} /> Presenza segnata</> : 'Check-in +1'}</button>
          <button className="button light" onClick={onUpdate}>Racconta il passo <ArrowRight size={17} /></button>
        </div>
      </div>
    </section>
  )
}

function SignalBar({ entry, onSignal, onSendVetta, recipient }) {
  const isCompletion = entry.type === 'completamento'
  return (
    <div className={`signal-bar ${isCompletion ? 'completion-signals' : ''}`}>
      {standardSignalTypes.slice(0, 3).map(({ id, label, icon: Icon }) => (
        <button key={id} onClick={() => onSignal(entry, id, label, recipient)} aria-label={`Invia ${label}`}>
          <Icon size={15} /><span>{entry.signals[id] || 0}</span>
        </button>
      ))}
      {isCompletion
        ? <button className="vetta-button" onClick={() => onSendVetta(entry, recipient)}><span aria-hidden="true">🏔</span> Manda una Vetta <strong>{entry.signals.vetta || 0}</strong></button>
        : <button className="signal-add" onClick={() => onSignal(entry, 'choose', '', recipient)}><Plus size={15} /> Segnale</button>}
    </div>
  )
}

function DayEntry({ entry, onSignal, onSendVetta, recipient, readOnly }) {
  const MediaIcon = entry.media === 'foto' ? Image : entry.media === 'video' ? Video : entry.media === 'documento' ? Paperclip : Mic
  return (
    <div className="day-entry" data-entry-id={entry.id}>
      <span className={`type-pill ${entry.type.replace(' ', '-')}`}>{entry.type}</span>
      <p>{entry.text}</p>
      {entry.tags && <div className="tag-list">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
      {entry.media === 'audio' && <div className="audio-card"><button aria-label="Riproduci nota audio">▶</button><span className="audio-wave">▂▄▆▃▇▅▂▆▄▃▇▅▂▆▄▃▇▅▂</span><small>0:24</small></div>}
      {entry.media && entry.media !== 'audio' && <div className="media-attachment"><MediaIcon size={18} /><span><strong>{entry.media}</strong><small>Allegato al Giorno X</small></span><button aria-label={`Apri ${entry.media}`}><ArrowRight size={16} /></button></div>}
      {!readOnly && <SignalBar entry={entry} onSignal={onSignal} onSendVetta={onSendVetta} recipient={recipient} />}
    </div>
  )
}

function DayBlockCard({ block, onSignal, onSendVetta, readOnly = false, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const additionalCount = block.entries.length - 1
  const visibleEntries = expanded ? block.entries : block.entries.slice(0, 1)
  return (
    <article className={`day-block-card ${expanded ? 'expanded' : ''} ${readOnly ? 'read-only' : ''}`} data-day-block-id={block.id}>
      <button className="day-block-header" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>
        <Avatar initials={block.initials} color={block.color} />
        <span className="day-block-person"><strong>{block.person}</strong><small>Giorno {block.day} di {block.total} · {block.dateLabel}</small></span>
        {!expanded && additionalCount > 0 && <span className="entry-count">+ {additionalCount} {additionalCount === 1 ? 'altro aggiornamento' : 'altri aggiornamenti'} oggi</span>}
        <ChevronDown className="day-block-chevron" size={18} />
      </button>
      <div className="day-block-entries">
        {visibleEntries.map(entry => <DayEntry key={entry.id} entry={entry} onSignal={onSignal} onSendVetta={onSendVetta} recipient={block.person} readOnly={readOnly} />)}
      </div>
    </article>
  )
}

function RightRail({ credits, onNotifications }) {
  const mates = [
    ['MR', '#cfe0ff'], ['LM', '#ffd5c5'], ['EV', '#d8ead9'], ['NS', '#e8ddff'], ['FG', '#fff0b8'], ['AS', '#ffcfd6']
  ]
  return (
    <aside className="right-rail">
      <div className="rail-actions">
        <button className="icon-button notification-button" onClick={onNotifications} aria-label="Notifiche"><Bell size={20} /><span /></button>
        <button className="icon-button" aria-label="Impostazioni"><Settings size={20} /></button>
      </div>
      <section className="rail-card team-card">
        <div className="rail-title"><div><span className="eyebrow">LA TUA STANZA</span><h3>8 in cammino</h3></div><button>Vedi tutti</button></div>
        <div className="mate-grid">
          {mates.map(([name, color], i) => <div key={name}><Avatar initials={name} color={color} /><span className={i < 4 ? 'online' : ''} /></div>)}
          <div className="more-mates">+2</div>
        </div>
        <p>Oggi hanno aggiornato <strong>Marta, Luca</strong> e altre 2 persone.</p>
      </section>
      <section className="rail-card rhythm-card">
        <span className="eyebrow">IL TUO RITMO</span>
        <div className="rhythm-head"><h3>4 giorni attivi</h3><span>questa settimana</span></div>
        <div className="week-dots">
          {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((d, i) => <div key={`${d}${i}`} className={i < 4 ? 'filled' : i === 4 ? 'today' : ''}><span>{i < 4 && <Check size={12} />}</span><small>{d}</small></div>)}
        </div>
        <p>Il tuo ritmo medio è un aggiornamento ogni <strong>1,8 giorni</strong>.</p>
      </section>
      <section className="credit-card">
        <div className="credit-coin">Q</div>
        <div><span>I tuoi crediti</span><strong>{credits}</strong></div>
        <button aria-label="Informazioni sui crediti"><MessageCircleQuestion size={18} /></button>
      </section>
    </aside>
  )
}

function TodayView({ onUpdate, onRoom, onCheckIn, checkedIn, onSignal, onSendVetta, credits, onNotifications }) {
  return (
    <div className="dashboard-layout">
      <main className="main-column">
        <PageHeader eyebrow="LUNEDÌ 13 LUGLIO" title={<>Buongiorno, Andrea<span className="title-dot">.</span></>} description="Il percorso non deve essere perfetto. Deve essere tuo." />
        <ActiveQuest onUpdate={onUpdate} onCheckIn={onCheckIn} checkedIn={checkedIn} />
        <div className="section-heading"><div><span className="eyebrow">DALLA TUA STANZA</span><h2>Passi recenti</h2></div><button onClick={onRoom}>Tutti gli aggiornamenti <ArrowRight size={16} /></button></div>
        <div className="feed-list">
          {dayBlocks.slice(0, 2).map(block => <DayBlockCard block={block} onSignal={onSignal} onSendVetta={onSendVetta} key={block.id} />)}
        </div>
      </main>
      <RightRail credits={credits} onNotifications={onNotifications} />
    </div>
  )
}

function MatchedHelpCard({ showToast }) {
  return (
    <aside className="matched-help-card">
      <div className="match-mark"><Map size={20} /></div>
      <div className="match-copy">
        <span className="eyebrow">DA UN BLOCCO GIÀ SUPERATO · #CAMBIO-ACCORDI</span>
        <h3>Questo passaggio ha aiutato 11 persone.</h3>
        <p>Al Giorno 11, Davide ha isolato il cambio Sol–Do a 45 bpm. Tre giorni dopo lo ha segnato come traguardo.</p>
        <button onClick={() => showToast('Passaggio salvato tra le risorse della tua Quest')}>Apri il passaggio <ChevronRight size={15} /></button>
      </div>
      <div className="match-route" aria-hidden="true"><span>11</span><i /><span>14</span></div>
    </aside>
  )
}

function RoomView({ onUpdate, onSignal, onSendVetta, showToast }) {
  const [phase, setPhase] = useState('25–50%')
  const visibleDayBlocks = dayBlocks.filter(block => {
    const progress = block.day / block.total
    if (phase === 'Primi 25%') return progress <= .25
    if (phase === '25–50%') return progress > .25 && progress <= .5
    return progress > .5
  })
  return (
    <main className="content-page room-page">
      <PageHeader
        eyebrow="STANZA PUBBLICA · MUSICA"
        title="Basi della chitarra"
        description="Persone diverse, lo stesso tratto di strada. Nessuna classifica."
        action={<button className="button primary" onClick={onUpdate}><Plus size={17} /> Aggiorna il giorno 12</button>}
      />
      <section className="room-overview">
        <div className="room-progress"><ProgressRing value={40}><strong>12</strong></ProgressRing><div><span>Il tuo percorso</span><strong>12 giorni su 30</strong><small>Prossimo punto: prima canzone</small></div></div>
        <div className="room-stat"><span>Persone attive</span><strong>8</strong><small>4 hanno aggiornato oggi</small></div>
        <div className="room-stat"><span>Ritmo della stanza</span><strong>1,6 gg</strong><small>tra un passo e l’altro</small></div>
        <div className="room-people">{dayBlocks.map(block => <Avatar key={block.id} initials={block.initials} color={block.color} />)}<span>+5</span></div>
      </section>
      <div className="filter-row">
        <div className="segmented"><button className="active">Aggiornamenti</button><button>Persone</button></div>
        <label className="phase-filter"><span>Fase del percorso</span><select value={phase} onChange={event => setPhase(event.target.value)}><option>Primi 25%</option><option>25–50%</option><option>Oltre il 50%</option></select><ChevronDown size={15} aria-hidden="true" /></label>
      </div>
      <div className="room-feed">
        <div className="day-divider"><span>OGGI</span></div>
        {visibleDayBlocks.length > 0 ? <>
          {visibleDayBlocks.slice(0, 2).map(block => <DayBlockCard block={block} onSignal={onSignal} onSendVetta={onSendVetta} key={block.id} />)}
          <MatchedHelpCard showToast={showToast} />
          {visibleDayBlocks.slice(2).map(block => <DayBlockCard block={block} onSignal={onSignal} onSendVetta={onSendVetta} key={block.id} />)}
        </> : <div className="phase-empty"><Users size={20} /><p><strong>Nessun aggiornamento in questa fase, oggi.</strong><span>Puoi esplorare un’altra fascia senza perdere il tuo punto nel percorso.</span></p></div>}
      </div>
    </main>
  )
}

function DiscoverView({ onCreate, showToast, onOpenRecipe }) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const searchItems = questsCompleted.map(item => ({ ...item, kind: item.listing ? 'Ricetta · Marketplace' : 'Ricetta', keywords: `${item.title} ${item.category} ${item.author} ${item.path.join(' ')} ${item.listing ? `${item.listing.type} ${item.listing.coach} ${item.listing.level}` : ''}` }))
  const results = normalizedQuery ? searchItems.filter(item => item.keywords.toLowerCase().includes(normalizedQuery)) : []
  const filtered = normalizedQuery ? categories.filter(category => `${category.name} ${category.description}`.toLowerCase().includes(normalizedQuery)) : categories
  return (
    <main className="content-page discover-page">
      <PageHeader eyebrow="TROVA IL TUO PROSSIMO PASSO" title={<>Cosa vuoi <em>imparare?</em></>} description="Non cercare persone da seguire. Cerca un percorso da iniziare." />
      <label className="big-search"><Search size={21} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cerca un obiettivo, una categoria o un blocco…" /><kbd>⌘ K</kbd></label>
      {normalizedQuery && (
        <section className="search-result-section">
          <div className="section-heading"><div><span className="eyebrow">RISULTATI PER “{query.toUpperCase()}”</span><h2>{results.length ? `${results.length} percorsi trovati` : 'Nessun percorso trovato'}</h2></div></div>
          {results.length > 0 ? <div className="search-result-list">{results.map(item => (
            <button key={item.id} onClick={() => onOpenRecipe(item)}>
              <span className="result-icon" style={{ background: item.color }}>{item.listing ? <BookOpen size={18} /> : <Library size={18} />}</span>
              <span><small>{item.kind} · {item.category}</small><strong>{item.title}</strong><em>{item.listing ? `${item.listing.coach} · da €${item.listing.price}` : `${item.success} di completamento · ${item.duration}`}</em></span>
              <ArrowRight size={18} />
            </button>
          ))}</div> : <div className="search-empty"><Search size={22} /><p><strong>Prova con un obiettivo più concreto.</strong><span>Per esempio “chitarra”, “correre” o “telefono”.</span></p></div>}
        </section>
      )}
      <section className="category-section">
        <div className="section-heading"><div><span className="eyebrow">ESPLORA PER CATEGORIA</span><h2>Da dove vuoi partire?</h2></div></div>
        <div className="category-grid">
          {filtered.map(category => (
            <button className="category-card" key={category.name} onClick={() => showToast(`Hai scelto ${category.name}: troviamo una Quest per te`)}>
              <span className="category-icon" style={{ background: category.color }}>{category.icon}</span>
              <span><strong>{category.name}</strong><small>{category.description}</small></span>
              <ArrowRight size={17} />
            </button>
          ))}
        </div>
      </section>
      <section className="starter-banner">
        <div className="starter-art" aria-hidden="true"><span /><span /><span /><span /></div>
        <div><span className="eyebrow inverse">NON TROVI QUELLO CHE CERCHI?</span><h2>Disegna il tuo percorso.</h2><p>Definisci un obiettivo, scegli una durata e trova persone con la stessa direzione.</p></div>
        <button className="button light" onClick={onCreate}>Crea una Quest <ArrowRight size={17} /></button>
      </section>
    </main>
  )
}

function RecipeCard({ recipe, onOpen }) {
  return (
    <article className="recipe-card" onClick={() => onOpen(recipe)}>
      <button className="recipe-cover" style={{ background: recipe.color }} aria-label={`Apri ${recipe.title}`}>
        <span className="cover-category">{recipe.category}</span>
        <div className="mini-path">{recipe.path.map((step, i) => <span key={step} className={i < 3 ? 'done' : ''}><i />{step}</span>)}</div>
      </button>
      <div className="recipe-content">
        <span className="recipe-kicker"><Sparkles size={14} /> RICETTA REALE</span>
        <h3>{recipe.title}</h3>
        <p>di {recipe.author} · {recipe.duration}</p>
        <div className="recipe-stats"><span><strong>{recipe.success}</strong> arriva in fondo</span><span><strong>{recipe.clones}</strong> clonazioni</span></div>
      </div>
    </article>
  )
}

function RecipesView({ onOpen }) {
  const [filter, setFilter] = useState('Per te')
  const sortedPaths = useMemo(() => [...questsCompleted].sort((a, b) => b.clones - a.clones || a.recencyDays - b.recencyDays), [])
  return (
    <main className="content-page recipes-page">
      <PageHeader eyebrow="PERCORSI CHE HANNO FUNZIONATO" title="Ricette" description="Esperienze vere, trasformate in mappe che puoi fare tue." />
      <div className="filter-row recipes-filter">
        <div className="chip-row">{['Per te', 'Più riuscite', 'Recenti', 'Musica', 'Benessere'].map(item => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <button className="select-button">Tutte le difficoltà <ChevronDown size={15} /></button>
      </div>
      <div className="recipe-grid">{sortedPaths.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onOpen={onOpen} />)}</div>
    </main>
  )
}

function ProductCard({ product, onOpen }) {
  const listing = product.listing
  return (
    <article className="product-card">
      <button className="product-art" style={{ background: product.color }} onClick={() => onOpen(product)}>
        <span className="product-type">{listingTypeLabel(listing)}</span>
        <span className="product-glyph">{listing.type === 'risorsa' ? '⌑' : listing.type === 'consulenza' ? '◎' : product.category === 'Musica' ? '♪' : '↗'}</span>
        <span className="product-level">{listing.level}</span>
      </button>
      <div className="product-content">
        <div className="market-badges"><span className="market-format">{listingFormatLabel(listing)}</span><span className={listing.activationStatus === 'attiva' ? 'active' : ''}>{listingStatusLabel(listing)}</span><span>★ {listing.rating}</span></div>
        <h3>{product.title}</h3>
        <p>con <strong>{listing.coach}</strong></p>
        <div className="product-footer"><span>da <strong>€{listing.price}</strong></span><button className="round-arrow" onClick={() => onOpen(product)} aria-label={`Apri ${product.title}`}><ArrowRight size={18} /></button></div>
      </div>
    </article>
  )
}

function MarketView({ onOpen }) {
  const [filter, setFilter] = useState('Tutto')
  const visibleProducts = filter === 'Tutto' ? marketPaths : marketPaths.filter(path => filter === 'Corsi' ? path.listing.type === 'corso' : filter === 'Consulenze' ? path.listing.type === 'consulenza' : filter === 'Risorse' ? path.listing.type === 'risorsa' : path.listing.hasPrivateRoom)
  const featured = marketPaths.find(path => path.listing.type === 'corso' && path.listing.hasPrivateRoom)
  return (
    <main className="content-page market-page">
      <PageHeader eyebrow="GUIDE VERIFICATE, PERCORSI CONCRETI" title="Marketplace" description="Compra competenze, non promesse. Ogni corso diventa una Quest tracciabile." />
      <section className="market-hero">
        <div><span className="eyebrow inverse">IN EVIDENZA · CORSO + STANZA</span><h2>La tua prima canzone,<br />insieme ad altri 17.</h2><p>30 giorni, guida verificata e una stanza privata che si muove al tuo ritmo.</p><button className="button light" onClick={() => onOpen(featured)}>Scopri il corso <ArrowRight size={17} /></button></div>
        <div className="market-orbit" aria-hidden="true"><span className="orbit-main">♪</span><span className="orbit-person o1">MB</span><span className="orbit-person o2">AR</span><span className="orbit-person o3">LC</span></div>
      </section>
      <div className="filter-row"><div className="chip-row">{['Tutto', 'Corsi', 'Stanze private', 'Consulenze', 'Risorse'].map(item => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><button className="select-button">Più rilevanti <ChevronDown size={15} /></button></div>
      <div className="product-grid">{visibleProducts.map(product => <ProductCard product={product} onOpen={onOpen} key={product.id} />)}</div>
    </main>
  )
}

function ProfileView({ generatedQuests }) {
  return (
    <main className="content-page profile-page">
      <section className="profile-hero">
        <div className="profile-intro"><Avatar initials="AL" color="#ffcfbd" size="xl" /><div><span className="eyebrow">IL TUO PERCORSO</span><h1>Andrea L.</h1><p>Sto imparando a essere costante, non perfetto.</p><div className="profile-badges"><span><Check size={14} /> Percorso verificato</span><span><Flame size={14} /> Costante</span></div></div></div>
        <button className="button secondary"><Settings size={17} /> Modifica profilo</button>
      </section>
      <section className="profile-stats">
        <div><strong>47</strong><span>giorni attivi</span></div><div><strong>2</strong><span>Quest completate</span></div><div><strong>1</strong><span>ricetta creata</span></div><div><strong>126</strong><span>persone aiutate</span></div>
      </section>
      <div className="profile-grid">
        <section className="profile-section"><div className="section-heading"><div><span className="eyebrow">ADESSO</span><h2>Quest attive</h2></div></div><div className="profile-quest-list"><div className="profile-quest"><div className="profile-quest-icon">♪</div><div><h3>Basi della chitarra</h3><p>Giorno 12 di 30 · Musica</p><div className="linear-progress"><span style={{ width: '40%' }} /></div></div><strong>40%</strong></div>{generatedQuests.map(quest => <div className="profile-quest generated-quest" key={quest.id}><div className="profile-quest-icon" style={{ background: quest.color }}><ShoppingBag size={19} /></div><div><span className="quest-source-label">{quest.origin === 'acquisto_marketplace' ? 'Da Marketplace' : 'Da Ricetta'}</span><h3>{quest.title}</h3><p>{quest.reference}</p><div className="linear-progress"><span style={{ width: '3%' }} /></div></div><strong>G1</strong></div>)}</div></section>
        <section className="profile-section"><div className="section-heading"><div><span className="eyebrow">MEMORIA DEL PERCORSO</span><h2>Traguardi e cambi di rotta</h2></div></div><div className="history-list"><div><span className="history-dot trophy"><Trophy size={15} /></span><p><strong>21 mattine senza telefono</strong><small>Completata in 23 giorni · Ricetta generata</small></p></div><div><span className="history-dot pivot"><Map size={15} /></span><p><strong>Corsa 5 km</strong><small>In pausa al giorno 16 · “Riparto in autunno”</small></p></div></div></section>
      </div>
    </main>
  )
}

function ComposerModal({ onClose, onPublish, showToast }) {
  const [text, setText] = useState('')
  const [type, setType] = useState('aggiornamento')
  return (
    <Modal title="Aggiorna il giorno 12" subtitle="Basi della chitarra" onClose={onClose} wide>
      <div className="composer-prompt"><Sparkles size={18} /><p><strong>Cosa è cambiato da ieri?</strong><span>Un tentativo, un dubbio o un piccolo passo: va bene tutto ciò che è vero.</span></p></div>
      <textarea value={text} onChange={e => setText(e.target.value)} autoFocus placeholder="Oggi ho…" />
      <div className="update-types"><span>Che tipo di passo è?</span><div>{['aggiornamento', 'traguardo', 'blocco', 'cambio rotta'].map(item => <button className={type === item ? 'active' : ''} onClick={() => setType(item)} key={item}>{item}</button>)}</div></div>
      <div className="composer-footer">
        <div className="attachment-row"><button onClick={() => showToast('Puoi allegare una foto')}><Image size={18} /> Foto</button><button onClick={() => showToast('Puoi allegare un video')}><Video size={18} /> Video</button><button onClick={() => showToast('Puoi registrare una nota audio')}><Mic size={18} /> Audio</button><button onClick={() => showToast('Puoi allegare un documento')}><Paperclip size={18} /> File</button></div>
        <button className="button primary" disabled={!text.trim()} onClick={() => onPublish(text, type)}>Pubblica il passo <Send size={17} /></button>
      </div>
    </Modal>
  )
}

function CreateQuestModal({ onClose, onCreated }) {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState('Musica')
  const [duration, setDuration] = useState(30)
  const [start, setStart] = useState('Oggi')
  const [objective, setObjective] = useState('Imparare le basi della chitarra')
  const [firstUpdate, setFirstUpdate] = useState('')
  const suggestedDurations = { Musica: 30, Benessere: 21, Movimento: 45, Cucina: 60, Lettura: 30, Creatività: 30 }
  const roomExamples = {
    Musica: { initials: 'MR', name: 'Marta', day: 12, text: 'Oggi il cambio tra Sol e Do è uscito senza fermarmi. Piano, ma intero.', color: '#cfe0ff' },
    Benessere: { initials: 'GL', name: 'Giorgio', day: 9, text: 'Telefono lasciato in cucina. La mattina è sembrata più lunga, nel senso buono.', color: '#d8ead9' },
    Movimento: { initials: 'SN', name: 'Sara', day: 8, text: 'Dodici minuti di corsa senza fermarmi. Due in più rispetto a lunedì.', color: '#d8ead9' },
    Cucina: { initials: 'NP', name: 'Nadia', day: 15, text: 'Prima salsa fatta senza ricetta davanti. Ho corretto il sale solo alla fine.', color: '#fff0b8' },
    Lettura: { initials: 'AC', name: 'Anna', day: 11, text: 'Dieci pagine e tre righe di appunti: oggi mi è rimasto davvero qualcosa.', color: '#e9deff' },
    Creatività: { initials: 'EV', name: 'Elena', day: 7, text: 'Ho finito uno schizzo invece di iniziarne altri quattro.', color: '#ffd6dd' },
  }
  const roomExample = roomExamples[selected]
  const titles = { 1: 'Scegli una direzione', 2: 'Dalle un ritmo', 3: 'La stanza è già viva', 4: 'Il tuo Giorno 1' }
  const selectCategory = category => {
    setSelected(category.name)
    setDuration(suggestedDurations[category.name])
    setObjective(category.name === 'Musica' ? 'Imparare le basi della chitarra' : `Il mio percorso di ${category.name.toLowerCase()}`)
  }
  return (
    <Modal title={titles[step]} subtitle={`NUOVA QUEST · PASSO ${step} DI ${start === 'Oggi' ? 4 : 3}`} onClose={onClose} wide>
      {step === 1 && <div className="modal-category-grid">{categories.map(cat => <button className={selected === cat.name ? 'active' : ''} onClick={() => selectCategory(cat)} key={cat.name}><span style={{ background: cat.color }}>{cat.icon}</span><strong>{cat.name}</strong><small>{cat.description}</small></button>)}</div>}
      {step === 2 && <div className="setup-form"><label><span>Il tuo obiettivo</span><input value={objective} onChange={event => setObjective(event.target.value)} /></label><label><span>Durata suggerita per {selected}</span><div className="duration-control"><button onClick={() => setDuration(Math.max(7, duration - 7))}>−</button><strong>{duration} giorni</strong><button onClick={() => setDuration(duration + 7)}>+</button></div></label><fieldset><legend>Quando inizi?</legend><div className="start-options">{['Oggi', 'Domani', 'Lunedì'].map(item => <button className={start === item ? 'active' : ''} onClick={() => setStart(item)} key={item}>{item}</button>)}</div></fieldset></div>}
      {step === 3 && <div className="onboarding-room"><div className="onboarding-room-head"><div><span className="eyebrow">STANZA · {selected.toUpperCase()}</span><h3>{objective}</h3><p>8 persone stanno lavorando a un obiettivo simile.</p></div><div className="room-people"><Avatar initials={roomExample.initials} color={roomExample.color} /><Avatar initials="LM" color="#ffd5c5" /><Avatar initials="EV" color="#d8ead9" /><span>+5</span></div></div><div className="room-preview-update"><Avatar initials={roomExample.initials} color={roomExample.color} /><p><strong>{roomExample.name} · Giorno {roomExample.day}</strong><span>“{roomExample.text}”</span></p><span className="type-pill traguardo">traguardo</span></div><p className="room-principle"><Users size={16} /> Non è una classifica: vedrai persone nella tua fase e persone un po’ più avanti.</p></div>}
      {step === 4 && <div className="first-update-step"><div className="composer-prompt"><Sparkles size={18} /><p><strong>Perché vuoi iniziare proprio adesso?</strong><span>Questo sarà il primo blocco del percorso. Puoi essere breve e concreto.</span></p></div><textarea value={firstUpdate} onChange={event => setFirstUpdate(event.target.value)} placeholder="Inizio questa Quest perché…" autoFocus /><div className="first-day-note"><CircleCheckBig size={18} /><p><strong>Il Giorno 1 non deve dimostrare nulla.</strong><span>Serve solo a lasciare un punto da cui guardare indietro.</span></p></div></div>}
      <div className="modal-actions">{step > 1 && <button className="button secondary" onClick={() => setStep(value => value - 1)}><ArrowLeft size={17} /> Indietro</button>}<button className="button primary" disabled={(step === 2 && !objective.trim()) || (step === 4 && !firstUpdate.trim())} onClick={() => step < 3 ? setStep(value => value + 1) : step === 3 && start === 'Oggi' ? setStep(4) : onCreated()}>{step === 1 ? 'Continua' : step === 2 ? 'Vedi la tua stanza' : step === 3 && start === 'Oggi' ? 'Entra e fai il primo passo' : step === 4 ? 'Pubblica e inizia' : 'Crea la Quest'} <ArrowRight size={17} /></button></div>
    </Modal>
  )
}

function RecipeModal({ recipe, onClose, onGenerate, onViewMarket, showToast }) {
  const [openBlock, setOpenBlock] = useState(0)
  const recipeDetails = {
    1: { active: '22/30', streak: 8, blocks: [{ day: 6, title: 'Le dita facevano male', text: 'Sessioni da 8 minuti, due volte al giorno, invece di una pratica lunga. Il dolore è sceso senza perdere il ritmo.' }, { day: 14, title: 'Il cambio Sol–Do non usciva', text: 'Metronomo a 45 bpm e solo due accordi per tre giorni. Al Giorno 17 il cambio è diventato un traguardo.' }] },
    2: { active: '18/21', streak: 9, blocks: [{ day: 4, title: 'Il gesto era automatico', text: 'Il telefono è rimasto a caricare fuori dalla camera. Togliere il gesto dalla portata ha funzionato meglio della forza di volontà.' }, { day: 12, title: 'Una mattina è saltata', text: 'Nessun reset della Quest: il fallimento è entrato nella timeline e la routine è ripartita il giorno dopo.' }] },
    3: { active: '34/60', streak: 4, blocks: [{ day: 15, title: 'La spesa era troppo dispersiva', text: 'Una base comune per tre ricette ha ridotto ingredienti e decisioni senza rendere i piatti uguali.' }, { day: 38, title: 'I tempi non coincidevano', text: 'Preparazioni ordinate al contrario: prima ciò che riposa, poi ciò che va servito caldo.' }] },
    4: { active: '26/30', streak: 12, blocks: [{ day: 5, title: 'Leggevo senza ricordare', text: 'Tre righe di appunti a fine sessione, senza evidenziare durante la lettura.' }, { day: 19, title: 'La sera ero troppo stanco', text: 'Le dieci pagine sono passate alla pausa pranzo; il cambio di orario è rimasto visibile nella timeline.' }] },
    5: { active: '37/45', streak: 7, blocks: [{ day: 8, title: 'Il fiato finiva troppo presto', text: 'Alternanza di due minuti di corsa e uno di camminata, senza forzare il ritmo.' }, { day: 26, title: 'Il ginocchio chiedeva una pausa', text: 'Tre giorni di recupero dichiarati nella timeline e ripartenza su un percorso più morbido.' }] },
  }
  const details = recipeDetails[recipe.id]
  const criticalBlocks = details.blocks
  const totalDays = Number.parseInt(recipe.duration, 10)
  const authorInitials = recipe.author.split(' ').map(part => part[0]).join('').slice(0, 2)
  const timelineBlocks = [
    { id: `recipe-${recipe.id}-start`, person: recipe.author, initials: authorInitials, color: recipe.color, day: 1, total: totalDays, dateLabel: 'inizio', entries: [{ id: `recipe-${recipe.id}-start-entry`, type: 'aggiornamento', text: `Il punto di partenza: ${recipe.path[0]}. Obiettivo dichiarato e primo tentativo documentato.`, signals: { fire: 0, brick: 0, map: 0, zap: 0 } }] },
    ...criticalBlocks.map((block, index) => ({ id: `recipe-${recipe.id}-block-${index}`, person: recipe.author, initials: authorInitials, color: recipe.color, day: block.day, total: totalDays, dateLabel: 'blocco superato', entries: [{ id: `recipe-${recipe.id}-block-entry-${index}`, type: 'blocco', text: `${block.title}. ${block.text}`, signals: { fire: 0, brick: 0, map: 0, zap: 0 } }] })),
    { id: `recipe-${recipe.id}-finish`, person: recipe.author, initials: authorInitials, color: recipe.color, day: totalDays, total: totalDays, dateLabel: 'percorso concluso', entries: [{ id: `recipe-${recipe.id}-finish-entry`, type: 'completamento', text: `Percorso completato: ${recipe.path[recipe.path.length - 1]}. La documentazione è diventata questa ricetta.`, signals: { fire: 0, brick: 0, map: 0, zap: 0, vetta: 0 } }] },
  ]
  return (
    <Modal title={recipe.title} subtitle={`RICETTA DI ${recipe.author.toUpperCase()}`} onClose={onClose} wide>
      <div className="detail-hero" style={{ background: recipe.color }}><div className="detail-path">{recipe.path.map((step, i) => <span key={step}><i>{i + 1}</i>{step}</span>)}</div></div>
      <div className="recipe-proof-grid"><div><strong>{details.active}</strong><span>giorni attivi</span></div><div><strong>{details.streak}</strong><span>streak massima</span></div><div><strong>{recipe.success}</strong><span>arriva in fondo</span></div><div><strong>{recipe.clones}</strong><span>clonazioni</span></div></div>
      <div className="recipe-document">
        <section><span className="eyebrow">SOMMARIO DEL PERCORSO</span><h3>La strada, compresi i punti in cui si è fermata.</h3><p>Questa ricetta non promette un metodo perfetto: mostra {recipe.duration} di pratica reale, 2 blocchi documentati e il cambio di rotta che ha reso possibile arrivare in fondo.</p><div className="story-points">{recipe.path.map((point, index) => <span key={point}><i>0{index + 1}</i>{point}</span>)}</div></section>
        <section className="critical-section"><span className="eyebrow">BLOCCHI CRITICI · E COME SONO STATI SUPERATI</span><div className="critical-list">{criticalBlocks.map((block, index) => <button className={openBlock === index ? 'open' : ''} onClick={() => setOpenBlock(openBlock === index ? -1 : index)} key={block.day}><span className="critical-day">G{block.day}</span><span><strong>{block.title}</strong>{openBlock === index && <small>{block.text}</small>}</span><ChevronDown size={17} /></button>)}</div></section>
      </div>
      <section className="recipe-timeline-section"><span className="eyebrow">TIMELINE COMPLETA · BLOCCHI GIORNO X</span><h3>Dal primo tentativo al completamento.</h3><div className="recipe-timeline-list">{timelineBlocks.map(block => <DayBlockCard key={block.id} block={block} readOnly />)}</div></section>
      <div className="recipe-trust-note"><Check size={17} /><p><strong>Percorso temporalmente verificato</strong><span>Pubblicato in almeno 14 giorni distinti nell’arco di 21 giorni di calendario.</span></p></div>
      <div className="modal-actions"><button className="button secondary" onClick={() => showToast('Link della ricetta copiato')}><Share2 size={16} /> Condividi</button>{recipe.listing && <button className="button secondary" onClick={() => onViewMarket(recipe)}><ShoppingBag size={16} /> Vedi nel marketplace</button>}<button className="button primary" onClick={() => onGenerate(recipe, { origin: 'clone_gratuito' })}>Clona questa ricetta <ArrowRight size={17} /></button></div>
    </Modal>
  )
}

function ProductModal({ product, onClose, onGenerate, onViewRecipe }) {
  const listing = product.listing
  const [plan, setPlan] = useState(listing.premiumPrice ? 'premium' : 'base')
  const baseLabel = listing.type === 'consulenza' ? 'Consulenza' : listing.type === 'risorsa' ? 'Risorsa digitale' : 'Corso base'
  const baseDescription = listing.type === 'consulenza' ? listing.activationDetail : listing.type === 'risorsa' ? listing.activationDetail : 'Materiali + Quest personale'
  return (
    <Modal title={product.title} subtitle={listingTypeLabel(listing).toUpperCase()} onClose={onClose} wide>
      <div className="coach-line"><Avatar initials={listing.coach.split(' ').map(n => n[0]).join('')} color={product.color} /><div><strong>{listing.coach}</strong><span><Check size={13} /> {verificationLabel(product)}</span></div><span className="rating">★ {listing.rating}</span></div>
      <button className="origin-link" onClick={() => onViewRecipe(product)}><Library size={15} /> Vedi la ricetta originale · stesso percorso #{product.id}</button>
      <div className="purchase-grid"><div><span className="eyebrow">COSA OTTIENI</span><ul><li><Check size={16} /> Una Quest personale già strutturata</li><li><Check size={16} /> Materiali ed esercizi del coach</li><li><Check size={16} /> Tutti i blocchi Giorno X</li>{listing.hasPrivateRoom && <li><Check size={16} /> Stanza privata e domande al coach</li>}{listing.hasLiveSessions && <li><Check size={16} /> Sessioni live dichiarate</li>}</ul></div><div className="plans"><button className={plan === 'base' ? 'active' : ''} onClick={() => setPlan('base')}><span><strong>{baseLabel}</strong><small>{baseDescription}</small></span><b>€{listing.price}</b></button>{listing.premiumPrice && <button className={plan === 'premium' ? 'active' : ''} onClick={() => setPlan('premium')}><span><strong>Corso + stanza</strong><small>{listingStatusLabel(listing)} · {listing.activationDetail}</small></span><b>€{listing.premiumPrice}</b></button>}</div></div>
      <div className="modal-actions"><small>Pagamento protetto · rimborso automatico se la stanza non si attiva</small><button className="button primary" onClick={() => onGenerate(product, { origin: 'acquisto_marketplace', plan })}>Continua · €{plan === 'premium' ? listing.premiumPrice : listing.price} <ArrowRight size={17} /></button></div>
    </Modal>
  )
}

function SignalModal({ update, onClose, onChoose, credits }) {
  return (
    <Modal title="Manda un segnale" subtitle={`A ${update.person.toUpperCase()} · 1 CREDITO`} onClose={onClose}>
      <p className="signal-intro">Scegli cosa ti ha lasciato questo aggiornamento. I segnali non sono like: dicono qualcosa di preciso.</p>
      <div className="signal-options">{standardSignalTypes.map(({ id, label, help, icon: Icon, color }) => <button key={id} onClick={() => onChoose(id, label)}><span style={{ color }}><Icon size={20} /></span><p><strong>{label}</strong><small>{help}</small></p><ArrowRight size={17} /></button>)}</div>
      <p className="credit-note"><span className="credit-coin small">Q</span> Ti restano {credits} crediti</p>
    </Modal>
  )
}

function VettaModal({ entry, recipient, onClose, onConfirm }) {
  return (
    <Modal title="Celebra la Vetta" subtitle={`PERCORSO COMPLETATO · ${recipient.toUpperCase()}`} onClose={onClose}>
      <div className="vetta-modal-mark" aria-hidden="true">🏔</div>
      <p className="signal-intro">La Vetta esiste solo quando una Quest arriva fino in fondo. È un riconoscimento gratuito e non consuma crediti.</p>
      <div className="vetta-recap"><Trophy size={20} /><p><strong>Giorno conclusivo</strong><span>{entry.text}</span></p></div>
      <div className="modal-actions"><button className="button secondary" onClick={onClose}>Annulla</button><button className="button primary" onClick={onConfirm}>Manda una Vetta <span aria-hidden="true">🏔</span></button></div>
    </Modal>
  )
}

function NotificationsModal({ onClose }) {
  return (
    <Modal title="Notifiche" subtitle="ULTIME ATTIVITÀ" onClose={onClose}>
      <div className="notification-list"><div className="unread"><span className="notif-icon"><Zap size={17} /></span><p><strong>Marta ti ha mandato una Scossa</strong><small>sul tuo aggiornamento del Giorno 11 · 20 min fa</small></p></div><div><span className="notif-icon"><Users size={17} /></span><p><strong>4 persone hanno aggiornato nella stanza</strong><small>Basi della chitarra · 1 ora fa</small></p></div><div><span className="notif-icon"><Sparkles size={17} /></span><p><strong>La tua ricetta è stata clonata</strong><small>21 mattine senza telefono · ieri</small></p></div></div>
    </Modal>
  )
}

function Modal({ title, subtitle, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header><div>{subtitle && <span className="eyebrow">{subtitle}</span>}<h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Chiudi"><X size={21} /></button></header>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  )
}

export default function App() {
  const [activeView, setActiveView] = useState('today')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [credits, setCredits] = useState(84)
  const [menuOpen, setMenuOpen] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)
  const [generatedQuests, setGeneratedQuests] = useState([])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  const showToast = message => setToast(message)
  const navigate = view => { setActiveView(view); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const onSignal = (entry, id, label, recipient) => {
    const target = { ...entry, person: recipient || entry.person }
    if (id === 'vetta') return showToast('La Vetta si può inviare solo dal completamento della Quest')
    if (id === 'choose') return setModal({ type: 'signal', update: target })
    if (credits < 1) return showToast('Non hai abbastanza crediti per inviare un segnale')
    setCredits(value => value - 1)
    showToast(`${label} inviato a ${target.person}`)
  }
  const openVettaFlow = (entry, recipient) => {
    if (entry.type !== 'completamento') return showToast('La Vetta è disponibile solo al completamento')
    setModal({ type: 'vetta', entry, recipient })
  }
  const sendVetta = () => {
    const recipient = modal.recipient
    setModal(null)
    showToast(`Vetta inviata a ${recipient} · nessun credito consumato`)
  }
  const handleCheckIn = () => {
    if (checkedIn) return
    setCheckedIn(true)
    setCredits(value => value + 1)
    showToast('Presenza segnata per il Giorno 12 · +1 credito')
  }
  const handleGenerateQuest = (path, { origin, plan = 'base' }) => {
    const isMarketplace = origin === 'acquisto_marketplace'
    const reference = isMarketplace
      ? `Percorso iniziato dal ${path.listing.type === 'corso' ? 'corso' : path.listing.type} di ${path.listing.coach} — Marketplace`
      : `Ricetta clonata da ${path.author}`
    setGeneratedQuests(current => [{ id: `${path.id}-${Date.now()}`, pathId: path.id, title: path.title, category: path.category, color: path.color, reference, origin, plan }, ...current])
    setModal(null)
    showToast(isMarketplace ? `Acquisto completato: la Quest “${path.title}” è pronta` : `“${path.title}” è ora una tua Quest`)
  }

  const view = useMemo(() => {
    if (activeView === 'room') return <RoomView onUpdate={() => setModal({ type: 'composer' })} onSignal={onSignal} onSendVetta={openVettaFlow} showToast={showToast} />
    if (activeView === 'discover') return <DiscoverView onCreate={() => setModal({ type: 'create' })} showToast={showToast} onOpenRecipe={recipe => setModal({ type: 'recipe', recipe })} />
    if (activeView === 'recipes') return <RecipesView onOpen={recipe => setModal({ type: 'recipe', recipe })} />
    if (activeView === 'market') return <MarketView onOpen={product => setModal({ type: 'product', product })} />
    if (activeView === 'profile') return <ProfileView generatedQuests={generatedQuests} />
    return <TodayView onUpdate={() => setModal({ type: 'composer' })} onRoom={() => navigate('room')} onCheckIn={handleCheckIn} checkedIn={checkedIn} onSignal={onSignal} onSendVetta={openVettaFlow} credits={credits} onNotifications={() => setModal({ type: 'notifications' })} />
  }, [activeView, credits, checkedIn, generatedQuests])

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} setActiveView={navigate} onCreate={() => setModal({ type: 'create' })} onProfile={() => navigate('profile')} />
      <MobileTopbar setMenuOpen={setMenuOpen} onNotifications={() => setModal({ type: 'notifications' })} />
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}><div className="drawer-head"><Logo /><button className="icon-button" onClick={() => setMenuOpen(false)}><X /></button></div>{navigation.map(({ id, label, icon: Icon }) => <button className={activeView === id ? 'active' : ''} onClick={() => navigate(id)} key={id}><Icon size={19} />{label}</button>)}<button className={activeView === 'profile' ? 'active' : ''} onClick={() => navigate('profile')}><CircleUserRound size={19} />Profilo</button><button className="drawer-create" onClick={() => { setMenuOpen(false); setModal({ type: 'create' }) }}><Plus size={19} />Nuova Quest</button></div>
      {menuOpen && <button className="drawer-scrim" aria-label="Chiudi menu" onClick={() => setMenuOpen(false)} />}
      <div className="app-content">{view}</div>
      <MobileNav activeView={activeView} setActiveView={navigate} />

      {modal?.type === 'composer' && <ComposerModal onClose={() => setModal(null)} showToast={showToast} onPublish={() => { setModal(null); setCredits(v => v + 2); showToast('Passo pubblicato · +2 crediti') }} />}
      {modal?.type === 'create' && <CreateQuestModal onClose={() => setModal(null)} onCreated={() => { setModal(null); showToast('Quest creata: la tua stanza è pronta') }} />}
      {modal?.type === 'recipe' && <RecipeModal recipe={modal.recipe} onClose={() => setModal(null)} showToast={showToast} onGenerate={handleGenerateQuest} onViewMarket={path => setModal({ type: 'product', product: path })} />}
      {modal?.type === 'product' && <ProductModal product={modal.product} onClose={() => setModal(null)} onGenerate={handleGenerateQuest} onViewRecipe={path => setModal({ type: 'recipe', recipe: path })} />}
      {modal?.type === 'signal' && <SignalModal update={modal.update} credits={credits} onClose={() => setModal(null)} onChoose={(id, label) => { setModal(null); onSignal(modal.update, id, label, modal.update.person) }} />}
      {modal?.type === 'vetta' && <VettaModal entry={modal.entry} recipient={modal.recipient} onClose={() => setModal(null)} onConfirm={sendVetta} />}
      {modal?.type === 'notifications' && <NotificationsModal onClose={() => setModal(null)} />}
      {toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}
    </div>
  )
}
