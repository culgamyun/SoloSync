'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { filterRoutineSpaces, filterSocialFears } from '@/lib/challenges/profile-personalization';
import { isSupabaseConfigured } from '@/lib/env';
import { shouldUseDemoDataForRequest } from '@/lib/server/demo-mode';
import { createClient } from '@/lib/supabase/server';

export async function updateProfileAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ko');
  if (await shouldUseDemoDataForRequest()) {
    revalidatePath(`/${locale}/settings/profile`);
    return;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }

  await supabase.from('users').upsert({
    id: user.id,
    display_name: String(formData.get('displayName') ?? ''),
    locale: locale === 'en' ? 'en' : 'ko',
    timezone: String(formData.get('timezone') ?? 'UTC')
  });

  await supabase.from('user_profiles').upsert({
    user_id: user.id,
    city: String(formData.get('city') ?? ''),
    comfort_level: (formData.get('comfortLevel') as 'very_low' | 'low' | 'medium' | 'high' | 'very_high') ?? 'medium',
    routine_spaces: filterRoutineSpaces(formData.getAll('routineSpaces').filter((value): value is string => typeof value === 'string')),
    social_fears: filterSocialFears(formData.getAll('socialFears').filter((value): value is string => typeof value === 'string'))
  });

  revalidatePath(`/${locale}/settings/profile`);
  revalidatePath(`/${locale}/home`);
  revalidatePath(`/${locale}/challenges`);
}

export async function updateLanguageAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ko');
  if (!(await shouldUseDemoDataForRequest()) && isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('users').upsert({
        id: user.id,
        locale: locale === 'en' ? 'en' : 'ko'
      });
    }
  }

  redirect(`/${locale}/settings/language`);
}
