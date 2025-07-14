import { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export const useModalSystem = () => {
  const [modals, setModals] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch enabled modals ordered by 'order' field
        const modalsQuery = query(
          collection(db, 'infoModals'),
          where('enabled', '==', true),
          orderBy('order')
        );
        const modalsSnapshot = await getDocs(modalsQuery);
        const modalsData = modalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch enabled sections for these modals
        const modalIds = modalsData.map(m => m.id);
        const sectionsQuery = query(
          collection(db, 'infoModalSections'),
          where('modalId', 'in', modalIds),
          where('enabled', '==', true),
          orderBy('order')
        );
        const sectionsSnapshot = await getDocs(sectionsQuery);
        const sectionsData = sectionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setModals(modalsData);
        setSections(sectionsData);
      } catch (error) {
        console.error("Error fetching modal data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { modals, sections, loading };
};