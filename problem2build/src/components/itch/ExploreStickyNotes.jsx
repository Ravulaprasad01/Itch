const NOTES = [
  { label: 'A SMALL FRICTION', text: 'What takes longer than it should?', tone: 'butter' },
  { label: 'YOU’RE NOT ALONE', text: 'Someone else may relate.', tone: 'mint' },
  { label: 'WORTH A LOOK', text: 'Find problems people share.', tone: 'lilac' },
];

export default function ExploreStickyNotes() {
  return (
    <div className="explore-sticky-notes" aria-label="Everyday problem notes">
      {NOTES.map((note, index) => (
        <article key={note.label} className={`explore-sticky-note explore-sticky-note-${index + 1} explore-sticky-note-${note.tone}`}>
          <span>{note.label}</span>
          <strong>{note.text}</strong>
          <i aria-hidden="true" />
        </article>
      ))}
    </div>
  );
}
