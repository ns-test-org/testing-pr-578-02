'use client';

import { useEffect, useState, useCallback } from 'react';

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Todo = { id: number; text: string; x: number; y: number; collected: boolean };

const GRID_SIZE = 20;
const CELL_SIZE = 20;

export default function TodoPacmanGame() {
  const [pacman, setPacman] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React', x: 5, y: 5, collected: false },
    { id: 2, text: 'Build a game', x: 15, y: 5, collected: false },
    { id: 3, text: 'Deploy app', x: 5, y: 15, collected: false },
    { id: 4, text: 'Celebrate!', x: 15, y: 15, collected: false },
  ]);
  const [score, setScore] = useState(0);
  const [newTodo, setNewTodo] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const movePacman = useCallback(() => {
    setPacman((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      switch (direction) {
        case 'UP':
          newY = Math.max(0, prev.y - 1);
          break;
        case 'DOWN':
          newY = Math.min(GRID_SIZE - 1, prev.y + 1);
          break;
        case 'LEFT':
          newX = Math.max(0, prev.x - 1);
          break;
        case 'RIGHT':
          newX = Math.min(GRID_SIZE - 1, prev.x + 1);
          break;
      }

      return { x: newX, y: newY };
    });
  }, [direction]);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(movePacman, 200);
    return () => clearInterval(interval);
  }, [movePacman, gameStarted]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        setGameStarted(true);
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted]);

  useEffect(() => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (!todo.collected && todo.x === pacman.x && todo.y === pacman.y) {
          setScore((s) => s + 10);
          return { ...todo, collected: true };
        }
        return todo;
      })
    );
  }, [pacman]);

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const newTodoItem: Todo = {
      id: Date.now(),
      text: newTodo,
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      collected: false,
    };

    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  const activeTodos = todos.filter((t) => !t.collected);
  const completedTodos = todos.filter((t) => t.collected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2 text-yellow-300">
          🎮 Todo Pac-Man
        </h1>
        <p className="text-center text-gray-300 mb-6">
          {!gameStarted ? 'Press any arrow key to start!' : 'Use arrow keys or WASD to move'}
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Game Board */}
          <div className="flex-1">
            <div className="bg-black/50 p-4 rounded-lg border-4 border-yellow-400">
              <div className="flex justify-between mb-4">
                <div className="text-2xl font-bold">Score: {score}</div>
                <div className="text-xl">Todos Left: {activeTodos.length}</div>
              </div>

              <div
                className="relative bg-blue-950 border-2 border-blue-400"
                style={{
                  width: GRID_SIZE * CELL_SIZE,
                  height: GRID_SIZE * CELL_SIZE,
                }}
              >
                {/* Grid lines */}
                {Array.from({ length: GRID_SIZE }).map((_, i) => (
                  <div key={`h-${i}`}>
                    <div
                      className="absolute border-t border-blue-800/30"
                      style={{
                        top: i * CELL_SIZE,
                        left: 0,
                        right: 0,
                        height: 1,
                      }}
                    />
                    <div
                      className="absolute border-l border-blue-800/30"
                      style={{
                        left: i * CELL_SIZE,
                        top: 0,
                        bottom: 0,
                        width: 1,
                      }}
                    />
                  </div>
                ))}

                {/* Todos */}
                {todos.map((todo) =>
                  !todo.collected ? (
                    <div
                      key={todo.id}
                      className="absolute flex items-center justify-center text-2xl animate-pulse"
                      style={{
                        left: todo.x * CELL_SIZE,
                        top: todo.y * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                      }}
                      title={todo.text}
                    >
                      ✅
                    </div>
                  ) : null
                )}

                {/* Pac-Man */}
                <div
                  className="absolute flex items-center justify-center text-2xl transition-all duration-200"
                  style={{
                    left: pacman.x * CELL_SIZE,
                    top: pacman.y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    transform:
                      direction === 'RIGHT'
                        ? 'rotate(0deg)'
                        : direction === 'DOWN'
                        ? 'rotate(90deg)'
                        : direction === 'LEFT'
                        ? 'rotate(180deg)'
                        : 'rotate(270deg)',
                  }}
                >
                  🟡
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Add Todo */}
            <div className="bg-black/50 p-4 rounded-lg border-2 border-green-400">
              <h2 className="text-2xl font-bold mb-4 text-green-300">Add Todo</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="New todo..."
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                />
                <button
                  onClick={addTodo}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded font-bold transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Active Todos */}
            <div className="bg-black/50 p-4 rounded-lg border-2 border-yellow-400">
              <h2 className="text-2xl font-bold mb-4 text-yellow-300">
                Active Todos ({activeTodos.length})
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activeTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-gray-800 p-2 rounded text-sm border border-gray-600"
                  >
                    ✅ {todo.text}
                  </div>
                ))}
                {activeTodos.length === 0 && (
                  <p className="text-gray-400 text-center py-4">
                    All todos collected! 🎉
                  </p>
                )}
              </div>
            </div>

            {/* Completed Todos */}
            <div className="bg-black/50 p-4 rounded-lg border-2 border-purple-400">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Completed ({completedTodos.length})
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {completedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-gray-800 p-2 rounded text-sm border border-gray-600 line-through opacity-60"
                  >
                    ✅ {todo.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

