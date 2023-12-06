const CommentText = ({comment, className = "", socialMediaType, usernames = []}) => {
    if (socialMediaType === "INSTAGRAM") {
        const words = comment.split(' ');
        return words.map((word, index) => {
            if (word.startsWith('@') || word.startsWith('#')) {
                return (
                    <span key={index} className={className}>
            {word}{' '}
          </span>
                );
            }
            return <span key={index}>{word} </span>;
        });
    } else if (socialMediaType === "FACEBOOK") {
        const pattern = new RegExp(`(${usernames.join('|')})|(#\\w+)`, 'g');
        const parts = comment.split(pattern);
        const highlightedSentence = parts.map((part, index) => {
            if (usernames.includes(part)) {
                return <span key={index} className={className}>{part}</span>;
            } else if (part?.startsWith('#')) {
                return <span key={index} className={className}>{part}</span>;
            } else {
                return part;
            }
        });

        return <div>{highlightedSentence}</div>;
    }
    return <></>;
}
export default CommentText