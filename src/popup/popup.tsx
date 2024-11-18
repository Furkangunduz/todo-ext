import React, { useEffect, useState } from "react";
import './popup.css';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
}

const Popup = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [inputValue, setInputValue] = useState<string>("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [dueDate, setDueDate] = useState<string>("");
    const [filter, setFilter] = useState<{
        status: 'all' | 'active' | 'completed',
        priority: 'all' | 'low' | 'medium' | 'high'
    }>({ status: 'all', priority: 'all' });

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (inputValue.trim()) {
            const newTodo: Todo = {
                id: Date.now().toString(),
                text: inputValue,
                completed: false,
                priority,
                dueDate,
            };
            setTodos([...todos, newTodo]);
            setInputValue("");
            setDueDate("");
            setPriority('medium');
        }
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const toggleComplete = (id: string) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const startEditing = (todo: Todo) => {
        setEditingId(todo.id);
        setInputValue(todo.text);
        setPriority(todo.priority);
        setDueDate(todo.dueDate);
    };

    const saveEdit = () => {
        if (editingId && inputValue.trim()) {
            setTodos(todos.map(todo =>
                todo.id === editingId
                    ? { ...todo, text: inputValue, priority, dueDate}
                    : todo
            ));
            setEditingId(null);
            setInputValue("");
            setPriority('medium');
            setDueDate("");
        }
    };

    const filteredTodos = todos.filter(todo => {
        const statusMatch = 
            filter.status === 'all' ? true :
            filter.status === 'active' ? !todo.completed :
            todo.completed;
        
        const priorityMatch = 
            filter.priority === 'all' ? true :
            todo.priority === filter.priority;

        return statusMatch && priorityMatch;
    });

    return (
        <div className="p-4 w-[400px] max-h-[600px] overflow-y-auto bg-white">
            
            <div className="mb-4 space-y-2">
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    placeholder="To do" 
                    className="w-full px-3 py-2 border rounded"
                />
                <div className="flex gap-2">
                    <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="px-3 py-2 border rounded"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <input 
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="px-3 py-2 border rounded"
                    />
                   
                </div>
                <button 
                    onClick={editingId ? saveEdit : addTodo}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    {editingId ? 'Save Edit' : 'Add Todo'}
                </button>
            </div>

            <div className="mb-4 space-y-2">
                <div className="flex gap-2">
                    <button 
                        onClick={() => setFilter(prev => ({ ...prev, status: 'all' }))}
                        className={`px-3 py-1 rounded ${filter.status === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setFilter(prev => ({ ...prev, status: 'active' }))}
                        className={`px-3 py-1 rounded ${filter.status === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Active
                    </button>
                    <button 
                        onClick={() => setFilter(prev => ({ ...prev, status: 'completed' }))}
                        className={`px-3 py-1 rounded ${filter.status === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Completed
                    </button>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => setFilter(prev => ({ ...prev, priority: 'all' }))}
                        className={`px-3 py-1 rounded ${filter.priority === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        All Priorities
                    </button>
                    <button 
                        onClick={() => setFilter(prev => ({ ...prev, priority: 'high' }))}
                        className={`px-3 py-1 rounded ${filter.priority === 'high' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                    >
                        High
                    </button>
                    <button 
                        onClick={() => setFilter(prev => ({ ...prev, priority: 'medium' }))}
                        className={`px-3 py-1 rounded ${filter.priority === 'medium' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                    >
                        Medium
                    </button>
                    <button 
                        onClick={() => setFilter(prev => ({ ...prev, priority: 'low' }))}
                        className={`px-3 py-1 rounded ${filter.priority === 'low' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                        Low
                    </button>
                </div>
            </div>

            <ul className="space-y-2 max-h-[150px] overflow-y-auto">
                {filteredTodos.map((todo) => (
                    <li 
                        key={todo.id} 
                        className={`p-3 border rounded flex items-center justify-between
                            ${todo.completed ? 'bg-gray-100' : ''}
                            ${todo.priority === 'high' ? 'border-red-500' : 
                              todo.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'}`}
                    >
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleComplete(todo.id)}
                                className="h-5 w-5"
                            />
                            <div className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                                <div>{todo.text}</div>
                                <div className="text-sm text-gray-500">
                                   
                                    {todo.dueDate && <span>📅 {todo.dueDate}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => startEditing(todo)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                ✏️
                            </button>
                            <button 
                                onClick={() => deleteTodo(todo.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                🗑️
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Popup;