import re
import json
from typing import List, Optional
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.meeting import Meeting
from app.models.transcript_segment import TranscriptSegment
from app import schemas


def get_transcript(db: Session, meeting_id: int) -> Optional[List[TranscriptSegment]]:
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return None
    return (
        db.query(TranscriptSegment)
        .filter(TranscriptSegment.meeting_id == meeting_id)
        .order_by(TranscriptSegment.sequence)
        .all()
    )


async def upload_transcript(
    db: Session, meeting_id: int, file: UploadFile
) -> Optional[List[TranscriptSegment]]:
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return None

    content = await file.read()
    text = content.decode("utf-8", errors="replace")
    filename = file.filename or ""

    # Parse based on file extension
    if filename.endswith(".vtt"):
        segments = _parse_vtt(text)
    elif filename.endswith(".json"):
        segments = _parse_json(text)
    else:
        # Plain text — each paragraph becomes one segment
        segments = _parse_plain_text(text)

    # Clear existing transcript
    db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == meeting_id).delete()

    # Build color map for speakers
    speaker_colors = {}
    palette = ["#6C47FF", "#FF6B6B", "#4ECDC4", "#FFE66D", "#A8E6CF", "#FF8B94"]
    color_index = 0

    new_segments = []
    for i, seg in enumerate(segments):
        speaker = seg.get("speaker", "Speaker")
        if speaker not in speaker_colors:
            speaker_colors[speaker] = palette[color_index % len(palette)]
            color_index += 1

        ts = TranscriptSegment(
            meeting_id=meeting_id,
            speaker_name=speaker,
            speaker_color=speaker_colors[speaker],
            start_time=seg.get("start", i * 10.0),
            end_time=seg.get("end", i * 10.0 + 8.0),
            text=seg.get("text", ""),
            sequence=i,
        )
        db.add(ts)
        new_segments.append(ts)

    db.commit()
    for ts in new_segments:
        db.refresh(ts)
    return new_segments


def search_transcript(
    db: Session, meeting_id: int, q: str
) -> Optional[List[schemas.TranscriptSearchResult]]:
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        return None

    segments = (
        db.query(TranscriptSegment)
        .filter(
            TranscriptSegment.meeting_id == meeting_id,
            TranscriptSegment.text.ilike(f"%{q}%"),
        )
        .order_by(TranscriptSegment.sequence)
        .all()
    )

    results = []
    for seg in segments:
        # Build highlight snippet
        pattern = re.compile(re.escape(q), re.IGNORECASE)
        highlight = pattern.sub(lambda m: f"<mark>{m.group()}</mark>", seg.text)
        results.append(
            schemas.TranscriptSearchResult(
                segment_id=seg.id,
                speaker_name=seg.speaker_name,
                speaker_color=seg.speaker_color,
                start_time=seg.start_time,
                text=seg.text,
                sequence=seg.sequence,
                highlight=highlight,
            )
        )
    return results


# ─── Parsers ────────────────────────────────────────────────────────────────────

def _parse_vtt(text: str) -> List[dict]:
    """Parse WebVTT format."""
    segments = []
    # Remove WEBVTT header
    lines = text.strip().splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        # Match timestamp line: 00:00:00.000 --> 00:00:05.000
        ts_match = re.match(
            r"(\d+:\d+:\d+[\.,]\d+)\s*-->\s*(\d+:\d+:\d+[\.,]\d+)", line
        )
        if ts_match:
            start = _vtt_time_to_seconds(ts_match.group(1))
            end = _vtt_time_to_seconds(ts_match.group(2))
            i += 1
            text_lines = []
            while i < len(lines) and lines[i].strip():
                text_lines.append(lines[i].strip())
                i += 1
            combined = " ".join(text_lines)
            # Check for speaker tag: <v Speaker Name>text
            speaker_match = re.match(r"<v\s+([^>]+)>(.*)", combined)
            if speaker_match:
                speaker = speaker_match.group(1)
                text_content = speaker_match.group(2)
            else:
                speaker = "Speaker"
                text_content = combined
            segments.append({"speaker": speaker, "start": start, "end": end, "text": text_content.strip()})
        i += 1
    return segments


def _vtt_time_to_seconds(ts: str) -> float:
    ts = ts.replace(",", ".")
    parts = ts.split(":")
    if len(parts) == 3:
        h, m, s = parts
        return int(h) * 3600 + int(m) * 60 + float(s)
    elif len(parts) == 2:
        m, s = parts
        return int(m) * 60 + float(s)
    return float(parts[0])


def _parse_json(text: str) -> List[dict]:
    """Parse JSON transcript — expects list of {speaker, start, end, text}."""
    try:
        data = json.loads(text)
        if isinstance(data, list):
            return data
        if isinstance(data, dict) and "segments" in data:
            return data["segments"]
    except Exception:
        pass
    return []


def _parse_plain_text(text: str) -> List[dict]:
    """
    Parse plain text. Each paragraph is a segment.
    Lines starting with 'Speaker Name:' get a speaker label.
    """
    segments = []
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    speaker_pattern = re.compile(r"^([A-Za-z][A-Za-z\s]{1,30}):\s+(.*)", re.DOTALL)

    for i, para in enumerate(paragraphs):
        match = speaker_pattern.match(para)
        if match:
            speaker = match.group(1).strip()
            content = match.group(2).strip()
        else:
            speaker = "Speaker"
            content = para

        segments.append({
            "speaker": speaker,
            "start": i * 12.0,
            "end": i * 12.0 + 10.0,
            "text": content,
        })
    return segments
