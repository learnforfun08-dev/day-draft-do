import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Trash2, Edit3, CheckCircle2, XCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SplitText from "./SplitText";

export default function TodoApp() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [targetHours, setTargetHours] = useState("");
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [diaryText, setDiaryText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
    const savedDiary = localStorage.getItem("diary");
    if (savedDiary) setDiaryEntries(JSON.parse(savedDiary));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("diary", JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  const addTask = () => {
    if (task.trim() === "") return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: task,
        completed: false,
        dueDate,
        priority,
        category,
        targetHours: targetHours ? parseFloat(targetHours) : null,
        progress: 0,
        subtasks: [],
        recurring: null,
      },
    ]);
    setTask("");
    setDueDate("");
    setPriority("medium");
    setCategory("general");
    setTargetHours("");
  };

  const toggleTask = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditId(null);
    setEditText("");
  };

  const logProgress = (id, hours) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const updatedProgress = (todo.progress || 0) + hours;
          return { ...todo, progress: updatedProgress };
        }
        return todo;
      })
    );
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const addDiaryEntry = () => {
    if (diaryText.trim() === "") return;
    setDiaryEntries([...diaryEntries, { id: Date.now(), text: diaryText, date: new Date().toLocaleDateString() }]);
    setDiaryText("");
  };

  const filteredTodos = todos.filter((todo) => {
    let matchesFilter = true;
    if (filter === "completed") matchesFilter = todo.completed;
    if (filter === "active") matchesFilter = !todo.completed;

    let matchesCategory =
      categoryFilter === "all" || todo.category === categoryFilter;

    let matchesPriority =
      priorityFilter === "all" || todo.priority === priorityFilter;

    let matchesSearch = todo.text.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesCategory && matchesPriority && matchesSearch;
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTodos = Array.from(todos);
    const [reordered] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, reordered);
    setTodos(newTodos);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "border-priority-high";
      case "medium": return "border-priority-medium";
      case "low": return "border-priority-low";
      default: return "border-muted";
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-welcome text-white p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <SplitText
            text="🎉 Welcome to Your Productivity Hub"
            className="text-4xl font-bold mb-4"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <motion.p 
            className="mb-6 text-lg opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Manage tasks, track progress, and log your daily thoughts!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <Button 
              onClick={() => setShowWelcome(false)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 transition-smooth shadow-glow"
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <SplitText
          text="📝 Advanced To-Do List"
          className="text-3xl font-bold mb-6 text-center text-foreground"
          delay={50}
          duration={0.5}
          ease="power2.out"
          splitType="words"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
        />

        {/* Daily Diary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="w-full mb-6 shadow-elegant bg-gradient-card border-0">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                📔 Daily Diary
              </h2>
              <div className="flex gap-2 mb-4">
                <Input
                  value={diaryText}
                  onChange={(e) => setDiaryText(e.target.value)}
                  placeholder="Write your diary entry..."
                  onKeyDown={(e) => e.key === "Enter" && addDiaryEntry()}
                  className="transition-smooth"
                />
                <Button onClick={addDiaryEntry} className="transition-smooth">
                  Add
                </Button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {diaryEntries.map((entry) => (
                  <motion.div 
                    key={entry.id} 
                    className="text-sm text-muted-foreground p-2 bg-muted/50 rounded"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-xs text-muted-foreground mb-1">{entry.date}</div>
                    {entry.text}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Todo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="w-full shadow-elegant bg-gradient-card border-0">
            <CardContent className="p-6">
              {/* Add Task Form */}
              <div className="space-y-4 mb-6">
                <Input
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Add a new task..."
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  className="transition-smooth"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  <Input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="transition-smooth"
                  />
                  <Input
                    type="number"
                    placeholder="Target hours"
                    value={targetHours}
                    onChange={(e) => setTargetHours(e.target.value)}
                    className="transition-smooth"
                  />
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="transition-smooth">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="high">🔴 High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="transition-smooth">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">📋 General</SelectItem>
                      <SelectItem value="work">💼 Work</SelectItem>
                      <SelectItem value="personal">👤 Personal</SelectItem>
                      <SelectItem value="study">📚 Study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addTask} className="w-full transition-smooth">
                  Add Task
                </Button>
              </div>

              {/* Filters */}
              <div className="space-y-4 mb-6">
                <Input
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="transition-smooth"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    onClick={() => setFilter("all")}
                    size="sm"
                    className="transition-smooth"
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "active" ? "default" : "outline"}
                    onClick={() => setFilter("active")}
                    size="sm"
                    className="transition-smooth"
                  >
                    Active
                  </Button>
                  <Button
                    variant={filter === "completed" ? "default" : "outline"}
                    onClick={() => setFilter("completed")}
                    size="sm"
                    className="transition-smooth"
                  >
                    Completed
                  </Button>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40 transition-smooth">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="general">📋 General</SelectItem>
                      <SelectItem value="work">💼 Work</SelectItem>
                      <SelectItem value="personal">👤 Personal</SelectItem>
                      <SelectItem value="study">📚 Study</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40 transition-smooth">
                      <SelectValue placeholder="Filter by Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">🟢 Low</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="high">🔴 High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Todo List */}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="todos">
                  {(provided) => (
                    <div
                      className="space-y-3"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {filteredTodos.map((todo, index) => (
                        <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-card p-4 rounded-lg shadow-sm border-l-4 transition-smooth ${getPriorityColor(todo.priority)} ${
                                snapshot.isDragging ? 'shadow-glow' : ''
                              }`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3 flex-1">
                                  <Checkbox
                                    checked={todo.completed}
                                    onCheckedChange={() => toggleTask(todo.id)}
                                  />
                                  {editId === todo.id ? (
                                    <Input
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                                      autoFocus
                                      className="flex-1"
                                    />
                                  ) : (
                                    <span
                                      className={`flex-1 ${
                                        todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                                      }`}
                                    >
                                      {todo.text}
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  {editId === todo.id ? (
                                    <>
                                      <Button size="sm" onClick={() => saveEdit(todo.id)} variant="outline">
                                        <CheckCircle2 className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditId(null)}
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => startEdit(todo.id, todo.text)}
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => deleteTask(todo.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="text-xs text-muted-foreground mb-2">
                                📅 {todo.dueDate ? new Date(todo.dueDate).toLocaleString() : "No due date"} | 
                                🏷️ {todo.category} | 
                                ⚡ {todo.priority}
                              </div>

                              {todo.targetHours && (
                                <div className="space-y-2">
                                  <div className="text-sm text-foreground">
                                    Progress: {(todo.progress || 0).toFixed(1)}/{todo.targetHours} hrs
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full transition-smooth"
                                      style={{
                                        width: `${Math.min(
                                          ((todo.progress || 0) / todo.targetHours) * 100,
                                          100
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      placeholder="Log hours"
                                      className="w-32 text-sm"
                                      step="0.5"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          const hours = parseFloat(e.currentTarget.value);
                                          if (!isNaN(hours) && hours > 0) {
                                            logProgress(todo.id, hours);
                                            e.currentTarget.value = "";
                                          }
                                        }
                                      }}
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        const input = e.currentTarget.parentElement.querySelector('input');
                                        const hours = parseFloat(input.value);
                                        if (!isNaN(hours) && hours > 0) {
                                          logProgress(todo.id, hours);
                                          input.value = "";
                                        }
                                      }}
                                    >
                                      Log
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {todos.some((t) => t.completed) && (
                <div className="flex justify-end mt-6">
                  <Button variant="destructive" onClick={clearCompleted} className="transition-smooth">
                    Clear Completed
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}