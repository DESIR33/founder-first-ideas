import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderPlus, 
  Folder, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Loader2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { 
  IdeaCollection, 
  COLLECTION_COLORS,
  createCollection, 
  updateCollection, 
  deleteCollection 
} from '@/lib/profileService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CollectionManagerProps {
  userId: string;
  collections: IdeaCollection[];
  onCollectionsChange: (collections: IdeaCollection[]) => void;
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
}

export function CollectionManager({ 
  userId, 
  collections, 
  onCollectionsChange, 
  selectedCollectionId,
  onSelectCollection 
}: CollectionManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState<string>('gray');
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState<string>('gray');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    
    if (newName.length > 50) {
      toast({ title: "Name too long", description: "Max 50 characters", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      const collection = await createCollection(userId, newName, newColor);
      onCollectionsChange([...collections, collection].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName('');
      setNewColor('gray');
      setIsCreating(false);
      toast({ title: "Collection created" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create collection", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      const updated = await updateCollection(id, { name: editName.trim(), color: editColor });
      onCollectionsChange(
        collections.map(c => c.id === id ? updated : c).sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingId(null);
      toast({ title: "Collection updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update collection", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteCollection(id);
      onCollectionsChange(collections.filter(c => c.id !== id));
      if (selectedCollectionId === id) {
        onSelectCollection(null);
      }
      toast({ title: "Collection deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete collection", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (collection: IdeaCollection) => {
    setEditingId(collection.id);
    setEditName(collection.name);
    setEditColor(collection.color);
  };

  return (
    <div className="space-y-3">
      {/* All Ideas button */}
      <Button
        variant={selectedCollectionId === null ? "secondary" : "ghost"}
        className="w-full justify-start"
        onClick={() => onSelectCollection(null)}
      >
        <Folder className="w-4 h-4 mr-2" />
        All Ideas
      </Button>

      {/* Collection List */}
      <AnimatePresence>
        {collections.map((collection) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {editingId === collection.id ? (
              <div className="p-2 bg-secondary/50 rounded-lg space-y-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Collection name"
                  maxLength={50}
                  className="h-8"
                />
                <ColorPicker value={editColor} onChange={setEditColor} />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => handleUpdate(collection.id)} disabled={loading}>
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  variant={selectedCollectionId === collection.id ? "secondary" : "ghost"}
                  className="flex-1 justify-start"
                  onClick={() => onSelectCollection(collection.id)}
                >
                  <div 
                    className={cn(
                      "w-3 h-3 rounded-full mr-2",
                      getColorClass(collection.color)
                    )} 
                  />
                  <span className="truncate">{collection.name}</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => startEditing(collection)}>
                  <Edit2 className="w-3 h-3" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-destructive hover:text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete collection?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete "{collection.name}" and remove all ideas from it. The ideas themselves won't be deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(collection.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Create New */}
      {isCreating ? (
        <div className="p-2 bg-secondary/50 rounded-lg space-y-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Collection name"
            maxLength={50}
            className="h-8"
            autoFocus
          />
          <ColorPicker value={newColor} onChange={setNewColor} />
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={handleCreate} disabled={loading}>
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Create"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => {
              setIsCreating(false);
              setNewName('');
              setNewColor('gray');
            }}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setIsCreating(true)}>
          <FolderPlus className="w-4 h-4 mr-2" />
          New Collection
        </Button>
      )}
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <div className="flex gap-1">
      {COLLECTION_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            "w-6 h-6 rounded-full transition-all",
            getColorClass(color),
            value === color && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
          )}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );
}

function getColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    gray: 'bg-gray-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  };
  return colorMap[color] || colorMap.gray;
}

// Add to Collection Dialog
interface AddToCollectionDialogProps {
  userId: string;
  ideaId: string;
  collections: IdeaCollection[];
  currentCollectionIds: string[];
  onUpdate: (collectionIds: string[]) => void;
  trigger?: React.ReactNode;
}

export function AddToCollectionDialog({ 
  userId, 
  ideaId, 
  collections, 
  currentCollectionIds, 
  onUpdate,
  trigger 
}: AddToCollectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(currentCollectionIds);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = (collectionId: string) => {
    setSelectedIds(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { addIdeaToCollection, removeIdeaFromCollection } = await import('@/lib/profileService');
      
      // Find additions and removals
      const toAdd = selectedIds.filter(id => !currentCollectionIds.includes(id));
      const toRemove = currentCollectionIds.filter(id => !selectedIds.includes(id));
      
      // Execute changes
      await Promise.all([
        ...toAdd.map(id => addIdeaToCollection(userId, id, ideaId)),
        ...toRemove.map(id => removeIdeaFromCollection(id, ideaId)),
      ]);
      
      onUpdate(selectedIds);
      setOpen(false);
      toast({ title: "Collections updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update collections", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FolderPlus className="w-4 h-4 mr-2" />
            Add to Collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Collections</DialogTitle>
          <DialogDescription>
            Select which collections this idea belongs to.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto py-4">
          {collections.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No collections yet. Create one from the sidebar.
            </p>
          ) : (
            collections.map((collection) => (
              <button
                key={collection.id}
                type="button"
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                  selectedIds.includes(collection.id) 
                    ? "bg-secondary" 
                    : "hover:bg-secondary/50"
                )}
                onClick={() => handleToggle(collection.id)}
              >
                <div className={cn("w-4 h-4 rounded-full", getColorClass(collection.color))} />
                <span className="flex-1 text-left">{collection.name}</span>
                {selectedIds.includes(collection.id) && (
                  <Check className="w-4 h-4 text-foreground" />
                )}
              </button>
            ))
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { getColorClass };
