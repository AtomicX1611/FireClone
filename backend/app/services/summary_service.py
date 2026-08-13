from typing import Optional
from sqlalchemy.orm import Session

from app.models.meeting import Meeting
from app.models.meeting_summary import MeetingSummary
from app.models.transcript_segment import TranscriptSegment
from app import schemas
from app.config import settings


def get_summary(db: Session, meeting_id: int) -> Optional[MeetingSummary]:
    return db.query(MeetingSummary).filter(MeetingSummary.meeting_id == meeting_id).first()


def create_or_update_summary(
    db: Session, meeting_id: int, payload: schemas.MeetingSummaryCreate
) -> Optional[MeetingSummary]:
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return None

    existing = db.query(MeetingSummary).filter(MeetingSummary.meeting_id == meeting_id).first()

    chapters = [c.model_dump() for c in payload.chapters]

    if existing:
        existing.overview = payload.overview
        existing.key_topics = payload.key_topics
        existing.chapters = chapters
        db.commit()
        db.refresh(existing)
        return existing

    summary = MeetingSummary(
        meeting_id=meeting_id,
        overview=payload.overview,
        key_topics=payload.key_topics,
        chapters=chapters,
    )
    db.add(summary)
    db.commit()
    db.refresh(summary)
    return summary


def generate_summary(db: Session, meeting_id: int) -> Optional[MeetingSummary]:
    """
    Generate or regenerate a summary from transcript segments.
    Uses OpenAI if OPENAI_API_KEY is configured, otherwise returns a mock summary.
    """
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return None

    segments = (
        db.query(TranscriptSegment)
        .filter(TranscriptSegment.meeting_id == meeting_id)
        .order_by(TranscriptSegment.sequence)
        .all()
    )
    if not segments:
        return None

    if settings.OPENAI_API_KEY:
        summary_data = _generate_with_openai(meeting.title, segments)
    else:
        summary_data = _generate_mock(meeting.title, segments)

    payload = schemas.MeetingSummaryCreate(**summary_data)
    return create_or_update_summary(db, meeting_id, payload)


def _generate_mock(title: str, segments) -> dict:
    """Generate a simple rule-based mock summary from transcript segments."""
    speakers = list({s.speaker_name for s in segments})
    total_words = sum(len(s.text.split()) for s in segments)

    # Extract key sentences (first sentence of every 4th segment)
    key_sentences = []
    for i, seg in enumerate(segments):
        if i % 4 == 0:
            first_sentence = seg.text.split(".")[0] + "."
            key_sentences.append(first_sentence)

    overview = (
        f"This meeting, titled '{title}', included {len(speakers)} participant(s): "
        f"{', '.join(speakers)}. "
        f"Approximately {total_words} words were spoken across {len(segments)} exchanges. "
        f"Key discussion points included: {' '.join(key_sentences[:3])}"
    )

    # Build chapters from segment groups
    chapters = []
    chapter_size = max(1, len(segments) // 4)
    for i in range(0, len(segments), chapter_size):
        chunk = segments[i : i + chapter_size]
        chapter_title = chunk[0].text[:40].rstrip() + "…" if chunk else f"Chapter {i // chapter_size + 1}"
        chapters.append(
            {
                "title": chapter_title,
                "start_time": chunk[0].start_time if chunk else 0,
                "summary": " ".join(s.text for s in chunk[:2])[:200] + "…",
            }
        )

    # Topics: unique words appearing frequently (simple heuristic)
    all_text = " ".join(s.text for s in segments).lower()
    stop_words = {"the", "a", "an", "is", "in", "on", "at", "to", "and", "or", "of", "we", "i", "you", "it", "that", "this", "was", "are", "for", "with", "be", "have", "has", "had", "will", "so", "do", "did", "not", "by"}
    words = [w.strip(".,!?;:'\"()") for w in all_text.split() if len(w) > 4]
    freq = {}
    for w in words:
        if w not in stop_words:
            freq[w] = freq.get(w, 0) + 1
    top_topics = sorted(freq, key=freq.get, reverse=True)[:6]

    return {
        "overview": overview,
        "key_topics": [t.capitalize() for t in top_topics],
        "chapters": chapters[:4],
    }


def _generate_with_openai(title: str, segments) -> dict:
    """Generate summary using OpenAI Chat API (requires OPENAI_API_KEY)."""
    try:
        from openai import OpenAI

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        transcript_text = "\n".join(
            f"[{s.start_time:.0f}s] {s.speaker_name}: {s.text}" for s in segments
        )
        prompt = f"""You are a meeting intelligence assistant like Fireflies.ai.
Analyze this meeting transcript and return a JSON object with:
- overview: a 2-3 sentence summary paragraph
- key_topics: an array of 5-6 short topic strings
- chapters: an array of up to 4 chapters, each with title, start_time (float), and summary (1-2 sentences)

Meeting title: {title}
Transcript:
{transcript_text[:6000]}

Return only valid JSON, no markdown fences."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        import json
        return json.loads(response.choices[0].message.content)
    except Exception:
        return _generate_mock(title, segments)
