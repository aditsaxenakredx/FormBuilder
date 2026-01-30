import { supabase } from '../../../lib/supabaseClient';
import { ShareView } from './ShareView'; // Import ShareView component
import { notFound } from 'next/navigation';
import { UUIDSchema } from '../../components/validation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function SharedFormPage({ params }: PageProps) {
    const { id } = await params;

    // Validate UUID format to prevent enumeration attacks
    const uuidValidation = UUIDSchema.safeParse(id);
    if (!uuidValidation.success) {
        notFound();
    }

    const { data: form, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !form) {
        notFound();
    }

    // Supabase returns 'structure' as a JSON object, we need to cast it
    // structure contains { pages: [], headerConfig: {}, backgroundColor: '' }
    // filled_data contains the collaborative form responses
    const { pages, headerConfig, backgroundColor } = form.structure;
    const filledData = form.filled_data || {};

    return (
        <ShareView
            formId={id}
            initialPages={pages}
            initialHeaderConfig={headerConfig}
            formTitle={form.title}
            initialBackgroundColor={backgroundColor}
            initialFilledData={filledData}
        />
    );
}
