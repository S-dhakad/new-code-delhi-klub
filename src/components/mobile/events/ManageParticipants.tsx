'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import Button from 'src/components/mobile/common/ui/Button';
import {
  Event,
  AddEventMemberDto,
  RemoveEventMemberDto,
} from 'src/types/events.types';
import { eventsService } from 'src/axios/events';
import { useCommunityStore } from 'src/store/community.store';
import { communityService } from 'src/axios/community/communityApi';
import { useProfileStore } from 'src/store/profile.store';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

type ParticipantItem = {
  id: string;
  eventMember: {
    id: string;
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
};

type Props = {
  event: Event;
  onClose: () => void;
  onSuccess?: () => void;
};

/**
 * Mobile Manage Participants Component
 * Full-screen component for managing event participants
 * Allows adding new participants and removing existing ones
 */
const ManageParticipants: React.FC<Props> = ({ event, onClose, onSuccess }) => {
  const { community } = useCommunityStore();
  const { profile } = useProfileStore();
  const showToast = useToastStore((s) => s.showToast);

  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  const [loading, setLoading] = useState(false);

  // State for existing participants
  const [existingMember, setExistingMember] = useState<ParticipantItem[]>([]);
  const [existingMemberEmails, setExistingMemberEmails] =
    useState<RemoveEventMemberDto>({
      emails: [],
    });

  // State for new participants
  const [newParticipant, setNewParticipant] = useState<ParticipantItem[]>([]);
  const [newMemberEmails, setNewMemberEmails] = useState<AddEventMemberDto>({
    emails: [],
  });

  /**
   * Fetch and compute participants on mount
   */
  useEffect(() => {
    const fetchMembersAndCompute = async () => {
      try {
        const hasUserEvents = Array.isArray(event?.UserEvents);

        // Get existing participants from event
        const existing = hasUserEvents
          ? (event.UserEvents || []).map((u) => ({
              id: u.id,
              eventMember: {
                id: u.eventMember?.id || '',
                email: u.eventMember?.email,
                firstName: u.eventMember?.firstName,
                lastName: u.eventMember?.lastName,
                profilePicture: (
                  u as unknown as { eventMember?: { profilePicture?: string } }
                ).eventMember?.profilePicture,
              },
            }))
          : [];
        setExistingMember(existing);

        const existingEmails = new Set(
          existing.map((u) => u.eventMember?.email).filter(Boolean) as string[],
        );

        // Fetch community members to compute new participants
        if (community?.id) {
          const response = await communityService.getCommunityMembers(
            community.id,
          );

          const rawMembers = [
            ...(response.data?.members || []),
            ...(response.data?.adminUsers || []),
          ] as Array<{
            id: string;
            email?: string;
            username?: string;
            firstName?: string;
            lastName?: string;
            profilePicture?: string;
          }>;

          // Map to the same shape as event.UserEvents entries
          const allMembersMapped: ParticipantItem[] = rawMembers
            .filter((m) => m.email)
            .map((m) => ({
              id: m.id,
              eventMember: {
                id: m.id,
                email: m.email!,
                username: m.username,
                firstName: m.firstName || '',
                lastName: m.lastName || '',
                profilePicture: m.profilePicture,
              },
            }));

          const currentUserEmail = profile?.email?.toLowerCase();
          const currentUsername = profile?.username?.toLowerCase();

          // Filter out existing participants and current user
          const newParts = allMembersMapped.filter((m) => {
            const memberEmail = m.eventMember?.email?.toLowerCase();
            const memberUsername = m.eventMember?.username?.toLowerCase();

            const isExisting = memberEmail
              ? existingEmails.has(memberEmail)
              : true;
            const isSelf =
              (currentUserEmail && memberEmail === currentUserEmail) ||
              (currentUsername && memberUsername === currentUsername);
            return !isExisting && !isSelf;
          });

          setNewParticipant(newParts);
        } else {
          setNewParticipant([]);
        }
      } catch (err) {
        console.error('Failed to compute participants:', err);
        const message = getErrorMessage(err);
        showToast({
          type: 'default-error',
          title: 'Failed to load participants',
          message,
        });
      }
    };

    if (event) {
      fetchMembersAndCompute();
    }
  }, [event, community?.id, profile?.email, profile?.username]);

  /**
   * Toggle existing participant selection
   */
  const toggleExistingEmail = (email?: string) => {
    if (!email) return;
    setExistingMemberEmails((prev) => {
      const has = prev.emails.includes(email);
      return {
        emails: has
          ? prev.emails.filter((e) => e !== email)
          : [...prev.emails, email],
      };
    });
  };

  /**
   * Toggle new participant selection
   */
  const toggleNewEmail = (email?: string) => {
    if (!email) return;
    setNewMemberEmails((prev) => {
      const has = prev.emails.includes(email);
      return {
        emails: has
          ? prev.emails.filter((e) => e !== email)
          : [...prev.emails, email],
      };
    });
  };

  /**
   * Select/Deselect all existing participants
   */
  const toggleAllExisting = () => {
    const allEmails = existingMember
      .map((u) => u.eventMember?.email)
      .filter(Boolean) as string[];

    if (existingMemberEmails.emails.length === existingMember.length) {
      setExistingMemberEmails({ emails: [] });
    } else {
      setExistingMemberEmails({ emails: allEmails });
    }
  };

  /**
   * Select/Deselect all new participants
   */
  const toggleAllNew = () => {
    const allEmails = newParticipant
      .map((u) => u.eventMember?.email)
      .filter(Boolean) as string[];

    if (newMemberEmails.emails.length === newParticipant.length) {
      setNewMemberEmails({ emails: [] });
    } else {
      setNewMemberEmails({ emails: allEmails });
    }
  };

  /**
   * Handle adding new participants
   */
  const handleAddEventMember = useCallback(async () => {
    if (!event?.id || !community?.id) {
      showToast({
        type: 'default-error',
        title: 'Cannot add participants. Missing required fields.',
      });
      return;
    }

    try {
      setLoading(true);
      await eventsService.addEventMembers(
        community.id,
        event.id,
        newMemberEmails,
      );

      showToast({
        type: 'default-success',
        title: 'Participants added successfully',
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error adding members in event:', error);
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to add participants',
        message,
      });
    } finally {
      setLoading(false);
    }
  }, [event?.id, community?.id, newMemberEmails, onClose, onSuccess]);

  /**
   * Handle removing existing participants
   */
  const handleRemoveEventMember = useCallback(async () => {
    if (!event?.id || !community?.id) {
      showToast({
        type: 'default-error',
        title: 'Cannot remove participants. Missing required fields.',
      });
      return;
    }

    try {
      setLoading(true);
      await eventsService.removeEventMembers(
        community.id,
        event.id,
        existingMemberEmails,
      );

      showToast({
        type: 'default-success',
        title: 'Participants removed successfully',
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error removing members in event:', error);
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to remove participants',
        message,
      });
    } finally {
      setLoading(false);
    }
  }, [event?.id, community?.id, existingMemberEmails, onClose, onSuccess]);

  return (
    <div className="mx-auto max-w-[430px] px-4 py-7 bg-white min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between text-text-secondary pt-1.5 pb-4 border-b-2">
        <h2 className="font-medium">Manage Participants</h2>
        <X className="w-4 h-4 cursor-pointer" onClick={onClose} />
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-4 border-b-2">
        <button
          onClick={() => setActiveTab('existing')}
          className={`pb-2 px-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'existing'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary'
          }`}
        >
          Existing Participants ({existingMember.length})
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`pb-2 px-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'new'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary'
          }`}
        >
          New Participants{' '}
          <span className="text-red-500">({newParticipant.length})</span>
        </button>
      </div>

      {/* Existing Participants Tab */}
      {activeTab === 'existing' && (
        <div className="mt-5">
          {/* Select All */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-secondary">
              Remove Participants
            </h3>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={
                  existingMember.length > 0 &&
                  existingMemberEmails.emails.length === existingMember.length
                }
                onChange={toggleAllExisting}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-0"
              />
              <span>Select all</span>
            </label>
          </div>

          {/* Participants List */}
          <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-auto">
            {existingMember.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                No existing participants
              </div>
            ) : (
              existingMember.map((user) => {
                const email = user.eventMember?.email;
                return (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 cursor-pointer active:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={
                        email
                          ? existingMemberEmails.emails.includes(email)
                          : false
                      }
                      onChange={() => toggleExistingEmail(email)}
                      className="h-5 w-5 rounded-md text-primary focus:ring-0"
                    />

                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {user.eventMember.profilePicture ? (
                          <Image
                            src={user.eventMember.profilePicture}
                            alt={user.eventMember.firstName || ''}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-semibold">
                            {user.eventMember.firstName?.charAt(0)}
                            {user.eventMember.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="text-sm font-medium">
                        {user.eventMember.firstName} {user.eventMember.lastName}
                        <div className="text-xs text-text-secondary">
                          {email}
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleRemoveEventMember}
              disabled={loading || existingMemberEmails.emails.length === 0}
            >
              {loading ? 'Updating...' : 'Update Participants'}
            </Button>
          </div>
        </div>
      )}

      {/* New Participants Tab */}
      {activeTab === 'new' && (
        <div className="mt-5">
          {/* Select All */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-secondary">
              Add new Participants
            </h3>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={
                  newMemberEmails.emails.length === newParticipant.length &&
                  newParticipant.length > 0
                }
                onChange={toggleAllNew}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-0"
              />
              <span>
                {newMemberEmails.emails.length === newParticipant.length &&
                newParticipant.length > 0
                  ? 'Deselect all'
                  : 'Select all'}
              </span>
            </label>
          </div>

          {/* Participants List */}
          <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-auto">
            {newParticipant.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                No new participants to add
              </div>
            ) : (
              newParticipant.map((user) => {
                const email = user.eventMember?.email;
                return (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 cursor-pointer active:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={
                        email ? newMemberEmails.emails.includes(email) : false
                      }
                      onChange={() => toggleNewEmail(email)}
                      className="h-5 w-5 rounded-md text-primary focus:ring-0"
                    />

                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {user.eventMember.profilePicture ? (
                          <Image
                            src={user.eventMember.profilePicture}
                            alt={user.eventMember.firstName || ''}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-semibold">
                            {user.eventMember.firstName?.charAt(0)}
                            {user.eventMember.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="text-sm font-medium">
                        {user.eventMember.firstName} {user.eventMember.lastName}
                        <div className="text-xs text-text-secondary">
                          {email}
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleAddEventMember}
              disabled={loading || newMemberEmails.emails.length === 0}
            >
              {loading ? 'Adding...' : 'Add Participants'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageParticipants;
