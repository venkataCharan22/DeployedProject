from fastapi import APIRouter
from models.schemas import PosterRequest, PosterResponse
from services.groq_service import get_groq_client

router = APIRouter(tags=["poster"])


@router.post("/poster", response_model=PosterResponse)
async def generate_poster(request: PosterRequest):
    """Accept an offer description and return AI-generated poster text."""
    prompt = f"""Create a catchy promotional phrase/caption for a small Indian shop to share on WhatsApp or Instagram.
Offer/promotion: {request.description}

Requirements:
- Use emojis for visual appeal
- Keep it SHORT (3-5 lines max)
- Make it punchy and attention-grabbing
- Add 2-3 relevant hashtags at the end
- Suitable for WhatsApp status or Instagram story
- Do NOT include store hours or address placeholders
- Write in a mix of English (with optional Hindi words for flavor)"""

    try:
        client = get_groq_client()
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=512,
        )
        poster_text = completion.choices[0].message.content.strip()
    except Exception as e:
        poster_text = (
            f"🔥 SPECIAL OFFER! 🔥\n\n"
            f"{request.description}\n\n"
            f"✅ Limited Time Only\n"
            f"✅ Best Prices Guaranteed\n\n"
            f"📍 Visit us today!\n"
            f"#ShopLocal #BestDeals"
        )

    return PosterResponse(poster_text=poster_text)
