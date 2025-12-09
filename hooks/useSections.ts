import { useState, useEffect } from 'react';

export interface Section {
    id: string;
    title: string;
    type: string;
    order: number;
    settings: any;
}

export function useSections() {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSections() {
            try {
                const res = await fetch('/api/sections');
                if (!res.ok) throw new Error('Failed to fetch sections');
                const data = await res.json();
                setSections(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchSections();
    }, []);

    return { sections, loading, error };
}
