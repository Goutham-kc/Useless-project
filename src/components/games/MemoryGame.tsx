import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface MemoryGameProps {
  onComplete: () => void;
  onClose: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, onClose }) => {
  const [cards, setCards] = useState<Array<{ id: number; value: string; isFlipped: boolean; isMatched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);

  const emojis = ['🚀', '⭐', '🎮', '🏆', '💎', '🔥'];
  const targetMatches = 6;

  const initializeGame = () => {
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameStarted(true);
  };

  const flipCard = (id: number) => {
    if (flippedCards.length >= 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setFlippedCards(prev => [...prev, id]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = flippedCards;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.value === secondCard.value) {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true, isFlipped: false }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matches === targetMatches) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [matches, onComplete]);

  if (!gameStarted) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">🧠 Memory Match Challenge</h3>
          <p className="text-muted-foreground">
            Match all 6 pairs of emojis to unlock your field!
          </p>
          <p className="text-sm text-muted-foreground">
            Click on cards to flip them and find matching pairs.
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={initializeGame} className="bg-gradient-to-tr from-[hsl(264_83%_58%)] to-[hsl(142_76%_36%)]">
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">Matches:</span> {matches}/{targetMatches}
        </div>
        <div className="text-sm">
          <span className="font-medium">Moves:</span> {moves}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => flipCard(card.id)}
            className={`
              aspect-square rounded-lg border-2 flex items-center justify-center text-2xl cursor-pointer
              transition-all duration-300 transform hover:scale-105
              ${card.isFlipped || card.isMatched
                ? 'bg-white border-game-primary shadow-lg'
                : 'bg-gradient-to-br from-game-primary to-game-secondary border-border hover:shadow-md'
              }
              ${card.isMatched ? 'animate-bounce-game' : ''}
            `}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="animate-scale-in">{card.value}</span>
            ) : (
              <span className="text-white">❓</span>
            )}
          </div>
        ))}
      </div>

      {matches === targetMatches && (
        <div className="bg-gradient-to-r from-game-success/10 to-game-secondary/10 p-4 rounded-lg border border-game-success/20">
          <h4 className="text-lg font-bold text-game-success mb-2">🎉 Congratulations!</h4>
          <p className="text-sm text-muted-foreground">
            You completed the memory game in {moves} moves!
          </p>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button onClick={initializeGame} variant="outline">
          Restart
        </Button>
        {matches === targetMatches && (
          <Button onClick={onComplete} className="bg-game-success text-white">
            🎉 Complete Challenge!
          </Button>
        )}
      </div>
    </div>
  );
};