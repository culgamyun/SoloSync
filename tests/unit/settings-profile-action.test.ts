import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  revalidatePath: vi.fn(),
  shouldUseDemoDataForRequest: vi.fn()
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath
}));

vi.mock('@/lib/server/demo-mode', () => ({
  shouldUseDemoDataForRequest: mocks.shouldUseDemoDataForRequest
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: mocks.createClient
}));

import { updateProfileAction } from '@/actions/settings';

function makeProfileForm() {
  const formData = new FormData();
  formData.set('locale', 'ko');
  formData.set('displayName', 'Mina');
  formData.set('city', 'Seoul');
  formData.set('timezone', 'Asia/Seoul');
  formData.set('comfortLevel', 'medium');
  formData.append('routineSpaces', 'gym');
  formData.append('routineSpaces', 'not_real');
  formData.append('routineSpaces', 'cafe');
  formData.append('socialFears', 'being_judged');
  formData.append('socialFears', 'awkward_silence');
  formData.append('socialFears', 'bad_value');
  return formData;
}

function arrangeSupabase(user: { id: string } | null = { id: 'user-1' }) {
  const usersUpsert = vi.fn().mockResolvedValue({ error: null });
  const profilesUpsert = vi.fn().mockResolvedValue({ error: null });
  const getUser = vi.fn().mockResolvedValue({ data: { user } });
  const from = vi.fn((table: string) => {
    if (table === 'users') {
      return { upsert: usersUpsert };
    }

    if (table === 'user_profiles') {
      return { upsert: profilesUpsert };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

  mocks.createClient.mockResolvedValue({
    auth: { getUser },
    from
  });

  return { from, getUser, usersUpsert, profilesUpsert };
}

describe('updateProfileAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.shouldUseDemoDataForRequest.mockResolvedValue(false);
  });

  it('stores filtered routine space and social fear arrays', async () => {
    const supabase = arrangeSupabase();

    await updateProfileAction(makeProfileForm());

    expect(supabase.usersUpsert).toHaveBeenCalledWith({
      id: 'user-1',
      display_name: 'Mina',
      locale: 'ko',
      timezone: 'Asia/Seoul'
    });
    expect(supabase.profilesUpsert).toHaveBeenCalledWith({
      user_id: 'user-1',
      city: 'Seoul',
      comfort_level: 'medium',
      routine_spaces: ['gym', 'cafe'],
      social_fears: ['being_judged', 'awkward_silence']
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/settings/profile');
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/home');
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/challenges');
  });

  it('stops before writing when the request is using demo data', async () => {
    mocks.shouldUseDemoDataForRequest.mockResolvedValue(true);

    await updateProfileAction(makeProfileForm());

    expect(mocks.createClient).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledTimes(1);
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/settings/profile');
  });
});
