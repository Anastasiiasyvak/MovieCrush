'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ActorPage from '@/components/ActorPage/ActorPage';

export default function ActorPageWrapper() {
    const { id } = useParams();

    if (!id) return <p>Loading...</p>;

    return <ActorPage actorId={id as string} />;
}
