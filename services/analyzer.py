def analyze_topics(topics):
    """
    Analyze topics and return weak/strong categorization
    
    Args:
        topics: List of Topic objects or dictionaries with name, subject, attempted, correct, score
        
    Returns:
        Dictionary with weak_topics, strong_topics, and overall_score
    """
    weak = []
    strong = []
    total_correct = 0
    total_attempted = 0

    for t in topics:
        # Handle both Pydantic model objects and dictionaries
        if hasattr(t, 'dict'):
            # It's a Pydantic model
            name = t.name
            subject = t.subject
            attempted = t.attempted
            correct = t.correct
            score = t.score if hasattr(t, 'score') and t.score is not None else 0
        elif isinstance(t, dict):
            # It's a dictionary
            name = t.get('name', '')
            subject = t.get('subject', '')
            attempted = t.get('attempted', 0)
            correct = t.get('correct', 0)
            score = t.get('score', 0)
        else:
            continue
        
        if attempted < 3:
            continue

        # Calculate accuracy (use score if provided, otherwise calculate)
        if score and score > 0:
            accuracy = int(score)
        else:
            accuracy = int((correct / attempted) * 100) if attempted > 0 else 0
        
        total_correct += correct
        total_attempted += attempted

        item = {
            "name": name,
            "subject": subject,
            "correct": correct,
            "attempted": attempted,
            "score": accuracy
        }

        if accuracy < 50:
            weak.append(item)
        else:
            strong.append(item)

    # Calculate overall score
    overall_score = int((total_correct / total_attempted) * 100) if total_attempted > 0 else 0

    return {
        "weak_topics": weak,
        "strong_topics": strong,
        "overall_score": overall_score
    }
