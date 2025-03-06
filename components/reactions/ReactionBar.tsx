import { ReactionType } from "@prisma/client";
import { ReactionButton } from "./ReactionBtn";

interface ReactionBarProps {
  postId: string;
  reactions: {
    type: ReactionType;
    count: number;
  }[];
  userReactions: ReactionType[];
  showSignIn?: boolean;
}

export function ReactionBar({
  postId,
  reactions,
  userReactions,
  showSignIn,
}: ReactionBarProps) {
  // Ensure all reaction types are represented
  const allReactionTypes = Object.values(ReactionType);
  const reactionMap = new Map(reactions.map((r) => [r.type, r.count]));

  // Fill in missing reaction types with count 0
  allReactionTypes.forEach((type) => {
    if (!reactionMap.has(type)) {
      reactionMap.set(type, 0);
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Array.from(reactionMap.entries()).map(([type, count]) => (
          <ReactionButton
            key={type}
            postId={postId}
            type={type as ReactionType}
            count={count}
            hasReacted={userReactions.includes(type as ReactionType)}
            requiresAuth={showSignIn}
          />
        ))}
      </div>

      {showSignIn && <div className="mt-4"></div>}
    </div>
  );
}
