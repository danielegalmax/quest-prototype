import React, { useEffect, useMemo, useState } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
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
import { dayBlocks, questsCompleted, roomCohorts, userQuests } from './data'

const navigation = [
  { id: 'today', label: 'Oggi', icon: Home },
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

const marketPaths = questsCompleted.filter(path => path.listing && path.authorVerifiedVia && path.publishedByCoach)

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
          <Icon size={20} /><span>{label}</span>
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

function ActiveQuest({ quest, onUpdate, onCheckIn, onOpenRoom, checkedIn }) {
  const progress = Math.round((quest.day / quest.total) * 100)
  return (
    <article className="active-quest-mini" style={{ '--quest-color': quest.color }}>
      <button className="active-quest-open" onClick={() => onOpenRoom(quest.id)} aria-label={`Apri la stanza ${quest.title}`}>
        <span className="active-quest-category">{quest.category}</span>
        <h3>{quest.title}</h3>
        <span>Giorno {quest.day} di {quest.total} · {quest.companions} compagni</span>
      </button>
      <div className="active-quest-progress"><span style={{ width: `${progress}%` }} /><small>{progress}%</small></div>
      <div className="active-quest-actions">
        <button onClick={() => onCheckIn(quest.id)} disabled={checkedIn}>{checkedIn ? <><Check size={14} /> Presenza segnata</> : 'Check-in +1'}</button>
        <button onClick={() => onUpdate(quest)}><Sparkles size={14} /> Racconta il passo</button>
      </div>
    </article>
  )
}

function ActiveQuestsWidget({ quests, onUpdate, onCheckIn, onOpenRoom, checkedInQuestIds }) {
  return (
    <section className="active-quests-widget" aria-label="Le tue Quest attive">
      <div className="active-quests-heading"><div><span className="eyebrow">OGGI NEI TUOI PERCORSI</span><h2>{quests.length === 1 ? 'Una strada, un passo alla volta.' : `${quests.length} strade, un passo alla volta.`}</h2></div><small>Scorri per vederle tutte →</small></div>
      <div className="active-quests-strip">
        {quests.map(quest => <ActiveQuest key={quest.id} quest={quest} onUpdate={onUpdate} onCheckIn={onCheckIn} onOpenRoom={onOpenRoom} checkedIn={checkedInQuestIds.includes(quest.id)} />)}
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

function DayBlockCard({ block, onSignal, onSendVetta, readOnly = false, mode = 'member', defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const additionalCount = block.entries.length - 1
  const visibleEntries = expanded ? block.entries : block.entries.slice(0, 1)
  return (
    <article className={`day-block-card ${expanded ? 'expanded' : ''} ${readOnly ? 'read-only' : ''} ${mode === 'viewer' ? 'viewer-block' : ''}`} data-day-block-id={block.id}>
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
        <div className="rail-title"><div><span className="eyebrow">I TUOI PERCORSI</span><h3>8 in cammino</h3></div><button>Vedi tutti</button></div>
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

function TodayView({ activeQuests, onUpdate, onOpenRoom, onCheckIn, checkedInQuestIds, onSignal, onSendVetta, credits, onNotifications }) {
  const [feedMode, setFeedMode] = useState('general')
  const [selectedCategory, setSelectedCategory] = useState('Musica')
  const visibleBlocks = dayBlocks.filter(block => {
    if (feedMode === 'category') return block.category === selectedCategory
    if (feedMode === 'companions') return block.entries.some(entry => entry.sharedRoomWith || entry.recipeClonedFrom)
    return true
  })
  return (
    <div className="dashboard-layout">
      <main className="main-column">
        <PageHeader eyebrow="LUNEDÌ 13 LUGLIO" title={<>Buongiorno, Andrea<span className="title-dot">.</span></>} description="I tuoi percorsi restano qui. Sotto, la piattaforma continua a muoversi." />
        <ActiveQuestsWidget quests={activeQuests} onUpdate={onUpdate} onCheckIn={onCheckIn} onOpenRoom={onOpenRoom} checkedInQuestIds={checkedInQuestIds} />
        <section className="global-feed-head">
          <div className="section-heading"><div><span className="eyebrow">DA QUEST, ADESSO</span><h2>Passi recenti</h2></div><span>{visibleBlocks.length} blocchi</span></div>
          <div className="feed-filter-row" role="tablist" aria-label="Filtra il feed"><button className={feedMode === 'general' ? 'active' : ''} onClick={() => setFeedMode('general')}>Generale</button><button className={feedMode === 'category' ? 'active' : ''} onClick={() => setFeedMode('category')}>Per categoria</button><button className={feedMode === 'companions' ? 'active' : ''} onClick={() => setFeedMode('companions')}>Compagni di percorso</button></div>
          {feedMode === 'category' && <label className="feed-category-filter"><span>Categoria</span><select value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)}>{categories.map(category => <option key={category.name}>{category.name}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></label>}
        </section>
        <div className="feed-list">
          {visibleBlocks.map(block => <DayBlockCard block={block} mode="viewer" onSignal={onSignal} onSendVetta={onSendVetta} key={block.id} />)}
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

function RoomView({ questId, roomId, mode = 'member', availableQuests, onUpdate, onCheckIn, checkedIn, onCreateForCategory, onSignal, onSendVetta, showToast }) {
  const [phase, setPhase] = useState('25–50%')
  const memberQuest = availableQuests.find(quest => quest.id === questId)
  const cohort = roomCohorts.find(room => room.id === (mode === 'viewer' ? roomId : memberQuest?.roomId))
  const room = mode === 'viewer' ? cohort : memberQuest ? { ...cohort, ...memberQuest, members: memberQuest.companions } : null
  if (!room) return <main className="content-page"><div className="search-empty"><Compass size={22} /><p><strong>Questa stanza non è disponibile.</strong><span>Torna a Scopri e scegli un percorso attivo.</span></p></div></main>
  const roomBlocks = dayBlocks.filter(block => block.category === room.category)
  const visibleDayBlocks = roomBlocks.filter(block => {
    const progress = block.day / block.total
    if (phase === 'Primi 25%') return progress <= .25
    if (phase === '25–50%') return progress > .25 && progress <= .5
    return progress > .5
  })
  const progress = Math.round((room.day / room.total) * 100)
  const memberActions = room.status === 'active' ? <div className="room-member-actions"><button className="button secondary" onClick={() => onCheckIn(room.id)} disabled={checkedIn}>{checkedIn ? <><Check size={16} /> Presenza segnata</> : 'Check-in +1'}</button><button className="button primary" onClick={() => onUpdate(room)}><Plus size={17} /> Aggiorna il giorno {room.day}</button></div> : <span className={`room-status ${room.status}`}>{room.status === 'paused' ? 'Quest in pausa' : 'Quest completata'}</span>
  return (
    <main className="content-page room-page">
      <PageHeader
        eyebrow={`STANZA ${mode === 'viewer' ? 'DA ESPLORARE' : 'DEL TUO PERCORSO'} · ${room.category.toUpperCase()}`}
        title={room.title}
        description="Persone diverse, lo stesso tratto di strada. Nessuna classifica."
        action={mode === 'viewer' ? <button className="button primary" onClick={() => onCreateForCategory(room.category)}><Plus size={17} /> Inizia il tuo percorso in questa categoria</button> : memberActions}
      />
      <section className="room-overview">
        <div className="room-progress"><ProgressRing value={progress}><strong>{room.day}</strong></ProgressRing><div><span>{mode === 'viewer' ? 'Fase della stanza' : 'Il tuo percorso'}</span><strong>{room.day} giorni su {room.total}</strong><small>{mode === 'viewer' ? room.startedLabel : `Prossimo punto: ${room.nextStep}`}</small></div></div>
        <div className="room-stat"><span>Persone attive</span><strong>{room.members}</strong><small>{roomBlocks.length} hanno aggiornato di recente</small></div>
        <div className="room-stat"><span>Ritmo della stanza</span><strong>1,6 gg</strong><small>tra un passo e l’altro</small></div>
        <div className="room-people">{roomBlocks.slice(0, 4).map(block => <Avatar key={block.id} initials={block.initials} color={block.color} />)}<span>+{Math.max(1, room.members - roomBlocks.length)}</span></div>
      </section>
      <div className="filter-row">
        <div className="segmented"><button className="active">Aggiornamenti</button><button>Persone</button></div>
        <label className="phase-filter"><span>Fase del percorso</span><select value={phase} onChange={event => setPhase(event.target.value)}><option>Primi 25%</option><option>25–50%</option><option>Oltre il 50%</option></select><ChevronDown size={15} aria-hidden="true" /></label>
      </div>
      <div className="room-feed">
        <div className="day-divider"><span>OGGI</span></div>
        {visibleDayBlocks.length > 0 ? <>
          {visibleDayBlocks.slice(0, 2).map(block => <DayBlockCard block={block} mode={mode} onSignal={onSignal} onSendVetta={onSendVetta} key={block.id} />)}
          <MatchedHelpCard showToast={showToast} />
          {visibleDayBlocks.slice(2).map(block => <DayBlockCard block={block} mode={mode} onSignal={onSignal} onSendVetta={onSendVetta} key={block.id} />)}
        </> : <div className="phase-empty"><Users size={20} /><p><strong>Nessun aggiornamento in questa fase, oggi.</strong><span>Puoi esplorare un’altra fascia senza perdere il tuo punto nel percorso.</span></p></div>}
      </div>
    </main>
  )
}

function DiscoverView({ onCreate, onOpenRecipe, onOpenProduct, onOpenRoom }) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const searchItems = questsCompleted.map(item => ({ ...item, hasPublishedListing: Boolean(item.listing && item.publishedByCoach && item.authorVerifiedVia), kind: item.listing && item.publishedByCoach ? 'Versione guidata' : 'Ricetta', keywords: `${item.title} ${item.category} ${item.author} ${item.path.join(' ')} ${item.listing ? `${item.listing.type} ${item.listing.coach} ${item.listing.level}` : ''}` }))
  const results = normalizedQuery ? searchItems.filter(item => item.keywords.toLowerCase().includes(normalizedQuery)) : []
  return (
    <main className="content-page discover-page">
      <PageHeader eyebrow="TROVA IL TUO PROSSIMO PASSO" title={<>Cosa vuoi <em>imparare?</em></>} description="Cerca un percorso, una stanza attiva o un blocco già superato." />
      <label className="big-search"><Search size={21} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cerca un obiettivo, una categoria o un blocco…" /><kbd>⌘ K</kbd></label>
      {normalizedQuery && (
        <section className="search-result-section">
          <div className="section-heading"><div><span className="eyebrow">RISULTATI PER “{query.toUpperCase()}”</span><h2>{results.length ? `${results.length} percorsi trovati` : 'Nessun percorso trovato'}</h2></div></div>
          {results.length > 0 ? <div className="search-result-list">{results.map(item => (
            <button key={item.id} onClick={() => item.hasPublishedListing ? onOpenProduct(item) : onOpenRecipe(item)}>
              <span className="result-icon" style={{ background: item.color }}>{item.hasPublishedListing ? <BookOpen size={18} /> : <Library size={18} />}</span>
              <span><small>{item.kind} · {item.category}</small><strong>{item.title}</strong><em>{item.hasPublishedListing ? `${item.listing.coach} · da €${item.listing.price}` : `${item.success} di completamento · ${item.duration}`}</em></span>
              <ArrowRight size={18} />
            </button>
          ))}</div> : <div className="search-empty"><Search size={22} /><p><strong>Prova con un obiettivo più concreto.</strong><span>Per esempio “chitarra”, “correre” o “telefono”.</span></p></div>}
        </section>
      )}
      <section className="all-rooms-section">
        <div className="section-heading"><div><span className="eyebrow">STANZE APERTE ADESSO</span><h2>Tutte le stanze</h2></div><span>Entra come spettatore</span></div>
        <div className="room-category-list">
          {categories.map(category => {
            const rooms = roomCohorts.filter(room => room.category === category.name)
            return <section className="room-category-group" key={category.name}><header><span className="category-icon small" style={{ background: category.color }}>{category.icon}</span><div><h3>{category.name}</h3><small>{rooms.length} {rooms.length === 1 ? 'stanza attiva' : 'stanze attive'}</small></div></header><div>{rooms.map(room => <button className="cohort-row" key={room.id} onClick={() => onOpenRoom(room.id)}><span><strong>{room.title}</strong><small>{room.startedLabel} · {room.members} persone</small></span><span className="cohort-progress">G{room.day}/{room.total}</span><ArrowRight size={17} /></button>)}</div></section>
          })}
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

function ProfileView({ quests, onOpenQuest }) {
  const [statusFilter, setStatusFilter] = useState('active')
  const filteredQuests = quests.filter(quest => quest.status === statusFilter)
  const statusLabels = { active: 'Attiva', paused: 'In pausa', completed: 'Completata' }
  return (
    <main className="content-page profile-page">
      <section className="profile-hero">
        <div className="profile-intro"><Avatar initials="AL" color="#ffcfbd" size="xl" /><div><span className="eyebrow">IL TUO PERCORSO</span><h1>Andrea L.</h1><p>Sto imparando a essere costante, non perfetto.</p><div className="profile-badges"><span><Check size={14} /> Percorso verificato</span><span><Flame size={14} /> Costante</span></div></div></div>
        <button className="button secondary"><Settings size={17} /> Modifica profilo</button>
      </section>
      <section className="profile-stats">
        <div><strong>47</strong><span>giorni attivi</span></div><div><strong>{quests.filter(quest => quest.status === 'active').length}</strong><span>Quest attive</span></div><div><strong>{quests.filter(quest => quest.status === 'completed').length}</strong><span>Quest completate</span></div><div><strong>126</strong><span>persone aiutate</span></div>
      </section>
      <section className="my-paths-section">
        <div className="section-heading"><div><span className="eyebrow">TUTTA LA TUA STORIA</span><h2>I miei percorsi</h2></div><span>{quests.length} Quest</span></div>
        <div className="path-status-filters">{Object.entries(statusLabels).map(([status, label]) => <button className={statusFilter === status ? 'active' : ''} onClick={() => setStatusFilter(status)} key={status}>{label}<span>{quests.filter(quest => quest.status === status).length}</span></button>)}</div>
        <div className="profile-path-list">{filteredQuests.map(quest => {
          const progress = Math.round((quest.day / quest.total) * 100)
          return <button className="profile-path-row" onClick={() => onOpenQuest(quest.id)} key={quest.id}><span className="profile-quest-icon" style={{ background: quest.color }}>{quest.origin === 'acquisto_marketplace' ? <ShoppingBag size={19} /> : quest.status === 'completed' ? <Trophy size={19} /> : <Target size={19} />}</span><span className="profile-path-copy"><small>{quest.category} · {statusLabels[quest.status]}</small><strong>{quest.title}</strong><em>{quest.reference || `Giorno ${quest.day} di ${quest.total} · ${quest.nextStep}`}</em><span className="linear-progress"><span style={{ width: `${progress}%` }} /></span></span><span className="profile-path-progress">{progress}%</span><ArrowRight size={18} /></button>
        })}</div>
      </section>
    </main>
  )
}

function ComposerModal({ quest, onClose, onPublish, showToast }) {
  const [text, setText] = useState('')
  const [type, setType] = useState('aggiornamento')
  return (
    <Modal title={`Aggiorna il giorno ${quest?.day || 1}`} subtitle={quest?.title || 'La tua Quest'} onClose={onClose} wide>
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

function CreateQuestModal({ onClose, onCreated, initialCategory = 'Musica' }) {
  const suggestedDurations = { Musica: 30, Benessere: 21, Movimento: 45, Cucina: 60, Lettura: 30, Creatività: 30 }
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState(initialCategory)
  const [duration, setDuration] = useState(suggestedDurations[initialCategory] || 30)
  const [start, setStart] = useState('Oggi')
  const [objective, setObjective] = useState(initialCategory === 'Musica' ? 'Imparare le basi della chitarra' : `Il mio percorso di ${initialCategory.toLowerCase()}`)
  const [firstUpdate, setFirstUpdate] = useState('')
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

function RecipePage({ recipe, onBack, onGenerate, onViewMarket, showToast }) {
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
    <main className="content-page detail-page recipe-detail-page">
      <nav className="detail-breadcrumb" aria-label="Breadcrumb"><button onClick={onBack}>Ricette</button><ChevronRight size={14} /><span>{recipe.category}</span><ChevronRight size={14} /><strong>{recipe.title}</strong></nav>
      <header className="detail-page-header"><div><span className="eyebrow">RICETTA DI {recipe.author.toUpperCase()}</span><h1>{recipe.title}</h1><p>Una timeline reale, clonabile gratuitamente e senza promesse di perfezione.</p></div><button className="button secondary" onClick={onBack}><ArrowLeft size={17} /> Indietro</button></header>
      <div className="detail-hero" style={{ background: recipe.color }}><div className="detail-path">{recipe.path.map((step, i) => <span key={step}><i>{i + 1}</i>{step}</span>)}</div></div>
      <div className="recipe-proof-grid"><div><strong>{details.active}</strong><span>giorni attivi</span></div><div><strong>{details.streak}</strong><span>streak massima</span></div><div><strong>{recipe.success}</strong><span>arriva in fondo</span></div><div><strong>{recipe.clones}</strong><span>clonazioni</span></div></div>
      <div className="recipe-document">
        <section><span className="eyebrow">SOMMARIO DEL PERCORSO</span><h3>La strada, compresi i punti in cui si è fermata.</h3><p>Questa ricetta non promette un metodo perfetto: mostra {recipe.duration} di pratica reale, 2 blocchi documentati e il cambio di rotta che ha reso possibile arrivare in fondo.</p><div className="story-points">{recipe.path.map((point, index) => <span key={point}><i>0{index + 1}</i>{point}</span>)}</div></section>
        <section className="critical-section"><span className="eyebrow">BLOCCHI CRITICI · E COME SONO STATI SUPERATI</span><div className="critical-list">{criticalBlocks.map((block, index) => <button className={openBlock === index ? 'open' : ''} onClick={() => setOpenBlock(openBlock === index ? -1 : index)} key={block.day}><span className="critical-day">G{block.day}</span><span><strong>{block.title}</strong>{openBlock === index && <small>{block.text}</small>}</span><ChevronDown size={17} /></button>)}</div></section>
      </div>
      <section className="recipe-timeline-section"><span className="eyebrow">TIMELINE COMPLETA · BLOCCHI GIORNO X</span><h3>Dal primo tentativo al completamento.</h3><div className="recipe-timeline-list">{timelineBlocks.map(block => <DayBlockCard key={block.id} block={block} readOnly />)}</div></section>
      <div className="recipe-trust-note"><Check size={17} /><p><strong>Percorso temporalmente verificato</strong><span>Pubblicato in almeno 14 giorni distinti nell’arco di 21 giorni di calendario.</span></p></div>
      {recipe.listing && recipe.authorVerifiedVia && recipe.publishedByCoach && <aside className="guided-upgrade"><span className="guided-upgrade-icon"><Crown size={21} /></span><div><span className="eyebrow">VERSIONE GUIDATA, FACOLTATIVA</span><h3>{recipe.listing.coach} offre anche una versione guidata.</h3><p>{recipe.listing.type === 'risorsa' ? 'Dispense extra e checklist curate' : recipe.listing.type === 'consulenza' ? 'Accesso diretto e revisione personale' : 'Dispense extra, canale domande e presenza del coach'} — da €{recipe.listing.price}.</p></div><button className="button secondary" onClick={() => onViewMarket(recipe)}>Scopri cosa aggiunge <ArrowRight size={16} /></button></aside>}
      <div className="detail-page-actions"><button className="button secondary" onClick={() => showToast('Link della ricetta copiato')}><Share2 size={16} /> Condividi</button><button className="button primary" onClick={() => onGenerate(recipe, { origin: 'clone_gratuito' })}>Clona questa ricetta <ArrowRight size={17} /></button></div>
    </main>
  )
}

function ProductPage({ product, onBack, onGenerate, onViewRecipe }) {
  const listing = product.listing
  const [plan, setPlan] = useState(listing.premiumPrice ? 'premium' : 'base')
  const baseLabel = listing.type === 'consulenza' ? 'Consulenza' : listing.type === 'risorsa' ? 'Risorsa digitale' : 'Corso base'
  const baseDescription = listing.type === 'consulenza' ? listing.activationDetail : listing.type === 'risorsa' ? listing.activationDetail : 'Dispense ed esercizi creati dal coach'
  const extraBenefits = listing.type === 'risorsa'
    ? ['Dispense originali curate dall’autore', 'Checklist operative non incluse nel clone', 'Aggiornamenti futuri della risorsa']
    : listing.type === 'consulenza'
      ? ['Revisione personale del tuo percorso', 'Accesso diretto al coach per 45 minuti', 'Indicazioni scritte dopo la sessione']
      : ['Dispense ed esercizi scritti apposta dal coach', 'Canale domande dedicato con risposte del coach', ...(listing.hasPrivateRoom ? ['Stanza privata con presenza attiva del coach'] : []), ...(listing.hasLiveSessions ? ['Sessioni live dichiarate nel calendario'] : [])]
  return (
    <main className="content-page detail-page product-detail-page">
      <nav className="detail-breadcrumb" aria-label="Breadcrumb"><button onClick={onBack}>Marketplace</button><ChevronRight size={14} /><span>{product.category}</span><ChevronRight size={14} /><strong>{product.title}</strong></nav>
      <header className="detail-page-header"><div><span className="eyebrow">{listingTypeLabel(listing).toUpperCase()}</span><h1>{product.title}</h1><p>Una versione guidata che aggiunge il lavoro diretto del coach al clone gratuito.</p></div><button className="button secondary" onClick={onBack}><ArrowLeft size={17} /> Indietro</button></header>
      <div className="coach-line"><Avatar initials={listing.coach.split(' ').map(n => n[0]).join('')} color={product.color} /><div><strong>{listing.coach}</strong><span><Check size={13} /> {verificationLabel(product)}</span></div><span className="rating">★ {listing.rating}</span></div>
      <button className="origin-link" onClick={() => onViewRecipe(product)}><Library size={15} /> Vedi la ricetta originale · stesso percorso #{product.id}</button>
      <div className="purchase-grid"><div><span className="eyebrow">COSA AGGIUNGE AL CLONE GRATUITO</span><ul>{extraBenefits.map(benefit => <li key={benefit}><Check size={16} /> {benefit}</li>)}</ul></div><div className="plans"><button className={plan === 'base' ? 'active' : ''} onClick={() => setPlan('base')}><span><strong>{baseLabel}</strong><small>{baseDescription}</small></span><b>€{listing.price}</b></button>{listing.premiumPrice && <button className={plan === 'premium' ? 'active' : ''} onClick={() => setPlan('premium')}><span><strong>Corso + stanza</strong><small>{listingStatusLabel(listing)} · {listing.activationDetail}</small></span><b>€{listing.premiumPrice}</b></button>}</div></div>
      <div className="detail-page-actions"><small>Pagamento protetto · rimborso automatico se la stanza non si attiva</small><button className="button primary" onClick={() => onGenerate(product, { origin: 'acquisto_marketplace', plan })}>Continua · €{plan === 'premium' ? listing.premiumPrice : listing.price} <ArrowRight size={17} /></button></div>
    </main>
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
  const routerNavigate = useNavigate()
  const recipeMatch = useMatch('/ricetta/:id')
  const productMatch = useMatch('/corso/:id')
  const [activeView, setActiveView] = useState('today')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [credits, setCredits] = useState(84)
  const [menuOpen, setMenuOpen] = useState(false)
  const [checkedInQuestIds, setCheckedInQuestIds] = useState([])
  const [selectedRoom, setSelectedRoom] = useState({ mode: 'member', questId: 'quest-guitar', roomId: null })
  const [generatedQuests, setGeneratedQuests] = useState([])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  const showToast = message => setToast(message)
  const navigate = view => { routerNavigate('/'); setActiveView(view); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openMemberRoom = questId => { routerNavigate('/'); setSelectedRoom({ mode: 'member', questId, roomId: null }); setActiveView('room'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openViewerRoom = roomId => { routerNavigate('/'); setSelectedRoom({ mode: 'viewer', questId: null, roomId }); setActiveView('room'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openRecipe = recipe => { routerNavigate(`/ricetta/${recipe.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openProduct = product => { routerNavigate(`/corso/${product.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }
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
  const handleCheckIn = questId => {
    if (checkedInQuestIds.includes(questId)) return
    const quest = [...userQuests, ...generatedQuests].find(item => item.id === questId)
    setCheckedInQuestIds(current => [...current, questId])
    setCredits(value => value + 1)
    showToast(`Presenza segnata per ${quest?.title || 'la Quest'} · +1 credito`)
  }
  const handleGenerateQuest = (path, { origin, plan = 'base' }) => {
    const isMarketplace = origin === 'acquisto_marketplace'
    const reference = isMarketplace
      ? `Percorso iniziato dal ${path.listing.type === 'corso' ? 'corso' : path.listing.type} di ${path.listing.coach} — Marketplace`
      : `Ricetta clonata da ${path.author}`
    setGeneratedQuests(current => [{ id: `generated-${path.id}-${Date.now()}`, pathId: path.id, roomId: null, title: path.title, category: path.category, color: path.color, day: 1, total: Number.parseInt(path.duration, 10), status: 'active', companions: 1, nextStep: 'Primo aggiornamento', reference, origin, plan }, ...current])
    setModal(null)
    showToast(isMarketplace ? `Acquisto completato: la Quest “${path.title}” è pronta` : `“${path.title}” è ora una tua Quest`)
  }

  const allUserQuests = [...userQuests, ...generatedQuests]
  const activeQuests = allUserQuests.filter(quest => quest.status === 'active')
  const routeRecipe = recipeMatch ? questsCompleted.find(recipe => String(recipe.id) === recipeMatch.params.id) : null
  const routeProduct = productMatch ? marketPaths.find(product => String(product.id) === productMatch.params.id) : null

  let view
  if (recipeMatch) view = routeRecipe ? <RecipePage recipe={routeRecipe} onBack={() => routerNavigate(-1)} showToast={showToast} onGenerate={handleGenerateQuest} onViewMarket={openProduct} /> : <main className="content-page"><div className="search-empty"><Library size={22} /><p><strong>Ricetta non trovata.</strong><span>Controlla il link o torna alla libreria.</span></p></div></main>
  else if (productMatch) view = routeProduct ? <ProductPage product={routeProduct} onBack={() => routerNavigate(-1)} onGenerate={handleGenerateQuest} onViewRecipe={openRecipe} /> : <main className="content-page"><div className="search-empty"><ShoppingBag size={22} /><p><strong>Versione guidata non disponibile.</strong><span>Questa ricetta non è stata pubblicata dal coach nel Marketplace.</span></p></div></main>
  else if (activeView === 'room') view = <RoomView {...selectedRoom} availableQuests={allUserQuests} onUpdate={quest => setModal({ type: 'composer', quest })} onCheckIn={handleCheckIn} checkedIn={selectedRoom.questId ? checkedInQuestIds.includes(selectedRoom.questId) : false} onCreateForCategory={category => setModal({ type: 'create', initialCategory: category })} onSignal={onSignal} onSendVetta={openVettaFlow} showToast={showToast} />
  else if (activeView === 'discover') view = <DiscoverView onCreate={() => setModal({ type: 'create' })} onOpenRecipe={openRecipe} onOpenProduct={openProduct} onOpenRoom={openViewerRoom} />
  else if (activeView === 'recipes') view = <RecipesView onOpen={openRecipe} />
  else if (activeView === 'market') view = <MarketView onOpen={openProduct} />
  else if (activeView === 'profile') view = <ProfileView quests={allUserQuests} onOpenQuest={openMemberRoom} />
  else view = <TodayView activeQuests={activeQuests} onUpdate={quest => setModal({ type: 'composer', quest })} onOpenRoom={openMemberRoom} onCheckIn={handleCheckIn} checkedInQuestIds={checkedInQuestIds} onSignal={onSignal} onSendVetta={openVettaFlow} credits={credits} onNotifications={() => setModal({ type: 'notifications' })} />

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} setActiveView={navigate} onCreate={() => setModal({ type: 'create' })} onProfile={() => navigate('profile')} />
      <MobileTopbar setMenuOpen={setMenuOpen} onNotifications={() => setModal({ type: 'notifications' })} />
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}><div className="drawer-head"><Logo /><button className="icon-button" onClick={() => setMenuOpen(false)}><X /></button></div>{navigation.map(({ id, label, icon: Icon }) => <button className={activeView === id ? 'active' : ''} onClick={() => navigate(id)} key={id}><Icon size={19} />{label}</button>)}<button className={activeView === 'profile' ? 'active' : ''} onClick={() => navigate('profile')}><CircleUserRound size={19} />Profilo</button><button className="drawer-create" onClick={() => { setMenuOpen(false); setModal({ type: 'create' }) }}><Plus size={19} />Nuova Quest</button></div>
      {menuOpen && <button className="drawer-scrim" aria-label="Chiudi menu" onClick={() => setMenuOpen(false)} />}
      <div className="app-content">{view}</div>
      <MobileNav activeView={activeView} setActiveView={navigate} />

      {modal?.type === 'composer' && <ComposerModal quest={modal.quest} onClose={() => setModal(null)} showToast={showToast} onPublish={() => { setModal(null); setCredits(v => v + 2); showToast('Passo pubblicato · +2 crediti') }} />}
      {modal?.type === 'create' && <CreateQuestModal initialCategory={modal.initialCategory} onClose={() => setModal(null)} onCreated={() => { setModal(null); showToast('Quest creata: la tua stanza è pronta') }} />}
      {modal?.type === 'signal' && <SignalModal update={modal.update} credits={credits} onClose={() => setModal(null)} onChoose={(id, label) => { setModal(null); onSignal(modal.update, id, label, modal.update.person) }} />}
      {modal?.type === 'vetta' && <VettaModal entry={modal.entry} recipient={modal.recipient} onClose={() => setModal(null)} onConfirm={sendVetta} />}
      {modal?.type === 'notifications' && <NotificationsModal onClose={() => setModal(null)} />}
      {toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}
    </div>
  )
}
