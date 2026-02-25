'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  PROPERTY_ROOM_TEMPLATES,
  ROOM_TYPE_LABELS,
  type PropertyType,
  type RoomType,
} from '@conditionlog/shared';
import { createRoomsBatch, deleteRoom as deleteRoomAction } from '@/actions/rooms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface RoomEntry {
  tempId: string;
  room_type: RoomType;
  room_label: string;
}

interface ExistingRoom {
  id: string;
  room_type: string;
  room_label: string | null;
  sort_order: number;
}

interface RoomSetupClientProps {
  reportId: string;
  propertyType: PropertyType;
  existingRooms: ExistingRoom[];
}

export function RoomSetupClient({ reportId, propertyType, existingRooms }: RoomSetupClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const templates = PROPERTY_ROOM_TEMPLATES[propertyType] ?? PROPERTY_ROOM_TEMPLATES.other;

  const [rooms, setRooms] = useState<RoomEntry[]>(() => {
    if (existingRooms.length > 0) {
      return existingRooms.map((r) => ({
        tempId: r.id,
        room_type: r.room_type as RoomType,
        room_label: r.room_label ?? '',
      }));
    }

    return templates.map((t, i) => ({
      tempId: `new-${i}`,
      room_type: t.room_type,
      room_label: t.default_label,
    }));
  });

  const [newRoomType, setNewRoomType] = useState<RoomType>('other');
  const [newRoomLabel, setNewRoomLabel] = useState('');

  function addRoom() {
    const label = newRoomLabel || ROOM_TYPE_LABELS[newRoomType] || newRoomType;
    setRooms((prev) => [
      ...prev,
      {
        tempId: `new-${Date.now()}`,
        room_type: newRoomType,
        room_label: label,
      },
    ]);
    setNewRoomLabel('');
  }

  function removeRoom(tempId: string) {
    // If this was an existing room (UUID format), also delete it server-side
    const isExisting = !tempId.startsWith('new-');
    if (isExisting) {
      startTransition(async () => {
        await deleteRoomAction(tempId, reportId);
      });
    }
    setRooms((prev) => prev.filter((r) => r.tempId !== tempId));
  }

  function updateLabel(tempId: string, label: string) {
    setRooms((prev) => prev.map((r) => (r.tempId === tempId ? { ...r, room_label: label } : r)));
  }

  function handleSaveAndContinue() {
    if (rooms.length === 0) {
      toast.error('Add at least one room to continue');
      return;
    }

    startTransition(async () => {
      // Only create rooms that don't already exist in DB
      const newRooms = rooms
        .filter((r) => r.tempId.startsWith('new-'))
        .map((r, i) => ({
          room_type: r.room_type,
          room_label: r.room_label,
          sort_order: i,
        }));

      if (newRooms.length > 0) {
        const result = await createRoomsBatch(reportId, newRooms);
        if (result?.error) {
          toast.error(result.error);
          return;
        }
      }

      router.push(`/reports/${reportId}/walkthrough`);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rooms to Document</CardTitle>
          <CardDescription>
            We&apos;ve pre-populated rooms based on your property type. Add, remove, or rename as
            needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rooms.map((room) => (
              <div key={room.tempId} className="flex items-center gap-3">
                <span className="w-36 text-sm text-muted-foreground">
                  {ROOM_TYPE_LABELS[room.room_type] ?? room.room_type}
                </span>
                <Input
                  value={room.room_label}
                  onChange={(e) => updateLabel(room.tempId, e.target.value)}
                  placeholder="Room label"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRoom(room.tempId)}
                  className="text-destructive hover:text-destructive"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Another Room</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div className="space-y-2">
              <Label>Room Type</Label>
              <Select
                value={newRoomType}
                onValueChange={(v: string) => setNewRoomType(v as RoomType)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROOM_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Custom Label</Label>
              <Input
                value={newRoomLabel}
                onChange={(e) => setNewRoomLabel(e.target.value)}
                placeholder={ROOM_TYPE_LABELS[newRoomType]}
              />
            </div>
            <Button variant="outline" onClick={addRoom}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSaveAndContinue} disabled={isPending}>
          {isPending ? 'Saving…' : `Continue with ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  );
}
