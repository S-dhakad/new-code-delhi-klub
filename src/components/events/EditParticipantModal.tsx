'use client';

import Image from 'next/image';
import * as React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import {
  AddEventMemberDto,
  Event,
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

export const EditParticipantModal = ({
  open,
  setOpen,
  onOpenChange,
  event,
  onSuccess,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange?: (open: boolean) => void;
  event: Event | null;
  onSuccess?: () => void;
}) => {
  const { community } = useCommunityStore();
  const { profile } = useProfileStore();
  const [loading, setLoading] = React.useState(false);
  const showToast = useToastStore((s) => s.showToast);
  const [existingMember, setExistingMember] = React.useState<ParticipantItem[]>(
    Array.isArray(event?.UserEvents)
      ? event!.UserEvents.map((u) => ({
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
      : [],
  );
  const [existingMemberEmails, setExistingMemberEmails] =
    React.useState<RemoveEventMemberDto>({
      emails: [],
    });
  const [newParticipant, setNewParticipant] = React.useState<ParticipantItem[]>(
    [],
  );
  const [newMemberEmails, setNewMemberEmails] =
    React.useState<AddEventMemberDto>({
      emails: [],
    });

  React.useEffect(() => {
    const fetchMembersAndCompute = async () => {
      try {
        const hasUserEvents = Array.isArray(event?.UserEvents);

        const existing = hasUserEvents
          ? (event!.UserEvents || []).map((u) => ({
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

        setExistingMemberEmails({ emails: Array.from(existingEmails) });

        // Fetch community members to compute new participants (all members - existing - current user)
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

          // Map to the same shape as event.UserEvents entries used by UI
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

        setNewMemberEmails({ emails: [] });
      } catch (err) {
        const message = getErrorMessage(err);
        showToast({
          type: 'default-error',
          title: 'Failed to load participants',
          message,
        });
      }
    };

    // Only run when modal has an event context
    if (event) {
      fetchMembersAndCompute();
    }
  }, [event, community?.id, profile?.email, profile?.username]);

  // Tabs onValueChange not needed for state here

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

  const selectAllNew = () => {
    const all = newParticipant
      .map((u) => u.eventMember?.email)
      .filter(Boolean) as string[];
    setNewMemberEmails({ emails: all });
  };

  const handleAddEventMember = React.useCallback(async () => {
    if (!event?.id || !community?.id) {
      showToast({
        type: 'default-error',
        title: 'Cannot remove participants. Missing required fields.',
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
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to add participants',
        message,
      });
    } finally {
      setLoading(false);
    }
  }, [event?.id, community?.id, newMemberEmails, setOpen, onSuccess]);

  const handleRemoveEventMember = React.useCallback(async () => {
    if (!event?.id || !community?.id) {
      showToast({
        type: 'default-error',
        title: 'Cannot add participants. Missing required fields.',
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
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to remove participants',
        message,
      });
    } finally {
      setLoading(false);
    }
  }, [event?.id, community?.id, existingMemberEmails, setOpen, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange ?? setOpen}>
      <DialogContent
        className="p-8 rounded-[30px] gap-3 w-[500px]"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-medium text-[#787878]">
            Edit Participants
          </DialogTitle>

          <DialogClose asChild>
            <button
              className="rounded-full p-1 hover:bg-gray-100 focus:outline-none"
              aria-label="Close"
            >
              <Image src="/plus.svg" alt="plus icon" width={32} height={32} />
            </button>
          </DialogClose>
        </DialogHeader>

        <div>
          <Tabs defaultValue="all" className="w-full gap-0">
            <TabsList className="flex w-full border-b p-0 bg-transparent rounded-none gap-8">
              <TabsTrigger
                value="all"
                className="px-0 pb-2 rounded-none text-sm font-medium  flex justify-start text-gray-500 border-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Existing Participants ({existingMember.length})
              </TabsTrigger>

              <TabsTrigger
                value="today"
                className="px-0 pb-2 rounded-none text-sm font-medium flex justify-start text-gray-500 border-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                <span>
                  New Participants{' '}
                  <span className="text-red-500">
                    ({newParticipant.length})
                  </span>
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-[#787878]">
                    Add Participants
                  </h3>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        existingMember.length > 0 &&
                        existingMemberEmails.emails.length ===
                          existingMember.length
                      }
                      onChange={() => {
                        const allEmails = existingMember
                          .map((u) => u.eventMember?.email)
                          .filter(Boolean) as string[];
                        if (
                          existingMemberEmails.emails.length ===
                          existingMember.length
                        ) {
                          setExistingMemberEmails({ emails: [] });
                        } else {
                          setExistingMemberEmails({ emails: allEmails });
                        }
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span>Select all</span>
                  </label>
                </div>

                <div className="space-y-3 h-[270px] overflow-auto">
                  {existingMember.map((user) => {
                    const email = user.eventMember?.email;
                    return (
                      <label
                        key={user.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-200 px-4 py-1 cursor-pointer hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={
                            email
                              ? existingMemberEmails.emails.includes(email)
                              : false
                          }
                          onChange={() => toggleExistingEmail(email)}
                          className="h-5 w-5 rounded-md text-blue-600 focus:ring-0"
                        />

                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-[34px] h-[34px] rounded-[10px] overflow-hidden bg-slate-100 flex-shrink-0">
                            {user.eventMember.profilePicture && (
                              <Image
                                src={user.eventMember.profilePicture || ''}
                                alt={user.eventMember.firstName || ''}
                                width={34}
                                height={34}
                                className="h-[34px] rounded-[10px] object-cover"
                              />
                            )}
                          </div>

                          <div className="text-sm font-medium text-slate-800">
                            {user.eventMember.firstName}{' '}
                            {user.eventMember.lastName}
                            <div className="text-xs text-slate-500">
                              {email}
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
                    onClick={handleRemoveEventMember}
                    disabled={
                      loading || existingMemberEmails.emails.length === 0
                    }
                  >
                    {loading ? 'Updating...' : 'Update Participants'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* New participants */}
            <TabsContent value="today">
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-[#787878]">
                    Add new Participants
                  </h3>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        newMemberEmails.emails.length ===
                          newParticipant.length && newParticipant.length > 0
                      }
                      onChange={() => {
                        if (
                          newMemberEmails.emails.length ===
                          newParticipant.length
                        ) {
                          setNewMemberEmails({ emails: [] });
                        } else {
                          selectAllNew();
                        }
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span>
                      {newMemberEmails.emails.length ===
                        newParticipant.length && newParticipant.length > 0
                        ? 'Deselect all'
                        : 'Select all'}
                    </span>
                  </label>
                </div>

                <div className="space-y-3 h-[270px] overflow-auto">
                  {newParticipant.map((user) => {
                    const email = user.eventMember?.email;
                    return (
                      <label
                        key={user.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-200 px-4 py-1 cursor-pointer hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={
                            email
                              ? newMemberEmails.emails.includes(email)
                              : false
                          }
                          onChange={() => toggleNewEmail(email)}
                          className="h-5 w-5 rounded-md text-blue-600 focus:ring-0"
                        />

                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-[34px] h-[34px] rounded-[10px] overflow-hidden bg-slate-100 flex-shrink-0">
                            {user.eventMember.profilePicture && (
                              <Image
                                src={user.eventMember.profilePicture || ''}
                                alt={user.eventMember.firstName || ''}
                                width={34}
                                height={34}
                                className="h-[34px] rounded-[10px] object-cover"
                              />
                            )}
                          </div>

                          <div className="text-base font-medium text-slate-800">
                            {user.eventMember.firstName}{' '}
                            {user.eventMember.lastName}
                            <div className="text-xs text-slate-500">
                              {email}
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleAddEventMember}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
                    disabled={loading || newMemberEmails.emails.length === 0}
                  >
                    {loading ? 'Adding...' : 'Add Participants'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
