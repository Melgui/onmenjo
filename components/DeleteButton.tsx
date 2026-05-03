'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmModal from './ConfirmModal';

interface Props {
  id: number;
  name: string;
}

export default function DeleteButton({ id, name }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setDeleting(false);
      alert('No s\'ha pogut eliminar');
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 w-full px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
      >
        Eliminar restaurant
      </button>

      {showModal && (
        <ConfirmModal
          title="Eliminar restaurant"
          message={`Segur que vols eliminar "${name}"? Aquesta acció no es pot desfer.`}
          confirmLabel={deleting ? 'Eliminant...' : 'Eliminar'}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
