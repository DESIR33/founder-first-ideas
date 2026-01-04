import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  MessageSquare, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { IdeaNote, addIdeaNote, updateIdeaNote, deleteIdeaNote } from '@/lib/profileService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface IdeaNotesProps {
  ideaId: string;
  userId: string;
  notes: IdeaNote[];
  onNotesChange: (notes: IdeaNote[]) => void;
}

export function IdeaNotes({ ideaId, userId, notes, onNotesChange }: IdeaNotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) {
      toast({
        title: "Note cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (newNoteContent.length > 2000) {
      toast({
        title: "Note too long",
        description: "Notes must be less than 2000 characters.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const newNote = await addIdeaNote(userId, ideaId, newNoteContent);
      onNotesChange([newNote, ...notes]);
      setNewNoteContent('');
      setIsAdding(false);
      toast({ title: "Note added" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim()) {
      toast({
        title: "Note cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (editContent.length > 2000) {
      toast({
        title: "Note too long",
        description: "Notes must be less than 2000 characters.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const updatedNote = await updateIdeaNote(noteId, editContent);
      onNotesChange(notes.map(n => n.id === noteId ? updatedNote : n));
      setEditingId(null);
      setEditContent('');
      toast({ title: "Note updated" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    setLoading(true);
    try {
      await deleteIdeaNote(noteId);
      onNotesChange(notes.filter(n => n.id !== noteId));
      toast({ title: "Note deleted" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (note: IdeaNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5" />
          Your Notes
          {notes.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({notes.length})
            </span>
          )}
        </CardTitle>
        
        {!isAdding && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Note
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pb-4 border-b border-border/50">
                <Textarea
                  placeholder="Write your thoughts, ideas, or action items..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="min-h-[100px] resize-none"
                  maxLength={2000}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {newNoteContent.length}/2000
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setIsAdding(false);
                        setNewNoteContent('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleAddNote}
                      disabled={loading || !newNoteContent.trim()}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes List */}
        {notes.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notes yet. Add your first note!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                    "p-4 rounded-xl bg-secondary/30 border border-border/30",
                    editingId === note.id && "ring-2 ring-primary/50"
                  )}
                >
                  {editingId === note.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[100px] resize-none"
                        maxLength={2000}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {editContent.length}/2000
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={cancelEditing}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateNote(note.id)}
                            disabled={loading || !editContent.trim()}
                          >
                            {loading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm whitespace-pre-wrap mb-3">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
                          {note.updated_at !== note.created_at && ' (edited)'}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => startEditing(note)}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete note?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this note. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
